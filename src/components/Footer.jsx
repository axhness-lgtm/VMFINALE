import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="main-footer">
      {/* Central Newsletter Pod */}
      <div className="footer-pod-container">
        <div className="footer-circle-pod">
          <p className="pod-heading">Get special updates + Vantammayilu news in your inbox.</p>
          <div className="pod-input-group">
            <div className="pod-input">
              <span className="input-icon">◒</span>
              <input type="email" placeholder="EMAIL" />
            </div>
            <div className="pod-input">
              <span className="input-icon">◓</span>
              <input type="tel" placeholder="PHONE" />
            </div>
          </div>
          <p className="pod-disclaimer">
            By subscribing, you agree to receive recurring automated marketing messages. 
            Reply STOP to unsubscribe.
          </p>
          <button className="pod-join-btn">
            JOIN
            <span className="btn-bubbles">
              <span className="bubble"></span>
              <span className="bubble"></span>
              <span className="bubble"></span>
            </span>
          </button>
        </div>
      </div>

      <div className="footer-content-wrapper">
        {/* Top Row: Auth & Social */}
        <div className="footer-top-row">
          <div className="auth-links">
            <a href="#login" className="auth-link">LOGIN</a>
            <a href="#signup" className="auth-link">SIGN UP</a>
          </div>
          <div className="social-links">
            <a href="https://www.instagram.com/vantammayilu/" target="_blank" rel="noopener noreferrer" className="social-icon">Instagram</a>
            <a href="#twitter" className="social-icon">Twitter / X</a>
          </div>
        </div>

        {/* Middle Row: Links Grid */}
        <div className="footer-grid">
          <div className="footer-col">
            <Link to="/">Home</Link>
            <Link to="/dinner">Dinner</Link>
            <Link to="/lts">LTS</Link>
            <Link to="/substack">Journal</Link>
          </div>
          
          <div className="footer-center-icon">
            <div className="v-logo-wrapper">
              <span className="v-logo">+</span>
              <div className="logo-particles">
                {[...Array(8)].map((_, i) => (
                  <span key={i} className="particle"></span>
                ))}
              </div>
            </div>
          </div>

          <div className="footer-col right-align">
            <Link to="/community">Community</Link>
            <Link to="/founder">Founder</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
        </div>

        {/* Bottom Branding */}
        <div className="footer-bottom-branding">
          <h2 className="massive-brand-text">VANTAMMAYILU</h2>
        </div>
      </div>
    </footer>
  );
}
