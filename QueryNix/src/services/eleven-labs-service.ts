
import { API_KEYS, API_ENDPOINTS } from "@/config/api-keys";
import { toast } from "sonner";

// Available voices
export const ELEVEN_LABS_VOICES = {
  RACHEL: "21m00Tcm4TlvDq8ikWAM", // Rachel - default voice
  ADAM: "pNInz6obpgDQGcFmaJgB",   // Adam
  ANTONI: "ErXwobaYiN019PkySvjV", // Antoni
  THOMAS: "VR6AewLTigWG4xSOukaG"  // Thomas
};

export const generateSpeech = async (text: string, voiceId = ELEVEN_LABS_VOICES.RACHEL): Promise<string> => {
  try {
    const response = await fetch(`${API_ENDPOINTS.ELEVEN_LABS}/${voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": API_KEYS.ELEVEN_LABS
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    // In a real implementation, we would handle the audio blob
    // For now, we'll just return a success message
    return "Voice generated successfully";
  } catch (error) {
    console.error("Error generating speech:", error);
    return "Error generating speech";
  }
};

export const textToSpeech = async (text: string): Promise<{ audioUrl: string | null; error?: string }> => {
  try {
    const response = await fetch(`${API_ENDPOINTS.ELEVEN_LABS}/${ELEVEN_LABS_VOICES.RACHEL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": API_KEYS.ELEVEN_LABS
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
    
    return { audioUrl };
  } catch (error) {
    console.error("Error in text to speech conversion:", error);
    toast.error("Failed to generate speech");
    return { audioUrl: null, error: "Failed to generate speech" };
  }
};

export const downloadAudio = (audioUrl: string, fileName = 'generated-speech.mp3') => {
  const link = document.createElement('a');
  link.href = audioUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
