import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { Account, Transaction } from '../types';

const DashboardPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [accs, trans] = await Promise.all([
          api.accounts.getAccounts(),
          api.transactions.getTransactions(),
        ]);
        setAccounts(accs);
        setTransactions(trans);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <main className="container my-5">
      <div className="p-5 mb-4 bg-light rounded-3">
        <div className="container-fluid py-5">
          <h1 className="display-5 fw-bold">Welcome to Zenith Bank</h1>
          <p className="col-md-8 fs-4">Your trusted partner for a secure financial future. Manage your accounts, track your spending, and reach your financial goals with ease.</p>
          <button className="btn btn-primary btn-lg" type="button">Get Started</button>
        </div>
      </div>

      <div className="row align-items-md-stretch text-center">
        <div className="col-md-4">
          <div className="h-100 p-5">
            <i className="bi bi-shield-check fs-1 text-primary"></i>
            <h2 className="mt-3">Secure Banking</h2>
            <p>Your security is our top priority. We use the latest technology to protect your information.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="h-100 p-5">
            <i className="bi bi-phone fs-1 text-primary"></i>
            <h2 className="mt-3">Mobile Access</h2>
            <p>Bank on the go with our mobile app. Access your accounts anytime, anywhere.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="h-100 p-5">
            <i className="bi bi-headset fs-1 text-primary"></i>
            <h2 className="mt-3">24/7 Support</h2>
            <p>Our support team is available 24/7 to help you with any questions or concerns.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="row mt-5">
            <div className="col-md-12">
              <h2 className="mb-4">Your Accounts</h2>
              <div className="row">
                {accounts.map(account => (
                  <div key={account.id} className="col-md-4 mb-4">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">{account.type}</h5>
                        <p className="card-text fs-4">{formatCurrency(account.balance)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-md-12">
              <h2 className="mb-4">Recent Transactions</h2>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Description</th>
                    <th scope="col" className="text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(transaction => (
                    <tr key={transaction.id}>
                      <td>{transaction.date}</td>
                      <td>{transaction.description}</td>
                      <td className={`text-end ${transaction.amount < 0 ? 'text-danger' : 'text-success'}`}>
                        {formatCurrency(transaction.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default DashboardPage;
