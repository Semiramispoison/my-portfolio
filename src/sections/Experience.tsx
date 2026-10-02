import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './Experience.module.css';
import SectionHeader from '../components/SectionHeader';
import { useContent } from '../context/ContentContext';

export default function Experience() {
  const { content } = useContent();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const lineVariants = {
    hidden: { height: 0 },
    visible: { 
      height: '100%',
      transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] as const, delay: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <section id="experience" className={styles.section} ref={ref}>
      <motion.div 
        className={styles.bgTypography}
        initial={{ opacity: 0, x: 100 }}
        animate={isInView ? { opacity: 0.05, x: 0 } : {}}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        EXPERIENCE
      </motion.div>
      <div className={styles.container}>
        <SectionHeader number="04" title="RECORD" subtitle="TIMELINE & MILESTONES" />
        
        <div className={styles.timelineWrapper}>
          <motion.div 
            className={styles.timelineLine}
            variants={lineVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          />
          
          <div className={styles.timeline}>
            {content.timeline.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div 
                  key={index} 
                  className={`${styles.entry} ${isEven ? styles.entryLeft : styles.entryRight}`}
                  variants={itemVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  transition={{ delay: 0.4 + index * 0.15 }}
                >
                  <div className={styles.yearContainer}>
                    <motion.div 
                      className={styles.year}
                      initial={{ opacity: 0, y: 50 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                      transition={{ duration: 0.8, delay: 0.3 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {item.year}
                    </motion.div>
                  </div>
                  
                  <div className={styles.marker} />
                  
                  <div className={styles.content}>
                    <span className={styles.tag}>{item.category}</span>
                    <h3 className={styles.title}>{item.title}</h3>
                    <p className={styles.description}>{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
