import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { Account } from '../types';

const TransfersPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const fetchedAccounts = await api.accounts.getAccounts();
        setAccounts(fetchedAccounts);
        if (fetchedAccounts.length > 0) {
          setFromAccount(fetchedAccounts[0].id.toString());
        }
      } catch (err) {
        console.error(err);
        setFeedback({ type: 'error', message: 'Could not load your accounts.' });
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFeedback(null);

    if (!fromAccount || !toAccount || !amount || parseFloat(amount) <= 0) {
      setFeedback({ type: 'error', message: 'Please fill out all fields correctly.' });
      return;
    }
    
    // Simulate transfer
    console.log(`Transfer of ${amount} from ${fromAccount} to ${toAccount}`);
    setFeedback({ type: 'success', message: `Successfully initiated transfer of $${amount} to account ${toAccount}.` });
    
    // Reset form
    setToAccount('');
    setAmount('');
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title text-center mb-4">Make a Transfer</h1>
              
              {loading && <p className="text-center">Loading accounts...</p>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="fromAccount" className="form-label">From Account</label>
                  <select 
                    id="fromAccount" 
                    className="form-select" 
                    value={fromAccount} 
                    onChange={e => setFromAccount(e.target.value)}
                    disabled={loading}
                  >
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>
                        {acc.type} - Balance: ${acc.balance.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="toAccount" className="form-label">To Account Number</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="toAccount" 
                    value={toAccount}
                    onChange={e => setToAccount(e.target.value)}
                    placeholder="Enter recipient's account number"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="amount" className="form-label">Amount</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="amount" 
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      placeholder="0.00"
                      min="0.01"
                      step="0.01"
                    />
                  </div>
                </div>

                {feedback && (
                  <div className={`alert alert-${feedback.type === 'success' ? 'success' : 'danger'} mt-3`}>
                    {feedback.message}
                  </div>
                )}

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-lg">
                    <i className="bi bi-arrow-right-left me-2"></i>
                    Initiate Transfer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransfersPage;
