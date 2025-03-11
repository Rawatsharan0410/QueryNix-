
import { generateGeminiResponse } from './gemini-service';
import { toast } from 'sonner';

export interface Recommendation {
  title: string;
  type: 'article' | 'product' | 'video' | 'book' | 'other';
  description: string;
  link?: string;
}

export const generateRecommendations = async (
  userInterests: string[],
  userHistory?: string[],
  category?: string
): Promise<Recommendation[]> => {
  try {
    console.log('Generating recommendations for interests:', userInterests);
    if (category) console.log('Category:', category);
    if (userHistory) console.log('User history:', userHistory);
    
    // Construct a prompt for the AI
    let prompt = `Generate 3 personalized recommendations`;
    
    if (category) {
      prompt += ` in the category of ${category}`;
    }
    
    prompt += ` based on the following interests: ${userInterests.join(', ')}`;
    
    if (userHistory && userHistory.length > 0) {
      prompt += `. The user has previously shown interest in: ${userHistory.join(', ')}`;
    }
    
    prompt += `. Format the response as a JSON array with objects containing title, type (article/product/video/book/other), description, and optionally link. Return only the JSON without any explanation.`;
    
    // Get recommendations from Gemini
    const response = await generateGeminiResponse(prompt);
    
    // Parse the JSON response
    // We need to extract JSON from the response which might contain explanatory text
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Could not parse recommendation response');
    }
    
    const recommendationsJson = jsonMatch[0];
    
    try {
      const recommendations = JSON.parse(recommendationsJson) as Recommendation[];
      toast.success('Generated personalized recommendations');
      return recommendations;
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Failed to parse recommendations JSON');
    }
  } catch (error) {
    console.error('Error generating recommendations:', error);
    toast.error('Failed to generate recommendations');
    
    // Fallback to static recommendations if the API fails
    return [
      {
        title: "10 Productivity Hacks for Busy Professionals",
        type: "article",
        description: "Learn time-saving techniques that can transform your workday."
      },
      {
        title: "The Future of AI in Everyday Life",
        type: "video",
        description: "An insightful documentary on how AI is changing our daily routines."
      },
      {
        title: "Premium Noise-Cancelling Headphones",
        type: "product",
        description: "Immerse yourself in crystal-clear audio with these top-rated headphones."
      }
    ];
  }
};
