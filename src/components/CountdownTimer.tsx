import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: Date;
  onComplete?: () => void;
  label?: string;
}

const CountdownTimer = ({ targetDate, onComplete, label = 'Sale starts in' }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    const tick = () => {
      const now = new Date().getTime();
      const diff = targetDate.getTime() - now;
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, expired: true });
        onComplete?.();
        return;
      }
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        expired: false,
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  if (timeLeft.expired) return null;

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs uppercase tracking-widest text-primary-foreground/80 font-body">{label}</span>
      <div className="flex gap-2">
        {[
          { val: timeLeft.hours, label: 'HRS' },
          { val: timeLeft.minutes, label: 'MIN' },
          { val: timeLeft.seconds, label: 'SEC' },
        ].map(({ val, label }) => (
          <div key={label} className="flex flex-col items-center">
            <div className="bg-foreground/10 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[48px]">
              <span className="font-display font-bold text-2xl text-primary-foreground">{pad(val)}</span>
            </div>
            <span className="text-[10px] text-primary-foreground/70 mt-1">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
