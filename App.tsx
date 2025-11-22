import React, { useState } from 'react';
import { MainMenu } from './components/MainMenu';
import { Flashcards } from './components/Flashcards';
import { StoryTime } from './components/StoryTime';
import { AppMode } from './types';
import { Home, BookOpen, GraduationCap } from 'lucide-react';

const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<AppMode>(AppMode.MENU);
  const [selectedTopic, setSelectedTopic] = useState<string>('');

  const handleNavigate = (mode: AppMode, topic?: string) => {
    if (topic) setSelectedTopic(topic);
    setCurrentMode(mode);
  };

  const renderContent = () => {
    switch (currentMode) {
      case AppMode.FLASHCARDS:
        return <Flashcards topic={selectedTopic} onBack={() => setCurrentMode(AppMode.MENU)} />;
      case AppMode.STORY:
        return <StoryTime topic={selectedTopic} onBack={() => setCurrentMode(AppMode.MENU)} />;
      case AppMode.MENU:
      default:
        return <MainMenu onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen font-comic text-kids-dark select-none overflow-hidden flex flex-col">
      {/* Header */}
      <header className="p-4 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b-4 border-kids-secondary/30">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => setCurrentMode(AppMode.MENU)}
          >
            <div className="bg-kids-primary text-white p-2 rounded-xl shadow-lg group-hover:rotate-12 transition-transform">
              <Home size={28} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-kids-primary to-kids-secondary bg-clip-text text-transparent">
              Magic English
            </h1>
          </div>
          
          <div className="flex gap-2">
             {currentMode !== AppMode.MENU && (
                <button 
                  onClick={() => setCurrentMode(AppMode.MENU)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-full font-bold text-sm transition-all"
                >
                  Thoát (Exit)
                </button>
             )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4 relative">
        <div className="absolute inset-0 pointer-events-none opacity-30">
            <div className="absolute top-10 left-10 text-6xl animate-bounce delay-700">🎈</div>
            <div className="absolute top-40 right-20 text-5xl animate-pulse">🌟</div>
            <div className="absolute bottom-20 left-1/4 text-6xl animate-bounce">🦄</div>
        </div>
        <div className="z-10 w-full h-full flex flex-col">
            {renderContent()}
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="p-4 text-center text-gray-400 text-xs bg-white/50">
        <p>Bé Học Tiếng Anh • Powered by Gemini 2.5</p>
      </footer>
    </div>
  );
};

export default App;