import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { AlertTriangle, CheckCircle2, ClipboardList, Utensils, Sparkles } from 'lucide-react';

interface Props {
  documentId: string;
}

export function DocumentAnalysis({ documentId }: Props) {
  const { data: analysis, isLoading } = useQuery({
    queryKey: ['document-analysis', documentId],
    queryFn: async () => {
      const { data } = await supabase
        .from('document_analysis')
        .select('*')
        .eq('documentId', documentId)
        .single();
      return data?.analysis;
    },
  });

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Document Analysis</h3>
      
      <div className="space-y-8">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <ClipboardList className="h-5 w-5 text-blue-500 mr-2" />
            Required Records
          </h4>
          <ul className="space-y-2">
            {analysis?.requiredRecords?.map((record: string, index: number) => (
              <li key={index} className="flex items-center text-sm text-gray-600">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>{record}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            Critical Control Points
          </h4>
          <ul className="space-y-4">
            {analysis?.criticalPoints?.map((point: any, index: number) => (
              <li key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="font-medium text-gray-900 mb-2">{point.name}</div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Critical Limit:</span> {point.limit}</p>
                  <p><span className="font-medium">Monitoring:</span> {point.monitoring}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Utensils className="h-5 w-5 text-indigo-500 mr-2" />
            Food Safety Procedures
          </h4>
          <ul className="space-y-2">
            {analysis?.foodSafetyProcedures?.map((procedure: string, index: number) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                <span className="font-medium text-indigo-600 mr-2">{index + 1}.</span>
                <span>{procedure}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            Allergen Management
          </h4>
          <ul className="space-y-2">
            {analysis?.allergenManagement?.map((requirement: string, index: number) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span>{requirement}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Sparkles className="h-5 w-5 text-green-500 mr-2" />
            Cleaning Requirements
          </h4>
          <ul className="space-y-2">
            {analysis?.cleaningRequirements?.map((requirement: string, index: number) => (
              <li key={index} className="text-sm text-gray-600 pl-4 border-l-2 border-green-500">
                {requirement}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}