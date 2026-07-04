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
            try { observer.unobserve(entry.target); } catch (e) {}
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px 150px 0px' }
    );

    const checkVisible = () => {
      const hiddenElements = document.querySelectorAll('.reveal-init:not(.reveal-visible)');
      const triggerBottom = window.innerHeight + 150;
      hiddenElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < triggerBottom && rect.bottom > -50) {
          el.classList.add('reveal-visible');
          try { observer.unobserve(el); } catch (e) {}
        }
      });
    };

    const observeElements = () => {
      const elements = document.querySelectorAll('h1, h2, h3, h4, h5, p, img:not([class*="absolute"]):not([class*="pointer-events-none"]), [class*="card"]:not(.no-reveal), .grid > div');
      elements.forEach((el) => {
        if (!el.classList.contains('reveal-init') && !el.closest('.no-reveal')) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight + 150 && rect.bottom > -50) {
            el.classList.add('reveal-init', 'reveal-visible');
          } else {
            el.classList.add('reveal-init');
            observer.observe(el);
          }
        }
      });
    };

    observeElements();
    checkVisible();

    const mutationObserver = new MutationObserver(() => {
      observeElements();
      checkVisible();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('scroll', checkVisible, { passive: true });
    const intervalId = setInterval(checkVisible, 200);

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('scroll', checkVisible);
      clearInterval(intervalId);
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
