import React from 'react';
import { AppMode, TOPICS } from '../types';
import { BookOpen, Layers, Sparkles } from 'lucide-react';

interface MainMenuProps {
  onNavigate: (mode: AppMode, topic: string) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 py-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-kids-secondary">Chọn Chủ Đề (Choose Topic)</h2>
        <p className="text-gray-500">Bé muốn học về cái gì hôm nay?</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl">
        {TOPICS.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onNavigate(AppMode.FLASHCARDS, topic.label)}
            className={`${topic.color} border-b-4 p-6 rounded-3xl flex flex-col items-center gap-3 hover:scale-105 transition-transform shadow-lg active:border-b-0 active:translate-y-1`}
          >
            <span className="text-5xl drop-shadow-sm">{topic.emoji}</span>
            <span className="font-bold text-lg text-center">{topic.label}</span>
          </button>
        ))}
      </div>

      <div className="w-full max-w-2xl border-t-2 border-dashed border-gray-300 pt-8 mt-4">
        <h3 className="text-center text-xl font-bold text-kids-primary mb-6">Góc Kể Chuyện (Story Time)</h3>
        <div className="flex justify-center gap-4">
            <button
                onClick={() => onNavigate(AppMode.STORY, 'Friendly Animals')}
                className="bg-white border-4 border-kids-secondary text-kids-secondary p-4 rounded-2xl flex items-center gap-3 shadow-md hover:bg-blue-50 transition-colors w-full md:w-auto justify-center"
            >
                <BookOpen size={24} />
                <span className="font-bold text-lg">Kể chuyện Động Vật</span>
            </button>
             <button
                onClick={() => onNavigate(AppMode.STORY, 'Space Adventure')}
                className="bg-white border-4 border-kids-primary text-kids-primary p-4 rounded-2xl flex items-center gap-3 shadow-md hover:bg-red-50 transition-colors w-full md:w-auto justify-center"
            >
                <Sparkles size={24} />
                <span className="font-bold text-lg">Phiêu lưu Vũ Trụ</span>
            </button>
        </div>
      </div>
    </div>
  );
};