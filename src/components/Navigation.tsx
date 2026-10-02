import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '../context/ContentContext';
import styles from './Navigation.module.css';

interface Section {
  id: string;
  number: string;
  label: string;
}

interface NavigationProps {
  sections: Section[];
}

export const Navigation: React.FC<NavigationProps> = ({ sections }) => {
  const { setEditMode } = useContent();
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showPasswordPrompt) {
        setShowPasswordPrompt(false);
        setPassword('');
        setPasswordError('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPasswordPrompt]);

  const handlePasswordSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (password === 'persona') {
      setShowPasswordPrompt(false);
      setIsOpen(false);
      setEditMode(true);
      setPassword('');
      setPasswordError('');
    } else {
      setPasswordError('ACCESS DENIED: INVALID PASSWORD');
      setPassword('');
    }
  };
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const observers = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isTransitioning) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections, isTransitioning]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSelect = (id: string) => {
    setIsTransitioning(true);
    setIsOpen(false);
    
    if (id === 'home') {
      const event = new CustomEvent('triggerTvTransition', { detail: { targetId: id } });
      window.dispatchEvent(event);
    } else {
      const event = new CustomEvent('triggerInnerTvTransition', { detail: { targetId: id } });
      window.dispatchEvent(event);
    }
    
    setTimeout(() => {
      setActiveSection(id);
    }, 200);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  };

  const menuStyles = [
    { xOffset: -20, skew: -6 },
    { xOffset: 30, skew: -10 },
    { xOffset: -10, skew: -4 },
    { xOffset: 40, skew: -8 },
    { xOffset: 10, skew: -5 },
    { xOffset: 25, skew: -7 },
  ];

  return (
    <>
      <button 
        className={`${styles.menuTrigger} ${isOpen ? styles.triggerOpen : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation menu"
      >
        <div className={styles.triggerData}>SYS.NAV</div>
        <div className={styles.hamburger}>
          <span className={styles.line1}></span>
          <span className={styles.line2}></span>
          <span className={styles.line3}></span>
        </div>
        <div className={styles.triggerLabel}>{isOpen ? 'CLOSE' : 'MENU'}</div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.nav 
            className={styles.navContainer}
            initial={{ opacity: 0, clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' }}
            animate={{ opacity: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
            exit={{ opacity: 0, clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <div className={styles.menuAtmosphere} />
            <div className={styles.menuBgTypography}>SYSTEM</div>

            <ul className={styles.navList}>
              {sections.map((section, index) => {
                const isActive = activeSection === section.id;
                const isHovered = hoveredSection === section.id;
                const styleDef = menuStyles[index % menuStyles.length];
                
                return (
                  <motion.li 
                    key={section.id} 
                    className={`${styles.navItemWrapper} ${isActive ? styles.activeItem : ''}`}
                    onMouseEnter={() => !isTransitioning && setHoveredSection(section.id)}
                    onMouseLeave={() => setHoveredSection(null)}
                    style={{
                      transform: `translateX(${styleDef.xOffset}vw) skewX(${styleDef.skew}deg)`
                    } as React.CSSProperties}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (index * 0.05), duration: 0.4 }}
                  >
                    <button
                      className={styles.navButton}
                      onClick={() => !isTransitioning && handleSelect(section.id)}
                      aria-label={`Navigate to ${section.label}`}
                      disabled={isTransitioning}
                    >
                      {/* Stable visual container that animates inside the stable button */}
                      <div className={`${styles.visualContainer} ${isHovered ? styles.visualContainerHovered : ''}`}>
                        <AnimatePresence>
                          {isActive && (
                            <>
                              <motion.div 
                                className={styles.yellowPanel}
                                initial={{ scaleX: 0, opacity: 0 }}
                                animate={{ scaleX: 1, opacity: 1 }}
                                exit={{ scaleX: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] as const }}
                              />
                              <motion.div 
                                className={styles.yellowPanel}
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                exit={{ scaleX: 0 }}
                                transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
                              />
                            </>
                          )}
                        </AnimatePresence>

                        <div className={styles.contentWrapper}>
                          <div className={styles.number}>{section.number}</div>
                          <div className={styles.label}>{section.label}</div>
                        </div>

                        <AnimatePresence>
                          {(isActive || isHovered) && (
                            <motion.div 
                              className={styles.contextualText}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              NAVIGATE_TO
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </button>
                  </motion.li>
                );
              })}
                        </ul>
            <motion.div 
              className={styles.editContentWrapper}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <button 
                className={styles.editMenuBtn} 
                onClick={() => {
                  setShowPasswordPrompt(true);
                  setPasswordError('');
                  setPassword('');
                }}
              >
                EDIT CONTENT
              </button>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPasswordPrompt && (
          <div className={styles.modalOverlay} onClick={() => setShowPasswordPrompt(false)}>
            <motion.div 
              className={styles.modalContent}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={styles.modalHeading}>EDITOR ACCESS</h3>
              <p className={styles.modalText}>Enter your password to access content editing.</p>
              <form onSubmit={handlePasswordSubmit}>
                <input 
                  type="password" 
                  className={styles.passwordInput}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
                {passwordError && <div className={styles.passwordError}>{passwordError}</div>}
                <div className={styles.modalActions}>
                  <button type="submit" className={styles.primaryBtn}>UNLOCK EDITOR</button>
                  <button type="button" className={styles.secondaryBtn} onClick={() => setShowPasswordPrompt(false)}>CANCEL</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;













