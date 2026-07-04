import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ReactLenis, useLenis } from '@studio-freight/react-lenis';
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
  const lenis = useLenis();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname, lenis]);

  return null;
}

function GlobalFadeIn() {
  const { pathname } = useLocation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
          }
        });
      },
      { threshold: 0.01, rootMargin: '0px 0px 0px 0px' }
    );

    const observeElements = () => {
      const elements = document.querySelectorAll('h2, h3, p');
      elements.forEach((el) => {
        if (!el.classList.contains('reveal-init') && !el.closest('.no-reveal')) {
          const rect = el.getBoundingClientRect();
          // If element is already in the top 85% of viewport on initial load, reveal immediately
          if (rect.top < window.innerHeight * 0.85) {
            el.classList.add('reveal-init', 'reveal-visible');
          } else {
            el.classList.add('reveal-init');
            observer.observe(el);
          }
        }
      });
    };

    observeElements();
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);

  return null;
}

function App() {
  return (
    <ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothTouch: true }}>
      <Router>
        <ScrollToTop />
        <GlobalFadeIn />
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
            <Route path="/hyndavio" element={<Admin />} />
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
