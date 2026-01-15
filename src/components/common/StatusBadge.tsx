import { RequestStatus } from '@/store/slices/requestsSlice';
import { CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';

interface StatusBadgeProps {
  status: RequestStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<RequestStatus, { label: string; className: string; icon: typeof CheckCircle }> = {
  pending_poc: {
    label: 'Pending POC',
    className: 'bg-warning-bg text-warning',
    icon: Clock,
  },
  pending_manager: {
    label: 'Pending Manager',
    className: 'bg-accent text-primary',
    icon: ArrowRight,
  },
  approved: {
    label: 'Approved',
    className: 'bg-success-bg text-success',
    icon: CheckCircle,
  },
  rejected_poc: {
    label: 'Rejected by POC',
    className: 'bg-destructive/10 text-destructive',
    icon: XCircle,
  },
  rejected_manager: {
    label: 'Rejected by Manager',
    className: 'bg-destructive/10 text-destructive',
    icon: XCircle,
  },
};

const StatusBadge = ({ status, size = 'md' }: StatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`status-badge ${config.className} ${
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'
      }`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
