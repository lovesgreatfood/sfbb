import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { DeliveryRecord } from '../../types';
import { Package } from 'lucide-react';

export function DeliveryRecords() {
  const { user } = useAuth();

  const { data: deliveries } = useQuery({
    queryKey: ['recent-deliveries', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('delivery_records')
        .select(`
          *,
          suppliers (
            name
          )
        `)
        .eq('businessId', user?.id)
        .order('date', { ascending: false })
        .limit(5);
      return data as (DeliveryRecord & { suppliers: { name: string } })[];
    },
  });

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Deliveries</h2>
        <div className="flow-root">
          <ul role="list" className="-my-5 divide-y divide-gray-200">
            {deliveries?.map((delivery) => (
              <li key={delivery.id} className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Package className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {delivery.suppliers.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {delivery.items.length} items • Accepted by {delivery.acceptedBy}
                    </p>
                  </div>
                  <div>
                    <div className="text-sm text-gray-900">
                      {format(new Date(delivery.date), 'MMM d, yyyy')}
                    </div>
                    {delivery.temperature && (
                      <div className="text-sm text-gray-500">
                        {delivery.temperature}°C
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}