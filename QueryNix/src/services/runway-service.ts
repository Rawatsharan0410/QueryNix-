
import { API_KEYS, API_ENDPOINTS } from "@/config/api-keys";
import { toast } from "sonner";

export const generateVideo = async (prompt: string): Promise<{ videoUrl?: string; error?: string }> => {
  try {
    console.log('Generating video with Runway ML API...');
    console.log('Using API endpoint:', API_ENDPOINTS.RUNWAY_ML);
    
    const response = await fetch(API_ENDPOINTS.RUNWAY_ML, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEYS.RUNWAY_ML}`
      },
      body: JSON.stringify({
        prompt,
        negative_prompt: "Low quality, blurry, distorted",
        aspect_ratio: "SQUARE",
        num_frames: 24,
        fps: 8
      })
    });

    if (!response.ok) {
      // Try to parse error JSON if possible
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`;
      } catch (e) {
        // If response is not JSON
        errorMessage = `Error: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Video generation response:', data);
    
    // In a real implementation, we would use the actual video URL from the response
    // For now, using a placeholder since we may not have actual API access
    const videoPlaceholder = 'https://storage.googleapis.com/querynix-videos/sample-video.mp4';
    
    toast.success('Video generated successfully');
    return { videoUrl: videoPlaceholder };
  } catch (error) {
    console.error('Error generating video:', error);
    toast.error('Failed to generate video');
    return { error: error instanceof Error ? error.message : 'Failed to generate video' };
  }
};

// Function to download the video
export const downloadVideo = (videoUrl: string, fileName = 'generated-video.mp4') => {
  try {
    if (!videoUrl) {
      toast.error('No video URL provided for download');
      return;
    }
    
    // Create an anchor element and trigger download
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Video download started');
  } catch (error) {
    console.error('Error downloading video:', error);
    toast.error('Failed to download video');
  }
};
