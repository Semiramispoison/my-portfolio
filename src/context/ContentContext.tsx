import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  profile as defaultProfile,
  projects as defaultProjects,
  skillCategories as defaultSkillCategories,
  timeline as defaultTimeline,
  socialLinks as defaultSocialLinks,
  type Project,
  type SkillCategory,
  type TimelineEntry,
  type SocialLink,
} from '../data/profile';

// ── Types ──────────────────────────────────────────────────────────

export interface ProfileData {
  name: string;
  roles: string[];
  status: string;
  location: string;
  bio: string[];
  specialties: string[];
  skills: { name: string; level: number }[];
  sysVersion: string;
  profileImageUrl: string;
}

export interface ContactData {
  heading: string;
  subtext: string;
  footerText: string;
}

export interface PortfolioContent {
  profile: ProfileData;
  projects: Project[];
  skillCategories: SkillCategory[];
  timeline: TimelineEntry[];
  socialLinks: SocialLink[];
  contact: ContactData;
}

interface ContentContextValue {
  content: PortfolioContent;
  isEditMode: boolean;
  hasUnsavedChanges: boolean;
  setEditMode: (on: boolean) => void;
  updateContent: (updater: (prev: PortfolioContent) => PortfolioContent) => void;
  saveChanges: () => void;
  cancelChanges: () => void;
  resetToDefaults: () => void;
  exportContent: () => void;
  importContent: (json: string) => { success: boolean; error?: string };
}

// ── Defaults ───────────────────────────────────────────────────────

const DEFAULT_CONTENT: PortfolioContent = {
  profile: {
    ...defaultProfile,
    sysVersion: 'P4.PORTFOLIO',
    profileImageUrl: '',
  },
  projects: defaultProjects.map(p => ({ ...p })),
  skillCategories: defaultSkillCategories.map(c => ({
    ...c,
    skills: c.skills.map(s => ({ ...s, tools: [...s.tools] })),
  })),
  timeline: defaultTimeline.map(t => ({ ...t })),
  socialLinks: defaultSocialLinks.map(l => ({ ...l })),
  contact: {
    heading: "LET'S CREATE\nSOMETHING.",
    subtext: '',
    footerText: '© 2026 JOHN BENEDICT VILLAMOR',
  },
};

const STORAGE_KEY = 'portfolio-content-v1';

// ── Helpers ────────────────────────────────────────────────────────

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function loadFromStorage(): PortfolioContent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Validate shape minimally
    if (parsed && parsed.profile && parsed.projects && Array.isArray(parsed.projects)) {
      return parsed as PortfolioContent;
    }
    return null;
  } catch {
    return null;
  }
}

function saveToStorage(content: PortfolioContent): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    return true;
  } catch {
    return false;
  }
}

// ── Context ────────────────────────────────────────────────────────

const ContentContext = createContext<ContentContextValue | null>(null);

export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}

// ── Provider ───────────────────────────────────────────────────────

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved content or use defaults
  const [savedContent, setSavedContent] = useState<PortfolioContent>(() => {
    const stored = loadFromStorage();
    return stored ?? deepClone(DEFAULT_CONTENT);
  });

  // Working copy (what the user sees during editing)
  const [workingContent, setWorkingContent] = useState<PortfolioContent>(() => deepClone(savedContent));
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Track whether working content has diverged from saved
  const savedRef = useRef(savedContent);
  savedRef.current = savedContent;

  const setEditMode = useCallback((on: boolean) => {
    if (on) {
      setWorkingContent(deepClone(savedRef.current));
      setHasUnsavedChanges(false);
    }
    setIsEditMode(on);
  }, []);

  const updateContent = useCallback((updater: (prev: PortfolioContent) => PortfolioContent) => {
    setWorkingContent(prev => {
      const next = updater(prev);
      setHasUnsavedChanges(true);
      return next;
    });
  }, []);

  const saveChanges = useCallback(() => {
    const snapshot = deepClone(workingContent);
    setSavedContent(snapshot);
    saveToStorage(snapshot);
    setHasUnsavedChanges(false);
  }, [workingContent]);

  const cancelChanges = useCallback(() => {
    setWorkingContent(deepClone(savedRef.current));
    setHasUnsavedChanges(false);
    setIsEditMode(false);
  }, []);

  const resetToDefaults = useCallback(() => {
    const defaults = deepClone(DEFAULT_CONTENT);
    setSavedContent(defaults);
    setWorkingContent(deepClone(defaults));
    saveToStorage(defaults);
    setHasUnsavedChanges(false);
  }, []);

  const exportContent = useCallback(() => {
    const blob = new Blob([JSON.stringify(workingContent, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-content-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [workingContent]);

  const importContent = useCallback((json: string): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(json);
      if (!parsed || !parsed.profile || !Array.isArray(parsed.projects)) {
        return { success: false, error: 'Invalid content structure' };
      }
      const imported = parsed as PortfolioContent;
      setWorkingContent(imported);
      setHasUnsavedChanges(true);
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Invalid JSON format' };
    }
  }, []);

  // The content visible to the website: working copy during edit mode, saved otherwise
  const content = isEditMode ? workingContent : savedContent;

  const value: ContentContextValue = {
    content,
    isEditMode,
    hasUnsavedChanges,
    setEditMode,
    updateContent,
    saveChanges,
    cancelChanges,
    resetToDefaults,
    exportContent,
    importContent,
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};
