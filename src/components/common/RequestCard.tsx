import { Request } from '@/store/slices/requestsSlice';
import StatusBadge from './StatusBadge';
import RequestTypeBadge from './RequestTypeBadge';
import { AlertTriangle, Calendar, User, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

interface RequestCardProps {
  request: Request;
  showActions?: boolean;
  onApprove?: (id: string, remark: string) => void;
  onReject?: (id: string, remark: string) => void;
  compact?: boolean;
}

const RequestCard = ({ request, compact = false }: RequestCardProps) => {
  return (
    <div
      className={`bg-card rounded-xl border border-border p-5 card-hover animate-slide-up ${
        request.isImportant ? 'ring-2 ring-warning/50' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <RequestTypeBadge type={request.type} />
            <StatusBadge status={request.status} />
            {request.isImportant && (
              <span className="status-badge bg-warning/10 text-warning">
                <AlertTriangle className="w-3.5 h-3.5" />
                Important
              </span>
            )}
          </div>
          <h3 className="font-semibold text-foreground mb-1 truncate">{request.title}</h3>
          {!compact && (
            <p className="text-sm text-muted-foreground line-clamp-2">{request.description}</p>
          )}
        </div>
      </div>

      {!compact && (
        <>
          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {request.employeeName}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {format(new Date(request.createdAt), 'MMM dd, yyyy')}
            </span>
          </div>

          {(request.startDate || request.endDate) && (
            <div className="mt-3 text-sm bg-muted/50 rounded-lg px-3 py-2">
              <span className="text-muted-foreground">Duration: </span>
              <span className="font-medium text-foreground">
                {request.startDate && format(new Date(request.startDate), 'MMM dd')}
                {request.endDate && ` - ${format(new Date(request.endDate), 'MMM dd, yyyy')}`}
              </span>
            </div>
          )}

          {request.pocRemark && (
            <div className="mt-3 bg-accent/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-xs font-medium text-accent-foreground mb-1">
                <MessageSquare className="w-3.5 h-3.5" />
                POC Remark
              </div>
              <p className="text-sm text-foreground">{request.pocRemark}</p>
            </div>
          )}

          {request.managerRemark && (
            <div className="mt-3 bg-success/10 rounded-lg p-3">
              <div className="flex items-center gap-2 text-xs font-medium text-success mb-1">
                <MessageSquare className="w-3.5 h-3.5" />
                Manager Remark
              </div>
              <p className="text-sm text-foreground">{request.managerRemark}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RequestCard;
