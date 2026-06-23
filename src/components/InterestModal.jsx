import React, { useState } from 'react';
import './BookingModal.css'; 

export default function InterestModal({ isOpen, onClose, dinner }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Normalize phone — add +91 if bare 10-digit Indian number
    let normalizedPhone = phone.replace(/\s/g, '');
    if (/^[6-9]\d{9}$/.test(normalizedPhone)) normalizedPhone = '+91' + normalizedPhone;
    if (!/^\+?[0-9]{10,15}$/.test(normalizedPhone)) {
      setError('Enter a valid phone number (e.g. 9876543210)');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, 
          phone: normalizedPhone, 
          email, 
          instagram_handle: instagram, 
          occurrence_id: dinner?.id
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit');
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bm-modal">
        <button className="bm-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="bm-step-wrapper step-in">
          {success ? (
             <div className="bm-step bm-confirmed-step">
               <div className="bm-step-tag font-body italicwritten">Interest — Received</div>
               <h2 className="bm-title">You're on the list.</h2>
               <p className="bm-subtitle">
                 We've noted your interest for {dinner?.title || 'this occurrence'}. If you're selected, we'll email you a private booking link when seats open.
               </p>
               <button className="bm-btn-primary mt-8" onClick={onClose}>Close</button>
             </div>
          ) : (
            <form className="bm-step" onSubmit={handleSubmit}>
              <div className="bm-step-tag font-body italicwritten">Step 01 — Express Interest</div>
              <h2 className="bm-title">Join the active list.</h2>
              <p className="bm-subtitle">Let us know you're available for {dinner?.title || 'this occurrence'}. We'll curate the final guest list from here.</p>
              
              <div className="bm-field-group">
                <label className="bm-label">Your Name</label>
                <input className="bm-input" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="bm-field-group">
                <label className="bm-label">Phone number</label>
                <input className="bm-input" type="tel" placeholder="+91 98765 43210" value={phone} onChange={e => setPhone(e.target.value)} required />
              </div>
              <div className="bm-field-group">
                <label className="bm-label">Email address</label>
                <input className="bm-input" type="email" placeholder="name@server.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="bm-field-group">
                <label className="bm-label">Instagram Handle</label>
                <input className="bm-input" placeholder="@username" value={instagram} onChange={e => setInstagram(e.target.value)} required />
              </div>

              {error && <div className="bm-error">{error}</div>}
              
              <button className="bm-btn-primary mt-4" type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'I\'m Interested →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
