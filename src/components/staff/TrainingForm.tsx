import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Staff } from '../../types';
import { X } from 'lucide-react';

interface TrainingFormData {
  staffId: string;
  trainingType: 'food-safety' | 'haccp' | 'allergens' | 'cleaning' | 'other';
  completionDate: string;
  expiryDate?: string;
  certificateUrl?: string;
  notes?: string;
}

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
  staff: Staff[];
}

export function TrainingForm({ onSuccess, onCancel, staff }: Props) {
  const { user } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TrainingFormData>();

  const onSubmit = async (data: TrainingFormData) => {
    try {
      const { error } = await supabase.from('training_records').insert([
        {
          ...data,
          businessId: user?.id,
          status: 'completed',
        },
      ]);

      if (error) throw error;

      toast.success('Training record added successfully');
      reset();
      onSuccess();
    } catch (error) {
      toast.error('Failed to add training record');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Add Training Record</h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="staffId" className="block text-sm font-medium text-gray-700">
            Staff Member
          </label>
          <select
            {...register('staffId', { required: 'Staff member is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select staff member</option>
            {staff.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
          {errors.staffId && (
            <p className="mt-1 text-sm text-red-600">{errors.staffId.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="trainingType" className="block text-sm font-medium text-gray-700">
            Training Type
          </label>
          <select
            {...register('trainingType', { required: 'Training type is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select training type</option>
            <option value="food-safety">Food Safety</option>
            <option value="haccp">HACCP</option>
            <option value="allergens">Allergens</option>
            <option value="cleaning">Cleaning</option>
            <option value="other">Other</option>
          </select>
          {errors.trainingType && (
            <p className="mt-1 text-sm text-red-600">{errors.trainingType.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="completionDate" className="block text-sm font-medium text-gray-700">
            Completion Date
          </label>
          <input
            type="date"
            {...register('completionDate', { required: 'Completion date is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.completionDate && (
            <p className="mt-1 text-sm text-red-600">{errors.completionDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
            Expiry Date
          </label>
          <input
            type="date"
            {...register('expiryDate')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="certificateUrl" className="block text-sm font-medium text-gray-700">
            Certificate URL
          </label>
          <input
            type="url"
            {...register('certificateUrl')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="https://"
          />
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

        <div className="flex space-x-3">
          <button
            type="submit"
            className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Training Record
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}