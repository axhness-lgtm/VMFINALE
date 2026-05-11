import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

export default function Navigation() {
  const location = useLocation();

  return (
    <nav className="minimal-nav">
      <div className="nav-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
        <Link to="/dinner" className={location.pathname === '/dinner' ? 'active' : ''}>Upcoming Dinner</Link>
        <Link to="/community" className={location.pathname === '/community' ? 'active' : ''}>Long Table Society</Link>
        <Link to="/substack" className={location.pathname === '/substack' ? 'active' : ''}>Journal</Link>
      </div>
    </nav>
  );
}
