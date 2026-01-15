import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import MainLayout from '@/components/layout/MainLayout';
import { addRequest, RequestType } from '@/store/slices/requestsSlice';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Home, Calendar, Clock, Package, FileText, CalendarDays, AlertTriangle, Send } from 'lucide-react';

const requestTypes: { value: RequestType; label: string; icon: typeof Home; description: string }[] = [
  {
    value: 'wfh',
    label: 'Work From Home',
    icon: Home,
    description: 'Request to work remotely for a period',
  },
  {
    value: 'leave',
    label: 'Leave Request',
    icon: Calendar,
    description: 'Apply for annual, sick, or personal leave',
  },
  {
    value: 'shift',
    label: 'Shift Change',
    icon: Clock,
    description: 'Request to change your work shift timing',
  },
  {
    value: 'resource',
    label: 'Resource Allocation',
    icon: Package,
    description: 'Request equipment, software, or resources',
  },
];

const CreateRequest = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: '' as RequestType | '',
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    isImportant: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.type || !formData.title || !formData.description) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (!user) return;

    const newRequest = {
      id: Date.now().toString(),
      type: formData.type,
      title: formData.title,
      description: formData.description,
      employeeId: user.id,
      employeeName: user.name,
      pocId: user.pocId || '',
      managerId: user.managerId || '',
      status: 'pending_poc' as const,
      isImportant: formData.isImportant,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined,
    };

    dispatch(addRequest(newRequest));
    toast({
      title: 'Request Created',
      description: 'Your request has been submitted for approval',
    });
    navigate('/my-requests');
  };

  const selectedType = requestTypes.find((t) => t.value === formData.type);

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Create New Request</h1>
          <p className="text-muted-foreground mt-1">
            Submit a new request for approval by your POC and Manager
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Request Type Selection */}
          <div className="bg-card rounded-xl border border-border p-6">
            <label className="text-sm font-medium text-foreground mb-4 block">
              Request Type *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {requestTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = formData.type === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.value })}
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-accent/50'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{type.label}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{type.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Request Details */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Request Title *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Brief title for your request"
                  className="pl-10 h-12 input-focus"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Description *
              </label>
              <Textarea
                placeholder="Provide detailed information about your request..."
                className="min-h-[120px] input-focus"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Start Date
                </label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="date"
                    className="pl-10 h-12 input-focus"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  End Date
                </label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="date"
                    className="pl-10 h-12 input-focus"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-warning/5 rounded-lg p-4">
              <Checkbox
                id="important"
                checked={formData.isImportant}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isImportant: checked as boolean })
                }
              />
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <label htmlFor="important" className="text-sm font-medium text-foreground cursor-pointer">
                  Mark as Important
                </label>
              </div>
              <span className="text-xs text-muted-foreground">
                Important requests are highlighted for faster review
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" className="btn-gradient px-8">
              <Send className="w-4 h-4 mr-2" />
              Submit Request
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreateRequest;
