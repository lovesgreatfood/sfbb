import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  trend?: 'up' | 'down';
  trendValue?: string;
  trendDirection?: 'good' | 'bad';
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  trendDirection = 'good',
}: MetricCardProps) {
  return (
    <div className="bg-white overflow-hidden rounded-lg shadow">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-6 w-6 text-gray-400" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                {trend && (
                  <div
                    className={`ml-2 flex items-baseline text-sm font-semibold ${
                      trendDirection === 'good'
                        ? trend === 'up'
                          ? 'text-green-600'
                          : 'text-red-600'
                        : trend === 'up'
                        ? 'text-red-600'
                        : 'text-green-600'
                    }`}
                  >
                    {trend === 'up' ? '↑' : '↓'} {trendValue}
                  </div>
                )}
              </dd>
              <dd className="mt-1 text-sm text-gray-500">{description}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}