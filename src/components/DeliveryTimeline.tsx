import { DeliveryStatus } from '@/store/types';
import { Check } from 'lucide-react';

const stages: { key: DeliveryStatus; label: string }[] = [
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'packed', label: 'Packed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
];

const DeliveryTimeline = ({ status }: { status: DeliveryStatus }) => {
  const currentIdx = stages.findIndex(s => s.key === status);

  return (
    <div className="flex items-center gap-1 w-full">
      {stages.map((stage, i) => {
        const done = i <= currentIdx;
        const active = i === currentIdx;
        return (
          <div key={stage.key} className="flex-1 flex flex-col items-center">
            <div className="flex items-center w-full">
              {i > 0 && <div className={`flex-1 h-0.5 ${done ? 'gradient-sale' : 'bg-muted'}`} />}
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                done ? 'gradient-sale text-primary-foreground' : 'bg-muted text-muted-foreground'
              } ${active ? 'ring-2 ring-primary/30 ring-offset-2 ring-offset-card' : ''}`}>
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              {i < stages.length - 1 && <div className={`flex-1 h-0.5 ${i < currentIdx ? 'gradient-sale' : 'bg-muted'}`} />}
            </div>
            <span className={`text-[10px] mt-1.5 text-center ${done ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
              {stage.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default DeliveryTimeline;
