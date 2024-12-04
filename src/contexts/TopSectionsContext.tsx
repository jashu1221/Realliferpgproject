import React, { createContext, useContext, useState } from 'react';

interface TopSectionsContextType {
  isTopSectionsVisible: boolean;
  toggleTopSections: () => void;
  setIsTopSectionsVisible: (visible: boolean) => void;
}

const TopSectionsContext = createContext<TopSectionsContextType | undefined>(undefined);

export function TopSectionsProvider({ children }: { children: React.ReactNode }) {
  const [isTopSectionsVisible, setIsTopSectionsVisible] = useState(true);

  const toggleTopSections = () => {
    setIsTopSectionsVisible(prev => !prev);
  };

  return (
    <TopSectionsContext.Provider value={{
      isTopSectionsVisible,
      toggleTopSections,
      setIsTopSectionsVisible
    }}>
      {children}
    </TopSectionsContext.Provider>
  );
}

export function useTopSections() {
  const context = useContext(TopSectionsContext);
  if (context === undefined) {
    throw new Error('useTopSections must be used within a TopSectionsProvider');
  }
  return context;
}