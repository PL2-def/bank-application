import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFeedback(null);

    if (!username || !password) {
      setFeedback({ type: 'error', message: 'Please enter both username and password.' });
      return;
    }

    try {
      const success = await login({ username, password });
      if (success) {
        setFeedback({ type: 'success', message: 'Login successful! Redirecting...' });
        navigate('/'); // Redirect to dashboard or home page
      } else {
        setFeedback({ type: 'error', message: 'Invalid username or password.' });
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'An unexpected error occurred during login.' });
      console.error('Login error:', error);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h3 className="card-title text-center mb-4">Login to Zenith Bank</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="username" 
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    id="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                {feedback && (
                  <div className={`alert alert-${feedback.type === 'success' ? 'success' : 'danger'} mt-3`}>
                    {feedback.message}
                  </div>
                )}

                <div className="d-grid mt-4">
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Login
                  </button>
                </div>
                <div className="text-center mt-3">
                  Don't have an account? <Link to="/register">Register here</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
