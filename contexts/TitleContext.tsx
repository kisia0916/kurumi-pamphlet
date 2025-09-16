"use client"
import { Buildings, Floor, Projects } from '@prisma/client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

// BuildingPinResponse 型定義（UUIDを想定して string 型に統一）


export interface MapPinData {
  id: string;
  createdAt: string;
  type: 'Building' | 'Room';
  x: number;
  y: number;
  is_selected:boolean;
  building_id?: string
  project_id?: string
  floor_id?: string
  building?: Buildings
  floor?:Floor
  project?:Projects
}

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
  mapZoom: number;
  setMapZoom: (zoom: number) => void;
  mapPins: {id:string,pin:MapPinData[]};
  setMapPins: (pins: {id:string,pin:MapPinData[]}) => void;
  now_page: "map" | "food" | "stamp" | "event";
  set_now_page: (page: "map" | "food" | "stamp" | "event") => void;
  navMode: 'full' | 'compact';
  setNavMode: (mode: 'full' | 'compact') => void;
  is_display_navigation: boolean;
  set_is_display_navigation: (expanded: boolean) => void;
  back_button_path:string;
  set_back_button_path: (path:string) => void;
}

const TitleContext = createContext<TitleContextType | undefined>(undefined);

export const TitleProvider = ({ children }: { children: ReactNode }) => {
  const [title, setTitle] = useState<string>('');
  const [height, setHeight] = useState<string>('calc(100dvh - 80px - 270px)');
  const [showBackButton, setShowBackButton] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [mapImg, setMapImg] = useState<string>('https://xrsvucyppaxvudgfnmdx.supabase.co/storage/v1/object/public/mappic/loading_map.png');
  const [mapZoom, setMapZoom] = useState<number>(1);
  const [mapPins, setMapPins] = useState<{id:string,pin:MapPinData[]}>({id:"",pin:[]});
  const [now_page, set_now_page] = useState<"map" | "food" | "stamp" | "event">("map");
  const [navMode, setNavMode] = useState<'full' | 'compact'>('full');
  const [is_display_navigation, set_is_display_navigation] = useState<boolean>(true);
  const [back_button_path,set_back_button_path] = useState<string>('/map');
  return (
    <TitleContext.Provider value={{ 
      title, setTitle, 
      height, setHeight, 
      showBackButton, setShowBackButton, 
      isExpanded, setIsExpanded,
      mapImg, setMapImg,
      mapZoom, setMapZoom,
      mapPins, setMapPins,
      now_page, set_now_page,
      navMode, setNavMode,
      is_display_navigation, set_is_display_navigation,
      back_button_path, set_back_button_path
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
