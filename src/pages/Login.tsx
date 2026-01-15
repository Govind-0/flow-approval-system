import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { login, mockUsers } from '@/store/slices/authSlice';
import { toast } from '@/hooks/use-toast';
import { ClipboardList, Mail, Lock, ArrowRight, User, Users, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    name: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Demo login - find user by email or employee ID
    const user = mockUsers.find(
      (u) => u.email === formData.identifier || u.employeeId === formData.identifier
    );

    if (user) {
      dispatch(login(user));
      toast({
        title: 'Welcome back!',
        description: `Logged in as ${user.name}`,
      });
      navigate('/dashboard');
    } else {
      toast({
        title: 'Login failed',
        description: 'Invalid credentials. Try: EMP001, POC001, or MGR001',
        variant: 'destructive',
      });
    }
  };

  const quickLogin = (employeeId: string) => {
    const user = mockUsers.find((u) => u.employeeId === employeeId);
    if (user) {
      dispatch(login(user));
      toast({
        title: 'Welcome back!',
        description: `Logged in as ${user.name}`,
      });
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl btn-gradient flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-sidebar-foreground">RequestFlow</h1>
              <p className="text-sm text-sidebar-muted">Management System</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-sidebar-foreground leading-tight">
                Streamline your<br />
                <span className="gradient-text">request workflow</span>
              </h2>
              <p className="mt-4 text-sidebar-muted text-lg max-w-md">
                Efficient request management from employees through POC to managers. Track approvals, manage workflows, and stay organized.
              </p>
            </div>

            <div className="flex items-center gap-4 text-sidebar-muted">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary/30 border-2 border-sidebar flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="w-8 h-8 rounded-full bg-warning/30 border-2 border-sidebar flex items-center justify-center">
                  <Users className="w-4 h-4 text-warning" />
                </div>
                <div className="w-8 h-8 rounded-full bg-success/30 border-2 border-sidebar flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-success" />
                </div>
              </div>
              <span className="text-sm">Employee → POC → Manager</span>
            </div>
          </div>

          <p className="text-sm text-sidebar-muted">
            © 2024 RequestFlow. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-slide-up">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">RequestFlow</h1>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
                <p className="text-muted-foreground mt-1">
                  Enter your credentials to access your account
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Employee ID or Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="EMP001 or john@company.com"
                      className="pl-10 h-12 input-focus"
                      value={formData.identifier}
                      onChange={(e) =>
                        setFormData({ ...formData, identifier: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10 h-12 input-focus"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 btn-gradient text-base">
                  Sign In
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>

              <div className="mt-8">
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Quick demo login
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => quickLogin('EMP001')}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-primary hover:bg-accent transition-all duration-200"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-foreground">Employee</span>
                  </button>
                  <button
                    onClick={() => quickLogin('POC001')}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-warning hover:bg-warning/5 transition-all duration-200"
                  >
                    <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-warning" />
                    </div>
                    <span className="text-xs font-medium text-foreground">POC</span>
                  </button>
                  <button
                    onClick={() => quickLogin('MGR001')}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-success hover:bg-success/5 transition-all duration-200"
                  >
                    <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-success" />
                    </div>
                    <span className="text-xs font-medium text-foreground">Manager</span>
                  </button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="signup">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground">Create account</h2>
                <p className="text-muted-foreground mt-1">
                  Sign up to start managing your requests
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="John Doe"
                      className="pl-10 h-12 input-focus"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Employee ID or Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="EMP001 or john@company.com"
                      className="pl-10 h-12 input-focus"
                      value={formData.identifier}
                      onChange={(e) =>
                        setFormData({ ...formData, identifier: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Create a strong password"
                      className="pl-10 h-12 input-focus"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 btn-gradient text-base">
                  Create Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Login;
