import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { LoanProduct } from '../types';

const LoansPage: React.FC = () => {
  const [loanProducts, setLoanProducts] = useState<LoanProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoanProducts = async () => {
      try {
        setLoading(true);
        const products = await api.loans.getLoanProducts();
        setLoanProducts(products);
        setError(null);
      } catch (err) {
        setError("Failed to fetch loan products. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoanProducts();
  }, []);

  return (
    <div className="container my-5">
      <div className="text-center mb-5">
        <h1>Our Loan Products</h1>
        <p className="lead">Find the perfect loan to meet your financial goals.</p>
      </div>

      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="row">
          {loanProducts.map(product => (
            <div key={product.id} className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text text-muted">{product.description}</p>
                  <ul className="list-unstyled mt-auto">
                    <li><strong>Interest Rate:</strong> {product.interestRate}</li>
                    <li><strong>Term:</strong> {product.term}</li>
                  </ul>
                  <button className="btn btn-primary mt-3">Apply Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LoansPage;
