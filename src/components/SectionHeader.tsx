import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
  number: string;
  title: string;
  subtitle?: string;
}

export const SectionHeader = ({ number, title, subtitle }: SectionHeaderProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

  // Split title into characters for staggered animation
  const characters = title.split('');

  return (
    <div className={styles.container} ref={ref}>
      <motion.div
        className={styles.watermark}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 0.05, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {number}
      </motion.div>

      <div className={styles.content}>
        <div className={styles.taglineWrapper}>
          <motion.div
            className={styles.tagline}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={styles.tagNumber}>{number}</span> / {title}
          </motion.div>
          <motion.div
            className={styles.rule}
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        <h2 className={styles.title}>
          {characters.map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.4 + index * 0.03,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </h2>

        {subtitle && (
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default SectionHeader;
