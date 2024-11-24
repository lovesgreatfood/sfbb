import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyABT6EohAW4vADG3z2qmo5MkEvhRGLkYeI');

export async function analyzeDocument(content: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
      Analyze this HACCP (Safer Food Better Business) document and extract the following information:
      1. List all required daily/weekly/monthly records that need to be kept
      2. Identify critical control points with their limits and monitoring requirements
      3. Extract key food safety procedures and requirements
      4. List allergen management requirements
      5. Provide cleaning and sanitization requirements
      
      Format the response as JSON with the following structure:
      {
        "requiredRecords": ["record1", "record2"],
        "criticalPoints": [
          {
            "name": "CCP name",
            "limit": "Critical limit",
            "monitoring": "Monitoring procedure"
          }
        ],
        "foodSafetyProcedures": ["procedure1", "procedure2"],
        "allergenManagement": ["requirement1", "requirement2"],
        "cleaningRequirements": ["requirement1", "requirement2"]
      }

      Document content:
      ${content}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      return JSON.parse(text);
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      return {
        requiredRecords: [],
        criticalPoints: [],
        foodSafetyProcedures: [],
        allergenManagement: [],
        cleaningRequirements: []
      };
    }
  } catch (error) {
    console.error('Error analyzing document:', error);
    throw error;
  }
}