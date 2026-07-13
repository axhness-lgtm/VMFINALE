import React, { useState } from 'react';
import './BookingModal.css'; 

export default function InterestModal({ isOpen, onClose, dinner }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [instagram, setInstagram] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Enforce 10-digit phone number
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('Enter a valid 10-digit mobile number');
      setLoading(false);
      return;
    }
    const normalizedPhone = '+91' + cleanPhone;

    try {
      const res = await fetch('/api/interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, 
          phone: normalizedPhone, 
          email, 
          instagram_handle: `${platform}: ${instagram}`, 
          occurrence_id: dinner?.id
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.details || data.error || 'Failed to submit');
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bm-modal" data-lenis-prevent="true">
        <button className="bm-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="bm-step-wrapper step-in">
          {success ? (
             <div className="bm-step bm-confirmed-step">
               <div className="bm-step-tag uppercase tracking-[0.2em] font-normal" style={{ fontFamily: 'Hibernate, sans-serif', letterSpacing: '0.2em', lineHeight: '1.8' }}>INTEREST — RECEIVED</div>
               <h2 className="bm-title uppercase" style={{ fontFamily: 'Hibernate, sans-serif', letterSpacing: '0.12em', lineHeight: '1.4', fontSize: '32px' }}>YOU'RE ON THE LIST.</h2>
               <p className="bm-subtitle font-body text-base mt-2" style={{ textTransform: 'none', letterSpacing: 'normal', opacity: 0.9 }}>
                 Keep an eye on your mail, your private booking link will be sent there personally from us.
               </p>
               <button className="bm-btn-primary mt-8" onClick={onClose}>Close</button>
             </div>
          ) : (
            <form className="bm-step" onSubmit={handleSubmit} style={{ gap: '24px' }}>
              <div>
                <div className="bm-step-tag uppercase tracking-[0.2em] font-normal mb-1" style={{ fontFamily: 'Hibernate, sans-serif', letterSpacing: '0.2em', lineHeight: '1.8' }}>STEP 01 — EXPRESS INTEREST</div>
                <h2 className="bm-title uppercase" style={{ fontFamily: 'Hibernate, sans-serif', letterSpacing: '0.12em', lineHeight: '1.4', fontSize: '36px' }}>JOIN THE ACTIVE LIST.</h2>
                <p className="bm-subtitle uppercase text-sm mt-1" style={{ fontFamily: 'Hibernate, sans-serif', letterSpacing: '0.12em', lineHeight: '1.6' }}>Let us know you're available for {dinner?.title || 'this occurrence'}.</p>
                {dinner?.event_date && (
                  <div className="mt-3 p-2.5 bg-[var(--accent-primary)]/10 rounded-lg border border-[var(--accent-primary)]/30 text-center">
                    <p className="text-xs uppercase font-mono font-bold tracking-wider text-[var(--accent-primary)]">
                      📅 Date: {new Date(dinner.event_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} • ⏰ {new Date(dinner.event_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="bm-field-group" style={{ marginBottom: '8px' }}>
                <label className="bm-label">Your Name</label>
                <input className="bm-input font-sans text-base" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="bm-field-group" style={{ marginBottom: '8px' }}>
                <label className="bm-label">Phone number</label>
                <div className="flex items-center gap-2 border-b-2 border-[#002fa7] py-1">
                  <span className="font-mono font-bold text-[#002fa7] text-base px-2 py-0.5 bg-[#002fa7]/10 rounded select-none">+91</span>
                  <input
                    className="bg-transparent border-none outline-none font-sans text-base text-[#002fa7] w-full"
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    required
                  />
                </div>
              </div>
              <div className="bm-field-group" style={{ marginBottom: '8px' }}>
                <label className="bm-label">Email address</label>
                <input className="bm-input font-sans text-base" type="email" placeholder="name@server.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="bm-field-group" style={{ marginBottom: '8px' }}>
                <label className="bm-label">Preferred Social Profile</label>
                <div className="flex gap-2 mb-2">
                  {['Instagram', 'Facebook', 'LinkedIn'].map(p => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setPlatform(p)}
                      className={`px-3 py-1 text-xs rounded font-bold uppercase tracking-wider transition-colors ${platform === p ? 'bg-[var(--accent-primary)] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <input className="bm-input font-sans text-base" placeholder={`Your ${platform} Handle / Profile URL`} value={instagram} onChange={e => setInstagram(e.target.value)} required />
              </div>

              {error && <div className="bm-error">{error}</div>}
              
              <button className="bm-btn-primary mt-2" type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'I\'m Interested →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
