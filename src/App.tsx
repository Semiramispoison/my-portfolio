import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ContentProvider } from './context/ContentContext';
import LoadingScreen from './components/LoadingScreen';
import Cursor from './components/Cursor';
import Navigation from './components/Navigation';
import CRTFrame from './components/CRTFrame';
import ContentEditor from './components/ContentEditor';
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Experience from './sections/Experience';
import Contact from './sections/Contact';

const NAV_SECTIONS = [
  { id: 'home', number: '00', label: 'HOME' },
  { id: 'about', number: '01', label: 'ABOUT' },
  { id: 'projects', number: '02', label: 'PROJECTS' },
  { id: 'skills', number: '03', label: 'SKILLS' },
  { id: 'experience', number: '04', label: 'EXPERIENCE' },
  { id: 'contact', number: '05', label: 'CONTACT' },
];

export default function App() {
  const [loaded, setLoaded] = useState(false);

  const handleLoadingComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <ContentProvider>
      <AnimatePresence>
        {!loaded && <LoadingScreen onComplete={handleLoadingComplete} />}
      </AnimatePresence>

      {loaded && (
        <>
          <Cursor />
          <ContentEditor />
          <main>
            <Hero />
            <CRTFrame>
              <Navigation sections={NAV_SECTIONS} />
              <About />
              <Projects />
              <Skills />
              <Experience />
              <Contact />
            </CRTFrame>
          </main>
        </>
      )}
    </ContentProvider>
  );
}
