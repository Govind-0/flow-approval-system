import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type RequestType = 'wfh' | 'leave' | 'shift' | 'resource';
export type RequestStatus = 'pending_poc' | 'pending_manager' | 'approved' | 'rejected_poc' | 'rejected_manager';

export interface Request {
  id: string;
  type: RequestType;
  title: string;
  description: string;
  employeeId: string;
  employeeName: string;
  pocId: string;
  managerId: string;
  status: RequestStatus;
  isImportant: boolean;
  createdAt: string;
  updatedAt: string;
  pocRemark?: string;
  managerRemark?: string;
  startDate?: string;
  endDate?: string;
}

interface RequestsState {
  requests: Request[];
  loading: boolean;
}

// Mock requests for demo
const initialRequests: Request[] = [
  {
    id: '1',
    type: 'wfh',
    title: 'Work From Home - Personal Reasons',
    description: 'Requesting WFH for next week due to home renovation work.',
    employeeId: '1',
    employeeName: 'John Doe',
    pocId: '2',
    managerId: '3',
    status: 'pending_poc',
    isImportant: true,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z',
    startDate: '2024-01-15',
    endDate: '2024-01-19',
  },
  {
    id: '2',
    type: 'leave',
    title: 'Annual Leave Request',
    description: 'Planning family vacation for 5 days.',
    employeeId: '4',
    employeeName: 'Sarah Wilson',
    pocId: '2',
    managerId: '3',
    status: 'pending_manager',
    isImportant: false,
    createdAt: '2024-01-08T14:30:00Z',
    updatedAt: '2024-01-09T10:00:00Z',
    pocRemark: 'Approved. Work handover completed.',
    startDate: '2024-01-22',
    endDate: '2024-01-26',
  },
  {
    id: '3',
    type: 'shift',
    title: 'Shift Change Request',
    description: 'Requesting shift change from morning to evening for better productivity.',
    employeeId: '1',
    employeeName: 'John Doe',
    pocId: '2',
    managerId: '3',
    status: 'approved',
    isImportant: false,
    createdAt: '2024-01-05T11:00:00Z',
    updatedAt: '2024-01-07T16:00:00Z',
    pocRemark: 'No concerns from team perspective.',
    managerRemark: 'Approved. Effective from next month.',
  },
  {
    id: '4',
    type: 'resource',
    title: 'New Laptop Request',
    description: 'Current laptop is outdated and affecting productivity. Requesting upgrade.',
    employeeId: '4',
    employeeName: 'Sarah Wilson',
    pocId: '2',
    managerId: '3',
    status: 'rejected_poc',
    isImportant: true,
    createdAt: '2024-01-03T08:00:00Z',
    updatedAt: '2024-01-04T09:30:00Z',
    pocRemark: 'Laptop upgrade cycle starts next quarter. Please resubmit then.',
  },
];

const initialState: RequestsState = {
  requests: initialRequests,
  loading: false,
};

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    addRequest: (state, action: PayloadAction<Request>) => {
      state.requests.unshift(action.payload);
    },
    updateRequestStatus: (
      state,
      action: PayloadAction<{ id: string; status: RequestStatus; remark?: string; isManager?: boolean }>
    ) => {
      const request = state.requests.find((r) => r.id === action.payload.id);
      if (request) {
        request.status = action.payload.status;
        request.updatedAt = new Date().toISOString();
        if (action.payload.remark) {
          if (action.payload.isManager) {
            request.managerRemark = action.payload.remark;
          } else {
            request.pocRemark = action.payload.remark;
          }
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { addRequest, updateRequestStatus, setLoading } = requestsSlice.actions;
export default requestsSlice.reducer;
