import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { TemperatureForm } from '../components/temperature/TemperatureForm';
import { TemperatureTable } from '../components/temperature/TemperatureTable';
import { TemperatureChart } from '../components/temperature/TemperatureChart';
import { ThermometerSun } from 'lucide-react';

export function TemperatureLog() {
  const { user } = useAuth();
  const today = format(new Date(), 'yyyy-MM-dd');

  const { data: temperatures, refetch } = useQuery({
    queryKey: ['temperatures', user?.id, today],
    queryFn: async () => {
      const { data } = await supabase
        .from('temperatures')
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
          <h1 className="text-2xl font-semibold text-gray-900">Temperature Log</h1>
          <p className="mt-1 text-sm text-gray-500">
            Record and monitor temperature checks for food safety compliance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <ThermometerSun className="w-4 h-4 mr-1" />
            Today's Checks: {temperatures?.length || 0}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TemperatureTable temperatures={temperatures || []} />
        </div>
        <div>
          <TemperatureForm onSuccess={refetch} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Temperature Trends</h2>
        <TemperatureChart data={temperatures || []} />
      </div>
    </div>
  );
}