
import { API_KEYS, API_ENDPOINTS } from "@/config/api-keys";
import { toast } from "sonner";

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  source: string;
}

export const searchWeb = async (query: string): Promise<SearchResult[]> => {
  try {
    const response = await fetch(API_ENDPOINTS.SERPER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEYS.SERPER
      },
      body: JSON.stringify({
        q: query,
        gl: 'us',
        hl: 'en',
        num: 5
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to search');
    }

    const data = await response.json();
    
    // Transform the organic results into a more usable format
    return data.organic.map((result: any) => ({
      title: result.title,
      link: result.link,
      snippet: result.snippet,
      source: result.source || 'Web Search'
    }));
  } catch (error) {
    console.error('Error searching web:', error);
    toast.error('Failed to search the web');
    return [];
  }
};
