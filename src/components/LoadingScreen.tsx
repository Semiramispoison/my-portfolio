import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import styles from './LoadingScreen.module.css';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'init' | 'loading' | 'ready' | 'exit'>('init');
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      const timer = setTimeout(() => {
        setStage('exit');
        setTimeout(onComplete, 300);
      }, 300);
      return () => clearTimeout(timer);
    }

    // Sequence timing
    const sequence = async () => {
      // Init phase
      await new Promise(resolve => setTimeout(resolve, 300));
      setStage('loading');

      // Loading phase (ticks 1-5)
      for (let i = 1; i <= 5; i++) {
        await new Promise(resolve => setTimeout(resolve, 150));
        setProgress(i);
      }

      // Ready phase
      await new Promise(resolve => setTimeout(resolve, 200));
      setStage('ready');

      // Exit phase
      await new Promise(resolve => setTimeout(resolve, 400));
      setStage('exit');
      
      // Complete
      setTimeout(onComplete, 800);
    };

    sequence();
  }, [onComplete, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <AnimatePresence>
        {stage !== 'exit' && (
          <motion.div
            className={styles.reducedMotionContainer}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span>LOADING...</span>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {stage !== 'exit' && (
        <motion.div 
          className={styles.container}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 0.6, duration: 0.2 } }}
        >
          <div className={styles.content}>
            <div className={styles.textContainer}>
              <motion.div 
                className={styles.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                INITIALIZING
              </motion.div>
              
              <motion.div 
                className={styles.title}
                initial={{ opacity: 0, y: 20 }}
                animate={stage === 'loading' || stage === 'ready' ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              >
                CREATIVE PROFILE
              </motion.div>
            </div>

            <div className={styles.progressContainer}>
              <div className={styles.counter}>
                0{progress}
              </div>
              <div className={styles.barTrack}>
                <motion.div 
                  className={styles.barFill}
                  initial={{ width: '0%' }}
                  animate={{ width: `${(progress / 5) * 100}%` }}
                  transition={{ duration: 0.2, ease: "linear" }}
                />
              </div>
            </div>

            <AnimatePresence>
              {stage === 'ready' && (
                <motion.div
                  className={styles.readyText}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  SYSTEM READY
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
      
      {/* Wipe Panels */}
      {stage === 'exit' && (
        <div className={styles.wipeContainer}>
          <motion.div
            className={styles.wipePanel1}
            initial={{ x: '-150%' }}
            animate={{ x: '150%' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            className={styles.wipePanel2}
            initial={{ x: '-150%' }}
            animate={{ x: '150%' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          />
          <motion.div
            className={styles.wipePanel3}
            initial={{ x: '-150%' }}
            animate={{ x: '150%' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          />
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
