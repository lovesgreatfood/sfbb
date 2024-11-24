import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface CleaningFormData {
  area: string;
  notes?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  priority: 'high' | 'medium' | 'low';
}

interface Props {
  onSuccess: () => void;
}

export function CleaningForm({ onSuccess }: Props) {
  const { user } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CleaningFormData>();

  const onSubmit = async (data: CleaningFormData) => {
    try {
      const { error } = await supabase.from('cleaning').insert([
        {
          ...data,
          businessId: user?.id,
          date: new Date().toISOString(),
          completedBy: user?.email,
          verified: false,
        },
      ]);

      if (error) throw error;

      toast.success('Cleaning task recorded successfully');
      reset();
      onSuccess();
    } catch (error) {
      toast.error('Failed to record cleaning task');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Add Cleaning Task</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="area" className="block text-sm font-medium text-gray-700">
            Area/Equipment
          </label>
          <input
            type="text"
            {...register('area', { required: 'Area is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.area && (
            <p className="mt-1 text-sm text-red-600">{errors.area.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
            Frequency
          </label>
          <select
            {...register('frequency', { required: 'Frequency is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            {...register('priority', { required: 'Priority is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Task
        </button>
      </div>
    </form>
  );
}