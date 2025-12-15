import { useState, useRef, useEffect } from "react";

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const playMusic = async () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.4;
        
        try {
          // 1. Try to play immediately
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          // 2. If blocked by browser, wait for the FIRST click anywhere
          console.log("Autoplay blocked. Waiting for user interaction...");
          
          const enableAudio = () => {
            audioRef.current.play();
            setIsPlaying(true);
            // Remove listener so it doesn't run on every click
            window.removeEventListener('click', enableAudio); 
            window.removeEventListener('keydown', enableAudio);
          };

          // Listen for any click or key press
          window.addEventListener('click', enableAudio);
          window.addEventListener('keydown', enableAudio);
        }
      }
    };

    playMusic();
  }, []);

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="absolute top-6 left-6 z-50">
      <audio ref={audioRef} loop>
        <source src="/phrog.mp3" type="audio/mpeg" />
      </audio>

      <button 
        onClick={toggleMusic}
        className={`
            p-3 rounded-full border-2 border-white/20 transition-all duration-300 shadow-lg
            ${isPlaying 
                ? 'bg-green-500 animate-pulse' 
                : 'bg-red-500 hover:bg-red-600'
            }
        `}
        title={isPlaying ? "Mute Music" : "Play Music"}
      >
        {isPlaying ? "🎵" : "🔇"}
      </button>
    </div>
  );
}