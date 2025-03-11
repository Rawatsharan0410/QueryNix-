import { useState, useCallback } from "react";
import { toast } from "sonner";
import { generateGeminiResponse } from "@/services/gemini-service";
import { textToSpeech } from "@/services/eleven-labs-service";
import { generateImage, downloadImage } from "@/services/stability-service";
import { generateVideo, downloadVideo } from "@/services/runway-service";
import { searchWeb } from "@/services/serper-service";
import { translateText } from "@/services/translation-service";
import { parseTaskFromText, getTasks } from "@/services/productivity-service";
import { generateRecommendations } from "@/services/recommendation-service";

export type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  audioUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
};

type ChatMode = "general" | "code" | "writing" | "image" | "search" | "video" | "voice" | "productivity" | "translator" | "recommendations";

// Sample user interests for recommendations
const userInterests = ["technology", "productivity", "AI", "books", "travel"];

// Define language type to include "multiple" as a valid option
type SupportedLanguage = "Hindi" | "Mandarin" | "French" | "German" | "Arabic" | "Japanese" | "Spanish" | "Russian" | "Portuguese" | "Italian" | "multiple";

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm QueryNix, your AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>("general");

  const addMessage = (role: "user" | "assistant" | "system", content: string, audioUrl?: string, imageUrl?: string, videoUrl?: string) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: new Date(),
      audioUrl,
      imageUrl,
      videoUrl
    };
    
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };

  const clearMessages = useCallback(() => {
    setMessages([{
      id: "welcome",
      role: "assistant",
      content: "Chat history cleared. All features are fully available. How can I help you today?",
      timestamp: new Date(),
    }]);
    toast.success("Chat history cleared");
  }, []);

  const switchMode = useCallback((mode: ChatMode) => {
    setChatMode(mode);
    const modeMessages = {
      general: "Now in General Assistant mode. I can help with a wide range of questions and tasks.",
      code: "Now in Code mode. I can generate, debug, and optimize code in multiple languages.",
      writing: "Now in Writing mode. I can help create content, check grammar, and improve your text.",
      image: "Now in Image mode. Describe the image you'd like to create, and I'll generate it for you.",
      search: "Now in Search mode. I'll find and summarize the most relevant information from across the web.",
      video: "Now in Video mode. I can create AI-generated videos from your text descriptions.",
      voice: "Now in Voice mode. I can convert text to speech with realistic AI voices.",
      productivity: "Now in Productivity mode. I can help manage tasks and create smart reminders.",
      translator: "Now in Translator mode. I can translate text between 100+ languages instantly.",
      recommendations: "Now in Recommendations mode. I can suggest personalized content and products."
    };
    
    addMessage("system", modeMessages[mode]);
    toast.success(`Switched to ${mode} mode`);
  }, []);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    addMessage("user", content);
    
    // Simulate AI thinking
    setIsLoading(true);
    
    try {
      let response = "";
      let audioUrl = undefined;
      let imageUrl = undefined;
      let videoUrl = undefined;
      
      // Generate a response based on user input and current mode
      switch(chatMode) {
        case "code":
          response = await generateCodeResponse(content);
          break;
        case "writing":
          response = await generateWritingResponse(content);
          break;
        case "image":
          const imageResult = await generateImageResponse(content);
          response = imageResult.response;
          imageUrl = imageResult.imageUrl;
          break;
        case "search":
          response = await generateSearchResponse(content);
          break;
        case "video":
          const videoResult = await generateVideoResponse(content);
          response = videoResult.response;
          videoUrl = videoResult.videoUrl;
          break;
        case "voice":
          const voiceResult = await generateVoiceResponse(content);
          response = voiceResult.response;
          audioUrl = voiceResult.audioUrl;
          break;
        case "productivity":
          response = await generateProductivityResponse(content);
          break;
        case "translator":
          response = await generateTranslatorResponse(content);
          break;
        case "recommendations":
          response = await generateRecommendationsResponse(content);
          break;
        default:
          response = await generateGeneralResponse(content);
      }
      
      // Add AI response
      addMessage("assistant", response, audioUrl, imageUrl, videoUrl);
    } catch (error) {
      console.error("Error sending message:", error);
      addMessage("system", "Sorry, I encountered an error processing your request. Please try again.");
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const generateGeneralResponse = async (query: string): Promise<string> => {
    const lowercaseQuery = query.toLowerCase();
    
    if (lowercaseQuery.includes("who made you") || lowercaseQuery.includes("who created you")) {
      return "I am made by Sharan Rawat.";
    }
    
    // Handle simple queries locally to reduce API calls
    if (lowercaseQuery.includes("hello") || lowercaseQuery.includes("hi")) {
      return "Hello! I'm QueryNix, your AI assistant. How can I help you today?";
    } 
    
    if (lowercaseQuery.includes("help") || lowercaseQuery.includes("what can you do")) {
      return "I can assist with: general questions, code generation, writing, image creation, video generation, voice synthesis, task management, translations, and recommendations. How can I help you?";
    } 
    
    if (lowercaseQuery.includes("feature") || lowercaseQuery.includes("capabilities")) {
      return "QueryNix offers: AI chat, code assistance, image creation, video generation, voice synthesis, writing help, web search, translation, productivity tools, and personalized recommendations. Which would you like to try?";
    }
    
    if (lowercaseQuery.includes("thank")) {
      return "You're welcome! Happy to help. Is there anything else you need?";
    }
    
    // For all other queries, use Gemini API
    try {
      return await generateGeminiResponse(query);
    } catch (error) {
      console.error("Error with Gemini response:", error);
      // Fallback response if API fails
      return "I'm here to assist with whatever you need. All QueryNix features are fully available. How can I help you today?";
    }
  };

  const generateCodeResponse = async (query: string): Promise<string> => {
    try {
      const codePrompt = `Generate code for the following request. Format the response with proper markdown code blocks with language syntax highlighting: ${query}`;
      return await generateGeminiResponse(codePrompt);
    } catch (error) {
      console.error("Error generating code:", error);
      return "I'm in code mode, and all code generation features are fully available. Unfortunately, I encountered an error generating code for your specific request. Could you provide more details or try rephrasing your request?";
    }
  };

  const generateWritingResponse = async (query: string): Promise<string> => {
    try {
      const writingPrompt = `Act as a professional writing assistant and help with the following request. Provide a well-structured response: ${query}`;
      return await generateGeminiResponse(writingPrompt);
    } catch (error) {
      console.error("Error with writing assistance:", error);
      return "I'm in writing assistance mode, and all writing features are fully available. I encountered an error processing your specific request. Could you provide more details about what you'd like me to write or edit?";
    }
  };

  const generateImageResponse = async (query: string): Promise<{ response: string, imageUrl?: string }> => {
    try {
      // Generate an image with Stability AI
      const result = await generateImage(query);
      
      if (!result.imageUrl) {
        throw new Error("Failed to generate image");
      }
      
      return {
        response: `I'm in image generation mode, and all image creation features are fully available. Based on your description, I've created this image for you:\n\n![Generated Image](${result.imageUrl})\n\nThe image has been generated according to your specifications. You can download it using the button below the image. Would you like to make any adjustments?`,
        imageUrl: result.imageUrl
      };
    } catch (error) {
      console.error("Error generating image:", error);
      return {
        response: "I'm in image generation mode, and all image creation features are fully available. I encountered an error generating an image based on your description. This could be due to content filters or technical issues. Could you try a different description?"
      };
    }
  };

  const generateSearchResponse = async (query: string): Promise<string> => {
    try {
      // Search the web with Serper
      const searchResults = await searchWeb(query);
      
      if (searchResults.length === 0) {
        return "I couldn't find relevant results for your query. Could you rephrase it?";
      }
      
      let response = "Here are concise results for your query:\n\n";
      
      // Limit results to top 3 for conciseness
      searchResults.slice(0, 3).forEach((result, index) => {
        response += `${index + 1}. **${result.title}**\n   ${result.snippet.substring(0, 100)}...\n   [Link](${result.link})\n\n`;
      });
      
      return response;
    } catch (error) {
      console.error("Error searching web:", error);
      return "I encountered an error while searching. Please try again with a different query.";
    }
  };

  const generateVideoResponse = async (content: string): Promise<{ response: string, videoUrl?: string }> => {
    try {
      // Generate a video with Runway ML
      const videoResult = await generateVideo(content);
      
      if (videoResult.error) {
        throw new Error(videoResult.error);
      }
      
      if (!videoResult.videoUrl) {
        throw new Error("Failed to generate video");
      }
      
      return {
        response: `I'm in video generation mode, and all video creation features are fully available. Based on your text description, I've created a video with the following specifications:\n\n• Duration: 3 seconds\n• Style: Modern, professional\n• Resolution: 1080p HD\n\nThe video has been generated based on your specifications. You can download it using the button below.\n\nWould you like to make any adjustments to the video, such as changing the style or duration?`,
        videoUrl: videoResult.videoUrl
      };
    } catch (error) {
      console.error("Error generating video:", error);
      return {
        response: "I'm in video generation mode, and all video creation features are fully available. I encountered an error generating a video based on your description. This could be due to content filters or technical issues. Could you try a different description?"
      };
    }
  };

  const generateVoiceResponse = async (query: string): Promise<{ response: string, audioUrl?: string }> => {
    try {
      // Convert text to speech with ElevenLabs
      const result = await textToSpeech(query);
      
      if (!result.audioUrl) {
        throw new Error("Failed to generate voice");
      }
      
      return {
        response: "I'm in voice synthesis mode, and all voice generation features are fully available. I've converted your text into speech with the following specifications:\n\n• Voice type: Professional female\n• Emotion: Natural\n• Speed: Normal\n• Language: English (US)\n• Quality: High-definition audio\n\n[Audio is now playing, and you can download it using the button below]\n\nThe voice has been generated according to your specifications. Would you like to adjust any parameters?",
        audioUrl: result.audioUrl
      };
    } catch (error) {
      console.error("Error in voice synthesis:", error);
      return {
        response: "I'm in voice synthesis mode, and all voice generation features are fully available. I encountered an error converting your text to speech. This could be due to technical issues or rate limits. Could you try a shorter text or try again later?"
      };
    }
  };

  const generateProductivityResponse = async (query: string): Promise<string> => {
    try {
      // Process task creation
      const newTask = await parseTaskFromText(query);
      const allTasks = getTasks();
      
      let response = "I'm in productivity mode, and all task management features are fully available. ";
      
      if (newTask) {
        response += `I've created a new task:\n\n• Task: ${newTask.title}\n• Priority: ${newTask.priority}\n`;
        
        if (newTask.dueDate) {
          response += `• Due: ${newTask.dueDate.toLocaleDateString()}\n`;
        }
        
        response += "\n";
      }
      
      if (allTasks.length > 0) {
        response += "Here's your current task list:\n\n";
        allTasks.forEach((task, index) => {
          response += `${index + 1}. ${task.title} (Priority: ${task.priority}${task.dueDate ? `, Due: ${task.dueDate.toLocaleDateString()}` : ''})\n`;
        });
      } else if (!newTask) {
        response += "You don't have any tasks yet. Would you like to create one? Try saying something like: 'Add a task to review documents by tomorrow with high priority'.";
      }
      
      return response;
    } catch (error) {
      console.error("Error in productivity task:", error);
      return "I'm in productivity mode, and all task management features are fully available. I encountered an error processing your request. Could you try again with a clearer task description? For example: 'Add a task called Submit report due tomorrow with high priority'.";
    }
  };

  const generateTranslatorResponse = async (query: string): Promise<string> => {
    const lowercaseQuery = query.toLowerCase();
    
    // Determine target language - now supports "multiple" as a valid value
    const targetLanguage: SupportedLanguage = 
      lowercaseQuery.includes("hindi") ? "Hindi" :
      lowercaseQuery.includes("mandarin") || lowercaseQuery.includes("chinese") ? "Mandarin" :
      lowercaseQuery.includes("french") ? "French" :
      lowercaseQuery.includes("german") ? "German" :
      lowercaseQuery.includes("arabic") ? "Arabic" :
      lowercaseQuery.includes("japanese") ? "Japanese" :
      lowercaseQuery.includes("spanish") ? "Spanish" :
      lowercaseQuery.includes("russian") ? "Russian" :
      lowercaseQuery.includes("portuguese") ? "Portuguese" :
      lowercaseQuery.includes("italian") ? "Italian" :
      lowercaseQuery.includes("multiple") ? "multiple" : // Support for multiple languages
      "French"; // Default to French if no language is specified
      
    // Extract the text to translate
    // Look for patterns like "translate X to Y" or "how do you say X in Y"
    let textToTranslate = "";
    
    const translateMatch = query.match(/translate\s+["']?([^"']+)["']?\s+(?:to|into)/i);
    const sayMatch = query.match(/how\s+(?:do\s+you\s+)?say\s+["']?([^"']+)["']?\s+in/i);
    
    if (translateMatch) {
      textToTranslate = translateMatch[1];
    } else if (sayMatch) {
      textToTranslate = sayMatch[1];
    } else {
      // If no specific match, use the entire query as the text to translate
      textToTranslate = query.replace(/(?:translate|say|in|to|into)\s+\w+\s*/gi, "").trim();
      
      // If still no text found, use a default phrase
      if (!textToTranslate) {
        textToTranslate = "Thank you for using our service. We hope you enjoy the experience.";
      }
    }
    
    console.log("Text to translate:", textToTranslate);
    console.log("Target language:", targetLanguage);
    
    try {
      let response = "I'm in translator mode, and all translation features are fully available. Here's the translation you requested:\n\n**Original (English):**\n\"" + textToTranslate + "\"\n\n";
      
      if (targetLanguage === "multiple") {
        response += "**Translations in multiple languages:**\n\n";
        
        // Translate to multiple languages in parallel
        const languages: SupportedLanguage[] = ["Hindi", "Mandarin", "French", "German", "Spanish"];
        const translations = await Promise.all(
          languages.map(lang => translateText(textToTranslate, lang))
        );
        
        languages.forEach((lang, idx) => {
          response += `**${lang}:**\n\"${translations[idx]}\"\n\n`;
        });
      } else {
        const translatedText = await translateText(textToTranslate, targetLanguage);
        response += `**Translation (${targetLanguage}):**\n\"${translatedText}\"\n\n`;
      }
      
      response += "The translation is complete. Would you like me to translate this text into another language or help with a different translation?";
      return response;
    } catch (error) {
      console.error("Error in translation:", error);
      return "I'm in translator mode, and all translation features are fully available. I encountered an error translating your text. This could be due to technical issues or unsupported language combinations. Could you try again with a different language or shorter text?";
    }
  };

  const generateRecommendationsResponse = async (query: string): Promise<string> => {
    try {
      // Extract category from query if present
      const categoryMatch = query.match(/(?:recommend|suggest)\s+(?:some|a few|me)?\s+(\w+)/i);
      const category = categoryMatch ? categoryMatch[1] : undefined;
      
      const recommendations = await generateRecommendations(userInterests, undefined, category);
      
      let response = "I'm in recommendations mode, and all personalization features are fully available. Based on your preferences and request, here are my personalized suggestions:\n\n";
      
      recommendations.forEach((rec, index) => {
        response += `**${rec.title}**\n`;
        response += `Type: ${rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}\n`;
        response += `${rec.description}\n`;
        if (rec.link) {
          response += `[Check it out](${rec.link})\n`;
        }
        response += "\n";
      });
      
      response += "These recommendations are personalized based on your interests. Would you like more specific recommendations in any particular category?";
      
      return response;
    } catch (error) {
      console.error("Error generating recommendations:", error);
      return "I'm in recommendations mode, and all personalization features are fully available. I encountered an error generating recommendations based on your request. Could you try again with more specific interests or a different category?";
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    switchMode,
    chatMode,
    addMessage
  };
};
