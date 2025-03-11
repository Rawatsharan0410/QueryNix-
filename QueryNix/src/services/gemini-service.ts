
import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_KEYS, API_ENDPOINTS } from "@/config/api-keys";
import { toast } from "sonner";

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(API_KEYS.GEMINI);

export const generateGeminiResponse = async (prompt: string): Promise<string> => {
  try {
    console.log('Generating Gemini response for prompt:', prompt);
    
    // For text-only input, use the gemini-1.5-flash model (updated from gemini-pro)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Add system instructions to make responses more conversational, helpful, and concise
    const enhancedPrompt = `As QueryNix, an advanced AI assistant, please respond to the following in a helpful, accurate, conversational, and concise manner. Your responses should be thorough but to-the-point:

${prompt}`;
    
    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Gemini response received successfully');
    return text;
  } catch (error) {
    console.error("Error generating Gemini response:", error);
    toast.error("Failed to get response from Gemini");
    
    // Provide a more detailed fallback response
    return "I'm experiencing difficulty connecting to my knowledge base right now. This could be due to connectivity issues or API rate limits. I would typically provide a detailed answer about this topic by leveraging the Google Gemini AI model. Please try again in a moment, or feel free to ask another question.";
  }
};

export const generateCodeWithGemini = async (prompt: string, language?: string): Promise<string> => {
  try {
    console.log('Generating code with Gemini for language:', language || 'unspecified');
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const languageSpecifier = language ? ` in ${language}` : '';
    const codePrompt = `Generate clean, efficient, and well-documented code${languageSpecifier} for the following request. 
    Format your response with code blocks with language specification. If you're including explanations, keep them brief and clear:
    
    ${prompt}`;
    
    const result = await model.generateContent(codePrompt);
    const response = await result.response;
    const code = response.text();
    
    return code;
  } catch (error) {
    console.error("Error generating code with Gemini:", error);
    toast.error("Failed to generate code");
    return "I encountered an error while generating code. This might be due to the complexity of the request or API rate limits. Let me try a simpler approach or provide guidance instead.";
  }
};

export const generateWritingWithGemini = async (prompt: string): Promise<string> => {
  try {
    console.log('Generating writing content with Gemini');
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const writingPrompt = `As QueryNix, a professional writing assistant, help with the following request. 
    Your response should be well-structured, engaging, and tailored precisely to the user's needs:
    
    ${prompt}`;
    
    const result = await model.generateContent(writingPrompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error("Error with writing assistance:", error);
    toast.error("Failed to generate writing content");
    return "I encountered an error while assisting with your writing request. This might be due to the complexity of the request or API rate limits. Let me try a different approach or provide some general guidance instead.";
  }
};

// Helper function to guess language from code
function guessLanguageFromCode(code: string): string {
  if (code.includes('import React') || code.includes('ReactDOM') || code.includes('useState') || 
      code.includes('const [') || code.includes('=> {') || code.includes('export default')) {
    return 'jsx';
  } else if (code.includes('func ') && code.includes('fmt.') && code.includes('package ')) {
    return 'go';
  } else if (code.includes('def ') && code.includes('print(') || code.includes('import ') && 
            !code.includes('{') && !code.includes('from "')) {
    return 'python';
  } else if (code.includes('function ') || code.includes('const ') || code.includes('let ') || 
            code.includes('var ') || code.includes('() =>')) {
    return 'javascript';
  } else if (code.includes('public class ') || code.includes('public static void main')) {
    return 'java';
  } else if (code.includes('#include') && (code.includes('<iostream>') || code.includes('<stdio.h>'))) {
    return code.includes('<iostream>') ? 'cpp' : 'c';
  }
  
  return '';
}
