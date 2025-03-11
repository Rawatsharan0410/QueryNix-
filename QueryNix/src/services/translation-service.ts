
import { toast } from "sonner";

// Sample translations for fallback (we'll use the Google Translate API)
const languages = {
  "Hindi": "hi",
  "Mandarin": "zh-CN",
  "French": "fr",
  "German": "de",
  "Arabic": "ar",
  "Japanese": "ja",
  "Spanish": "es",
  "Russian": "ru",
  "Portuguese": "pt",
  "Italian": "it",
  "Korean": "ko",
  "Dutch": "nl",
  "Swedish": "sv",
  "Turkish": "tr",
  "Greek": "el"
};

export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  try {
    // Get the language code
    const languageCode = languages[targetLanguage as keyof typeof languages] || targetLanguage;
    
    console.log(`Translating text to language: ${targetLanguage} (code: ${languageCode})`);
    
    // Use Google's translation API
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${languageCode}&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Translation API response:', data);
    
    // Extract translation from response
    let translatedText = '';
    if (data && data[0]) {
      for (let i = 0; i < data[0].length; i++) {
        translatedText += data[0][i][0];
      }
    }
    
    if (!translatedText) {
      throw new Error('No translation returned');
    }
    
    toast.success(`Translated to ${targetLanguage} successfully`);
    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    toast.error('Translation failed');
    
    // Return a fallback message in the target language if available
    const fallbackMessages = {
      "hi": "अनुवाद विफल हो गया।",
      "zh-CN": "翻译失败。",
      "fr": "Échec de la traduction.",
      "de": "Übersetzung fehlgeschlagen.",
      "ar": "فشلت الترجمة.",
      "ja": "翻訳に失敗しました。",
      "es": "Falló la traducción.",
      "ru": "Ошибка перевода.",
      "pt": "Falha na tradução.",
      "it": "Traduzione fallita.",
      "ko": "번역 실패.",
      "nl": "Vertaling mislukt.",
      "sv": "Översättning misslyckades.",
      "tr": "Çeviri başarısız oldu.",
      "el": "Η μετάφραση απέτυχε."
    };
    
    const languageCode = languages[targetLanguage as keyof typeof languages] || targetLanguage;
    
    return fallbackMessages[languageCode as keyof typeof fallbackMessages] || 
      `[Translation to ${targetLanguage} failed]`;
  }
};

export const getSupportedLanguages = (): string[] => {
  return Object.keys(languages);
};
