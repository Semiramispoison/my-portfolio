import React, { useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FaUserAlt } from 'react-icons/fa';
import styles from './Hero.module.css';
import { useContent } from '../context/ContentContext';

export const Hero: React.FC = () => {
  const { content } = useContent();
  const nameParts = content.profile.name.split(' ');
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 1000], [0, 200]);
  const tvY = useTransform(scrollY, [0, 1000], [0, -100]);
  const textX = useTransform(scrollY, [0, 1000], [0, 150]);
  
  // Interaction State
  const [interactionState, setInteractionState] = useState<'idle' | 'flashing' | 'tunnel' | 'revealed'>('idle');

  const triggerTransition = (targetId: string, jumpToHomeFirst: boolean) => {
    if (interactionState !== 'idle') return;

    if (jumpToHomeFirst) {
      const homeSection = document.getElementById('home');
      if (homeSection) homeSection.scrollIntoView({ behavior: 'auto' });
    }

    // PHASE 1: 0ms-120ms - Static intensifies
    setInteractionState('flashing');
    
    // PHASE 2: 120ms-550ms - Tunnel sucks inward
    setTimeout(() => {
      setInteractionState('tunnel');
    }, 120);

    // PHASE 3: 550ms-750ms - Profile reveals
    setTimeout(() => {
      setInteractionState('revealed');
    }, 550);

    // PHASE 4: 750ms+ - Navigate to destination
    setTimeout(() => {
      const destSection = document.getElementById(targetId);
      if (destSection) {
        destSection.scrollIntoView({ behavior: 'smooth' });
      }
      
      // Reset state silently after transition ends
      setTimeout(() => {
        setInteractionState('idle');
      }, 1000);
    }, 750);
  };

  const handleTvClick = () => {
    triggerTransition('about', false);
  };

  React.useEffect(() => {
    const handleNavEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ targetId: string }>;
      triggerTransition(customEvent.detail.targetId, true);
    };
    window.addEventListener('triggerTvTransition', handleNavEvent);
    return () => window.removeEventListener('triggerTvTransition', handleNavEvent);
  }, [interactionState]);
  React.useEffect(() => {
    const handleNavEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ targetId: string }>;
      triggerTransition(customEvent.detail.targetId, true);
    };
    window.addEventListener('triggerTvTransition', handleNavEvent);
    return () => window.removeEventListener('triggerTvTransition', handleNavEvent);
  }, [interactionState]);

  return (
    <section id="home" className={styles.heroSection}>
      {/* Bright Yellow Rainbow Static Background */}
      <div className={styles.staticBackground} />
      <div className={styles.analogNoise} />
      <div className={styles.scanlines} />

      <motion.div 
        className={styles.bgTypography}
        style={{ y: bgY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        PORTFOLIO
      </motion.div>

      <div className={styles.mainContent}>
        
        {/* CRT Television Profile Frame */}
        <motion.div 
          className={styles.crtContainer}
          style={{ y: tvY }}
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: -2 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <div className={styles.crtBody}>
            <div className={styles.crtScreenBezel}>
              {/* The clickable glass area */}
              <div 
                className={`${styles.crtGlass} ${interactionState === 'idle' ? styles.crtClickable : ''}`}
                onClick={handleTvClick}
              >
                
                <div className={styles.profileImagePlaceholder}>
                  
                  <AnimatePresence>
                    {(interactionState === 'idle' || interactionState === 'flashing') && (
                      <motion.div
                        key="static"
                        className={styles.staticLayer}
                        initial={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.15, ease: "easeIn" }}
                      >
                        <motion.div 
                          className={styles.tvSignal}
                          animate={interactionState === 'flashing' ? {
                            filter: 'contrast(3) saturate(3) brightness(2)',
                            scale: 1.1
                          } : {
                            filter: 'contrast(1.5) saturate(1.5) brightness(1)',
                            scale: 1
                          }}
                          transition={{ duration: 0.1 }}
                        />
                        <div className={styles.tvNoise} />
                        <div className={styles.channelText}>CH 04 // J.B.V</div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Tunnel Effect */}
                  {interactionState === 'tunnel' && (
                    <div className={styles.tunnelContainer}>
                      {[...Array(14)].map((_, i) => (
                        <motion.div
                          key={`tunnel-${i}`}
                          className={styles.tunnelRect}
                          style={{ transformOrigin: 'center center' }}
                          initial={{ scale: 0.95, opacity: 0, rotate: i % 2 === 0 ? 2 : -2 }}
                          animate={{ scale: 0, opacity: [0, 1, 1, 0] }}
                          transition={{ 
                            duration: 0.25, 
                            delay: i * 0.015, 
                            ease: "linear"
                          }}
                        />
                      ))}
                    </div>
                  )}



                  {/* Final Reveal */}
                  {interactionState === 'revealed' && (
                    <motion.div 
                      className={styles.finalProfileImage}
                      initial={{ opacity: 0, scale: 0, filter: 'brightness(3)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'brightness(1)' }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      {content.profile.heroImageUrl ? (
                        <img 
                          src={content.profile.heroImageUrl} 
                          alt="TV Reveal" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      ) : (
                        <FaUserAlt className={styles.portraitIcon} />
                      )}
                    </motion.div>
                  )}

                </div>
                
                <div className={styles.screenGlow} />
                <div className={styles.glassReflection} />
                <div className={styles.crtScanlines} />
              </div>
            </div>
            {/* TV Details */}
            <div className={styles.tvControls}>
              <div className={styles.dial} />
              <div className={styles.dial} />
              <div className={styles.speakerGrille} />
            </div>
          </div>
        </motion.div>

        {/* Text/Typography Composition */}
        <motion.div 
          className={styles.typographyContainer}
          style={{ x: textX }}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <h1 className={styles.name}>
            <span className={styles.firstName}>{nameParts[0]}</span>
            <span className={styles.middleName}>{nameParts[1]}</span>
            <span className={styles.lastName}>{nameParts.slice(2).join(' ')}</span>
          </h1>

          <div className={styles.roleBlock}>
            <div className={styles.roleBlackBg}>
              {content.profile.roles.join(' // ')}
            </div>
          </div>

          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>STATUS</span>
              <span className={styles.metaValue}>{content.profile.status}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>LOCATION</span>
              <span className={styles.metaValue}>{content.profile.location}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>SYS.VER</span>
              <span className={styles.metaValue}>{content.profile.sysVersion}</span>
            </div>
          </div>
        </motion.div>

      </div>

      <motion.div 
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <div className={styles.scrollText}>SCROLL</div>
        <div className={styles.scrollLine} />
      </motion.div>
    </section>
  );
};

export default Hero;



