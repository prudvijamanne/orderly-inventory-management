import React from 'react';
import { DashboardMetrics } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ShoppingCart,
  DollarSign,
  Package,
  AlertTriangle,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardCardsProps {
  metrics: DashboardMetrics;
  isLoading?: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: { value: number; isPositive: boolean };
  variant?: 'default' | 'warning' | 'success';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  variant = 'default',
}) => {
  return (
    <Card className="stat-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={cn(
            'p-2 rounded-lg',
            variant === 'warning' && 'bg-warning/10 text-warning',
            variant === 'success' && 'bg-success/10 text-success',
            variant === 'default' && 'bg-primary/10 text-primary'
          )}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div
            className={cn(
              'flex items-center text-xs mt-2',
              trend.isPositive ? 'text-success' : 'text-destructive'
            )}
          >
            <TrendingUp
              className={cn('h-3 w-3 mr-1', !trend.isPositive && 'rotate-180')}
            />
            <span>{trend.value}% from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const DashboardCards: React.FC<DashboardCardsProps> = ({ metrics, isLoading }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="stat-card animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-10 w-10 bg-muted rounded-lg" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-20 bg-muted rounded mb-2" />
              <div className="h-3 w-32 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Total Revenue"
        value={formatCurrency(metrics.totalRevenue)}
        icon={<DollarSign className="h-4 w-4" />}
        trend={{ value: 12.5, isPositive: true }}
        variant="success"
      />
      <StatCard
        title="Total Orders"
        value={metrics.totalOrders}
        icon={<ShoppingCart className="h-4 w-4" />}
        trend={{ value: 8.2, isPositive: true }}
      />
      <StatCard
        title="Orders Today"
        value={metrics.ordersToday}
        icon={<TrendingUp className="h-4 w-4" />}
        description="New orders received today"
      />
      <StatCard
        title="Pending Orders"
        value={metrics.pendingOrders}
        icon={<Clock className="h-4 w-4" />}
        description="Awaiting processing"
        variant="warning"
      />
      <StatCard
        title="Total Products"
        value={metrics.totalProducts}
        icon={<Package className="h-4 w-4" />}
        description="Active products in catalog"
      />
      <StatCard
        title="Low Stock Items"
        value={metrics.lowStockItems}
        icon={<AlertTriangle className="h-4 w-4" />}
        description="Items below minimum stock"
        variant="warning"
      />
    </div>
  );
};

export default DashboardCards;
