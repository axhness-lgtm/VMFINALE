import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ReactLenis } from '@studio-freight/react-lenis';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Community from './pages/Community';
import Founder from './pages/Founder';
import Substack from './pages/Substack';
import Dinner from './pages/Dinner';
import DinnerTrial from './pages/DinnerTrial';
import TextureOverlay from './components/TextureOverlay';

function CustomNavigation() {
  const location = useLocation();
  if (location.pathname === '/dinner-trial') return null;
  return <Navigation />;
}

function App() {
  return (
    <ReactLenis root>
      <Router>
        <TextureOverlay />
        <CustomNavigation />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/community" element={<Community />} />
            <Route path="/founder" element={<Founder />} />
            <Route path="/substack" element={<Substack />} />
            <Route path="/dinner" element={<Dinner />} />
            <Route path="/dinner-trial" element={<DinnerTrial />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </Router>
    </ReactLenis>
  );
}

export default App;

