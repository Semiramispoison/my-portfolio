import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaEnvelope, FaGithub, FaLinkedin, FaInstagram, FaExternalLinkAlt } from 'react-icons/fa';
import styles from './Contact.module.css';
import SectionHeader from '../components/SectionHeader';
import { useContent } from '../context/ContentContext';

const getIconForLabel = (label: string) => {
  const l = label.toLowerCase();
  if (l.includes('email')) return <FaEnvelope size={24} />;
  if (l.includes('github')) return <FaGithub size={24} />;
  if (l.includes('linkedin')) return <FaLinkedin size={24} />;
  if (l.includes('instagram')) return <FaInstagram size={24} />;
  return <FaExternalLinkAlt size={24} />;
};

export default function Contact() {
  const { content } = useContent();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <section id="contact" className={styles.section} ref={ref}>
      <motion.div 
        className={styles.bgTypography}
        initial={{ opacity: 0, x: 100 }}
        animate={isInView ? { opacity: 0.05, x: 0 } : {}}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        CONTACT
      </motion.div>
      <div className={styles.container}>
        <SectionHeader number="05" title="CONTACT" subtitle="DISPATCH" />
        
        <div className={styles.content}>
          <motion.h2 
            className={styles.statement}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {content.contact.heading.split('\n').map((line, i, arr) => (
              <React.Fragment key={i}>
                {line}{i < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </motion.h2>
          
          <motion.div 
            className={styles.gradientLine}
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          />

          <motion.div 
            className={styles.links}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {content.socialLinks.map((link, index) => (
              <motion.a 
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.button}
                variants={itemVariants}
                whileHover={{ skewX: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className={styles.buttonLabel}>{link.label}</span>
                <span className={styles.buttonIcon}>
                  {getIconForLabel(link.label)}
                </span>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
      
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>{content.contact.footerText}</p>
          <p>BUILT WITH CREATIVE INTENT</p>
        </div>
      </footer>
    </section>
  );
}
