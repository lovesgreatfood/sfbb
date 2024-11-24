import React from 'react';
import { format } from 'date-fns';
import type { Temperature } from '../../types';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface Props {
  temperatures: Temperature[];
}

export function TemperatureTable({ temperatures }: Props) {
  const isTemperatureInRange = (temp: Temperature) => {
    switch (temp.type) {
      case 'fridge':
        return temp.temperature <= 8;
      case 'freezer':
        return temp.temperature <= -18;
      case 'cooking':
        return temp.temperature >= 75;
      case 'hot-holding':
        return temp.temperature >= 63;
      default:
        return true;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Temperature Records</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                  Time
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Item
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Type
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Temperature
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Location
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {temperatures.map((temp) => (
                <tr key={temp.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
                    {format(new Date(temp.date), 'HH:mm')}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {temp.itemName}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {temp.type}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {temp.temperature}°C
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {temp.location}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    {isTemperatureInRange(temp) ? (
                      <span className="inline-flex items-center text-green-700">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        OK
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-red-700">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        Action Required
                      </span>
                    )}
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