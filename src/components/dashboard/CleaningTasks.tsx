import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { Cleaning } from '../../types';
import { CheckCircle2, XCircle } from 'lucide-react';

export function CleaningTasks() {
  const { user } = useAuth();

  const { data: cleaningTasks } = useQuery({
    queryKey: ['recent-cleaning', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('cleaning')
        .select('*')
        .eq('businessId', user?.id)
        .order('date', { ascending: false })
        .limit(5);
      return data as Cleaning[];
    }
  });

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900">Recent Cleaning Tasks</h3>
        <div className="mt-6 flow-root">
          <ul role="list" className="divide-y divide-gray-200">
            {cleaningTasks?.map((task) => (
              <li key={task.id} className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {task.verified ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    ) : (
                      <XCircle className="h-6 w-6 text-gray-300" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {task.area}
                    </p>
                    <p className="truncate text-sm text-gray-500">
                      Completed by {task.completedBy}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-sm text-gray-500">
                    {format(new Date(task.date), 'MMM d, yyyy')}
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