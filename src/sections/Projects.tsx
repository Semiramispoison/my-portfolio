import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import styles from './Projects.module.css';
import SectionHeader from '../components/SectionHeader';
import { CRTFrame } from '../components/CRTFrame';
import { useContent } from '../context/ContentContext';

const Projects: React.FC = () => {
  const { content } = useContent();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const [selectedId, setSelectedId] = useState(content.projects[0]?.id || '');
  const selectedProject = content.projects.find(p => p.id === selectedId) || content.projects[0];

  useEffect(() => {
    if (!content.projects.find(p => p.id === selectedId)) {
      setSelectedId(content.projects[0]?.id || '');
    }
  }, [content.projects, selectedId]);

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } }
  };

  return (
    <section id="projects" className={styles.projectsSection} ref={ref}>
      <motion.div 
        className={styles.bgTypography}
        initial={{ opacity: 0, y: -100 }}
        animate={isInView ? { opacity: 0.05, y: 0 } : {}}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        DATABASE
      </motion.div>

      <SectionHeader number="02" title="PROJECTS" subtitle="ARCHIVE & WORKS" />

      <div className={styles.interfaceContainer}>
        <motion.div 
          className={styles.selectionMenu}
          variants={listVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className={styles.menuHeader}>// SELECT_TARGET</div>
          <div className={styles.projectList}>
            {content.projects.map((project) => {
              const isSelected = selectedId === project.id;
              return (
                <motion.button
                  key={project.id}
                  className={`${styles.projectItem} ${isSelected ? styles.selected : ''}`}
                  onClick={() => setSelectedId(project.id)}
                  variants={itemVariants}
                >
                  {isSelected && (
                    <motion.div 
                      layoutId="projectSelectBg"
                      className={styles.selectionBg}
                      transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                    />
                  )}
                  <span className={styles.projectNumber}>{project.number}</span>
                  <span className={styles.projectTitle}>{project.title}</span>
                  {isSelected && <span className={styles.activeArrow}>►</span>}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <div className={styles.detailWrapper}>
          <CRTFrame variant="inner">
          <AnimatePresence mode="wait">
            {selectedProject && (
              <motion.div
                key={selectedProject.id}
                className={styles.detailContent}
                initial={{ opacity: 0, x: 20, skewX: 2 }}
                animate={{ opacity: 1, x: 0, skewX: 0 }}
                exit={{ opacity: 0, x: -20, skewX: -2 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
              >
                <div className={styles.detailHeader}>
                  <div className={styles.detailNumber}>{selectedProject.number}</div>
                  <div className={styles.detailCategory}>{selectedProject.category}</div>
                </div>

                <h2 className={styles.detailTitle}>{selectedProject.title}</h2>

                <div className={styles.previewImage}>
                  <div className={styles.previewPlaceholder}>
                    NO_VISUAL_DATA
                  </div>
                  <div className={styles.scanlineOverlay} />
                </div>

                <div className={styles.metaGrid}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>YEAR</span>
                    <span className={styles.metaValue}>{selectedProject.year}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>ROLE</span>
                    <span className={styles.metaValue}>{selectedProject.role}</span>
                  </div>
                </div>

                <div className={styles.description}>
                  <p>{selectedProject.description}</p>
                </div>

                <div className={styles.toolsList}>
                  {selectedProject.tools.map(tool => (
                    <span key={tool} className={styles.toolTag}>{tool}</span>
                  ))}
                </div>

                <button className={styles.actionButton}>
                  <span className={styles.actionText}>EXECUTE // VIEW</span>
                  <span className={styles.actionArrow}>↗</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          </CRTFrame>
        </div>
      </div>
    </section>
  );
};

export default Projects;
