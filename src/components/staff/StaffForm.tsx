import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Staff } from '../../types';

interface StaffFormData {
  name: string;
  email: string;
  role: string;
  phone?: string;
  emergencyContact?: string;
  foodHygieneLevel?: number;
}

interface Props {
  onSuccess: () => void;
  staff?: Staff;
}

export function StaffForm({ onSuccess, staff }: Props) {
  const { user } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<StaffFormData>({
    defaultValues: staff,
  });

  const onSubmit = async (data: StaffFormData) => {
    try {
      const staffData = {
        ...data,
        businessId: user?.id,
        startDate: new Date().toISOString(),
        active: true,
      };

      const { error } = staff
        ? await supabase
            .from('staff')
            .update(staffData)
            .eq('id', staff.id)
        : await supabase
            .from('staff')
            .insert([staffData]);

      if (error) throw error;

      toast.success(staff ? 'Staff member updated successfully' : 'Staff member added successfully');
      reset();
      onSuccess();
    } catch (error) {
      toast.error('Failed to save staff member');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        {staff ? 'Edit Staff Member' : 'Add New Staff Member'}
      </h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            {...register('name', { required: 'Name is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <input
            type="text"
            {...register('role', { required: 'Role is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            {...register('phone')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700">
            Emergency Contact
          </label>
          <input
            type="text"
            {...register('emergencyContact')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="foodHygieneLevel" className="block text-sm font-medium text-gray-700">
            Food Hygiene Level
          </label>
          <select
            {...register('foodHygieneLevel', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value={0}>None</option>
            <option value={1}>Level 1</option>
            <option value={2}>Level 2</option>
            <option value={3}>Level 3</option>
            <option value={4}>Level 4</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {staff ? 'Update Staff Member' : 'Add Staff Member'}
        </button>
      </div>
    </form>
  );
}