import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ReactLenis } from '@studio-freight/react-lenis';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import About from './pages/About';
import Community from './pages/Community';
import Dinner from './pages/Dinner';
import Journal from './pages/Journal';
import Admin from './pages/Admin';
import Footer from './components/Footer';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothTouch: true }}>
      <Router>
        <ScrollToTop />
        <div className="relative min-h-screen">
          <audio id="bg-music" loop preload="auto" crossOrigin="anonymous">
            <source src="https://ia800501.us.archive.org/33/items/OudImprovisation/OudImprovisation.mp3" type="audio/mpeg" />
            <source src="https://upload.wikimedia.org/wikipedia/commons/4/44/Taqsim_Oud_Maqam_Rast.ogg" type="audio/ogg" />
          </audio>
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/community" element={<Community />} />
            <Route path="/dinner" element={<Dinner />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/founder-admin" element={<Admin />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ReactLenis>
  );
}

export default App;
