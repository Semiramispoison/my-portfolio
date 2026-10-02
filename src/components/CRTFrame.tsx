import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './CRTFrame.module.css';

interface CRTFrameProps {
  children: React.ReactNode;
  variant?: 'full' | 'inner';
}

export const CRTFrame: React.FC<CRTFrameProps> = ({ children, variant = 'full' }) => {
  const isInner = variant === 'inner';
  
  const [interactionState, setInteractionState] = useState<'idle' | 'flashing' | 'tunnel'>('idle');

  useEffect(() => {
    const handleTransition = () => {
      if (interactionState !== 'idle') return;
      setInteractionState('flashing');
      setTimeout(() => setInteractionState('tunnel'), 120);
      setTimeout(() => setInteractionState('idle'), 750);
    };

    const handleNavEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ targetId: string }>;
      const targetId = customEvent.detail.targetId;
      if (interactionState !== 'idle') return;
      handleTransition();
      setTimeout(() => {
        const destSection = document.getElementById(targetId);
        if (destSection) destSection.scrollIntoView({ behavior: 'auto' });
      }, 200);
    };

    const handleProjectEvent = () => {
      handleTransition();
    };

    if (isInner) {
      window.addEventListener('triggerProjectTvTransition', handleProjectEvent);
      return () => window.removeEventListener('triggerProjectTvTransition', handleProjectEvent);
    } else {
      window.addEventListener('triggerInnerTvTransition', handleNavEvent);
      return () => window.removeEventListener('triggerInnerTvTransition', handleNavEvent);
    }
  }, [interactionState, isInner]);

  return (
    <section className={isInner ? styles.tvSectionInner : styles.tvSection}>
      <div className={styles.crtContainer}>
        <div className={isInner ? styles.crtBodyInner : styles.crtBody}>
          <div className={isInner ? styles.crtScreenBezelInner : styles.crtScreenBezel}>
            <div className={isInner ? styles.crtGlassInner : styles.crtGlass}>
              <div className={styles.tvScreenScrollArea}>
                {children}
              </div>
              
              {/* Transition Overlay */}
              <div className={styles.transitionOverlay}>
                <AnimatePresence>
                  {(interactionState === 'flashing') && (
                    <motion.div
                      key="static"
                      className={styles.staticLayer}
                      initial={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ duration: 0.15, ease: "easeIn" }}
                    >
                      <motion.div 
                        className={styles.tvSignal}
                        animate={{
                          filter: 'contrast(3) saturate(3) brightness(2)',
                          scale: 1.1
                        }}
                        transition={{ duration: 0.1 }}
                      />
                      <div className={styles.tvNoise} />
                      <div className={styles.channelText}>SYS // NAV</div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {interactionState === 'tunnel' && (
                  <div className={styles.tunnelContainer}>
                    {[...Array(14)].map((_, i) => (
                      <motion.div
                        key={"tunnel-" + i}
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
              </div>

              {/* Glass Overlays - Pointer Events None */}
              <div className={styles.screenGlow} />
              <div className={styles.glassReflection} />
              <div className={styles.crtScanlines} />
            </div>
          </div>
          
          <div className={isInner ? styles.tvControlsInner : styles.tvControls}>
            <div className={isInner ? styles.dialInner : styles.dial} />
            <div className={isInner ? styles.dialInner : styles.dial} />
            <div className={isInner ? styles.speakerGrilleInner : styles.speakerGrille} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CRTFrame;
