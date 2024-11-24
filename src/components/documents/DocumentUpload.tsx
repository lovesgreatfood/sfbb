import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { processDocument } from '../../lib/documents';
import { Upload, File } from 'lucide-react';

interface Props {
  onSuccess: () => void;
}

export function DocumentUpload({ onSuccess }: Props) {
  const { user } = useAuth();
  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user?.id) {
      toast.error('You must be logged in to upload documents');
      return;
    }

    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    try {
      const loadingToast = toast.loading('Processing document...');
      
      await processDocument(file, user.id);
      
      toast.dismiss(loadingToast);
      toast.success('Document uploaded and analyzed successfully');
      onSuccess();
    } catch (error: any) {
      console.error('Error processing document:', error);
      if (error.message?.includes('Document storage is not properly configured')) {
        toast.error('Document storage is not available. Please contact support.');
      } else {
        toast.error('Failed to process document. Please try again.');
      }
    }
  }, [user, onSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Document</h2>
      
      <div {...getRootProps()} className="cursor-pointer">
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors">
          <div className="space-y-1 text-center">
            {isDragActive ? (
              <Upload className="mx-auto h-12 w-12 text-blue-500" />
            ) : (
              <File className="mx-auto h-12 w-12 text-gray-400" />
            )}
            <div className="flex text-sm text-gray-600">
              <input {...getInputProps()} />
              <p className="pl-1">
                {isDragActive
                  ? 'Drop the PDF here'
                  : 'Drag and drop a PDF file here, or click to select'}
              </p>
            </div>
            <p className="text-xs text-gray-500">PDF up to 10MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}