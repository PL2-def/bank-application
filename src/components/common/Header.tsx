import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          <i className="bi bi-bank2 me-2"></i>
          Zenith Bank
        </NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>
                <i className="bi bi-house-door me-1"></i>
                Home
              </NavLink>
            </li>
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/accounts">
                    <i className="bi bi-wallet2 me-1"></i>
                    Accounts
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/transfers">
                    <i className="bi bi-arrow-right-left me-1"></i>
                    Transfers
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/loans">
                    <i className="bi bi-cash-coin me-1"></i>
                    Loans
                  </NavLink>
                </li>
              </>
            )}
            <li className="nav-item ms-lg-3">
              {isAuthenticated ? (
                <div className="d-flex align-items-center">
                  <span className="navbar-text me-3">
                    Welcome, {user?.username}!
                  </span>
                  <button onClick={handleLogout} className="btn btn-light text-primary">
                    <i className="bi bi-box-arrow-right me-1"></i>
                    Logout
                  </button>
                </div>
              ) : (
                <NavLink className="btn btn-light text-primary" to="/login">
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  Login
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
