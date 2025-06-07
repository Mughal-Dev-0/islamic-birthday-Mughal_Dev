
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Star, Sparkles, Download, Share2, Music, Volume2, VolumeX, Gift, Moon, Cake, Edit2, Users, MessageSquare } from 'lucide-react';

const Index = () => {
  const [fromName, setFromName] = useState('');
  const [toName, setToName] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const [showSurprise, setShowSurprise] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentDua, setCurrentDua] = useState(0);
  const [customBlessing, setCustomBlessing] = useState('');
  const [customQuote, setCustomQuote] = useState('');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const [currentGift, setCurrentGift] = useState(0);
  const [showNameEditor, setShowNameEditor] = useState(false);
  const [candlesBlown, setCandlesBlown] = useState(0);
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
      setToName(nameFromUrl);
      setShowWelcome(true);
    }
  }, []);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (toName.trim()) {
      setShowWelcome(true);
      // Update URL without refreshing
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('name', toName);
      window.history.pushState({}, '', newUrl.toString());
    }
  };

  const handleCakeClick = () => {
    setShowSurprise(true);
    setShowConfetti(true);
    if (audioRef.current) {
      audioRef.current.play();
      setIsMusicPlaying(true);
    }
    setTimeout(() => {
      setShowSurprise(false);
      setShowConfetti(false);
    }, 4000);
  };

  const blowCandle = () => {
    setCandlesBlown(prev => prev + 1);
    if (candlesBlown >= 2) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
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
      const textToRead = customBlessing || duas[currentDua];
      const utterance = new SpeechSynthesisUtterance(textToRead);
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

    // Add names
    ctx.font = 'bold 36px serif';
    ctx.fillText(`Dear ${toName}`, 400, 180);
    
    if (fromName) {
      ctx.font = '20px serif';
      ctx.fillText(`From: ${fromName}`, 400, 520);
    }

    // Add Islamic greeting
    ctx.font = '24px serif';
    ctx.fillText('بارك الله في عمرك', 400, 220);

    // Add blessing
    ctx.font = '18px serif';
    const blessing = customBlessing || duas[currentDua];
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

    // Add quote if provided
    if (customQuote) {
      ctx.font = 'italic 16px serif';
      ctx.fillText(`"${customQuote}"`, 400, y + 50);
    }

    // Add decorative elements
    ctx.font = '60px serif';
    ctx.fillText('🎂', 200, 450);
    ctx.fillText('🌙', 400, 450);
    ctx.fillText('⭐', 600, 450);

    // Add website credit
    ctx.font = '14px serif';
    ctx.fillText('Generated by mughal.dev', 400, 580);
  };

  const downloadCard = () => {
    generateCardImage();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `birthday-card-${toName}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const shareCard = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}?name=${encodeURIComponent(toName)}`;
    const message = `🎉 Happy Birthday ${toName}! 🎂 Check out your special Islamic birthday card: ${shareUrl}`;
    
    if (navigator.share) {
      navigator.share({
        title: `Birthday Wishes for ${toName}`,
        text: message,
        url: shareUrl
      });
    } else {
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
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">🎂 Birthday Wishes</h1>
              <p className="text-sm sm:text-base text-gray-600">Create beautiful Islamic birthday blessings</p>
            </div>
            
            <form onSubmit={handleNameSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Your Name (From)</label>
                <Input
                  type="text"
                  placeholder="Enter your name..."
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  className="text-center border-2 border-purple-200 focus:border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Birthday Person's Name (To)</label>
                <Input
                  type="text"
                  placeholder="Enter their name..."
                  value={toName}
                  onChange={(e) => setToName(e.target.value)}
                  className="text-center text-lg border-2 border-purple-200 focus:border-purple-500"
                  required
                />
              </div>
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
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti absolute w-2 h-2 bg-yellow-400"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'][Math.floor(Math.random() * 7)]
              }}
            />
          ))}
        </div>
      )}
      
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
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
        
        {[...Array(20)].map((_, i) => (
          <Star
            key={i}
            className="absolute text-yellow-300 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              fontSize: `${Math.random() * 10 + 8}px`
            }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="fixed top-4 right-4 z-10 flex gap-2">
        <Button
          onClick={() => setShowNameEditor(!showNameEditor)}
          className="bg-white/20 backdrop-blur-sm border-0 hover:bg-white/30"
          size="sm"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          onClick={toggleMusic}
          className="bg-white/20 backdrop-blur-sm border-0 hover:bg-white/30"
          size="sm"
        >
          {isMusicPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </div>

      {/* Name Editor Modal */}
      {showNameEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20 p-4">
          <Card className="w-full max-w-md bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Edit Names
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">From (Your Name)</label>
                <Input
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">To (Birthday Person)</label>
                <Input
                  value={toName}
                  onChange={(e) => setToName(e.target.value)}
                  placeholder="Their name"
                />
              </div>
              <Button
                onClick={() => setShowNameEditor(false)}
                className="w-full"
              >
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Hidden audio element */}
      <audio ref={audioRef} loop>
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+L4v2IaBDWH0fPTfzMGJXDD8+GTRwwWVrLn77NlEAhMoeDyvmMcCDN+zPLFeDEFKG/D8N2QRQwUWbPn77NiFAhMnOD0wGMeAjCA1PCMeLXz2Y14CwEPAQ==" type="audio/wav" />
      </audio>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold text-white mb-4 animate-fade-in">
            Happy Birthday, {toName}! 🎉
          </h1>
          {fromName && (
            <p className="text-lg sm:text-xl text-white/90 mb-2">
              From: {fromName} ❤️
            </p>
          )}
          <p className="text-xl md:text-2xl text-white/90 mb-8 animate-fade-in">
            بارك الله في عمرك - May Allah bless your life
          </p>
          
          {/* Cake Section with Candles */}
          <div className="relative inline-block mb-8">
            <div
              onClick={handleCakeClick}
              className="cursor-pointer transform transition-all duration-300 hover:scale-110 animate-bounce"
            >
              <div className="text-6xl sm:text-8xl md:text-9xl mb-4">🎂</div>
            </div>
            
            {/* Candles */}
            <div className="flex justify-center gap-4 mb-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  onClick={blowCandle}
                  className={`cursor-pointer text-3xl sm:text-4xl transition-all duration-300 ${
                    candlesBlown > i ? 'opacity-30' : 'animate-pulse'
                  }`}
                >
                  🕯️
                </div>
              ))}
            </div>
            <p className="text-sm text-white/70">Click candles to blow them out!</p>
            
            {showSurprise && (
              <div className="absolute inset-0 flex items-center justify-center animate-scale-in">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 sm:p-6 shadow-2xl">
                  <div className="text-3xl sm:text-4xl mb-2">🎊 Surprise! 🎊</div>
                  <p className="text-lg font-semibold text-purple-600">Make a wish!</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Islamic Prayer Section */}
        <Card className="mb-6 sm:mb-8 bg-white/10 backdrop-blur-sm border-0 text-white">
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-pink-300" />
              <h2 className="text-xl sm:text-2xl font-semibold">Islamic Birthday Blessings</h2>
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 ml-2 text-pink-300" />
            </div>
            
            <div className="mb-6">
              <p className="text-base sm:text-lg md:text-xl italic mb-4 min-h-[3rem] flex items-center justify-center">
                "{customBlessing || duas[currentDua]}"
              </p>
              <div className="text-sm text-white/70">☪️ Islamic Birthday Dua ☪️</div>
            </div>
            
            <div className="space-y-4 mb-6">
              <Textarea
                placeholder="Add your custom blessing..."
                value={customBlessing}
                onChange={(e) => setCustomBlessing(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder-white/70"
                rows={3}
              />
              <Input
                placeholder="Add a personal quote..."
                value={customQuote}
                onChange={(e) => setCustomQuote(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder-white/70"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => setCurrentDua((prev) => (prev + 1) % duas.length)}
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 border-0 text-sm sm:text-base"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Next Blessing
              </Button>
              
              {!isNarrating ? (
                <Button
                  onClick={narrateBlessing}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-0 text-sm sm:text-base"
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  Listen
                </Button>
              ) : (
                <Button
                  onClick={stopNarration}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 border-0 text-sm sm:text-base"
                >
                  <VolumeX className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Surprise Gift Section */}
        <Card className="mb-6 sm:mb-8 bg-white/10 backdrop-blur-sm border-0 text-white">
          <CardContent className="p-6 sm:p-8 text-center">
            <h3 className="text-xl sm:text-2xl font-semibold mb-6">🎁 Special Surprise</h3>
            
            {!showGift ? (
              <Button
                onClick={showSurpriseGift}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 border-0 text-lg sm:text-xl py-4 sm:py-6 px-6 sm:px-8"
              >
                <Gift className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                Reveal Your Gift
              </Button>
            ) : (
              <div className="animate-scale-in">
                <div className="text-4xl sm:text-6xl mb-4">{gifts[currentGift].icon}</div>
                <h4 className="text-xl sm:text-2xl font-bold mb-2">{gifts[currentGift].text}</h4>
                <p className="text-base sm:text-lg text-white/90">{gifts[currentGift].description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card Generator Section */}
        <Card className="mb-6 sm:mb-8 bg-white/95 backdrop-blur-sm border-0">
          <CardContent className="p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 text-gray-800 flex items-center justify-center gap-2">
              <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
              Your Birthday Card
            </h3>
            
            <div ref={cardRef} className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 sm:p-8 rounded-lg text-center border-4 border-dashed border-purple-300 mb-6">
              <div className="text-3xl sm:text-4xl mb-4">🎂 🌙 ⭐</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-purple-800 mb-4">Happy Birthday, {toName}!</h2>
              {fromName && <p className="text-lg text-gray-700 mb-4">From: {fromName}</p>}
              <p className="text-base sm:text-lg text-gray-700 mb-4">"{customBlessing || duas[currentDua]}"</p>
              {customQuote && <p className="text-sm sm:text-base italic text-gray-600 mb-4">"{customQuote}"</p>}
              <div className="text-xl sm:text-2xl mb-4">🎈 🎊 🎁</div>
              <div className="text-xs text-gray-500">Generated by mughal.dev</div>
            </div>
            
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={downloadCard}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Card
              </Button>
              <Button
                onClick={shareCard}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm sm:text-base"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Card
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-white/80">
          <p className="mb-2 text-base sm:text-lg transform transition-all duration-300 hover:scale-105 hover:text-white cursor-default animate-glow">
            🎉 Created with ❤️ by Zain Mughal 🎉
          </p>
          <p className="text-xs sm:text-sm mb-2">Share the joy - send birthday wishes to your loved ones!</p>
          <a 
            href="https://mughal.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors underline"
          >
            Powered by mughal.dev
          </a>
        </div>
      </div>
    </div>
  );
};

export default Index;
