
import { API_KEYS, API_ENDPOINTS } from "@/config/api-keys";
import { toast } from "sonner";

export const generateImage = async (prompt: string): Promise<{ imageUrl: string; base64Data?: string }> => {
  try {
    const response = await fetch(API_ENDPOINTS.STABILITY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_KEYS.STABILITY}`
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: prompt,
            weight: 1.0
          }
        ],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        samples: 1,
        steps: 30
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate image');
    }

    const data = await response.json();
    // Return the base64 data and URL of the first image
    const base64Data = data.artifacts[0].base64;
    const imageUrl = `data:image/png;base64,${base64Data}`;
    
    return { imageUrl, base64Data };
  } catch (error) {
    console.error('Error generating image:', error);
    toast.error('Failed to generate image');
    return { imageUrl: '' };
  }
};

export const downloadImage = (imageUrl: string, fileName = 'generated-image.png') => {
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
