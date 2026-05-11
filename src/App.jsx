import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Community from './pages/Community';
import Founder from './pages/Founder';
import Substack from './pages/Substack';
import Dinner from './pages/Dinner';

function App() {
  return (
    <Router>
      <div className="noise-overlay"></div>
      <Navigation />
      <div className="smooth-scroll-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/community" element={<Community />} />
          <Route path="/founder" element={<Founder />} />
          <Route path="/substack" element={<Substack />} />
          <Route path="/dinner" element={<Dinner />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
