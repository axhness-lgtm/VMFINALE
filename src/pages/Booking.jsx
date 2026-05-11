export default function Booking() {
  return (
    <main className="page-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', fontStyle: 'italic', marginBottom: '2rem' }}>Reserve a Seat</h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '400px', marginBottom: '3rem' }}>
        We will open bookings soon. 
        Backend integration with Supabase is planned to handle real-time reservations for the 8 available seats.
      </p>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '300px' }}>
        <input 
          type="email" 
          placeholder="Enter your email" 
          style={{ 
            padding: '10px 0', 
            background: 'transparent', 
            border: 'none', 
            borderBottom: '1px solid var(--text-color)', 
            color: 'var(--text-color)',
            fontFamily: 'inherit',
            fontSize: '1rem',
            outline: 'none'
          }} 
        />
        <button 
          type="button"
          style={{
            padding: '12px 24px',
            background: 'var(--text-color)',
            color: 'var(--bg-color)',
            border: 'none',
            fontFamily: 'inherit',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            cursor: 'pointer',
            marginTop: '1rem',
            transition: 'opacity 0.3s ease'
          }}
        >
          Notify Me
        </button>
      </form>
    </main>
  );
}
