import { supabase } from './supabase';
import { uploadDocument } from './storage';
import { analyzeDocument } from './gemini';
import { extractPdfText } from './pdf';

export async function processDocument(file: File, businessId: string) {
  try {
    // 1. Upload the file to Supabase Storage
    const fileUrl = await uploadDocument(file, businessId);
    
    // 2. Extract text from PDF
    const arrayBuffer = await file.arrayBuffer();
    const pdfContent = await extractPdfText(arrayBuffer);
    
    // 3. Analyze the content using Gemini
    const analysis = await analyzeDocument(pdfContent);
    
    // 4. Store document metadata
    const { data: document, error: docError } = await supabase
      .from('documents')
      .insert({
        business_id: businessId,
        title: file.name,
        type: 'haccp',
        file_url: fileUrl,
        uploaded_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (docError) throw docError;

    // 5. Store the analysis results
    const { error: analysisError } = await supabase
      .from('document_analysis')
      .insert({
        document_id: document.id,
        business_id: businessId,
        content: pdfContent,
        analysis,
      });

    if (analysisError) throw analysisError;

    return {
      document,
      analysis
    };
  } catch (error) {
    console.error('Error processing document:', error);
    throw error;
  }
}