import React, { useState, useEffect } from 'react';
import { inventoryApi } from '@/lib/api';
import { InventoryItem } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Pencil, Loader2, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Inventory: React.FC = () => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({
    quantity: '',
    minStock: '',
    location: '',
  });

  const canEdit = user?.role === 'ADMIN' || user?.role === 'MANAGER';


  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const data = await inventoryApi.getAll();
      setInventory(data);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      toast({
        title: 'Error',
        description: 'Failed to load inventory',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      quantity: String(item.quantity ?? 0),
      minStock: String(item.minStock ?? 0),
      location: item.location ?? '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      await inventoryApi.update(editingItem.id, {
        quantity: parseInt(formData.quantity),
        minStock: parseInt(formData.minStock),
        location: formData.location,
      });

      toast({ title: 'Success', description: 'Inventory updated successfully' });
      fetchInventory();
      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update inventory',
        variant: 'destructive',
      });
    }
  };

  const getStockStatus = (quantity: number, minStock: number) => {
    if (quantity === 0)
      return { label: 'Out of Stock', variant: 'destructive' as const };
    if (quantity <= minStock)
      return { label: 'Low Stock', variant: 'secondary' as const };
    return { label: 'In Stock', variant: 'default' as const };
  };

  // ✅ SAFE FILTERING
  const filteredInventory = inventory.filter((item) => {
    const name = item.productName ?? '';
    const sku = item.sku ?? '';
    const location = item.location ?? '';

    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const lowStockCount = inventory.filter(
    (item) => (item.quantity ?? 0) <= (item.minStock ?? 0)
  ).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Inventory</h1>
        <p className="page-subtitle">Monitor and manage stock levels</p>
      </div>

      {/* Low stock alert */}
      {lowStockCount > 0 && (
        <div className="flex items-center gap-3 p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <div>
            <p className="font-medium text-foreground">Low Stock Alert</p>
            <p className="text-sm text-muted-foreground">
              {lowStockCount} item{lowStockCount > 1 ? 's' : ''} below minimum stock level
            </p>
          </div>
        </div>
      )}

      <Card className="dashboard-card">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="data-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Min Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Last Updated</TableHead>
                    {canEdit && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredInventory.map((item) => {
                    const stockStatus = getStockStatus(
                      item.quantity ?? 0,
                      item.minStock ?? 0
                    );
                    const isLowStock =
                      (item.quantity ?? 0) <= (item.minStock ?? 0);

                    return (
                      <TableRow
                        key={item.id}
                        className={cn(isLowStock && 'bg-warning/5')}
                      >
                        <TableCell className="font-medium">
                          {item.productName ?? 'Unknown'}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {item.sku ?? 'N/A'}
                        </TableCell>
                        <TableCell>{item.quantity ?? 0}</TableCell>
                        <TableCell>{item.minStock ?? 0}</TableCell>
                        <TableCell>
                          <Badge variant={stockStatus.variant}>
                            {stockStatus.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {item.location ?? 'N/A'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {item.lastUpdated
                            ? format(new Date(item.lastUpdated), 'MMM d, yyyy')
                            : '-'}
                        </TableCell>
                        {canEdit && (
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(item)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {filteredInventory.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No inventory items found
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-popover">
          <DialogHeader>
            <DialogTitle>Update Inventory</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Product</Label>
              <p className="text-sm text-muted-foreground">
                {editingItem?.productName ?? 'Unknown'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
              />
              <Input
                type="number"
                value={formData.minStock}
                onChange={(e) =>
                  setFormData({ ...formData, minStock: e.target.value })
                }
              />
            </div>

            <Input
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />

            <div className="flex justify-end gap-2">
              <Button type="button" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
