import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './CrtOverlay.module.css';

export const CrtOverlay: React.FC = () => {
  const { scrollY } = useScroll();
  
  // Fade in the CRT overlay as the user scrolls past the Hero section (approx 500px down)
  const opacity = useTransform(scrollY, [300, 800], [0, 1]);

  return (
    <motion.div 
      className={styles.overlayContainer}
      style={{ opacity }}
    >
      <div className={styles.screenBezel} />
      <div className={styles.screenVignette} />
      <div className={styles.screenGlare} />
    </motion.div>
  );
};

export default CrtOverlay;
