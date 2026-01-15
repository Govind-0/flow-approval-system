import { RequestType } from '@/store/slices/requestsSlice';
import { Home, Calendar, Clock, Package } from 'lucide-react';

interface RequestTypeBadgeProps {
  type: RequestType;
}

const typeConfig: Record<RequestType, { label: string; className: string; icon: typeof Home }> = {
  wfh: {
    label: 'Work From Home',
    className: 'bg-primary/10 text-primary',
    icon: Home,
  },
  leave: {
    label: 'Leave Request',
    className: 'bg-success/10 text-success',
    icon: Calendar,
  },
  shift: {
    label: 'Shift Change',
    className: 'bg-warning/10 text-warning',
    icon: Clock,
  },
  resource: {
    label: 'Resource Allocation',
    className: 'bg-accent text-accent-foreground',
    icon: Package,
  },
};

const RequestTypeBadge = ({ type }: RequestTypeBadgeProps) => {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <span className={`status-badge ${config.className}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};

export default RequestTypeBadge;
