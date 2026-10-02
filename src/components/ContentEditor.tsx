import React, { useState, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useContent, type PortfolioContent } from '../context/ContentContext';
import type { Project, SkillCategory, TimelineEntry } from '../data/profile';
import { ImageUploader } from './ImageUploader';
import styles from './ContentEditor.module.css';

// ── Tabs ───────────────────────────────────────────────────────────

const TABS = ['HOME', 'PROFILE', 'PROJECTS', 'SKILLS', 'EXPERIENCE', 'CONTACT'] as const;
type Tab = typeof TABS[number];

// ── Toast Component ────────────────────────────────────────────────

const Toast: React.FC<{ message: string; type?: 'success' | 'error'; onDone: () => void }> = ({ message, type = 'success', onDone }) => {
  React.useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);
  return <div className={type === 'error' ? styles.toastError : styles.toast}>{message}</div>;
};

// ── Confirm Dialog ─────────────────────────────────────────────────

const ConfirmDialog: React.FC<{ message: string; onConfirm: () => void; onCancel: () => void }> = ({ message, onConfirm, onCancel }) => (
  <div className={styles.confirmOverlay} onClick={onCancel}>
    <div className={styles.confirmBox} onClick={e => e.stopPropagation()}>
      <div className={styles.confirmText}>{message}</div>
      <div className={styles.confirmActions}>
        <button className={styles.toolbarBtn} onClick={onCancel}>CANCEL</button>
        <button className={styles.resetBtn} onClick={onConfirm}>CONFIRM</button>
      </div>
    </div>
  </div>
);

// ── Tag Editor ─────────────────────────────────────────────────────

const TagEditor: React.FC<{ tags: string[]; onChange: (tags: string[]) => void; placeholder?: string }> = ({ tags, onChange, placeholder = 'Add...' }) => {
  const [input, setInput] = useState('');
  const add = () => {
    const val = input.trim();
    if (val && !tags.includes(val)) {
      onChange([...tags, val]);
    }
    setInput('');
  };
  return (
    <>
      <div className={styles.tagList}>
        {tags.map((tag, i) => (
          <span key={i} className={styles.tag}>
            {tag}
            <button className={styles.tagRemove} onClick={() => onChange(tags.filter((_, j) => j !== i))}>×</button>
          </span>
        ))}
      </div>
      <div className={styles.addTagRow}>
        <input
          className={styles.addTagInput}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={placeholder}
        />
        <button className={styles.addTagBtn} onClick={add} type="button">+</button>
      </div>
    </>
  );
};

// ── Skill Level Slider ─────────────────────────────────────────────

const SkillSlider: React.FC<{ value: number; onChange: (v: number) => void }> = ({ value, onChange }) => (
  <div className={styles.sliderRow}>
    <input
      type="range"
      className={styles.slider}
      min={0}
      max={100}
      value={value}
      onChange={e => onChange(Number(e.target.value))}
    />
    <span className={styles.sliderValue}>{value}</span>
  </div>
);

// ── Helpers ────────────────────────────────────────────────────────

function updatePath<T>(content: PortfolioContent, path: string, value: T): PortfolioContent {
  const clone = JSON.parse(JSON.stringify(content)) as PortfolioContent;
  const parts = path.split('.');
  let obj: any = clone;
  for (let i = 0; i < parts.length - 1; i++) {
    obj = obj[parts[i]];
  }
  obj[parts[parts.length - 1]] = value;
  return clone;
}

// ── Main Editor Component ──────────────────────────────────────────

export const ContentEditor: React.FC = () => {
  const { content, isEditMode, hasUnsavedChanges, setEditMode, updateContent, saveChanges, cancelChanges, resetToDefaults, exportContent, importContent } = useContent();
  const [activeTab, setActiveTab] = useState<Tab>('HOME');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ message: string; onConfirm: () => void } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showConfirm = useCallback((message: string, onConfirm: () => void) => {
    setConfirmAction({ message, onConfirm });
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  }, []);

  const handleSave = () => {
    saveChanges();
    showToast('CONTENT SAVED SUCCESSFULLY');
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setConfirmAction({
        message: 'Discard unsaved changes?',
        onConfirm: () => { cancelChanges(); setConfirmAction(null); },
      });
    } else {
      cancelChanges();
    }
  };

  const handleReset = () => {
    setConfirmAction({
      message: 'RESET ALL CONTENT to original defaults? This cannot be undone.',
      onConfirm: () => { resetToDefaults(); setConfirmAction(null); showToast('CONTENT RESET TO DEFAULTS'); },
    });
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = importContent(ev.target?.result as string);
      if (result.success) {
        showToast('CONTENT IMPORTED');
      } else {
        showToast(result.error || 'IMPORT FAILED', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Shorthand updater
  const set = (path: string, value: any) => {
    updateContent(prev => updatePath(prev, path, value));
  };

  // ── Tab Panels ─────────────────────────────────────────────

  const renderHome = () => (
    <div className={styles.sectionBody}>
      <div className={styles.sectionTitle}>// HOME_DISPLAY</div>
      <div className={styles.field}>
        <label className={styles.fieldLabel}>NAME</label>
        <input className={styles.fieldInput} value={content.profile.name} onChange={e => set('profile.name', e.target.value)} />
      </div>
      <div className={styles.field}>
        <label className={styles.fieldLabel}>ROLES (comma separated)</label>
        <input className={styles.fieldInput} value={content.profile.roles.join(', ')} onChange={e => set('profile.roles', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
      </div>
      <div className={styles.field}>
        <label className={styles.fieldLabel}>AVAILABILITY STATUS</label>
        <input className={styles.fieldInput} value={content.profile.status} onChange={e => set('profile.status', e.target.value)} />
      </div>
      <div className={styles.field}>
        <label className={styles.fieldLabel}>LOCATION</label>
        <input className={styles.fieldInput} value={content.profile.location} onChange={e => set('profile.location', e.target.value)} />
      </div>
      <div className={styles.field}>
        <label className={styles.fieldLabel}>SYS.VER LABEL</label>
        <input className={styles.fieldInput} value={content.profile.sysVersion} onChange={e => set('profile.sysVersion', e.target.value)} />
      </div>
      <ImageUploader 
        label="TV MAIN VISUAL" 
        value={content.profile.heroImageUrl || ''} 
        onChange={val => set('profile.heroImageUrl', val)} 
        aspectRatioText="(16:9 RECOMMENDED)"
      />
    </div>
  );

  const renderProfile = () => (
    <div className={styles.sectionBody}>
      <div className={styles.sectionTitle}>// IDENTITY</div>
      <div className={styles.field}>
        <label className={styles.fieldLabel}>NAME</label>
        <input className={styles.fieldInput} value={content.profile.name} onChange={e => set('profile.name', e.target.value)} />
      </div>
      <ImageUploader 
        label="PROFILE IMAGE" 
        value={content.profile.profileImageUrl || ''} 
        onChange={val => set('profile.profileImageUrl', val)} 
      />

      <div className={styles.sectionTitle}>// BIOGRAPHY_DATA</div>
      {content.profile.bio.map((para, idx) => (
        <div key={idx} className={styles.field}>
          <label className={styles.fieldLabel}>BIO PARAGRAPH {idx + 1}</label>
          <textarea className={styles.fieldTextarea} value={para} onChange={e => {
            const newBio = [...content.profile.bio];
            newBio[idx] = e.target.value;
            set('profile.bio', newBio);
          }} />
        </div>
      ))}

      <div className={styles.sectionTitle}>// PRIMARY_ROLES</div>
      <div className={styles.field}>
        <TagEditor tags={content.profile.roles} onChange={roles => set('profile.roles', roles)} placeholder="Add role..." />
      </div>

      <div className={styles.sectionTitle}>// SPECIALTIES</div>
      <div className={styles.field}>
        <TagEditor tags={content.profile.specialties} onChange={specs => set('profile.specialties', specs)} placeholder="Add specialty..." />
      </div>

      <div className={styles.sectionTitle}>// STATUS</div>
      <div className={styles.field}>
        <label className={styles.fieldLabel}>CURRENT STATUS</label>
        <input className={styles.fieldInput} value={content.profile.status} onChange={e => set('profile.status', e.target.value)} />
      </div>
      <div className={styles.field}>
        <label className={styles.fieldLabel}>LOCATION</label>
        <input className={styles.fieldInput} value={content.profile.location} onChange={e => set('profile.location', e.target.value)} />
      </div>

      <div className={styles.sectionTitle}>// CORE_PARAMETERS</div>
      {content.profile.skills.map((skill, idx) => (
        <div key={idx} className={styles.itemCard}>
          <div className={styles.itemCardHeader}>
            <span className={styles.itemCardTitle}>PARAM_{String(idx + 1).padStart(2, '0')}</span>
            <div className={styles.itemCardActions}>
              <button className={styles.deleteBtn} onClick={() => {
                const skills = content.profile.skills.filter((_, i) => i !== idx);
                set('profile.skills', skills);
              }}>DEL</button>
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>NAME</label>
            <input className={styles.fieldInput} value={skill.name} onChange={e => {
              const skills = [...content.profile.skills];
              skills[idx] = { ...skills[idx], name: e.target.value };
              set('profile.skills', skills);
            }} />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>LEVEL</label>
            <SkillSlider value={skill.level} onChange={v => {
              const skills = [...content.profile.skills];
              skills[idx] = { ...skills[idx], level: v };
              set('profile.skills', skills);
            }} />
          </div>
        </div>
      ))}
      <button className={styles.addItemBtn} onClick={() => {
        set('profile.skills', [...content.profile.skills, { name: 'New Skill', level: 50 }]);
      }}>+ ADD PARAMETER</button>
    </div>
  );

  const renderProjects = () => (
    <div className={styles.sectionBody}>
      <div className={styles.sectionTitle}>// PROJECT_DATABASE</div>
      {content.projects.map((project, idx) => (
        <div key={project.id} className={styles.itemCard}>
          <div className={styles.itemCardHeader}>
            <span className={styles.itemCardTitle}>PROJECT_{project.number}</span>
            <div className={styles.itemCardActions}>
              {idx > 0 && (
                <button className={styles.iconBtn} onClick={() => {
                  updateContent(prev => {
                    const ps = [...prev.projects];
                    [ps[idx - 1], ps[idx]] = [ps[idx], ps[idx - 1]];
                    return { ...prev, projects: ps.map((p, i) => ({ ...p, number: String(i + 1).padStart(2, '0') })) };
                  });
                }}>↑</button>
              )}
              {idx < content.projects.length - 1 && (
                <button className={styles.iconBtn} onClick={() => {
                  updateContent(prev => {
                    const ps = [...prev.projects];
                    [ps[idx], ps[idx + 1]] = [ps[idx + 1], ps[idx]];
                    return { ...prev, projects: ps.map((p, i) => ({ ...p, number: String(i + 1).padStart(2, '0') })) };
                  });
                }}>↓</button>
              )}
              <button className={styles.deleteBtn} onClick={() => {
                if (content.projects.length <= 1) { showToast('NEED AT LEAST 1 PROJECT', 'error'); return; }
                updateContent(prev => ({
                  ...prev,
                  projects: prev.projects.filter((_, i) => i !== idx).map((p, i) => ({ ...p, number: String(i + 1).padStart(2, '0') })),
                }));
              }}>DEL</button>
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>TITLE</label>
            <input className={styles.fieldInput} value={project.title} onChange={e => {
              updateContent(prev => {
                const ps = [...prev.projects];
                ps[idx] = { ...ps[idx], title: e.target.value };
                return { ...prev, projects: ps };
              });
            }} />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>CATEGORY</label>
            <input className={styles.fieldInput} value={project.category} onChange={e => {
              updateContent(prev => {
                const ps = [...prev.projects];
                ps[idx] = { ...ps[idx], category: e.target.value };
                return { ...prev, projects: ps };
              });
            }} />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>YEAR</label>
            <input className={styles.fieldInput} value={project.year} onChange={e => {
              updateContent(prev => {
                const ps = [...prev.projects];
                ps[idx] = { ...ps[idx], year: e.target.value };
                return { ...prev, projects: ps };
              });
            }} />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>ROLE</label>
            <input className={styles.fieldInput} value={project.role} onChange={e => {
              updateContent(prev => {
                const ps = [...prev.projects];
                ps[idx] = { ...ps[idx], role: e.target.value };
                return { ...prev, projects: ps };
              });
            }} />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>DESCRIPTION</label>
            <textarea className={styles.fieldTextarea} value={project.description} onChange={e => {
              updateContent(prev => {
                const ps = [...prev.projects];
                ps[idx] = { ...ps[idx], description: e.target.value };
                return { ...prev, projects: ps };
              });
            }} />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>TOOLS</label>
            <TagEditor tags={project.tools} onChange={tools => {
              updateContent(prev => {
                const ps = [...prev.projects];
                ps[idx] = { ...ps[idx], tools };
                return { ...prev, projects: ps };
              });
            }} placeholder="Add tool..." />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>ACCENT COLOR</label>
            <input className={styles.fieldInput} value={project.accent} onChange={e => {
              updateContent(prev => {
                const ps = [...prev.projects];
                ps[idx] = { ...ps[idx], accent: e.target.value };
                return { ...prev, projects: ps };
              });
            }} placeholder="#HEXCODE" />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>PROJECT URL (EXECUTE BUTTON)</label>
            <input className={styles.fieldInput} value={project.projectUrl || ''} onChange={e => {
              updateContent(prev => {
                const ps = [...prev.projects];
                ps[idx] = { ...ps[idx], projectUrl: e.target.value };
                return { ...prev, projects: ps };
              });
            }} placeholder="https://..." />
          </div>
          <ImageUploader 
            label="PROJECT IMAGE" 
            value={project.imageUrl || ''} 
            onChange={val => {
              updateContent(prev => {
                const ps = [...prev.projects];
                ps[idx] = { ...ps[idx], imageUrl: val };
                return { ...prev, projects: ps };
              });
            }}
            aspectRatioText="(16:9 RECOMMENDED)"
          />
        </div>
      ))}
      <button className={styles.addItemBtn} onClick={() => {
        const num = String(content.projects.length + 1).padStart(2, '0');
        updateContent(prev => ({
          ...prev,
          projects: [...prev.projects, {
            id: `project-${Date.now()}`,
            number: num,
            title: 'NEW PROJECT',
            category: 'Category',
            year: new Date().getFullYear().toString(),
            role: 'Role',
            tools: [],
            description: 'Project description.',
            accent: '#FFCC00',
          }],
        }));
      }}>+ ADD PROJECT</button>
    </div>
  );

  const renderSkills = () => (
    <div className={styles.sectionBody}>
      <div className={styles.sectionTitle}>// SKILL_CATEGORIES</div>
      {content.skillCategories.map((cat, catIdx) => (
        <div key={cat.id} className={styles.itemCard}>
          <div className={styles.itemCardHeader}>
            <span className={styles.itemCardTitle}>CAT_{cat.id.toUpperCase()}</span>
            <div className={styles.itemCardActions}>
              <button className={styles.deleteBtn} onClick={() => {
                if (content.skillCategories.length <= 1) { showToast('NEED AT LEAST 1 CATEGORY', 'error'); return; }
                updateContent(prev => ({
                  ...prev,
                  skillCategories: prev.skillCategories.filter((_, i) => i !== catIdx),
                }));
              }}>DEL</button>
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>CATEGORY TITLE</label>
            <input className={styles.fieldInput} value={cat.title} onChange={e => {
              updateContent(prev => {
                const cats = [...prev.skillCategories];
                cats[catIdx] = { ...cats[catIdx], title: e.target.value };
                return { ...prev, skillCategories: cats };
              });
            }} />
          </div>
          {cat.skills.map((skill, sIdx) => (
            <div key={sIdx} style={{ paddingLeft: '12px', borderLeft: '2px solid #333', marginTop: '10px' }}>
              <div className={styles.itemCardHeader}>
                <span className={styles.itemCardTitle} style={{ fontSize: '0.65rem' }}>SKILL_{sIdx + 1}</span>
                <button className={styles.deleteBtn} onClick={() => {
                  updateContent(prev => {
                    const cats = [...prev.skillCategories];
                    cats[catIdx] = { ...cats[catIdx], skills: cats[catIdx].skills.filter((_, i) => i !== sIdx) };
                    return { ...prev, skillCategories: cats };
                  });
                }}>DEL</button>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>NAME</label>
                <input className={styles.fieldInput} value={skill.name} onChange={e => {
                  updateContent(prev => {
                    const cats = JSON.parse(JSON.stringify(prev.skillCategories)) as SkillCategory[];
                    cats[catIdx].skills[sIdx].name = e.target.value;
                    return { ...prev, skillCategories: cats };
                  });
                }} />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>LEVEL</label>
                <SkillSlider value={skill.level} onChange={v => {
                  updateContent(prev => {
                    const cats = JSON.parse(JSON.stringify(prev.skillCategories)) as SkillCategory[];
                    cats[catIdx].skills[sIdx].level = v;
                    return { ...prev, skillCategories: cats };
                  });
                }} />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>DESCRIPTION</label>
                <input className={styles.fieldInput} value={skill.description} onChange={e => {
                  updateContent(prev => {
                    const cats = JSON.parse(JSON.stringify(prev.skillCategories)) as SkillCategory[];
                    cats[catIdx].skills[sIdx].description = e.target.value;
                    return { ...prev, skillCategories: cats };
                  });
                }} />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>TOOLS</label>
                <TagEditor tags={skill.tools} onChange={tools => {
                  updateContent(prev => {
                    const cats = JSON.parse(JSON.stringify(prev.skillCategories)) as SkillCategory[];
                    cats[catIdx].skills[sIdx].tools = tools;
                    return { ...prev, skillCategories: cats };
                  });
                }} placeholder="Add tool..." />
              </div>
            </div>
          ))}
          <button className={styles.addItemBtn} style={{ marginTop: '10px' }} onClick={() => {
            updateContent(prev => {
              const cats = JSON.parse(JSON.stringify(prev.skillCategories)) as SkillCategory[];
              cats[catIdx].skills.push({ name: 'New Skill', level: 50, tools: [], description: 'Description.' });
              return { ...prev, skillCategories: cats };
            });
          }}>+ ADD SKILL</button>
        </div>
      ))}
      <button className={styles.addItemBtn} onClick={() => {
        updateContent(prev => ({
          ...prev,
          skillCategories: [...prev.skillCategories, {
            id: `cat-${Date.now()}`,
            title: 'NEW CATEGORY',
            skills: [{ name: 'New Skill', level: 50, tools: [], description: 'Description.' }],
          }],
        }));
      }}>+ ADD CATEGORY</button>
    </div>
  );

  const renderExperience = () => (
    <div className={styles.sectionBody}>
      <div className={styles.sectionTitle}>// TIMELINE_DATA</div>
      {content.timeline.map((entry, idx) => (
        <div key={idx} className={styles.itemCard}>
          <div className={styles.itemCardHeader}>
            <span className={styles.itemCardTitle}>ENTRY_{String(idx + 1).padStart(2, '0')}</span>
            <div className={styles.itemCardActions}>
              {idx > 0 && (
                <button className={styles.iconBtn} onClick={() => {
                  updateContent(prev => {
                    const tl = [...prev.timeline];
                    [tl[idx - 1], tl[idx]] = [tl[idx], tl[idx - 1]];
                    return { ...prev, timeline: tl };
                  });
                }}>↑</button>
              )}
              {idx < content.timeline.length - 1 && (
                <button className={styles.iconBtn} onClick={() => {
                  updateContent(prev => {
                    const tl = [...prev.timeline];
                    [tl[idx], tl[idx + 1]] = [tl[idx + 1], tl[idx]];
                    return { ...prev, timeline: tl };
                  });
                }}>↓</button>
              )}
              <button className={styles.deleteBtn} onClick={() => {
                updateContent(prev => ({
                  ...prev,
                  timeline: prev.timeline.filter((_, i) => i !== idx),
                }));
              }}>DEL</button>
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>YEAR</label>
            <input className={styles.fieldInput} value={entry.year} onChange={e => {
              updateContent(prev => {
                const tl = [...prev.timeline];
                tl[idx] = { ...tl[idx], year: e.target.value };
                return { ...prev, timeline: tl };
              });
            }} />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>TITLE</label>
            <input className={styles.fieldInput} value={entry.title} onChange={e => {
              updateContent(prev => {
                const tl = [...prev.timeline];
                tl[idx] = { ...tl[idx], title: e.target.value };
                return { ...prev, timeline: tl };
              });
            }} />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>DESCRIPTION</label>
            <textarea className={styles.fieldTextarea} value={entry.description} onChange={e => {
              updateContent(prev => {
                const tl = [...prev.timeline];
                tl[idx] = { ...tl[idx], description: e.target.value };
                return { ...prev, timeline: tl };
              });
            }} />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>CATEGORY</label>
            <input className={styles.fieldInput} value={entry.category} onChange={e => {
              updateContent(prev => {
                const tl = [...prev.timeline];
                tl[idx] = { ...tl[idx], category: e.target.value };
                return { ...prev, timeline: tl };
              });
            }} placeholder="Work / Education" />
          </div>
        </div>
      ))}
      <button className={styles.addItemBtn} onClick={() => {
        updateContent(prev => ({
          ...prev,
          timeline: [...prev.timeline, {
            year: new Date().getFullYear().toString(),
            title: 'New Entry',
            description: 'Description.',
            category: 'Work',
          }],
        }));
      }}>+ ADD ENTRY</button>
    </div>
  );

  const renderContact = () => (
    <div className={styles.sectionBody}>
      <div className={styles.sectionTitle}>// DISPLAY</div>
      <div className={styles.field}>
        <label className={styles.fieldLabel}>HEADING (use \n for line break)</label>
        <input className={styles.fieldInput} value={content.contact.heading} onChange={e => set('contact.heading', e.target.value)} />
      </div>
      <div className={styles.field}>
        <label className={styles.fieldLabel}>FOOTER TEXT</label>
        <input className={styles.fieldInput} value={content.contact.footerText} onChange={e => set('contact.footerText', e.target.value)} />
      </div>

      <div className={styles.sectionTitle}>// SOCIAL_LINKS</div>
      {content.socialLinks.map((link, idx) => (
        <div key={idx} className={styles.itemCard}>
          <div className={styles.itemCardHeader}>
            <span className={styles.itemCardTitle}>{link.label}</span>
            <button className={styles.deleteBtn} onClick={() => {
              updateContent(prev => ({ ...prev, socialLinks: prev.socialLinks.filter((_, i) => i !== idx) }));
            }}>DEL</button>
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>LABEL</label>
            <input className={styles.fieldInput} value={link.label} onChange={e => {
              updateContent(prev => {
                const links = [...prev.socialLinks];
                links[idx] = { ...links[idx], label: e.target.value };
                return { ...prev, socialLinks: links };
              });
            }} />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>URL</label>
            <input className={styles.fieldInput} value={link.url} onChange={e => {
              updateContent(prev => {
                const links = [...prev.socialLinks];
                links[idx] = { ...links[idx], url: e.target.value };
                return { ...prev, socialLinks: links };
              });
            }} placeholder="https://..." />
          </div>
        </div>
      ))}
      <button className={styles.addItemBtn} onClick={() => {
        updateContent(prev => ({
          ...prev,
          socialLinks: [...prev.socialLinks, { label: 'NEW LINK', url: 'https://' }],
        }));
      }}>+ ADD SOCIAL LINK</button>
    </div>
  );

  const renderTab = () => {
    switch (activeTab) {
      case 'HOME': return renderHome();
      case 'PROFILE': return renderProfile();
      case 'PROJECTS': return renderProjects();
      case 'SKILLS': return renderSkills();
      case 'EXPERIENCE': return renderExperience();
      case 'CONTACT': return renderContact();
    }
  };

  return (
    <>
      {/* Editor Panel */}
      <AnimatePresence>
        {isEditMode && (
          <div className={styles.overlay}>
            <motion.div
              className={styles.backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (hasUnsavedChanges) {
                  showConfirm('Discard unsaved changes?', () => setEditMode(false));
                } else {
                  setEditMode(false);
                }
              }}
            />
            <motion.div
              className={styles.panel}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className={styles.header}>
                <div className={styles.headerTitle}>SYSTEM CONFIG // {activeTab}</div>
                <div className={styles.headerActions}>
                  {hasUnsavedChanges && (
                    <button className={styles.saveBtn} onClick={() => { saveChanges(); showToast('CHANGES SAVED'); }}>
                      SAVE
                    </button>
                  )}
                  <button className={styles.closeBtn} onClick={() => {
                    if (hasUnsavedChanges) {
                      showConfirm('Discard unsaved changes?', () => setEditMode(false));
                    } else {
                      setEditMode(false);
                    }
                  }}>
                    CLOSE
                  </button>
                </div>
              </div>

              <div className={styles.tabs}>
                {TABS.map(tab => (
                  <button
                    key={tab}
                    className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className={styles.content}>
                {renderTab()}
              </div>

              <div className={styles.footer}>
                <button className={styles.dangerBtn} onClick={() => {
                  showConfirm('Reset all content to original defaults? This cannot be undone.', () => {
                    resetToDefaults();
                    showToast('RESET TO DEFAULTS');
                  });
                }}>
                  RESET DEFAULTS
                </button>
                <div style={{display: 'flex', gap: '8px'}}>
                  <button className={styles.utilityBtn} onClick={() => {
                    exportContent();
                    showToast('CONTENT EXPORTED');
                  }}>
                    EXPORT
                  </button>
                  <button className={styles.utilityBtn} onClick={() => fileInputRef.current?.click()}>
                    IMPORT
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{display: 'none'}} 
                    accept="application/json"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        try {
                          const json = event.target?.result as string;
                          importContent(json);
                          showToast('CONTENT IMPORTED');
                        } catch (err) {
                          showToast('IMPORT FAILED: INVALID FILE', 'error');
                        }
                      };
                      reader.readAsText(file);
                      e.target.value = '';
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
      </AnimatePresence>

      {confirmAction && (
        <ConfirmDialog 
          message={confirmAction.message} 
          onConfirm={() => { confirmAction.onConfirm(); setConfirmAction(null); }} 
          onCancel={() => setConfirmAction(null)} 
        />
      )}
    </>
  );
};

export default ContentEditor;

