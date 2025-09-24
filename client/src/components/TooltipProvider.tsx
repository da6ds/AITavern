import { createContext, useContext, useState } from "react";

type TooltipContextType = {
  showTooltips: boolean;
  toggleTooltips: () => void;
};

const TooltipContext = createContext<TooltipContextType | undefined>(undefined);

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  const [showTooltips, setShowTooltips] = useState(() => {
    const stored = localStorage.getItem("show-tooltips");
    return stored ? JSON.parse(stored) : true;
  });

  const toggleTooltips = () => {
    const newValue = !showTooltips;
    setShowTooltips(newValue);
    localStorage.setItem("show-tooltips", JSON.stringify(newValue));
  };

  return (
    <TooltipContext.Provider value={{ showTooltips, toggleTooltips }}>
      {children}
    </TooltipContext.Provider>
  );
}

export const useTooltips = () => {
  const context = useContext(TooltipContext);
  if (context === undefined) {
    throw new Error("useTooltips must be used within a TooltipProvider");
  }
  return context;
};