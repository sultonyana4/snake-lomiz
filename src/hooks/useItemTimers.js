import { useEffect } from 'react';
import { ITEM_TIMERS } from '../lib/constants.js';

export const useItemTimers = (clockTimer, bombTimer, setClock, setBomb, setClockTimer, setBombTimer) => {
  // Clock timer effect
  useEffect(() => {
    if (clockTimer > 0) {
      const timer = setTimeout(() => {
        setClockTimer(prev => {
          if (prev <= ITEM_TIMERS.TIMER_INTERVAL) {
            setClock(null);
            return 0;
          }
          return prev - ITEM_TIMERS.TIMER_INTERVAL;
        });
      }, ITEM_TIMERS.TIMER_INTERVAL);
      return () => clearTimeout(timer);
    }
  }, [clockTimer, setClock, setClockTimer]);

  // Bomb timer effect
  useEffect(() => {
    if (bombTimer > 0) {
      const timer = setTimeout(() => {
        setBombTimer(prev => {
          if (prev <= ITEM_TIMERS.TIMER_INTERVAL) {
            setBomb(null);
            return 0;
          }
          return prev - ITEM_TIMERS.TIMER_INTERVAL;
        });
      }, ITEM_TIMERS.TIMER_INTERVAL);
      return () => clearTimeout(timer);
    }
  }, [bombTimer, setBomb, setBombTimer]);
};