import React from 'react';
import styles from './CRTFrame.module.css';

interface CRTFrameProps {
  children: React.ReactNode;
  variant?: 'full' | 'inner';
}

export const CRTFrame: React.FC<CRTFrameProps> = ({ children, variant = 'full' }) => {
  const isInner = variant === 'inner';
  
  return (
    <section className={isInner ? styles.tvSectionInner : styles.tvSection}>
      <div className={styles.crtContainer}>
        <div className={isInner ? styles.crtBodyInner : styles.crtBody}>
          <div className={isInner ? styles.crtScreenBezelInner : styles.crtScreenBezel}>
            <div className={isInner ? styles.crtGlassInner : styles.crtGlass}>
              <div className={styles.tvScreenScrollArea}>
                {children}
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
