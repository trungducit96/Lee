import React, { useState, useEffect, useCallback } from 'react';
import { VocabularyItem } from '../types';
import { generateVocabulary, speakText, playAudioBuffer } from '../services/geminiService';
import { Volume2, ArrowRight, ArrowLeft, RefreshCcw, Star } from 'lucide-react';

interface FlashcardsProps {
  topic: string;
  onBack: () => void;
}

export const Flashcards: React.FC<FlashcardsProps> = ({ topic, onBack }) => {
  const [cards, setCards] = useState<VocabularyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [flipped, setFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const loadCards = useCallback(async () => {
    setLoading(true);
    setCards([]);
    try {
      const items = await generateVocabulary(topic);
      setCards(items);
      setCurrentIndex(0);
      setFlipped(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [topic]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const handleSpeak = async (text: string) => {
    if (isPlaying) return;
    setIsPlaying(true);
    const buffer = await speakText(text);
    if (buffer) {
      playAudioBuffer(buffer);
    }
    setIsPlaying(false);
  };

  // Auto-play sound when card appears (optional, but nice for kids)
  useEffect(() => {
    if (!loading && cards.length > 0) {
        // Small delay to let animation finish
        const timer = setTimeout(() => {
            handleSpeak(cards[currentIndex].word);
        }, 500);
        return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, cards, loading]);


  const nextCard = () => {
    setFlipped(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
        // Cycle back or show finish? Let's cycle for endless play
        setCurrentIndex(0); 
    }
  };

  const prevCard = () => {
    setFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <div className="text-6xl animate-bounce mb-4">🤖</div>
        <p className="text-xl text-kids-primary font-bold">Đang tạo thẻ học...</p>
        <p className="text-gray-400">(Creating magic flashcards...)</p>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-xl mb-4">Không tải được thẻ. Bé thử lại nhé!</p>
        <button onClick={loadCards} className="bg-kids-primary text-white px-6 py-3 rounded-full font-bold">
            Thử Lại (Retry)
        </button>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="flex flex-col items-center h-full py-4">
      <div className="w-full flex justify-between items-center mb-6 px-2">
         <div className="bg-white px-4 py-2 rounded-full shadow-sm text-sm font-bold text-kids-secondary border border-kids-secondary">
            {topic}
         </div>
         <div className="flex gap-1">
            {cards.map((_, idx) => (
                <div 
                    key={idx} 
                    className={`h-2 w-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-kids-primary' : 'bg-gray-300'}`}
                />
            ))}
         </div>
      </div>

      {/* Card Container */}
      <div 
        className="relative w-full max-w-sm aspect-[3/4] perspective-1000 cursor-pointer group"
        onClick={() => setFlipped(!flipped)}
      >
        <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}>
            
            {/* Front of Card */}
            <div className="absolute w-full h-full bg-white border-8 border-kids-secondary rounded-[3rem] shadow-xl backface-hidden flex flex-col items-center justify-center p-6 overflow-hidden">
                <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-blue-50 to-transparent -z-10"></div>
                <div className="text-[8rem] leading-none transform group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
                    {currentCard.emoji}
                </div>
                <h2 className="text-5xl font-extrabold text-kids-dark mt-8 mb-2 tracking-wide">{currentCard.word}</h2>
                <button 
                    onClick={(e) => { e.stopPropagation(); handleSpeak(currentCard.word); }}
                    className="mt-4 bg-kids-accent text-yellow-900 p-4 rounded-full shadow-md hover:bg-yellow-300 active:scale-95 transition-all"
                >
                    <Volume2 size={32} />
                </button>
                <p className="text-gray-400 text-sm mt-8 animate-pulse">Chạm để xem nghĩa (Tap to flip)</p>
            </div>

            {/* Back of Card */}
            <div className="absolute w-full h-full bg-white border-8 border-kids-primary rounded-[3rem] shadow-xl backface-hidden rotate-y-180 flex flex-col items-center justify-center p-8 text-center">
                 <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-red-50 to-transparent -z-10"></div>
                <h3 className="text-4xl font-bold text-kids-primary mb-6">{currentCard.vietnamese}</h3>
                <div className="bg-gray-50 p-6 rounded-2xl w-full">
                    <p className="text-xl text-kids-dark italic font-medium">"{currentCard.sentence}"</p>
                    <button 
                         onClick={(e) => { e.stopPropagation(); handleSpeak(currentCard.sentence); }}
                         className="mt-3 inline-flex items-center gap-2 text-kids-secondary font-bold hover:underline"
                    >
                        <Volume2 size={20} /> Nghe câu (Listen)
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 mt-8">
        <button 
            onClick={prevCard} 
            disabled={currentIndex === 0}
            className="p-4 rounded-full bg-white shadow-md disabled:opacity-30 text-kids-dark hover:bg-gray-50"
        >
            <ArrowLeft size={32} />
        </button>

        <button 
            onClick={loadCards}
            className="p-3 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:rotate-180 transition-all"
            title="New Words"
        >
            <RefreshCcw size={24} />
        </button>

        <button 
            onClick={nextCard}
            className="p-4 rounded-full bg-kids-primary shadow-lg shadow-red-200 text-white hover:bg-red-500 hover:scale-110 transition-all"
        >
            <ArrowRight size={32} />
        </button>
      </div>

    </div>
  );
};