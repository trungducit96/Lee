import { GoogleGenAI, Type, Modality } from "@google/genai";
import { VocabularyItem, StoryContent } from "../types";

const API_KEY = process.env.API_KEY || '';

// Note: Creating instance on demand to ensure key freshness if we had a key picker,
// but per instructions we rely on env.
const getAI = () => new GoogleGenAI({ apiKey: API_KEY });

export const generateVocabulary = async (topic: string): Promise<VocabularyItem[]> => {
  const ai = getAI();
  const prompt = `Generate 5 simple, distinct English vocabulary words suitable for a 5-year-old child about the topic: "${topic}".
  For each word, provide:
  1. The English word.
  2. The Vietnamese translation.
  3. A single matching Emoji.
  4. A very simple English example sentence using the word.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            vietnamese: { type: Type.STRING },
            emoji: { type: Type.STRING },
            sentence: { type: Type.STRING },
          },
          required: ["word", "vietnamese", "emoji", "sentence"]
        }
      }
    }
  });

  const text = response.text;
  if (!text) return [];
  
  try {
    return JSON.parse(text) as VocabularyItem[];
  } catch (e) {
    console.error("Failed to parse vocabulary", e);
    return [];
  }
};

export const generateStory = async (topic: string): Promise<StoryContent> => {
  const ai = getAI();
  const prompt = `Write a very short, cute, and simple story (approx 50 words) in English for a 5-year-old child about "${topic}".
  Use simple grammar.
  Also provide a Vietnamese summary.
  Format as JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          vietnamese_summary: { type: Type.STRING },
        },
        required: ["title", "content", "vietnamese_summary"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No story generated");

  return JSON.parse(text) as StoryContent;
};

export const speakText = async (text: string): Promise<AudioBuffer | null> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' }, // 'Puck' is a nice friendly voice
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return null;

    // Decode audio
    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(bytes.buffer);
    return audioBuffer;
  } catch (error) {
    console.error("TTS Error", error);
    return null;
  }
};

export const playAudioBuffer = (buffer: AudioBuffer) => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start(0);
};