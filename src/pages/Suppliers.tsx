import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { SupplierForm } from '../components/suppliers/SupplierForm';
import { SupplierList } from '../components/suppliers/SupplierList';
import { DeliveryRecords } from '../components/suppliers/DeliveryRecords';
import { Truck } from 'lucide-react';

export function Suppliers() {
  const { user } = useAuth();

  const { data: suppliers, refetch } = useQuery({
    queryKey: ['suppliers', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('suppliers')
        .select('*')
        .eq('businessId', user?.id)
        .order('name');
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Supplier Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage suppliers and track deliveries
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <Truck className="w-4 h-4 mr-1" />
            Active Suppliers: {suppliers?.length || 0}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SupplierList suppliers={suppliers || []} onUpdate={refetch} />
          <DeliveryRecords />
        </div>
        <div>
          <SupplierForm onSuccess={refetch} />
        </div>
      </div>
    </div>
  );
}