import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4">
      <div className="container text-center text-md-start">
        <div className="row text-center text-md-start">
          <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 fw-bold text-primary">Zenith Bank</h5>
            <p>Your trusted partner for a secure financial future. We are committed to providing the best banking experience.</p>
          </div>

          <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 fw-bold">Products</h5>
            <p><Link to="/accounts" className="text-white" style={{ textDecoration: 'none' }}>Accounts</Link></p>
            <p><Link to="/transfers" className="text-white" style={{ textDecoration: 'none' }}>Transfers</Link></p>
            <p><Link to="/loans" className="text-white" style={{ textDecoration: 'none' }}>Loans</Link></p>
          </div>

          <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 fw-bold">Useful links</h5>
            <p><Link to="/contact" className="text-white" style={{ textDecoration: 'none' }}>Contact Us</Link></p>
            <p><Link to="/support" className="text-white" style={{ textDecoration: 'none' }}>Support</Link></p>
            <p><Link to="/privacy" className="text-white" style={{ textDecoration: 'none' }}>Privacy Policy</Link></p>
          </div>

          <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 fw-bold">Contact</h5>
            <p><i className="bi bi-house-door me-3"></i> New York, NY 10012, US</p>
            <p><i className="bi bi-envelope me-3"></i> info@zenithbank.com</p>
            <p><i className="bi bi-phone me-3"></i> + 01 234 567 88</p>
          </div>
        </div>

        <hr className="mb-4" />

        <div className="row align-items-center">
          <div className="col-md-7 col-lg-8">
            <p className="text-center text-md-start mb-3 mb-md-0">
              &copy; {new Date().getFullYear()} Zenith Bank. All rights reserved.
            </p>
          </div>
          <div className="col-md-5 col-lg-4">
            <div className="text-center text-md-end">
              <a href="#" className="text-white me-4"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-white me-4"><i className="bi bi-twitter"></i></a>
              <a href="#" className="text-white me-4"><i className="bi bi-linkedin"></i></a>
              <a href="#" className="text-white"><i className="bi bi-instagram"></i></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
