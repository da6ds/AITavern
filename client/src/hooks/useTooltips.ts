import { useState, useEffect } from 'react';

export interface TooltipConfig {
  id: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'auto';
  delay?: number;
}

const TOOLTIP_STORAGE_KEY = 'ttrpg-seen-tooltips';

export function useTooltips() {
  const [seenTooltips, setSeenTooltips] = useState<Set<string>>(new Set());
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Load seen tooltips from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(TOOLTIP_STORAGE_KEY);
      if (stored) {
        setSeenTooltips(new Set(JSON.parse(stored)));
      }
    } catch (error) {
      console.warn('Failed to load tooltip state:', error);
    }
  }, []);

  // Save seen tooltips to localStorage when updated
  useEffect(() => {
    try {
      localStorage.setItem(TOOLTIP_STORAGE_KEY, JSON.stringify(Array.from(seenTooltips)));
    } catch (error) {
      console.warn('Failed to save tooltip state:', error);
    }
  }, [seenTooltips]);

  const markTooltipAsSeen = (tooltipId: string) => {
    setSeenTooltips(prev => new Set([...Array.from(prev), tooltipId]));
    if (activeTooltip === tooltipId) {
      setActiveTooltip(null);
    }
  };

  const shouldShowTooltip = (tooltipId: string) => {
    return !seenTooltips.has(tooltipId);
  };

  const showTooltip = (tooltipId: string) => {
    if (shouldShowTooltip(tooltipId)) {
      setActiveTooltip(tooltipId);
    }
  };

  const hideTooltip = () => {
    setActiveTooltip(null);
  };

  const resetAllTooltips = () => {
    setSeenTooltips(new Set());
    localStorage.removeItem(TOOLTIP_STORAGE_KEY);
  };

  return {
    seenTooltips,
    activeTooltip,
    markTooltipAsSeen,
    shouldShowTooltip,
    showTooltip,
    hideTooltip,
    resetAllTooltips
  };
}