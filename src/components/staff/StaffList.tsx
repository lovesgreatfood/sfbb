import React from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import type { Staff } from '../../types';
import { Edit2, Trash2, GraduationCap } from 'lucide-react';

interface Props {
  staff: Staff[];
  onUpdate: () => void;
}

export function StaffList({ staff, onUpdate }: Props) {
  const deactivateStaff = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate this staff member?')) return;

    try {
      const { error } = await supabase
        .from('staff')
        .update({ active: false })
        .eq('id', id);

      if (error) throw error;

      toast.success('Staff member deactivated successfully');
      onUpdate();
    } catch (error) {
      toast.error('Failed to deactivate staff member');
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Staff Members</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Food Hygiene
                </th>
                <th className="px-6 py-3 bg-gray-50"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staff.map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {member.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{member.phone}</div>
                    <div className="text-xs">Emergency: {member.emergencyContact}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {member.foodHygieneLevel ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <GraduationCap className="w-3 h-3 mr-1" />
                        Level {member.foodHygieneLevel}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">Not certified</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {/* Implement edit */}}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deactivateStaff(member.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}