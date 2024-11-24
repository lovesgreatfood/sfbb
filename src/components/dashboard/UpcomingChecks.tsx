import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, addDays } from 'date-fns';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar } from 'lucide-react';

export function UpcomingChecks() {
  const { user } = useAuth();

  const { data: upcomingTasks } = useQuery({
    queryKey: ['upcoming-tasks', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('tasks')
        .select('*')
        .eq('businessId', user?.id)
        .eq('completed', false)
        .order('dueDate', { ascending: true })
        .limit(5);
      return data;
    }
  });

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900">Upcoming Checks</h3>
        <div className="mt-6 flow-root">
          <ul role="list" className="divide-y divide-gray-200">
            {upcomingTasks?.map((task) => (
              <li key={task.id} className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Calendar className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <p className="text-sm text-gray-500">{task.description}</p>
                  </div>
                  <div className="flex-shrink-0 text-sm font-medium text-red-500">
                    Due {format(new Date(task.dueDate), 'MMM d')}
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