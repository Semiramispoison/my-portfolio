import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './Skills.module.css';
import SectionHeader from '../components/SectionHeader';
import { useContent } from '../context/ContentContext';

export default function Skills() {
  const { content } = useContent();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const
      }
    }
  };

  return (
    <section id="skills" className={styles.section} ref={ref}>
      <motion.div 
        className={styles.bgTypography}
        initial={{ opacity: 0, x: 100 }}
        animate={isInView ? { opacity: 0.05, x: 0 } : {}}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        SKILLS
      </motion.div>
      <div className={styles.container}>
        <SectionHeader number="03" title="SKILL SET" subtitle="STATUS PARAMETERS" />
        
        <motion.div 
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {content.skillCategories.map((category, index) => (
            <motion.div key={index} className={styles.card} variants={itemVariants}>
              <div className={styles.cardHeader}>
                <h3 className={styles.categoryTitle}>{category.title}</h3>
                <span className={styles.paramLabel}>PARAM</span>
              </div>
              
              <div className={styles.skillList}>
                {category.skills.map((skill, sIndex) => (
                  <div key={sIndex} className={styles.skillItem}>
                    <div className={styles.skillHeader}>
                      <span className={styles.skillName}>{skill.name}</span>
                      <span className={styles.skillLevel}>
                        <span className={styles.lvLabel}>LV</span>
                        {skill.level}
                      </span>
                    </div>
                    
                    <div className={styles.barTrack}>
                      <motion.div 
                        className={styles.barFill}
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                        transition={{ 
                          duration: 1, 
                          delay: 0.3 + (index * 0.1) + (sIndex * 0.1),
                          ease: [0.16, 1, 0.3, 1]
                        }}
                      />
                    </div>
                    
                    <p className={styles.skillDesc}>{skill.description}</p>
                    
                    <div className={styles.tools}>
                      {skill.tools.map((tool, tIndex) => (
                        <span key={tIndex} className={styles.toolLabel}>{tool}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div className={styles.bgDiagonal} />
    </section>
  );
}
