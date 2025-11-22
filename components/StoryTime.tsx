import React, { useState, useEffect } from 'react';
import { generateStory, speakText, playAudioBuffer } from '../services/geminiService';
import { StoryContent } from '../types';
import { Volume2, Play, Pause, Wand2 } from 'lucide-react';

interface StoryTimeProps {
  topic: string;
  onBack: () => void;
}

export const StoryTime: React.FC<StoryTimeProps> = ({ topic, onBack }) => {
  const [story, setStory] = useState<StoryContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      setLoading(true);
      try {
        const data = await generateStory(topic);
        setStory(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, [topic]);

  const handleReadAloud = async () => {
    if (!story || isPlaying) return;
    
    setIsPlaying(true);
    const textToRead = `${story.title}. ${story.content}`;
    const buffer = await speakText(textToRead);
    if (buffer) {
      playAudioBuffer(buffer);
      // A simple timeout to reset playing state roughly after duration, 
      // though in a real app we'd listen to 'ended' event from the source.
      setTimeout(() => setIsPlaying(false), buffer.duration * 1000);
    } else {
        setIsPlaying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <div className="text-6xl animate-spin mb-4">✨</div>
        <p className="text-xl text-kids-secondary font-bold">Đang viết chuyện cổ tích...</p>
        <p className="text-gray-400">(Writing a magical story...)</p>
      </div>
    );
  }

  if (!story) return (
      <div className="flex flex-col items-center justify-center h-full">
        <p>Không thể tạo truyện. Thử lại nhé!</p>
        <button onClick={onBack} className="mt-4 text-blue-500 underline">Quay lại</button>
      </div>
  );

  return (
    <div className="flex flex-col h-full relative">
      {/* Story Card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-yellow-200 flex-1 flex flex-col">
        {/* Illustration placeholder using unsplash for variety, based on topic keywords */}
        <div className="h-48 w-full bg-yellow-50 relative overflow-hidden">
             <img 
                src={`https://picsum.photos/800/400?random=${Date.now()}`} 
                alt="Story decoration" 
                className="w-full h-full object-cover opacity-80"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
             <div className="absolute bottom-4 left-6 right-6">
                 <h2 className="text-3xl font-bold text-kids-dark leading-tight shadow-white drop-shadow-md">{story.title}</h2>
             </div>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto flex-1">
            <div className="prose prose-xl max-w-none">
                <p className="text-2xl text-gray-700 leading-relaxed font-medium font-comic">
                    {story.content}
                </p>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-xl border-l-4 border-kids-secondary">
                <h4 className="text-sm font-bold text-kids-secondary uppercase mb-1">Tóm tắt (Summary)</h4>
                <p className="text-gray-600">{story.vietnamese_summary}</p>
            </div>
        </div>

        {/* Footer Controls */}
        <div className="bg-gray-50 p-4 flex items-center justify-between border-t border-gray-100">
            <button 
                onClick={() => window.location.reload()} // Simple refresh for new story logic or recall parent state
                className="flex items-center gap-2 text-gray-500 hover:text-kids-primary px-4 py-2"
            >
                <Wand2 size={20} />
                <span className="font-bold text-sm">Truyện Mới</span>
            </button>

            <button 
                onClick={handleReadAloud}
                disabled={isPlaying}
                className={`flex items-center gap-3 px-8 py-4 rounded-full shadow-lg transition-all ${isPlaying ? 'bg-gray-300 cursor-not-allowed' : 'bg-kids-secondary hover:bg-teal-400 text-white hover:scale-105'}`}
            >
                {isPlaying ? <Volume2 className="animate-pulse" /> : <Play fill="currentColor" />}
                <span className="font-bold text-lg">{isPlaying ? 'Đang Đọc...' : 'Đọc Cho Bé'}</span>
            </button>
        </div>
      </div>
    </div>
  );
};