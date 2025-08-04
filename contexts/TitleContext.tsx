"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TitleContextType {
  title: string;
  setTitle: (title: string) => void;
  height: string;
  setHeight: (height: string) => void;
  showBackButton: boolean;
  setShowBackButton: (show: boolean) => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

const TitleContext = createContext<TitleContextType | undefined>(undefined);

export const TitleProvider = ({ children }: { children: ReactNode }) => {
  const [title, setTitle] = useState<string>('');
  const [height, setHeight] = useState<string>('calc(100dvh - 80px - 300px)');
  const [showBackButton, setShowBackButton] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <TitleContext.Provider value={{ title, setTitle, height, setHeight, showBackButton, setShowBackButton, isExpanded, setIsExpanded }}>
      {children}
    </TitleContext.Provider>
  );
};

export const useTitle = () => {
  const context = useContext(TitleContext);
  if (!context) {
    throw new Error('useTitle must be used within a TitleProvider');
  }
  return context;
};
