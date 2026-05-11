import React from 'react';
import Footer from '../components/Footer';

export default function Community() {
  return (
    <main className="page-container" style={{ padding: '15vh 6vw', display: 'flex', flexDirection: 'column', gap: '8vh' }}>
      <section style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3.5rem', fontStyle: 'italic', marginBottom: '2rem' }}>A Table for the Curious.</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>
          You don't know who you'll meet. That's the entire point. Our community is built on 
          the belief that the best conversations happen between strangers sharing a meal.
        </p>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '4rem' }}>
        <div style={{ overflow: 'hidden', height: '400px' }}>
          <img 
            src="C:/Users/a/.gemini/antigravity/brain/4d0e0f54-dcbb-4a5e-9208-4328bcb211be/media__1777712477629.jpg" 
            alt="Gathering from above" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(20%) sepia(10%)' }} 
          />
        </div>
        <div style={{ overflow: 'hidden', height: '400px' }}>
          <img 
            src="C:/Users/a/.gemini/antigravity/brain/4d0e0f54-dcbb-4a5e-9208-4328bcb211be/media__1777712477753.jpg" 
            alt="Guests toasting" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(20%) sepia(10%)' }} 
          />
        </div>
      </section>

      <section style={{ textAlign: 'center', marginTop: '10vh' }}>
        <h2 style={{ fontSize: '2rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>Join the Inner Circle</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Sign up to be notified when seats open up in your city.</p>
        <button style={{
            padding: '12px 32px',
            background: 'var(--text-color)',
            color: 'var(--bg-color)',
            border: 'none',
            fontFamily: 'inherit',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            cursor: 'pointer'
        }}>Apply for Access</button>
      </section>
      
      <Footer />
    </main>
  );
}
