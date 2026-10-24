import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadFromStorage, saveToStorage } from '../utils/storage';

interface ThemeMotionContextType {
  prefersReducedMotion: boolean;
  setPrefersReducedMotion: (val: boolean) => void;
  enable3DGraphics: boolean;
  setEnable3DGraphics: (val: boolean) => void;
  toggleReducedMotion: () => void;
}

const ThemeMotionContext = createContext<ThemeMotionContextType | undefined>(undefined);

export const ThemeMotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    const saved = loadFromStorage<boolean | null>('reduced_motion', null);
    if (saved !== null) return saved;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const [enable3DGraphics, setEnable3DGraphics] = useState<boolean>(() => {
    return loadFromStorage<boolean>('enable_3d_graphics', true);
  });

  useEffect(() => {
    saveToStorage('reduced_motion', prefersReducedMotion);
  }, [prefersReducedMotion]);

  useEffect(() => {
    saveToStorage('enable_3d_graphics', enable3DGraphics);
  }, [enable3DGraphics]);

  const toggleReducedMotion = () => {
    setPrefersReducedMotion((prev) => !prev);
  };

  return (
    <ThemeMotionContext.Provider
      value={{
        prefersReducedMotion,
        setPrefersReducedMotion,
        enable3DGraphics,
        setEnable3DGraphics,
        toggleReducedMotion
      }}
    >
      {children}
    </ThemeMotionContext.Provider>
  );
};

export const useThemeMotion = () => {
  const context = useContext(ThemeMotionContext);
  if (!context) {
    throw new Error('useThemeMotion must be used within a ThemeMotionProvider');
  }
  return context;
};
