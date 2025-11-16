"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const USERS_FILE_PATH = path_1.default.join(__dirname, 'users.json');
const app = (0, express_1.default)();
const port = 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Function to load users from file
const loadUsers = () => {
    if (fs_1.default.existsSync(USERS_FILE_PATH)) {
        const data = fs_1.default.readFileSync(USERS_FILE_PATH, 'utf8');
        return JSON.parse(data);
    }
    return [];
};
let users = loadUsers();
let nextUserId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
// Function to save users to file
const saveUsers = (usersToSave) => {
    fs_1.default.writeFileSync(USERS_FILE_PATH, JSON.stringify(usersToSave, null, 2), 'utf8');
};
// Middleware to simulate authentication (for now, just checks if a user is "logged in")
// In a real app, this would involve JWT verification or session management
const authenticateUser = (req, res, next) => {
    // For this prototype, we'll assume the user is authenticated if they have successfully logged in
    // and their user object is available (e.g., from a session or token lookup).
    // Since we don't have sessions/tokens yet, we'll just use a placeholder.
    // In a real app, you'd extract a token from headers, verify it, and attach the user to req.
    // For now, we'll just pass through, assuming the frontend handles the "logged in" state.
    // This will be improved later when we implement proper token-based authentication.
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        // In a real app, decode and verify the token to get user ID
        // For now, let's assume a simple "Bearer <username>" token for testing
        const token = authHeader.split(' ')[1];
        const user = users.find(u => u.username === token); // Simple lookup by username as token
        if (user) {
            req.user = user; // Attach user to request
            next();
            return;
        }
    }
    // If no auth header or user not found, for now, we'll still proceed for simplicity
    // but in a real app, this would be a 401 Unauthorized
    next();
};
app.get('/', (req, res) => {
    res.send('Backend is running!');
});
// Register endpoint
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    if (users.some(user => user.username === username)) {
        return res.status(409).json({ message: 'User already exists' });
    }
    const passwordHash = await bcryptjs_1.default.hash(password, 10); // Hash password with salt rounds
    const newUser = {
        id: nextUserId++,
        username,
        passwordHash,
        accounts: [] // Initialize with empty accounts
    };
    users.push(newUser);
    saveUsers(users);
    // Return user data without password hash
    const { passwordHash: _, ...userWithoutHash } = newUser;
    res.status(201).json(userWithoutHash);
});
// Login endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Return user data without password hash
    const { passwordHash: _, ...userWithoutHash } = user;
    res.status(200).json(userWithoutHash);
});
// Account Management Endpoints (Protected by authenticateUser middleware)
app.use(authenticateUser); // Apply authentication middleware to all subsequent routes
// Get accounts for the authenticated user
app.get('/api/accounts', (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    res.json(user.accounts);
});
// Add a new account
app.post('/api/accounts', (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const { name, type, initialBalance } = req.body;
    if (!name || !type || initialBalance === undefined) {
        return res.status(400).json({ message: 'Name, type, and initialBalance are required' });
    }
    const newAccount = {
        id: Date.now().toString(), // Simple unique ID
        name,
        type,
        balance: initialBalance,
    };
    user.accounts.push(newAccount);
    saveUsers(users);
    res.status(201).json(newAccount);
});
// Remove an account
app.delete('/api/accounts/:accountId', (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const { accountId } = req.params;
    const initialLength = user.accounts.length;
    user.accounts = user.accounts.filter((acc) => acc.id !== accountId);
    if (user.accounts.length < initialLength) {
        saveUsers(users);
        res.status(204).send(); // No Content
    }
    else {
        res.status(404).json({ message: 'Account not found' });
    }
});
// Update account name
app.put('/api/accounts/:accountId/name', (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const { accountId } = req.params;
    const { newName } = req.body;
    if (!newName) {
        return res.status(400).json({ message: 'New name is required' });
    }
    const account = user.accounts.find((acc) => acc.id === accountId);
    if (account) {
        account.name = newName;
        saveUsers(users);
        res.json(account);
    }
    else {
        res.status(404).json({ message: 'Account not found' });
    }
});
// Update account balance (deposit/withdrawal)
app.put('/api/accounts/:accountId/balance', (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const { accountId } = req.params;
    const { amount } = req.body; // amount can be positive (deposit) or negative (withdrawal)
    if (amount === undefined || typeof amount !== 'number') {
        return res.status(400).json({ message: 'Amount is required and must be a number' });
    }
    const account = user.accounts.find((acc) => acc.id === accountId);
    if (account) {
        account.balance += amount;
        saveUsers(users);
        res.json(account);
    }
    else {
        res.status(404).json({ message: 'Account not found' });
    }
});
app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
