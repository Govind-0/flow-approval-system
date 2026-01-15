import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import MainLayout from '@/components/layout/MainLayout';
import StatusBadge from '@/components/common/StatusBadge';
import RequestTypeBadge from '@/components/common/RequestTypeBadge';
import { updateRequestStatus, Request } from '@/store/slices/requestsSlice';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Clock,
  User,
  Calendar,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { format } from 'date-fns';

const PendingApprovals = () => {
  const user = useAppSelector((state) => state.auth.user);
  const requests = useAppSelector((state) => state.requests.requests);
  const dispatch = useAppDispatch();

  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [remark, setRemark] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  // Filter pending requests for current user based on role
  const pendingRequests = requests.filter((r) => {
    if (user?.role === 'poc') {
      return r.pocId === user.id && r.status === 'pending_poc';
    } else if (user?.role === 'manager') {
      return r.managerId === user.id && r.status === 'pending_manager';
    }
    return false;
  });

  const handleAction = (request: Request, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setActionType(action);
    setRemark('');
  };

  const confirmAction = () => {
    if (!selectedRequest || !actionType) return;

    const isManager = user?.role === 'manager';
    let newStatus: Request['status'];

    if (actionType === 'approve') {
      newStatus = isManager ? 'approved' : 'pending_manager';
    } else {
      newStatus = isManager ? 'rejected_manager' : 'rejected_poc';
    }

    dispatch(
      updateRequestStatus({
        id: selectedRequest.id,
        status: newStatus,
        remark: remark || undefined,
        isManager,
      })
    );

    toast({
      title: actionType === 'approve' ? 'Request Approved' : 'Request Rejected',
      description: `The request has been ${actionType === 'approve' ? 'approved' : 'rejected'} successfully.`,
    });

    setSelectedRequest(null);
    setActionType(null);
    setRemark('');
  };

  if (user?.role === 'employee') {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-6 flex items-center justify-center">
              <Clock className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Access Restricted</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Only POCs and Managers can view and approve pending requests. Please check "My
              Requests" to view your submitted requests.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Pending Approvals</h1>
          <p className="text-muted-foreground mt-1">
            Review and approve requests awaiting your action
          </p>
        </div>

        {/* Pending Requests List */}
        {pendingRequests.length > 0 ? (
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className={`bg-card rounded-xl border border-border p-6 card-hover animate-slide-up ${
                  request.isImportant ? 'ring-2 ring-warning/50' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      <RequestTypeBadge type={request.type} />
                      <StatusBadge status={request.status} />
                      {request.isImportant && (
                        <span className="status-badge bg-warning/10 text-warning">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Important
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {request.title}
                    </h3>
                    <p className="text-muted-foreground">{request.description}</p>

                    <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
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
                      <div className="mt-4 text-sm bg-muted/50 rounded-lg px-3 py-2 inline-block">
                        <span className="text-muted-foreground">Duration: </span>
                        <span className="font-medium text-foreground">
                          {request.startDate && format(new Date(request.startDate), 'MMM dd')}
                          {request.endDate &&
                            ` - ${format(new Date(request.endDate), 'MMM dd, yyyy')}`}
                        </span>
                      </div>
                    )}

                    {request.pocRemark && user?.role === 'manager' && (
                      <div className="mt-4 bg-accent/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-xs font-medium text-accent-foreground mb-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          POC Remark
                        </div>
                        <p className="text-sm text-foreground">{request.pocRemark}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => handleAction(request, 'approve')}
                      className="bg-success hover:bg-success/90 text-success-foreground"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleAction(request, 'reject')}
                      className="border-destructive text-destructive hover:bg-destructive/10"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border p-16 text-center">
            <div className="w-20 h-20 rounded-full bg-success/10 mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">All caught up!</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              You have no pending requests to review. Check back later for new submissions.
            </p>
          </div>
        )}

        {/* Action Dialog */}
        <Dialog
          open={!!selectedRequest && !!actionType}
          onOpenChange={() => {
            setSelectedRequest(null);
            setActionType(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === 'approve' ? 'Approve Request' : 'Reject Request'}
              </DialogTitle>
              <DialogDescription>
                {actionType === 'approve'
                  ? 'Add an optional remark before approving this request.'
                  : 'Please provide a reason for rejecting this request.'}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <Textarea
                placeholder={
                  actionType === 'approve'
                    ? 'Optional: Add a remark...'
                    : 'Required: Reason for rejection...'
                }
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedRequest(null);
                  setActionType(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmAction}
                disabled={actionType === 'reject' && !remark.trim()}
                className={
                  actionType === 'approve'
                    ? 'bg-success hover:bg-success/90'
                    : 'bg-destructive hover:bg-destructive/90'
                }
              >
                {actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default PendingApprovals;
