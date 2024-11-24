import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { StaffList } from '../components/staff/StaffList';
import { StaffForm } from '../components/staff/StaffForm';
import { TrainingForm } from '../components/staff/TrainingForm';
import { TrainingOverview } from '../components/staff/TrainingOverview';
import { GraduationCap, Users } from 'lucide-react';

export function Staff() {
  const { user } = useAuth();
  const [showTrainingForm, setShowTrainingForm] = useState(false);

  const { data: staff, refetch } = useQuery({
    queryKey: ['staff', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('staff')
        .select('*')
        .eq('businessId', user?.id)
        .eq('active', true)
        .order('name');
      return data;
    },
  });

  const { data: trainingStats } = useQuery({
    queryKey: ['training-stats', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('training_records')
        .select('status')
        .eq('businessId', user?.id);
      
      return {
        completed: data?.filter(r => r.status === 'completed').length || 0,
        expired: data?.filter(r => r.status === 'expired').length || 0,
        upcoming: data?.filter(r => r.status === 'upcoming').length || 0,
      };
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Staff Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage staff and training records
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <Users className="w-4 h-4 mr-1" />
            Active Staff: {staff?.length || 0}
          </span>
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <GraduationCap className="w-4 h-4 mr-1" />
            Training Records: {trainingStats?.completed || 0}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <StaffList staff={staff || []} onUpdate={refetch} />
          <TrainingOverview onAddTraining={() => setShowTrainingForm(true)} />
        </div>
        <div className="space-y-6">
          {showTrainingForm ? (
            <TrainingForm 
              staff={staff || []} 
              onSuccess={() => {
                refetch();
                setShowTrainingForm(false);
              }}
              onCancel={() => setShowTrainingForm(false)}
            />
          ) : (
            <StaffForm onSuccess={refetch} />
          )}
        </div>
      </div>
    </div>
  );
}