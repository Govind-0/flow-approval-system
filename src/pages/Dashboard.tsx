import { useAppSelector } from '@/store/hooks';
import MainLayout from '@/components/layout/MainLayout';
import StatCard from '@/components/common/StatCard';
import RequestCard from '@/components/common/RequestCard';
import Chatbot from '@/components/chat/Chatbot';
import { Clock, CheckCircle, XCircle, AlertTriangle, TrendingUp } from 'lucide-react';
const Dashboard = () => {
  const user = useAppSelector((state) => state.auth.user);
  const requests = useAppSelector((state) => state.requests.requests);

  // Filter requests based on user role
  const relevantRequests = requests.filter((r) => {
    if (user?.role === 'employee') {
      return r.employeeId === user.id;
    } else if (user?.role === 'poc') {
      return r.pocId === user.id;
    } else if (user?.role === 'manager') {
      return r.managerId === user.id;
    }
    return false;
  });

  const pendingCount = relevantRequests.filter(
    (r) =>
      (user?.role === 'poc' && r.status === 'pending_poc') ||
      (user?.role === 'manager' && r.status === 'pending_manager') ||
      (user?.role === 'employee' && (r.status === 'pending_poc' || r.status === 'pending_manager'))
  ).length;

  const approvedCount = relevantRequests.filter((r) => r.status === 'approved').length;
  const rejectedCount = relevantRequests.filter(
    (r) => r.status === 'rejected_poc' || r.status === 'rejected_manager'
  ).length;

  const importantRequests = relevantRequests.filter((r) => r.isImportant);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's an overview of your request management
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Pending Requests"
            value={pendingCount}
            icon={Clock}
            variant="warning"
          />
          <StatCard
            title="Approved Requests"
            value={approvedCount}
            icon={CheckCircle}
            variant="success"
          />
          <StatCard
            title="Rejected Requests"
            value={rejectedCount}
            icon={XCircle}
            variant="default"
          />
          <StatCard
            title="Total Requests"
            value={relevantRequests.length}
            icon={TrendingUp}
            variant="primary"
            trend={{ value: 12, isPositive: true }}
          />
        </div>

        {/* Important Requests */}
        {importantRequests.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <h2 className="text-xl font-semibold text-foreground">Important Requests</h2>
              <span className="bg-warning/10 text-warning px-2 py-0.5 rounded-full text-xs font-medium">
                {importantRequests.length}
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {importantRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
          {relevantRequests.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {relevantRequests.slice(0, 4).map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <Clock className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No requests yet</h3>
              <p className="text-muted-foreground">
                {user?.role === 'employee'
                  ? 'Create your first request to get started'
                  : 'No pending requests to review'}
              </p>
            </div>
          )}
        </div>
      </div>
      <Chatbot />
    </MainLayout>
  );
};

export default Dashboard;
