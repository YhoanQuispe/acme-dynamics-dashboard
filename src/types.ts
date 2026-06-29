import { ComponentType } from 'react';

export interface NavigationItem {
  id: string;
  name: string;
  iconName: string; // Dynamic Lucide icon reference or Lucide ComponentType
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

export type SubscriptionTier = 'Free' | 'Basic' | 'Premium' | 'Enterprise';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  customerId: string;
}

export interface UserCRMProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  company?: string;
  subscriptionTier: SubscriptionTier;
  createdAt: string;
  lastActiveAt: string;
}

export interface TelemetryLog {
  id: string;
  timestamp: string;
  deviceId: string;
  eventType: string;
  metrics: Record<string, any>;
  status: 'Success' | 'Warning' | 'Error';
}

export interface Message {
  id: string;
  sessionId: string;
  senderId: string;
  senderType: 'User' | 'Agent' | 'System';
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface SupportSession {
  id: string;
  ticketId?: string;
  customerId: string;
  agentId?: string;
  status: 'Active' | 'Waiting' | 'Ended';
  startTime: string;
  endTime?: string;
  messages: Message[];
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  authorId: string;
  publishedAt: string;
  updatedAt: string;
  views: number;
}



