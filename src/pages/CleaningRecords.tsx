import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { CleaningForm } from '../components/cleaning/CleaningForm';
import { CleaningSchedule } from '../components/cleaning/CleaningSchedule';
import { CleaningHistory } from '../components/cleaning/CleaningHistory';
import { Sparkles } from 'lucide-react';

export function CleaningRecords() {
  const { user } = useAuth();
  const today = format(new Date(), 'yyyy-MM-dd');

  const { data: cleaningTasks, refetch } = useQuery({
    queryKey: ['cleaning-tasks', user?.id, today],
    queryFn: async () => {
      const { data } = await supabase
        .from('cleaning')
        .select('*')
        .eq('businessId', user?.id)
        .gte('date', today)
        .order('date', { ascending: false });
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Cleaning Records</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track cleaning tasks and schedules
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <Sparkles className="w-4 h-4 mr-1" />
            Tasks Completed Today: {cleaningTasks?.filter(task => task.verified).length || 0}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CleaningSchedule tasks={cleaningTasks || []} onUpdate={refetch} />
        </div>
        <div>
          <CleaningForm onSuccess={refetch} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <CleaningHistory />
      </div>
    </div>
  );
}