import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Temperature } from '../../types';

interface TemperatureFormData {
  itemName: string;
  temperature: number;
  location: string;
  type: 'fridge' | 'freezer' | 'cooking' | 'hot-holding';
}

interface Props {
  onSuccess: () => void;
}

export function TemperatureForm({ onSuccess }: Props) {
  const { user } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TemperatureFormData>();

  const onSubmit = async (data: TemperatureFormData) => {
    try {
      const { error } = await supabase.from('temperatures').insert([
        {
          ...data,
          businessId: user?.id,
          date: new Date().toISOString(),
          checkedBy: user?.email,
        },
      ]);

      if (error) throw error;

      toast.success('Temperature recorded successfully');
      reset();
      onSuccess();
    } catch (error) {
      toast.error('Failed to record temperature');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Record Temperature</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">
            Item Name
          </label>
          <input
            type="text"
            {...register('itemName', { required: 'Item name is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.itemName && (
            <p className="mt-1 text-sm text-red-600">{errors.itemName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Check Type
          </label>
          <select
            {...register('type', { required: 'Type is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="fridge">Fridge (0-8°C)</option>
            <option value="freezer">Freezer (-18°C or below)</option>
            <option value="cooking">Cooking (75°C or above)</option>
            <option value="hot-holding">Hot-holding (63°C or above)</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">
            Temperature (°C)
          </label>
          <input
            type="number"
            step="0.1"
            {...register('temperature', {
              required: 'Temperature is required',
              valueAsNumber: true,
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.temperature && (
            <p className="mt-1 text-sm text-red-600">{errors.temperature.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            {...register('location', { required: 'Location is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Record Temperature
        </button>
      </div>
    </form>
  );
}