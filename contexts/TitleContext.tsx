"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

// BuildingPinResponse型定義を追加
type BuildingPinResponse = {
  id: number;
  createdAt: string;
  type: 'Building';
  x: number;
  y: number;
  building_id: number | null;
  project_id: number | null;
  building: {
    id: number;
    name: string;
    picture: string;
    status: 'hard' | 'middle' | 'empty';
    _count: {
      projects: number;
      floors: number;
    };
  } | null;
};

interface TitleContextType {
  title: string;
  setTitle: (title: string) => void;
  height: string;
  setHeight: (height: string) => void;
  showBackButton: boolean;
  setShowBackButton: (show: boolean) => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  mapImg: string;
  setMapImg: (img: string) => void;
  mapPins: BuildingPinResponse[];
  setMapPins: (pins: BuildingPinResponse[]) => void;
}

const TitleContext = createContext<TitleContextType | undefined>(undefined);

export const TitleProvider = ({ children }: { children: ReactNode }) => {
  const [title, setTitle] = useState<string>('');
  const [height, setHeight] = useState<string>('calc(100dvh - 80px - 300px)');
  const [showBackButton, setShowBackButton] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [mapImg, setMapImg] = useState<string>('https://xrsvucyppaxvudgfnmdx.supabase.co/storage/v1/object/public/mappic/map1.png');
  const [mapPins, setMapPins] = useState<BuildingPinResponse[]>([]);
  return (
    <TitleContext.Provider value={{ 
      title, setTitle, 
      height, setHeight, 
      showBackButton, setShowBackButton, 
      isExpanded, setIsExpanded,
      mapImg, setMapImg,
      mapPins, setMapPins,
    }}>
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
