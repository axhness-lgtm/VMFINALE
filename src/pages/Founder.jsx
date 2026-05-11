import React from 'react';
import Footer from '../components/Footer';

export default function Founder() {
  return (
    <main className="page-container" style={{ padding: '15vh 6vw', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6vw', maxWidth: '1000px', alignItems: 'center' }}>
        
        {/* Left Side: Image */}
        <div style={{ overflow: 'hidden', height: '600px', width: '100%' }}>
          <img 
            src="C:/Users/a/.gemini/antigravity/brain/4d0e0f54-dcbb-4a5e-9208-4328bcb211be/media__1777712477698.jpg" 
            alt="The Founder" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(30%) sepia(20%) brightness(0.8)' }} 
          />
        </div>

        {/* Right Side: Text */}
        <div>
          <h1 style={{ fontSize: '3.5rem', fontStyle: 'italic', marginBottom: '2rem' }}>The Vision</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-color)', marginBottom: '1.5rem', lineHeight: '1.8' }}>
            Vantammayilu was born from a simple realization: in a world increasingly connected by screens, we have forgotten how to sit with strangers.
          </p>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.8' }}>
            We started as a single table in a small apartment. No menu, no expectations. Just an invitation to show up, break bread, and tell the truth.
          </p>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
            The food is the anchor, but the people are the experience. This isn't just about dining; it's about returning to something essential, something almost forgotten.
          </p>
          
          <div style={{ marginTop: '4rem', fontStyle: 'italic', fontFamily: 'var(--font-heading)', fontSize: '1.5rem' }}>
            &mdash; The Founder
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
