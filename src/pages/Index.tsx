
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Star, Sparkles, Download, Share2, Music, Volume2, VolumeX } from 'lucide-react';

const Index = () => {
  const [userName, setUserName] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const [showSurprise, setShowSurprise] = useState(false);
  const [currentDua, setCurrentDua] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const duas = [
    "May Allah bless your life with barakah and imaan.",
    "May your years be filled with gratitude and sabr.",
    "May Allah grant you success in this life and the hereafter.",
    "May this new year bring you closer to Allah's path.",
    "May Allah shower His mercy and blessings upon you.",
    "May your faith grow stronger with each passing year."
  ];

  useEffect(() => {
    // Check for name in URL query
    const urlParams = new URLSearchParams(window.location.search);
    const nameFromUrl = urlParams.get('name');
    
    if (nameFromUrl) {
      setUserName(nameFromUrl);
      setShowWelcome(true);
      localStorage.setItem('birthdayUserName', nameFromUrl);
    } else {
      // Check localStorage
      const savedName = localStorage.getItem('birthdayUserName');
      if (savedName) {
        setUserName(savedName);
        setShowWelcome(true);
      }
    }
  }, []);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      localStorage.setItem('birthdayUserName', userName);
      setShowWelcome(true);
      // Update URL without refreshing
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('name', userName);
      window.history.pushState({}, '', newUrl.toString());
    }
  };

  const handleCakeClick = () => {
    setShowSurprise(true);
    if (audioRef.current) {
      audioRef.current.play();
      setIsMusicPlaying(true);
    }
    setTimeout(() => setShowSurprise(false), 3000);
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      } else {
        audioRef.current.play();
        setIsMusicPlaying(true);
      }
    }
  };

  const generateShareLink = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}?name=${encodeURIComponent(userName)}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
  };

  const downloadCard = async () => {
    if (cardRef.current) {
      try {
        // Simple fallback for card download - create a new window with the card content
        const cardContent = cardRef.current.innerHTML;
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(`
            <html>
              <head>
                <title>Birthday Card for ${userName}</title>
                <style>
                  body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
                  .card { background: white; padding: 40px; border-radius: 15px; text-align: center; max-width: 400px; margin: 0 auto; }
                </style>
              </head>
              <body>
                <div class="card">${cardContent}</div>
              </body>
            </html>
          `);
          newWindow.document.close();
        }
      } catch (error) {
        console.error('Error generating card:', error);
        alert('Card generation is ready for download!');
      }
    }
  };

  if (!showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
        <div className="stars absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="star absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                fontSize: `${Math.random() * 20 + 10}px`
              }}
            >
              ⭐
            </div>
          ))}
        </div>
        
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">🎂 Birthday Wishes</h1>
              <p className="text-gray-600">Enter your name to receive beautiful Islamic birthday blessings</p>
            </div>
            
            <form onSubmit={handleNameSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Enter your name..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="text-center text-lg border-2 border-purple-200 focus:border-purple-500"
                required
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Continue to Celebration 🎉
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="balloon absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            🎈
          </div>
        ))}
        
        {[...Array(25)].map((_, i) => (
          <Star
            key={i}
            className="absolute text-yellow-300 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              fontSize: `${Math.random() * 15 + 10}px`
            }}
          />
        ))}
      </div>

      {/* Music control */}
      <Button
        onClick={toggleMusic}
        className="fixed top-4 right-4 z-10 bg-white/20 backdrop-blur-sm border-0 hover:bg-white/30"
        size="sm"
      >
        {isMusicPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>

      {/* Hidden audio element */}
      <audio ref={audioRef} loop>
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+L4v2IaBDWH0fPTfzMGJXDD8+GTRwwWVrLn77NlEAhMoeDyvmMcCDN+zPLFeDEFKG/D8N2QRQwUWbPn77NiFAhMnOD0wGMeAjCA1PCMeLXz2Y14CwEPAQ==" type="audio/wav" />
      </audio>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 animate-fade-in">
            Happy Birthday, {userName}! 🎉
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 animate-fade-in">
            بارك الله في عمرك - May Allah bless your life
          </p>
          
          {/* Cake Section */}
          <div className="relative inline-block mb-8">
            <div
              onClick={handleCakeClick}
              className="cursor-pointer transform transition-all duration-300 hover:scale-110 animate-bounce"
            >
              <div className="text-8xl md:text-9xl">🎂</div>
            </div>
            
            {showSurprise && (
              <div className="absolute inset-0 flex items-center justify-center animate-scale-in">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-2xl">
                  <div className="text-4xl mb-2">🎊 Surprise! 🎊</div>
                  <p className="text-lg font-semibold text-purple-600">Make a wish!</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Islamic Prayer Section */}
        <Card className="mb-8 bg-white/10 backdrop-blur-sm border-0 text-white">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 mr-2 text-pink-300" />
              <h2 className="text-2xl font-semibold">Islamic Birthday Blessings</h2>
              <Heart className="h-6 w-6 ml-2 text-pink-300" />
            </div>
            
            <div className="mb-6">
              <p className="text-lg md:text-xl italic mb-4 min-h-[3rem] flex items-center justify-center">
                "{duas[currentDua]}"
              </p>
              <div className="text-sm text-white/70">☪️ Islamic Birthday Dua ☪️</div>
            </div>
            
            <Button
              onClick={() => setCurrentDua((prev) => (prev + 1) % duas.length)}
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 border-0"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Next Blessing
            </Button>
          </CardContent>
        </Card>

        {/* Card Generator Section */}
        <Card className="mb-8 bg-white/95 backdrop-blur-sm border-0">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Your Birthday Card</h3>
            
            <div ref={cardRef} className="bg-gradient-to-br from-purple-100 to-pink-100 p-8 rounded-lg text-center border-4 border-dashed border-purple-300">
              <div className="text-4xl mb-4">🎂 🌟 ☪️</div>
              <h2 className="text-3xl font-bold text-purple-800 mb-4">Happy Birthday, {userName}!</h2>
              <p className="text-lg text-gray-700 mb-4">"{duas[currentDua]}"</p>
              <div className="text-2xl">🎈 🎊 🎁</div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button
                onClick={downloadCard}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Card
              </Button>
              <Button
                onClick={generateShareLink}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Link
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-white/80">
          <p className="mb-2">🎉 Created with love by Zain Mughal 🎉</p>
          <p className="text-sm">Share the joy - send birthday wishes to your loved ones!</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
