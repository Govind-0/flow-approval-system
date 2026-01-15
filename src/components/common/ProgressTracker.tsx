import { RequestStatus } from '@/store/slices/requestsSlice';
import { User, Users, Briefcase, Check, X } from 'lucide-react';

interface ProgressTrackerProps {
  status: RequestStatus;
}

const ProgressTracker = ({ status }: ProgressTrackerProps) => {
  const getStepStatus = (step: 'employee' | 'poc' | 'manager') => {
    switch (status) {
      case 'pending_poc':
        if (step === 'employee') return 'complete';
        if (step === 'poc') return 'active';
        return 'pending';
      case 'pending_manager':
        if (step === 'employee' || step === 'poc') return 'complete';
        if (step === 'manager') return 'active';
        return 'pending';
      case 'approved':
        return 'complete';
      case 'rejected_poc':
        if (step === 'employee') return 'complete';
        if (step === 'poc') return 'rejected';
        return 'pending';
      case 'rejected_manager':
        if (step === 'employee' || step === 'poc') return 'complete';
        if (step === 'manager') return 'rejected';
        return 'pending';
      default:
        return 'pending';
    }
  };

  const steps = [
    { key: 'employee' as const, label: 'Employee', icon: User },
    { key: 'poc' as const, label: 'POC Review', icon: Users },
    { key: 'manager' as const, label: 'Manager Approval', icon: Briefcase },
  ];

  const getStepClass = (stepStatus: string) => {
    switch (stepStatus) {
      case 'complete':
        return 'progress-step-complete';
      case 'active':
        return 'progress-step-active animate-pulse-glow';
      case 'rejected':
        return 'progress-step-rejected';
      default:
        return 'progress-step-pending';
    }
  };

  const getLineClass = (fromStep: 'employee' | 'poc', status: RequestStatus) => {
    const fromStatus = getStepStatus(fromStep);
    const toStep = fromStep === 'employee' ? 'poc' : 'manager';
    const toStatus = getStepStatus(toStep);

    if (fromStatus === 'complete' && (toStatus === 'complete' || toStatus === 'active')) {
      return 'bg-success';
    }
    if (fromStatus === 'complete' && toStatus === 'rejected') {
      return 'bg-destructive';
    }
    return 'bg-border';
  };

  return (
    <div className="flex items-center justify-between py-4">
      {steps.map((step, index) => {
        const stepStatus = getStepStatus(step.key);
        const StepIcon = step.icon;

        return (
          <div key={step.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`progress-step ${getStepClass(stepStatus)}`}>
                {stepStatus === 'complete' ? (
                  <Check className="w-5 h-5" />
                ) : stepStatus === 'rejected' ? (
                  <X className="w-5 h-5" />
                ) : (
                  <StepIcon className="w-5 h-5" />
                )}
              </div>
              <span className="text-xs font-medium text-muted-foreground mt-2 text-center">
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-3 rounded-full transition-colors duration-300 ${getLineClass(
                  step.key as 'employee' | 'poc',
                  status
                )}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressTracker;
