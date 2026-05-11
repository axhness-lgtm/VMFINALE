export default function Journal() {
  return (
    <main className="page-container" style={{ padding: '20vh 6vw' }}>
      <h1 style={{ fontSize: '4rem', fontStyle: 'italic', marginBottom: '4rem' }}>The Journal</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem', maxWidth: '800px', margin: '0 auto' }}>
        <article>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>A Study on Imperfection</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>October 12, 2026</p>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
            There is something profound in the way a torn edge catches the light. The perfectly smooth 
            surface tells no stories. In our latest supper, we intentionally left the tablescape slightly 
            undone—a crumpled linen here, an asymmetrical floral arrangement there. It gave the space 
            permission to be lived in, and by extension, gave the guests permission to be themselves.
          </p>
        </article>

        <article>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>The Spaces Between Words</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>September 04, 2026</p>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
            It is rarely the food that is remembered most vividly. It is the pause after the first bite, 
            the clinking of a glass, the low murmur of someone you met an hour ago telling you a secret 
            they haven't spoken in years. We curate the silence just as carefully as the menu.
          </p>
        </article>
      </div>
    </main>
  );
}
