import { useState, useEffect } from 'react'
import { fetchQuizData } from './utils/pokeLogic'
import BackgroundMusic from './background'
export default function App() {
  const [quizData, setQuizData] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [isWrong, setIsWrong] = useState(false)
  
  // 1. Initialize High Score from LocalStorage (or default to 0)
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem('highScore')) || 0
  )

  const loadQuestion = async () => {
    setRevealed(false)
    setIsWrong(false)
    const data = await fetchQuizData()
    setQuizData(data)
  }

  useEffect(() => {
    loadQuestion()
  }, [])

  // 2. Helper Logic: Check and Save High Score
  const checkHighScore = () => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('highScore', score)
    }
  }

  // 3. Skip Logic: Check score -> Reset -> New Question
  const handleSkip = () => {
    checkHighScore()
    setScore(0)
    loadQuestion()
  }

 const handleGuess = (selectedName) => {
    if (revealed) return; 

    if (selectedName === quizData.correctOption.name) {
      // 1. Play Success Sound
      new Audio('/ding.mp3').play()
      
      setScore(s => s + 1)
      setIsWrong(false)
    } else {
      // 2. Play Failure Sound
      new Audio('/buzzer.mp3').play()
      
      checkHighScore()
      setScore(0) 
      setIsWrong(true) 
    }
    
    setRevealed(true) 
    setTimeout(() => loadQuestion(), 2500)
  }

  if (!quizData) return (
    <div className="w-full h-full bg-red-600 flex items-center justify-center font-black text-yellow-400 text-4xl tracking-widest animate-bounce">
        LOADING...
    </div>
  )

  return (
    <div className="w-full h-full bg-[#E3350D] relative overflow-hidden font-sans select-none flex">
      
      {/* 2. Place it here (It is absolute positioned, so it will float in top-left) */}
      <BackgroundMusic />

      {/* --- BLUE BACKGROUND (Left Split) --- */}
      <div 
        className="absolute inset-0 z-0 bg-[#00C0F0]"
        style={{ clipPath: 'polygon(0 0, 60% 0, 40% 100%, 0% 100%)' }}
      >
        <div className="absolute inset-0 bg-[repeating-conic-gradient(rgba(255,255,255,0.3)_0deg_10deg,transparent_10deg_20deg)] animate-spin-slow scale-150 origin-[40%_50%]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_50%,_rgba(255,255,255,0.8)_0%,_transparent_60%)]" />
      </div>

      {/* --- LEFT SIDE: POKÉMON IMAGE --- */}
      <div className="relative z-10 w-[50%] h-full flex items-center justify-center">
        <img 
            src={quizData.correctOption.image} 
            alt="Pokemon" 
            className={`
                max-w-[80%] max-h-[75vh] 
                object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.3)]
                transition-all duration-500 ease-out
                ${revealed ? 'brightness-100 scale-110' : 'brightness-0 scale-100'}
            `}
        />
      </div>

      {/* --- RIGHT SIDE: UI PANEL --- */}
      <div className="relative z-10 w-[50%] h-full flex flex-col justify-center items-center px-2 md:px-4">
        
        {/* Floating Background Elements */}
        <div className="absolute top-[5vh] right-[5vw] rotate-12 animate-pulse z-0 pointer-events-none">
            <span className="text-[10vh] md:text-[20vh] font-black text-[#FFCB05] drop-shadow-[0.5vh_0.5vh_0_#2A479F] leading-none">
                {revealed ? '!' : '?'}
            </span>
        </div>

        <div className="absolute bottom-[5vh] right-[5vw] -rotate-6 z-0 pointer-events-none">
            <h1 className="text-[5vh] md:text-[8vh] font-black italic text-[#FFCB05] drop-shadow-[0.3vh_0.3vh_0_#2A479F] tracking-tighter stroke-text opacity-80">
                POKÉMON
            </h1>
        </div>

        {/* Game Interface Box */}
        <div className="relative z-20 w-full max-w-lg bg-black/20 backdrop-blur-sm p-3 md:p-10 rounded-xl md:rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center">
            
            {/* SCOREBOARD */}
            <div className="text-center mb-2 md:mb-6 flex gap-4 justify-center">
                 {/* Current Streak */}
                 <span className="bg-[#2A479F] text-white font-bold px-3 py-1 md:px-6 md:py-2 rounded-full text-xs md:text-lg tracking-widest border-2 border-white/20 shadow-lg">
                    STREAK: {score}
                 </span>

                 {/* High Score */}
                 <span className="bg-[#FFCB05] text-[#2A479F] font-black px-3 py-1 md:px-6 md:py-2 rounded-full text-xs md:text-lg tracking-widest border-2 border-white/20 shadow-lg">
                    BEST: {highScore}
                 </span>
            </div>

            {/* Question Text */}
            <h2 className="text-xl md:text-5xl font-black text-white text-center mb-4 md:mb-8 italic drop-shadow-md uppercase leading-tight">
                 {revealed 
                    ? <span className="text-[#FFCB05] drop-shadow-sm">It's {quizData.correctOption.name}!</span> 
                    : "Who's That?"
                 }
            </h2>

            {/* Answer Buttons & Skip */}
            {!revealed && (
                <>
                    <div className="grid grid-cols-2 gap-2 md:gap-4 w-full">
                        {quizData.options.map((pokemon) => (
                            <button
                                key={pokemon.id}
                                onClick={() => handleGuess(pokemon.name)}
                                className="
                                    bg-white border-b-[4px] md:border-b-[6px] border-r-[4px] md:border-r-[6px] border-[#2A479F] 
                                    rounded-lg md:rounded-xl py-2 md:py-6 px-1
                                    text-[#2A479F] font-black uppercase text-[10px] sm:text-xs md:text-xl tracking-wider
                                    hover:bg-[#FFCB05] hover:border-b-[2px] hover:border-r-[2px] hover:translate-y-[2px] hover:translate-x-[2px]
                                    transition-all active:scale-95 shadow-lg truncate
                                "
                            >
                                {pokemon.name}
                            </button>
                        ))}
                    </div>

                    {/* SKIP BUTTON */}
                    <button
                        onClick={handleSkip}
                        className="
                            mt-4 md:mt-6
                            bg-[#FFCB05] border-b-[4px] md:border-b-[6px] border-r-[4px] md:border-r-[6px] border-[#c7a008]
                            rounded-lg md:rounded-xl py-2 md:py-3 px-8
                            text-[#2A479F] font-black uppercase text-xs md:text-lg tracking-widest
                            hover:brightness-110 hover:translate-y-[1px]
                            active:border-b-0 active:border-r-0 active:translate-y-[4px]
                            transition-all shadow-lg flex items-center gap-2
                        "
                    >
                        SKIP ⏩
                    </button>
                </>
            )}
        </div>

      </div>
    </div>
  )
}