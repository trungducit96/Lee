export enum AppMode {
  MENU = 'MENU',
  FLASHCARDS = 'FLASHCARDS',
  STORY = 'STORY',
}

export interface VocabularyItem {
  word: string;
  vietnamese: string;
  emoji: string;
  sentence: string;
}

export interface StoryContent {
  title: string;
  content: string;
  vietnamese_summary: string;
}

export interface Topic {
  id: string;
  label: string;
  emoji: string;
  color: string;
}

export const TOPICS: Topic[] = [
  { id: 'animals', label: 'Động vật (Animals)', emoji: '🦁', color: 'bg-orange-100 border-orange-300 text-orange-800' },
  { id: 'fruits', label: 'Trái cây (Fruits)', emoji: '🍎', color: 'bg-red-100 border-red-300 text-red-800' },
  { id: 'colors', label: 'Màu sắc (Colors)', emoji: '🎨', color: 'bg-purple-100 border-purple-300 text-purple-800' },
  { id: 'family', label: 'Gia đình (Family)', emoji: '👨‍👩‍👧‍👦', color: 'bg-blue-100 border-blue-300 text-blue-800' },
  { id: 'body', label: 'Cơ thể (Body)', emoji: '👀', color: 'bg-pink-100 border-pink-300 text-pink-800' },
  { id: 'numbers', label: 'Số đếm (Numbers)', emoji: '1️⃣', color: 'bg-green-100 border-green-300 text-green-800' },
];