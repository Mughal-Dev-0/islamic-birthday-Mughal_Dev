
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Star, Sparkles, Download, Share2, Music, Volume2, VolumeX, Gift, Moon, Cake } from 'lucide-react';

const Index = () => {
  const [userName, setUserName] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const [showSurprise, setShowSurprise] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [currentDua, setCurrentDua] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const [currentGift, setCurrentGift] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const duas = [
    "May Allah bless your life with barakah and imaan.",
    "May your years be filled with gratitude and sabr.",
    "May Allah grant you success in this life and the hereafter.",
    "May this new year bring you closer to Allah's path.",
    "May Allah shower His mercy and blessings upon you.",
    "May your faith grow stronger with each passing year."
  ];

  const gifts = [
    { icon: "🎁", text: "A virtual gift!", description: "May this year bring you countless blessings" },
    { icon: "🌙", text: "A spiritual reminder", description: "Remember Allah in all your endeavors" },
    { icon: "💖", text: "A special dua", description: "May Allah grant you happiness and peace" }
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

  const narrateBlessing = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(duas[currentDua]);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsNarrating(true);
      utterance.onend = () => setIsNarrating(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  const stopNarration = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsNarrating(false);
    }
  };

  const generateCardImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    // Add decorative border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, 760, 560);

    // Add title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px serif';
    ctx.textAlign = 'center';
    ctx.fillText('Happy Birthday!', 400, 120);

    // Add name
    ctx.font = 'bold 36px serif';
    ctx.fillText(userName, 400, 180);

    // Add Islamic greeting
    ctx.font = '24px serif';
    ctx.fillText('بارك الله في عمرك', 400, 220);

    // Add blessing
    ctx.font = '18px serif';
    const blessing = duas[currentDua];
    const words = blessing.split(' ');
    let line = '';
    let y = 280;
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > 700 && i > 0) {
        ctx.fillText(line, 400, y);
        line = words[i] + ' ';
        y += 30;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 400, y);

    // Add decorative elements (simple geometric shapes as emoji alternatives)
    ctx.font = '60px serif';
    ctx.fillText('🎂', 200, 450);
    ctx.fillText('🌙', 400, 450);
    ctx.fillText('⭐', 600, 450);

    // Add footer
    ctx.font = '16px serif';
    ctx.fillText('Created with ❤️ by Zain Mughal', 400, 550);
  };

  const downloadCard = () => {
    generateCardImage();
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create download link
    const link = document.createElement('a');
    link.download = `birthday-card-${userName}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const shareCard = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}?name=${encodeURIComponent(userName)}`;
    const message = `🎉 Happy Birthday ${userName}! 🎂 Check out your special Islamic birthday card: ${shareUrl}`;
    
    if (navigator.share) {
      navigator.share({
        title: `Birthday Wishes for ${userName}`,
        text: message,
        url: shareUrl
      });
    } else {
      // Fallback to WhatsApp
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const showSurpriseGift = () => {
    setCurrentGift(Math.floor(Math.random() * gifts.length));
    setShowGift(true);
    setTimeout(() => setShowGift(false), 4000);
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
      {/* SEO Meta tags would be handled by React Helmet in a real app */}
      <title>Happy Birthday {userName} - Islamic Birthday Wishes</title>
      
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
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setCurrentDua((prev) => (prev + 1) % duas.length)}
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 border-0"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Next Blessing
              </Button>
              
              {!isNarrating ? (
                <Button
                  onClick={narrateBlessing}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-0"
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  Listen
                </Button>
              ) : (
                <Button
                  onClick={stopNarration}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 border-0"
                >
                  <VolumeX className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Surprise Gift Section */}
        <Card className="mb-8 bg-white/10 backdrop-blur-sm border-0 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-semibold mb-6">🎁 Special Surprise</h3>
            
            {!showGift ? (
              <Button
                onClick={showSurpriseGift}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 border-0 text-xl py-6 px-8"
              >
                <Gift className="h-6 w-6 mr-2" />
                Reveal Your Gift
              </Button>
            ) : (
              <div className="animate-scale-in">
                <div className="text-6xl mb-4">{gifts[currentGift].icon}</div>
                <h4 className="text-2xl font-bold mb-2">{gifts[currentGift].text}</h4>
                <p className="text-lg text-white/90">{gifts[currentGift].description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card Generator Section */}
        <Card className="mb-8 bg-white/95 backdrop-blur-sm border-0">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Your Birthday Card</h3>
            
            <div ref={cardRef} className="bg-gradient-to-br from-purple-100 to-pink-100 p-8 rounded-lg text-center border-4 border-dashed border-purple-300 mb-6">
              <div className="text-4xl mb-4">🎂 🌙 ⭐</div>
              <h2 className="text-3xl font-bold text-purple-800 mb-4">Happy Birthday, {userName}!</h2>
              <p className="text-lg text-gray-700 mb-4">"{duas[currentDua]}"</p>
              <div className="text-2xl">🎈 🎊 🎁</div>
            </div>
            
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={downloadCard}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Card
              </Button>
              <Button
                onClick={shareCard}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Card
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-white/80">
          <p className="mb-2 transform transition-all duration-300 hover:scale-105 hover:text-white cursor-default">
            🎉 Created with ❤️ by Zain Mughal 🎉
          </p>
          <p className="text-sm">Share the joy - send birthday wishes to your loved ones!</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
