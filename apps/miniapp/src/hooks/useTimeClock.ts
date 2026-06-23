import { useState, useEffect } from 'react';

export function useTimeClock() {
  const [timeClock, setTimeClock] = useState<string>('12:00');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = String(now.getUTCHours() + 5).padStart(2, '0'); // mock GMT+5 (Uzbekistan time)
      const mins = String(now.getUTCMinutes()).padStart(2, '0');
      setTimeClock(`${hrs}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, []);

  return { timeClock, setTimeClock };
}
