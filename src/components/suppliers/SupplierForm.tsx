import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Supplier } from '../../types';

interface SupplierFormData {
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  products: string;
  certifications: string;
}

interface Props {
  onSuccess: () => void;
  supplier?: Supplier;
}

export function SupplierForm({ onSuccess, supplier }: Props) {
  const { user } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SupplierFormData>({
    defaultValues: supplier ? {
      ...supplier,
      products: supplier.products.join(', '),
      certifications: supplier.certifications.join(', '),
    } : undefined,
  });

  const onSubmit = async (data: SupplierFormData) => {
    try {
      const supplierData = {
        ...data,
        businessId: user?.id,
        products: data.products.split(',').map(p => p.trim()),
        certifications: data.certifications.split(',').map(c => c.trim()),
      };

      const { error } = supplier
        ? await supabase
            .from('suppliers')
            .update(supplierData)
            .eq('id', supplier.id)
        : await supabase
            .from('suppliers')
            .insert([supplierData]);

      if (error) throw error;

      toast.success(supplier ? 'Supplier updated successfully' : 'Supplier added successfully');
      reset();
      onSuccess();
    } catch (error) {
      toast.error('Failed to save supplier');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        {supplier ? 'Edit Supplier' : 'Add New Supplier'}
      </h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Supplier Name
          </label>
          <input
            type="text"
            {...register('name', { required: 'Supplier name is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">
            Contact Person
          </label>
          <input
            type="text"
            {...register('contactPerson', { required: 'Contact person is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.contactPerson && (
            <p className="mt-1 text-sm text-red-600">{errors.contactPerson.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              {...register('phone', { required: 'Phone is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
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
        </div>

        <div>
          <label htmlFor="products" className="block text-sm font-medium text-gray-700">
            Products (comma-separated)
          </label>
          <input
            type="text"
            {...register('products', { required: 'Products are required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="e.g., Fresh Produce, Dairy, Meat"
          />
          {errors.products && (
            <p className="mt-1 text-sm text-red-600">{errors.products.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="certifications" className="block text-sm font-medium text-gray-700">
            Certifications (comma-separated)
          </label>
          <input
            type="text"
            {...register('certifications')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="e.g., ISO 22000, HACCP, BRC"
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {supplier ? 'Update Supplier' : 'Add Supplier'}
        </button>
      </div>
    </form>
  );
}