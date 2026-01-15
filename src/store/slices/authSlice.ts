import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'employee' | 'poc' | 'manager';

export interface User {
  id: string;
  employeeId: string;
  email: string;
  name: string;
  role: UserRole;
  department: string;
  pocId?: string;
  managerId?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// Mock users for demo
export const mockUsers: User[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    email: 'john.doe@company.com',
    name: 'John Doe',
    role: 'employee',
    department: 'Engineering',
    pocId: '2',
    managerId: '3',
  },
  {
    id: '2',
    employeeId: 'POC001',
    email: 'jane.smith@company.com',
    name: 'Jane Smith',
    role: 'poc',
    department: 'Engineering',
    managerId: '3',
  },
  {
    id: '3',
    employeeId: 'MGR001',
    email: 'mike.johnson@company.com',
    name: 'Mike Johnson',
    role: 'manager',
    department: 'Engineering',
  },
  {
    id: '4',
    employeeId: 'EMP002',
    email: 'sarah.wilson@company.com',
    name: 'Sarah Wilson',
    role: 'employee',
    department: 'Design',
    pocId: '2',
    managerId: '3',
  },
];

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { login, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
