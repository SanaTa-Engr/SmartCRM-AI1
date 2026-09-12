import {
  User,
  Contact,
  Company,
  Lead,
  Deal,
  Task,
  Note,
  Activity,
  DashboardMetrics,
  SalesPipelineReport,
} from './types';

const TOKEN_KEY = 'smartcrm_auth_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data;
}

export const api = {
  getToken,
  setToken,
  request,

  // Auth
  async login(email: string, password: string) {
    const res = await request<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(res.token);
    return res;
  },

  async signup(email: string, password: string, name: string, companyName?: string) {
    const res = await request<{ user: User; token: string }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, companyName }),
    });
    setToken(res.token);
    return res;
  },

  async getMe() {
    return request<{ user: User }>('/api/auth/me');
  },

  async logout() {
    try {
      await request('/api/auth/logout', { method: 'POST' });
    } finally {
      setToken(null);
    }
  },

  async seedData() {
    return request<{ success: boolean; message: string }>('/api/seed', { method: 'POST' });
  },

  async getStatus() {
    return request<any>('/api/status');
  },

  // Dashboard & Reports
  async getDashboardMetrics() {
    return request<DashboardMetrics>('/api/dashboard/metrics');
  },

  async getReportsAnalytics() {
    return request<SalesPipelineReport & { totalLeads: number; totalDeals: number; totalTasks: number }>('/api/reports/analytics');
  },

  // Contacts
  async getContacts() {
    return request<Contact[]>('/api/contacts');
  },
  async getContact(id: string) {
    return request<Contact>(`/api/contacts/${id}`);
  },
  async createContact(data: Partial<Contact>) {
    return request<Contact>('/api/contacts', { method: 'POST', body: JSON.stringify(data) });
  },
  async updateContact(id: string, data: Partial<Contact>) {
    return request<Contact>(`/api/contacts/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  async deleteContact(id: string) {
    return request<{ success: boolean }>(`/api/contacts/${id}`, { method: 'DELETE' });
  },

  // Companies
  async getCompanies() {
    return request<Company[]>('/api/companies');
  },
  async getCompany(id: string) {
    return request<Company>(`/api/companies/${id}`);
  },
  async createCompany(data: Partial<Company>) {
    return request<Company>('/api/companies', { method: 'POST', body: JSON.stringify(data) });
  },
  async updateCompany(id: string, data: Partial<Company>) {
    return request<Company>(`/api/companies/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  async deleteCompany(id: string) {
    return request<{ success: boolean }>(`/api/companies/${id}`, { method: 'DELETE' });
  },

  // Leads
  async getLeads() {
    return request<Lead[]>('/api/leads');
  },
  async getLead(id: string) {
    return request<Lead>(`/api/leads/${id}`);
  },
  async createLead(data: Partial<Lead>) {
    return request<Lead>('/api/leads', { method: 'POST', body: JSON.stringify(data) });
  },
  async updateLead(id: string, data: Partial<Lead>) {
    return request<Lead>(`/api/leads/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  async deleteLead(id: string) {
    return request<{ success: boolean }>(`/api/leads/${id}`, { method: 'DELETE' });
  },

  // Deals
  async getDeals() {
    return request<Deal[]>('/api/deals');
  },
  async getDeal(id: string) {
    return request<Deal>(`/api/deals/${id}`);
  },
  async createDeal(data: Partial<Deal>) {
    return request<Deal>('/api/deals', { method: 'POST', body: JSON.stringify(data) });
  },
  async updateDeal(id: string, data: Partial<Deal>) {
    return request<Deal>(`/api/deals/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  async deleteDeal(id: string) {
    return request<{ success: boolean }>(`/api/deals/${id}`, { method: 'DELETE' });
  },

  // Tasks
  async getTasks() {
    return request<Task[]>('/api/tasks');
  },
  async createTask(data: Partial<Task>) {
    return request<Task>('/api/tasks', { method: 'POST', body: JSON.stringify(data) });
  },
  async updateTask(id: string, data: Partial<Task>) {
    return request<Task>(`/api/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  async deleteTask(id: string) {
    return request<{ success: boolean }>(`/api/tasks/${id}`, { method: 'DELETE' });
  },

  // Notes
  async getNotes(entityType?: string, entityId?: string) {
    let url = '/api/notes';
    const params = new URLSearchParams();
    if (entityType) params.append('entityType', entityType);
    if (entityId) params.append('entityId', entityId);
    if (params.toString()) url += `?${params.toString()}`;
    return request<Note[]>(url);
  },
  async createNote(data: Partial<Note>) {
    return request<Note>('/api/notes', { method: 'POST', body: JSON.stringify(data) });
  },
  async updateNote(id: string, data: Partial<Note>) {
    return request<Note>(`/api/notes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  async deleteNote(id: string) {
    return request<{ success: boolean }>(`/api/notes/${id}`, { method: 'DELETE' });
  },

  // Activities
  async getActivities() {
    return request<Activity[]>('/api/activities');
  },
  async logActivity(data: Partial<Activity>) {
    return request<Activity>('/api/activities', { method: 'POST', body: JSON.stringify(data) });
  },

  // AI
  async scoreLead(lead: Lead) {
    return request<{ score: number; reason: string; nextAction: string; aiSummary: string }>('/api/ai/lead-score', {
      method: 'POST',
      body: JSON.stringify({ lead }),
    });
  },

  async getLeadSummary(lead: Lead) {
    return request<{ summary: string }>('/api/ai/lead-summary', {
      method: 'POST',
      body: JSON.stringify({ lead }),
    });
  },

  async analyzeContact(contactId: string) {
    return request<{
      sentiment: 'positive' | 'neutral' | 'high_priority' | 'at_risk';
      summary: string;
      upsellOpportunities: string[];
      recommendedTalkingPoints: string[];
    }>('/api/ai/contact-analysis', {
      method: 'POST',
      body: JSON.stringify({ contactId }),
    });
  },

  async generateFollowUp(params: {
    recipientName: string;
    companyName: string;
    tone: string;
    context: string;
    stage?: string;
  }) {
    return request<{ subject: string; body: string }>('/api/ai/follow-up-email', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async getDealInsights(dealId: string) {
    return request<{
      winProbability: number;
      healthAssessment: 'healthy' | 'caution' | 'at_risk';
      keyStrengths: string[];
      potentialRisks: string[];
      closingStrategy: string;
    }>('/api/ai/deal-insights', {
      method: 'POST',
      body: JSON.stringify({ dealId }),
    });
  },

  async getActivitySummary() {
    return request<{ summary: string }>('/api/ai/activity-summary', {
      method: 'POST',
    });
  },

  async chatWithAI(messages: { role: 'user' | 'assistant'; content: string }[]) {
    return request<{ content: string; suggestions?: string[] }>('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ messages }),
    });
  },
};
