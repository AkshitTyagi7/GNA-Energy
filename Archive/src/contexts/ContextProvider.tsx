import React, { createContext, useContext, useState, ReactNode } from 'react';

interface StateContextProps {
  currentColor: string;
  currentMode: string;
  activeMenu: boolean;
  screenSize?: number | undefined;
  setScreenSize: (size: number | undefined) => void;
  handleClick: (clicked: keyof typeof initialState) => void;
  isClicked: Record<string, boolean>;
  initialState: Record<string, boolean>;
  setIsClicked: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  setActiveMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentColor: React.Dispatch<React.SetStateAction<string>>;
  setCurrentMode: React.Dispatch<React.SetStateAction<string>>;
  setMode: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setColor: (color: string) => void;
  themeSettings: boolean;
  setThemeSettings: React.Dispatch<React.SetStateAction<boolean>>;
}

const StateContext = createContext<StateContextProps>({} as StateContextProps);

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

interface ContextProviderProps {
  children: ReactNode;
}

export const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
  const [screenSize, setScreenSize] = useState<number | undefined>(undefined);
  const [currentColor, setCurrentColor] = useState<string>('#03C9D7');
  const [currentMode, setCurrentMode] = useState<string>('Light');
  const [themeSettings, setThemeSettings] = useState<boolean>(false);
  const [activeMenu, setActiveMenu] = useState<boolean>(true);
  const [isClicked, setIsClicked] = useState<Record<string, boolean>>(initialState);

  const setMode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMode(e.target.value);
    localStorage.setItem('themeMode', e.target.value);
  };

  const setColor = (color: string) => {
    setCurrentColor(color);
    localStorage.setItem('colorMode', color);
  };

  const handleClick = (clicked: keyof typeof initialState) => setIsClicked({ ...initialState, [clicked]: true });

  const contextValues: StateContextProps = {
    currentColor,
    currentMode,
    activeMenu,
    screenSize,
    setScreenSize,
    handleClick,
    isClicked,
    initialState,
    setIsClicked,
    setActiveMenu,
    setCurrentColor,
    setCurrentMode,
    setMode,
    setColor,
    themeSettings,
    setThemeSettings,
  };

  return (
    <StateContext.Provider value={contextValues}>
      {children}
    </StateContext.Provider>
  );
};
