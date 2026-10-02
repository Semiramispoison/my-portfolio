import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './About.module.css';
import SectionHeader from '../components/SectionHeader';
import { useContent } from '../context/ContentContext';

const About: React.FC = () => {
  const { content } = useContent();
  const ref = useRef<HTMLElement>(null);
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
    hidden: { opacity: 0, x: -30, skewX: -5 },
    visible: { 
      opacity: 1, 
      x: 0,
      skewX: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  const nameParts = content.profile.name.split(' ');
  const nameFirst = nameParts[0];
  const nameMiddle = nameParts[1];
  const nameLast = nameParts[2];

  return (
    <section id="about" className={styles.aboutSection} ref={ref}>
      {/* Background Graphic 1: Giant yellow crosshair/UI line */}
      <div className={styles.bgTechLineH} />
      <div className={styles.bgTechLineV} />
      <div className={styles.bgGrid} />

      <motion.div 
        className={styles.bgTypography}
        initial={{ opacity: 0, x: 100 }}
        animate={isInView ? { opacity: 0.05, x: 0 } : {}}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        PROFILE
      </motion.div>

      <SectionHeader number="01" title="PROFILE" subtitle="IDENTITY & CAPABILITIES" />

      <motion.div 
        className={styles.statusScreen}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.div className={styles.portraitPanel} variants={itemVariants}>
          <div className={styles.portraitFrame}>
            <div className={styles.portraitPlaceholder}>
              {content.profile.profileImageUrl ? (
                <img src={content.profile.profileImageUrl} alt="Portrait" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span className={styles.portraitLabel}>[ PORTRAIT_DATA_MISSING ]</span>
              )}
            </div>
            <div className={styles.portraitOverlay} />
          </div>
          
          <div className={styles.levelCard}>
            <div className={styles.levelLabel}>LV.</div>
            <div className={styles.levelNumber}>99</div>
            <div className={styles.levelClass}>CREATIVE</div>
          </div>
        </motion.div>

        <div className={styles.dataPanel}>
          <motion.div className={styles.dataBlock} variants={itemVariants}>
            <h3 className={styles.dataLabel}>// IDENTITY</h3>
            <div className={styles.dataValuePrimary}>
              <span className={styles.nameWhite}>{nameFirst}</span>
              <span className={styles.nameYellow}>{nameMiddle}</span>
              <span className={styles.nameWhite}>{nameLast}</span>
            </div>
          </motion.div>

          <motion.div className={styles.dataBlock} variants={itemVariants}>
            <h3 className={styles.dataLabel}>// PRIMARY_ROLES</h3>
            <div className={styles.rolesList}>
              {content.profile.roles.map((role) => (
                <span key={role} className={styles.roleTag}>{role}</span>
              ))}
            </div>
          </motion.div>

          <motion.div className={styles.dataBlock} variants={itemVariants}>
            <h3 className={styles.dataLabel}>// BIOGRAPHY_DATA</h3>
            <div className={styles.bioText}>
              {content.profile.bio.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </motion.div>
        </div>

        <div className={styles.statsPanel}>
          <motion.div className={styles.dataBlock} variants={itemVariants}>
            <h3 className={styles.dataLabel}>// CURRENT_STATUS</h3>
            <div className={styles.statusIndicator}>
              <div className={styles.statusDot} />
              {content.profile.status}
            </div>
            <div className={styles.locationText}>LOC: {content.profile.location}</div>
          </motion.div>

          <motion.div className={styles.dataBlock} variants={itemVariants}>
            <h3 className={styles.dataLabel}>// CORE_PARAMETERS</h3>
            <div className={styles.parametersList}>
              {content.profile.skills.map((skill) => (
                <div key={skill.name} className={styles.parameterItem}>
                  <div className={styles.parameterName}>{skill.name}</div>
                  <div className={styles.parameterBar}>
                    <motion.div 
                      className={styles.parameterFill}
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${skill.level}%` } : {}}
                      transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    />
                  </div>
                  <div className={styles.parameterValue}>{skill.level}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className={styles.dataBlock} variants={itemVariants}>
            <h3 className={styles.dataLabel}>// SPECIALTIES</h3>
            <div className={styles.specialtiesList}>
              {content.profile.specialties.map((spec) => (
                <span key={spec} className={styles.specialtyItem}>{spec}</span>
              ))}
            </div>
          </motion.div>
        </div>

      </motion.div>
    </section>
  );
};

export default About;
