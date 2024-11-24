import { supabase } from './supabase';

export async function uploadDocument(file: File, businessId: string): Promise<string> {
  try {
    // Create a unique file path that includes the business ID for RLS
    const fileName = `${businessId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // Upload the file
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        contentType: 'application/pdf',
        upsert: false
      });

    if (error) {
      console.error('Storage error:', error);
      throw error;
    }

    // Get the URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
}