import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { AlertTriangle, CheckCircle2, ThermometerSun, Trash2 } from 'lucide-react';
import { MetricCard } from '../components/dashboard/MetricCard';
import { RecentTemperatures } from '../components/dashboard/RecentTemperatures';
import { CleaningTasks } from '../components/dashboard/CleaningTasks';
import { UpcomingChecks } from '../components/dashboard/UpcomingChecks';

export function Dashboard() {
  const { user } = useAuth();

  const { data: metrics } = useQuery({
    queryKey: ['dashboard-metrics', user?.id],
    queryFn: async () => {
      const today = new Date();
      const [temperatures, cleaning, tasks] = await Promise.all([
        supabase
          .from('temperatures')
          .select('*')
          .eq('businessId', user?.id)
          .gte('date', format(today, 'yyyy-MM-dd')),
        supabase
          .from('cleaning')
          .select('*')
          .eq('businessId', user?.id)
          .gte('date', format(today, 'yyyy-MM-dd')),
        supabase
          .from('tasks')
          .select('*')
          .eq('businessId', user?.id)
          .eq('completed', false)
      ]);

      return {
        temperaturesChecked: temperatures.data?.length || 0,
        cleaningTasks: cleaning.data?.length || 0,
        pendingTasks: tasks.data?.length || 0,
        alerts: temperatures.data?.filter(t => 
          (t.type === 'fridge' && t.temperature > 8) || 
          (t.type === 'freezer' && t.temperature > -18)
        ).length || 0
      };
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your food safety management system
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Temperature Checks"
          value={metrics?.temperaturesChecked || 0}
          description="Completed today"
          icon={ThermometerSun}
          trend="up"
          trendValue="12%"
        />
        <MetricCard
          title="Cleaning Tasks"
          value={metrics?.cleaningTasks || 0}
          description="Completed today"
          icon={Trash2}
          trend="up"
          trendValue="8%"
        />
        <MetricCard
          title="Pending Tasks"
          value={metrics?.pendingTasks || 0}
          description="Require attention"
          icon={AlertTriangle}
          trend="down"
          trendValue="5%"
          trendDirection="bad"
        />
        <MetricCard
          title="Compliance Score"
          value="98%"
          description="Last 30 days"
          icon={CheckCircle2}
          trend="up"
          trendValue="2%"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <RecentTemperatures />
        <CleaningTasks />
      </div>

      <div className="grid grid-cols-1">
        <UpcomingChecks />
      </div>
    </div>
  );
}