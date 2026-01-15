import { useAppSelector } from '@/store/hooks';
import MainLayout from '@/components/layout/MainLayout';
import StatusBadge from '@/components/common/StatusBadge';
import RequestTypeBadge from '@/components/common/RequestTypeBadge';
import ProgressTracker from '@/components/common/ProgressTracker';
import { Calendar, AlertTriangle, MessageSquare, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const MyRequests = () => {
  const user = useAppSelector((state) => state.auth.user);
  const requests = useAppSelector((state) => state.requests.requests);

  // Filter requests created by current user
  const myRequests = requests.filter((r) => r.employeeId === user?.id);

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Requests</h1>
            <p className="text-muted-foreground mt-1">
              Track the progress of your submitted requests
            </p>
          </div>
          <Link to="/create-request">
            <Button className="btn-gradient">
              <FileText className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </Link>
        </div>

        {/* Requests List */}
        {myRequests.length > 0 ? (
          <div className="space-y-6">
            {myRequests.map((request) => (
              <div
                key={request.id}
                className={`bg-card rounded-xl border border-border overflow-hidden card-hover animate-slide-up ${
                  request.isImportant ? 'ring-2 ring-warning/50' : ''
                }`}
              >
                {/* Request Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
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
                      <h3 className="text-lg font-semibold text-foreground">{request.title}</h3>
                      <p className="text-muted-foreground mt-1 text-sm">{request.description}</p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5 justify-end">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(request.createdAt), 'MMM dd, yyyy')}
                      </span>
                    </div>
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
                </div>

                {/* Progress Tracker */}
                <div className="px-6 py-4 bg-muted/30 border-t border-border">
                  <ProgressTracker status={request.status} />
                </div>

                {/* Remarks Section */}
                {(request.pocRemark || request.managerRemark) && (
                  <div className="px-6 py-4 border-t border-border space-y-3">
                    {request.pocRemark && (
                      <div className="bg-accent/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-xs font-medium text-accent-foreground mb-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          POC Remark
                        </div>
                        <p className="text-sm text-foreground">{request.pocRemark}</p>
                      </div>
                    )}
                    {request.managerRemark && (
                      <div className="bg-success/10 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-xs font-medium text-success mb-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          Manager Remark
                        </div>
                        <p className="text-sm text-foreground">{request.managerRemark}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border p-16 text-center">
            <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-6 flex items-center justify-center">
              <FileText className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">No requests yet</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              You haven't submitted any requests. Create your first request to get started.
            </p>
            <Link to="/create-request">
              <Button className="btn-gradient">
                <FileText className="w-4 h-4 mr-2" />
                Create Your First Request
              </Button>
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MyRequests;
