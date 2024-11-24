import React from 'react';
import { format } from 'date-fns';
import { FileText, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Document {
  id: string;
  title: string;
  type: string;
  description?: string;
  fileUrl: string;
  uploadedAt: string;
  uploadedBy: string;
}

interface Props {
  documents: Document[];
  onSelect: (id: string) => void;
  selectedId: string | null;
}

export function DocumentList({ documents, onSelect, selectedId }: Props) {
  const downloadFile = async (path: string, filename: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(path);
      
      if (error) throw error;

      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Documents</h2>
        <div className="overflow-hidden">
          <ul role="list" className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer ${
                  selectedId === doc.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => onSelect(doc.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <FileText className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {doc.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      Uploaded by {doc.uploadedBy} on{' '}
                      {format(new Date(doc.uploadedAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadFile(doc.fileUrl, doc.title);
                      }}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}