import { ComponentType } from 'react';

export interface NavigationItem {
  id: string;
  name: string;
  iconName: string;
  label?: string;
}

export interface User {
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
  status: 'online' | 'away' | 'offline';
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  unread: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface Project {
  id: string;
  name: string;
  status: 'In Progress' | 'Completed' | 'On Hold' | 'Archived';
  progress: number;
  manager: string;
  budget: string;
  dueDate: string;
  blueprintClassType: string;
  targetDeploymentTier: string;
  isBlueprint?: boolean;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  spent: string;
  status: 'Active' | 'Inactive';
  tier?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  stock: number;
  price: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'In Transit';
  supplier?: string;
}

export interface Blueprint {
  id: string;
  name: string;
  blueprintClassType: string;
  targetDeploymentTier: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  eventId: string;
  severity: 'Critical' | 'Warning' | 'Info';
  description: string;
}

export interface OperatorProfile {
  name: string;
  email: string;
}

export interface AlertSettings {
  systemAlerts: boolean;
  securityAlerts: boolean;
  onUpdateAlertSettings?: (settings: AlertSettings) => void;
  billingAlerts: boolean;
}

export interface Order {
  id: string;
  customer: string;
  orderDate: string;
  totalAmount: string;
  fulfillmentStatus: 'Shipped' | 'Pending' | 'Processing' | 'Cancelled' | 'Delivered';
}

export type SubscriptionTier = 'Free' | 'Pro' | 'Enterprise' | string;

export interface UserCRMProfile {
  id: string;
  name: string;
  email: string;
  company: string;
  tier: SubscriptionTier;
  status: 'active' | 'inactive';
  avatarUrl?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'agent' | 'system';
  content: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  title: string;
  description?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  user?: UserCRMProfile;
  messages?: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface TelemetryLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  component: string;
  message: string;
  meta?: Record<string, any>;
}

export interface SupportSession {
  id: string;
  status: 'active' | 'idle' | 'closed';
  user: UserCRMProfile;
  startedAt: string;
  lastActivityAt: string;
  messages: Message[];
  deviceInfo?: string;
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  views: number;
  helpfulVotes: number;
  tags: string[];
  updatedAt: string;
}
