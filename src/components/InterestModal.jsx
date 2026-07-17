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
                <div className="mt-3.5 p-3 bg-[var(--accent-primary)]/5 rounded-lg border border-[var(--accent-primary)]/20 flex flex-col gap-2.5">
                  {dinner?.event_date && (
                    <div className="uppercase tracking-[0.14em] text-[var(--accent-primary)] flex items-center justify-center gap-2 font-bold" style={{ fontFamily: 'Hibernate, sans-serif', fontSize: '18px', lineHeight: '1.4', fontWeight: 800, textShadow: '0.5px 0.5px 0px var(--accent-primary)' }}>
                      <span className="font-extrabold text-xl">DATE:</span>
                      <span className="font-bold">{new Date(dinner.event_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} • {new Date(dinner.event_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-center pt-1">
                    {dinner?.dietary_type === 'veg' ? (
                      <div className="inline-flex items-center gap-2.5 bg-green-50 border-2 border-green-700 px-4 py-1.5 rounded-md text-green-900 text-[15px] font-bold uppercase tracking-wider shadow-md" style={{ fontFamily: 'Hibernate, sans-serif', letterSpacing: '0.12em', lineHeight: '1.4', fontWeight: 800, textShadow: '0.4px 0.4px 0px currentColor' }}>
                        <span className="inline-flex items-center justify-center w-4 h-4 border-2 border-green-700 rounded-sm p-[2px] shrink-0" title="100% Vegetarian">
                          <span className="w-2 h-2 rounded-full bg-green-700 block"></span>
                        </span>
                        <span>100% Vegetarian Occurrence</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2.5 bg-red-50 border-2 border-red-700 px-4 py-1.5 rounded-md text-red-900 text-[15px] font-bold uppercase tracking-wider shadow-md" style={{ fontFamily: 'Hibernate, sans-serif', letterSpacing: '0.12em', lineHeight: '1.4', fontWeight: 800, textShadow: '0.4px 0.4px 0px currentColor' }}>
                        <span className="inline-flex items-center justify-center w-4 h-4 border-2 border-red-700 rounded-sm p-[2px] shrink-0" title="Non-Vegetarian">
                          <span className="w-2 h-2 rounded-full bg-red-700 block"></span>
                        </span>
                        <span>Non-Vegetarian Occurrence</span>
                      </div>
                    )}
                  </div>
                </div>
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
