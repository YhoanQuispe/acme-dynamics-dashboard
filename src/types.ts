import { ComponentType } from 'react';

export interface NavigationItem {
  id?: string;
  name?: string;
  iconName?: string;
  label?: string;
  [key: string]: any;
}

export interface User {
  name?: string;
  email?: string;
  avatarUrl?: string;
  role?: string;
  status?: any;
  [key: string]: any;
}

export interface NotificationItem {
  id?: string;
  title?: string;
  description?: string;
  timestamp?: string;
  unread?: boolean;
  type?: any;
  [key: string]: any;
}

export interface Project {
  id?: string;
  name?: string;
  status?: any;
  progress?: number;
  manager?: string;
  budget?: string;
  dueDate?: string;
  blueprintClassType?: string;
  targetDeploymentTier?: string;
  isBlueprint?: boolean;
  [key: string]: any;
}

export interface Customer {
  id?: string;
  name?: string;
  company?: string;
  email?: string;
  spent?: string;
  status?: any;
  tier?: string;
  [key: string]: any;
}

export interface InventoryItem {
  id?: string;
  name?: string;
  sku?: string;
  stock?: number;
  price?: string;
  status?: any;
  supplier?: string;
  [key: string]: any;
}

export interface Blueprint {
  id?: string;
  name?: string;
  blueprintClassType?: string;
  targetDeploymentTier?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface AuditLog {
  id?: string;
  timestamp?: string;
  eventId?: string;
  severity?: any;
  description?: string;
  [key: string]: any;
}

export interface OperatorProfile {
  name?: string;
  email?: string;
  [key: string]: any;
}

export interface AlertSettings {
  systemAlerts?: boolean;
  securityAlerts?: boolean;
  onUpdateAlertSettings?: (settings: AlertSettings) => void;
  billingAlerts?: boolean;
  [key: string]: any;
}

export interface Order {
  id?: string;
  customer?: string;
  orderDate?: string;
  totalAmount?: string;
  fulfillmentStatus?: any;
  [key: string]: any;
}

export type SubscriptionTier = any;

export interface Ticket {
  id?: string;
  [key: string]: any;
}

export interface UserCRMProfile {
  id?: string;
  [key: string]: any;
}

export interface TelemetryLog {
  id?: string;
  [key: string]: any;
}

export interface Message {
  id?: string;
  [key: string]: any;
}

export interface SupportSession {
  id?: string;
  [key: string]: any;
}

export interface KnowledgeBaseArticle {
  id?: string;
  [key: string]: any;
}