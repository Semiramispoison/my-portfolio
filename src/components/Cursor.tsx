import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import styles from './Cursor.module.css';

export const Cursor = () => {
  const [isTouch, setIsTouch] = useState(false);
  const [hoverText, setHoverText] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useSpring(0, { damping: 25, stiffness: 200, mass: 0.5 });
  const cursorY = useSpring(0, { damping: 25, stiffness: 200, mass: 0.5 });

  useEffect(() => {
    // Detect touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    document.body.style.cursor = 'none';

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cursorTarget = target.closest('[data-cursor]');
      
      if (cursorTarget) {
        const text = cursorTarget.getAttribute('data-cursor') || 'VIEW';
        setHoverText(text);
      } else if (target.closest('a') || target.closest('button')) {
        setHoverText('OPEN');
      } else {
        setHoverText(null);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.body.style.cursor = 'auto';
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (isTouch || !isVisible) return null;

  const isHovering = hoverText !== null;

  return (
    <motion.div
      className={`${styles.cursor} ${isHovering ? styles.hovering : ''}`}
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        width: isHovering ? 48 : 12,
        height: isHovering ? 48 : 12,
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
    >
      <div className={styles.inner}>
        {isHovering && (
          <motion.span 
            className={styles.text}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            {hoverText}
          </motion.span>
        )}
      </div>
    </motion.div>
  );
};

export default Cursor;
