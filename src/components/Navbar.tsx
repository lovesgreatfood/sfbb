import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Bell } from 'lucide-react';

export function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Food Safety Management System
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-500"
            >
              <Bell className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">
                {user?.email}
              </span>
              <button
                onClick={signOut}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}