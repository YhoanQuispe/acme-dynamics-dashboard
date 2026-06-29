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

// Estructuras dinámicas para el módulo de soporte y CRM
export type SubscriptionTier = any;

export interface Ticket {
  id: string;
  [key: string]: any;
}

export interface UserCRMProfile {
  id: string;
  [key: string]: any;
}

export interface TelemetryLog {
  id: string;
  [key: string]: any;
}

export interface Message {
  id: string;
  [key: string]: any;
}

export interface SupportSession {
  id: string;
  [key: string]: any;
}

export interface KnowledgeBaseArticle {
  id: string;
  [key: string]: any;
}