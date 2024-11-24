import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { DocumentUpload } from '../components/documents/DocumentUpload';
import { DocumentList } from '../components/documents/DocumentList';
import { DocumentAnalysis } from '../components/documents/DocumentAnalysis';
import { FileText } from 'lucide-react';

export function Documents() {
  const { user } = useAuth();
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const { data: documents, refetch } = useQuery({
    queryKey: ['documents', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('documents')
        .select('*')
        .eq('businessId', user?.id)
        .order('uploadedAt', { ascending: false });
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">HACCP Documentation</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and analyze your food safety documentation
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <FileText className="w-4 h-4 mr-1" />
            Documents: {documents?.length || 0}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DocumentList 
            documents={documents || []} 
            onSelect={setSelectedDocument}
            selectedId={selectedDocument}
          />
          {selectedDocument && (
            <DocumentAnalysis documentId={selectedDocument} />
          )}
        </div>
        <div>
          <DocumentUpload onSuccess={refetch} />
        </div>
      </div>
    </div>
  );
}