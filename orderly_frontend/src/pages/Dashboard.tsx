import React, { useState, useEffect } from 'react';
import { dashboardApi, ordersApi } from '@/lib/api';
import { DashboardMetrics, Order } from '@/types';
import StatCard from '@/components/dashboard/StatCard';
import { useAuth } from '@/contexts/AuthContext';
import DashboardCards from '@/components/dashboard/DashboardCards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';

const getStatusBadgeVariant = (status: Order['status']) => {
  const variants: Record<Order['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pending: 'outline',
    processing: 'secondary',
    shipped: 'default',
    delivered: 'default',
    cancelled: 'destructive',
  };
  return variants[status];
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
  if (!user) return; // ⛔ wait until logged in

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Fetch dashboard metrics
      const metricsData = await dashboardApi.getMetrics();
      setMetrics(metricsData);

      // Fetch recent orders (limit to latest 5)
      const orders = await ordersApi.getAll();
      setRecentOrders(orders.slice(0, 5));
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, [user]);



  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Overview of your business performance and recent activity
        </p>
      </div>

      {/* Metrics Cards - Show for Admin and Manager */}
      {user?.role === 'ADMIN' && metrics && (
  <DashboardCards metrics={metrics} isLoading={isLoading} />
)}
{/* Manager Dashboard */}
{user?.role === 'MANAGER' && metrics && (
  <div className="grid gap-4 md:grid-cols-3">
    <StatCard title="Total Products" value={metrics.totalProducts} />
    <StatCard title="Total Orders" value={metrics.totalOrders} />
    <StatCard title="Low Stock Items" value={metrics.lowStockItems} />
  </div>
)}

      {/* Staff sees simplified view */}
      {user?.role === 'STAFF' && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="stat-card">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-muted-foreground text-sm">
                Welcome! You can view products and create new orders from the sidebar navigation.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Orders Table */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="text-lg">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <Table className="data-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>
                      ${order.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(order.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
