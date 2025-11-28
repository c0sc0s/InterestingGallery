import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw, Trophy, Brain, X, Flame, Zap, Timer, EyeOff } from 'lucide-react';
import audioManager from './audio.js';

// --- 游戏配置 ---
const ICONS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐙', '🐵', '🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍍', '🥝', '🍄', '🌳', '🌵', '🌻', '🍕', '🍔', '🍟', '🍦', '🍩', '🍪', '🍫', '🍬'];
const ROTATIONS = [0, 90, 180, 270];

// 难度配置
const getDifficultyConfig = (score) => {
  // 简单防护，防止 score 为 undefined
  const safeScore = score || 0;
  
  if (safeScore < 10) return { 
    level: 1, name: "新手村", color: "text-emerald-600", bg: "bg-emerald-100", 
    rotate: false, traps: 0, optionsCount: 4, hideDelay: null, 
    description: "轻松热身 · 无旋转" 
  };
  if (safeScore < 20) return { 
    level: 2, name: "冒险者", color: "text-blue-600", bg: "bg-blue-100", 
    rotate: true, traps: 0, optionsCount: 4, hideDelay: null, 
    description: "世界开始旋转了" 
  };
  if (safeScore < 30) return { 
    level: 3, name: "挑战者", color: "text-violet-600", bg: "bg-violet-100", 
    rotate: true, traps: 1, optionsCount: 4, hideDelay: 3000, 
    description: "3秒记忆 · 小心陷阱" 
  };
  if (safeScore < 40) return { 
    level: 4, name: "大师", color: "text-orange-600", bg: "bg-orange-100", 
    rotate: true, traps: 2, optionsCount: 6, hideDelay: 2000, 
    description: "6选1 · 2秒记忆" 
  };
  return { 
    level: 5, name: "传说", color: "text-rose-600", bg: "bg-rose-100", 
    rotate: true, traps: 3, optionsCount: 9, hideDelay: 1500, 
    description: "9宫格 · 极限挑战" 
  };
};

// 评价系统
const getRating = (ms) => {
  if (ms < 1000) return { text: "神速!!", color: "text-yellow-400", icon: "⚡", scale: 1.5, rotate: -6 };
  if (ms < 1800) return { text: "完美!", color: "text-emerald-400", icon: "🔥", scale: 1.2, rotate: 3 };
  if (ms < 3000) return { text: "不错", color: "text-blue-400", icon: "👍", scale: 1.0, rotate: -2 };
  return null;
};

// --- 卡通风格 UI 组件 ---

// 卡通按钮
const CartoonButton = ({ children, onClick, className = "", variant = "primary" }) => {
  const variants = {
    primary: "bg-indigo-500 hover:bg-indigo-400 text-white border-indigo-900",
    success: "bg-emerald-500 hover:bg-emerald-400 text-white border-emerald-900",
    warning: "bg-amber-400 hover:bg-amber-300 text-amber-900 border-amber-900",
    danger: "bg-rose-500 hover:bg-rose-400 text-white border-rose-900",
    neutral: "bg-white hover:bg-slate-50 text-slate-900 border-slate-900",
  };

  const handleClick = (e) => {
    audioManager.playClickSound();
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        relative py-3 px-6 rounded-xl font-black text-lg
        border-b-[6px] border-r-[4px] border-t-2 border-l-2
        active:border-b-2 active:border-r-2 active:translate-y-[4px] active:translate-x-[2px]
        transition-all duration-75
        flex items-center justify-center gap-2
        ${variants[variant] || variants.primary}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

// 卡通卡片
const Card = ({ content, rotation, onClick, className = "", size = "text-5xl", isHidden = false, status = 'normal' }) => {
  let baseStyle = "bg-white border-slate-900 text-slate-800";
  let interactiveStyle = "hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none focus:outline-none";
  
  if (status === 'correct') {
    baseStyle = "bg-emerald-100 border-emerald-900 text-emerald-800";
    interactiveStyle = "translate-y-0 shadow-none ring-4 ring-emerald-400 focus:outline-none"; 
  } 
  else if (status === 'disabled') {
    baseStyle = "bg-slate-100 border-slate-300 text-slate-300 opacity-60";
    interactiveStyle = "cursor-not-allowed focus:outline-none";
  }

  if (isHidden) {
      return (
        <div className={`relative rounded-xl border-4 border-slate-900 bg-slate-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] flex items-center justify-center aspect-square ${className}`}>
             <div className="text-slate-600 animate-pulse">
                <Brain className="w-10 h-10 text-white opacity-50" />
            </div>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 10px, transparent 0, transparent 20px)' }}></div>
        </div>
      )
  }

  const handleCardClick = (e) => {
    if (status === 'normal' && onClick) {
      audioManager.playCardFlipSound();
      onClick(e);
    }
  };

  return (
    <button
      onClick={handleCardClick}
      onMouseLeave={(e) => {
        // 强制清除可能的 hover 状态
        e.currentTarget.blur();
      }}
      disabled={status !== 'normal'}
      className={`
        relative rounded-xl border-4 flex items-center justify-center aspect-square 
        transition-all duration-100 
        ${baseStyle} 
        ${status === 'normal' ? interactiveStyle : ''}
        ${status === 'correct' ? interactiveStyle : ''}
        ${className}
      `}
    >
      <div 
        className={`${size} leading-none select-none filter drop-shadow-sm`}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {content}
      </div>
    </button>
  );
};

export default function NBackGame() {
  const [gameState, setGameState] = useState('MENU');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const [totalStartTime, setTotalStartTime] = useState(0);
  const [totalTimePlayed, setTotalTimePlayed] = useState(0); 
  const [roundStartTime, setRoundStartTime] = useState(0);
  
  const [previousCard, setPreviousCard] = useState(null); 
  const [currentCard, setCurrentCard] = useState(null);   
  const [options, setOptions] = useState([]);             
  const [isCurrentCardHidden, setIsCurrentCardHidden] = useState(false);
  const hideTimerRef = useRef(null);
  const [feedback, setFeedback] = useState(null); 
  const [rating, setRating] = useState(null);
  const previousLevelRef = useRef(1);

  const difficulty = getDifficultyConfig(score);

  const generateCard = useCallback((forceNoRotation = false, specificIcon = null, excludeRotations = []) => {
    const icon = specificIcon || ICONS[Math.floor(Math.random() * ICONS.length)];
    let rotation = 0;
    const shouldRotate = (difficulty.rotate && !forceNoRotation);
    
    if (shouldRotate) {
        const availableRotations = ROTATIONS.filter(r => !excludeRotations.includes(r));
        rotation = availableRotations.length > 0 
           ? availableRotations[Math.floor(Math.random() * availableRotations.length)] 
           : ROTATIONS[0];
    }
    return { id: Math.random().toString(36).substr(2, 9), content: icon, rotation };
  }, [difficulty.rotate]);

  useEffect(() => {
    if (gameState === 'PLAYING' && difficulty.hideDelay) {
      setIsCurrentCardHidden(false);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        setIsCurrentCardHidden(true);
        audioManager.playHideSound();
      }, difficulty.hideDelay);
    } else {
      setIsCurrentCardHidden(false);
    }
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [currentCard, gameState, difficulty.hideDelay]);

  // 检测等级提升
  useEffect(() => {
    if (gameState === 'PLAYING' && difficulty.level > previousLevelRef.current) {
      audioManager.playLevelUpSound();
      previousLevelRef.current = difficulty.level;
    }
  }, [difficulty.level, gameState]);

  useEffect(() => {
    let interval;
    if (gameState === 'PLAYING' || gameState === 'MEMORIZE_FIRST') {
      interval = setInterval(() => {
        setTotalTimePlayed(Date.now() - totalStartTime);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [gameState, totalStartTime]);

  const startGame = () => {
    setScore(0);
    setTotalStartTime(Date.now());
    setTotalTimePlayed(0);
    previousLevelRef.current = 1;
    audioManager.playStartSound();
    const firstCard = generateCard(true); 
    setCurrentCard(firstCard);
    setGameState('MEMORIZE_FIRST');
  };

  const confirmFirstMemory = () => {
    audioManager.playClickSound();
    setPreviousCard(currentCard);
    const newCurrent = generateCard();
    setCurrentCard(newCurrent);
    generateOptions(currentCard, newCurrent, 0); 
    setRoundStartTime(Date.now());
    setGameState('PLAYING');
  };

  const generateOptions = (targetCard, distinctFromCard, currentScore) => {
    const config = getDifficultyConfig(currentScore);
    let newOptions = [];
    newOptions.push({ ...targetCard, id: 'correct-answer' });
    
    if (config.rotate && config.traps > 0) {
        let usedRotations = [targetCard.rotation];
        for (let i = 0; i < config.traps; i++) {
            const trap = generateCard(false, targetCard.content, usedRotations);
            if (!usedRotations.includes(trap.rotation)) {
                newOptions.push({ ...trap, id: `trap-${i}` });
                usedRotations.push(trap.rotation);
            }
        }
    }
    
    while (newOptions.length < config.optionsCount) {
      const distractor = generateCard();
      const isDuplicate = newOptions.some(opt => 
        opt.content === distractor.content && opt.rotation === distractor.rotation
      );
      const isContentDuplicate = newOptions.some(opt => opt.content === distractor.content);
      
      if (!isDuplicate) {
          if (!isContentDuplicate || newOptions.length >= ICONS.length) {
              newOptions.push(distractor);
          }
      }
    }
    newOptions = newOptions.sort(() => Math.random() - 0.5);
    setOptions(newOptions);
  };

  const handleOptionClick = (selectedOption) => {
    if (feedback) return;

    const reactionTime = Date.now() - roundStartTime;
    const currentRating = getRating(reactionTime);

    const isCorrect = selectedOption.content === previousCard.content && 
                      selectedOption.rotation === previousCard.rotation;

    if (isCorrect) {
      audioManager.playCorrectSound(reactionTime);
      setFeedback('correct');
      setRating(currentRating);
      const newScore = score + 1;
      setScore(newScore);
      
      setTimeout(() => {
        setFeedback(null);
        setRating(null);
        handleNextRound(newScore);
      }, 500);
    } else {
      audioManager.playWrongSound();
      setFeedback('wrong');
      if (score > highScore) setHighScore(score);
      setTimeout(() => {
        audioManager.playGameOverSound();
        setGameState('GAME_OVER');
        setFeedback(null);
      }, 1000);
    }
  };

  const handleNextRound = (currentScore) => {
    // 确保清除所有反馈状态
    setFeedback(null);
    setRating(null);
    
    const oldCurrent = currentCard;
    setPreviousCard(oldCurrent);
    const newCurrent = generateCard();
    setCurrentCard(newCurrent);
    generateOptions(oldCurrent, newCurrent, currentScore);
    setRoundStartTime(Date.now());
  };

  const getGridClass = () => {
    if (difficulty.optionsCount === 9) return "grid-cols-3 gap-2";
    if (difficulty.optionsCount === 6) return "grid-cols-3 gap-2";
    return "grid-cols-2 gap-3";
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] font-sans text-slate-900 flex flex-col items-center overflow-hidden touch-manipulation"
         style={{ backgroundImage: 'radial-gradient(#CBD5E1 2px, transparent 2px)', backgroundSize: '20px 20px' }}>
      
      {/* 顶部 HUD */}
      <div className="w-full max-w-lg z-20 px-4 pt-4 pb-2">
        <div className="bg-white border-4 border-slate-900 rounded-2xl p-3 flex justify-between items-center shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
           <div className="flex flex-col pl-1">
              <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">SCORE</span>
              <div className="text-3xl font-black text-indigo-600 leading-none">{score}</div>
           </div>
           <div className="flex flex-col items-center">
              <div className="bg-slate-900 text-white px-3 py-1 rounded-lg font-mono text-sm font-bold flex items-center gap-1.5 shadow-inner">
                  <Timer className="w-4 h-4 text-yellow-400" />
                  {formatTime(totalTimePlayed)}
              </div>
           </div>
           <div className="flex flex-col items-end pr-1">
               <div className={`px-2 py-1 rounded-lg text-xs font-black border-2 border-current flex items-center gap-1 ${difficulty.color} bg-white`}>
                   {difficulty.level >= 4 ? <Flame className="w-3 h-3 fill-current" /> : <Zap className="w-3 h-3 fill-current" />}
                   Lv.{difficulty.level} {difficulty.name}
               </div>
           </div>
        </div>
      </div>

      {/* 主游戏区域 */}
      <div className="w-full max-w-lg flex-1 flex flex-col p-4 relative z-10 min-h-0">
        
        {/* === 菜单 (移除动画以防崩溃) === */}
        {gameState === 'MENU' && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-8 py-4">
            <div className="space-y-4 text-center">
              <div className="relative inline-block transform -rotate-6 hover:rotate-0 transition-transform cursor-pointer">
                <div className="bg-indigo-500 p-8 rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
                  <Brain className="w-24 h-24 text-white" />
                </div>
                <div className="absolute -top-4 -right-4 text-4xl animate-bounce">✨</div>
              </div>
              <div>
                <h1 className="text-5xl font-black text-slate-900 tracking-tight mt-6" style={{ textShadow: '2px 2px 0px #CBD5E1' }}>
                  记忆回溯
                </h1>
                <div className="inline-block bg-yellow-300 px-3 py-1 rounded-full border-2 border-slate-900 text-xs font-bold mt-2 transform rotate-2">
                    挑战你的海马体！
                </div>
              </div>
            </div>

            <div className="w-full bg-white rounded-2xl border-4 border-slate-900 p-5 space-y-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 border-2 border-indigo-900 flex items-center justify-center text-indigo-700">
                      <EyeOff className="w-6 h-6"/>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-slate-900 text-sm">瞬时记忆</h3>
                    <p className="text-xs text-slate-500 font-bold mt-0.5">高难度下图片会<span className="text-rose-500">瞬间消失</span>！</p>
                  </div>
               </div>
               <div className="h-0.5 bg-slate-100 w-full border-b-2 border-dashed border-slate-300"></div>
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 border-2 border-amber-900 flex items-center justify-center text-amber-700">
                      <RotateCcw className="w-6 h-6"/>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-slate-900 text-sm">方向感</h3>
                    <p className="text-xs text-slate-500 font-bold mt-0.5">不仅看脸，还要看<span className="text-amber-600">朝向</span>！</p>
                  </div>
               </div>
            </div>

            <div className="w-full pt-4">
                <CartoonButton onClick={startGame} className="w-full text-xl py-4 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:shadow-none">
                    <Play className="w-6 h-6 fill-current" /> 开始挑战
                </CartoonButton>
            </div>
          </div>
        )}

        {/* === 第一轮记忆 (增加 currentCard 保护) === */}
        {gameState === 'MEMORIZE_FIRST' && currentCard && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-fade-in">
            <div className="text-center">
              <div className="inline-block bg-indigo-100 text-indigo-800 text-sm font-black px-4 py-1.5 rounded-full border-2 border-indigo-900 mb-4">
                ROUND 1
              </div>
              <h2 className="text-3xl font-black text-slate-900">记住这张图!</h2>
            </div>

            <div className="p-8 bg-white rounded-[2.5rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] transform hover:scale-105 transition-transform duration-300">
              <Card 
                content={currentCard.content} 
                rotation={currentCard.rotation} 
                className="w-32 h-32 text-8xl pointer-events-none border-none shadow-none bg-transparent" 
              />
            </div>

            <CartoonButton onClick={confirmFirstMemory} variant="success" className="px-12 text-xl shadow-[6px_6px_0px_0px_rgba(6,78,59,1)]">
              记住了，Go!
            </CartoonButton>
          </div>
        )}

        {/* === 游戏主循环 (增加 currentCard 保护) === */}
        {gameState === 'PLAYING' && currentCard && (
          <div className="flex-1 flex flex-col h-full min-h-0">
            
            {/* 记忆显示器 */}
            <div className="flex-none bg-slate-900 rounded-2xl border-4 border-slate-900 p-4 mb-5 relative overflow-hidden flex items-center gap-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,0.3)]">
               <div className="flex-none relative">
                 <div className="absolute inset-0 bg-white rounded-xl transform translate-x-1 translate-y-1 opacity-20"></div>
                 <Card 
                   content={currentCard.content} 
                   rotation={currentCard.rotation} 
                   isHidden={isCurrentCardHidden}
                   className={`w-20 h-20 pointer-events-none transition-all duration-300 z-10 border-2 ${isCurrentCardHidden ? 'scale-95 opacity-90' : 'scale-100'}`}
                   size="text-5xl"
                 />
               </div>
               
               <div className="flex-1 flex flex-col justify-center min-w-0">
                  <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black text-green-400 uppercase tracking-widest flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse border border-green-300"></div>
                         REC • MEMORY
                      </span>
                  </div>
                  <div className={`text-base font-black leading-tight transition-colors duration-300 ${isCurrentCardHidden ? 'text-slate-500' : 'text-white'}`}>
                      {isCurrentCardHidden ? "信号丢失...靠你了！" : "记住这个家伙！"}
                  </div>
                  {difficulty.hideDelay && !isCurrentCardHidden && (
                      <div className="w-full h-2 bg-slate-800 mt-3 rounded-full overflow-hidden border border-slate-700">
                          <div 
                            className="h-full bg-amber-400 animate-shrink"
                            style={{ animationDuration: `${difficulty.hideDelay}ms` }}
                          />
                      </div>
                  )}
               </div>
            </div>

            {/* 选择区 */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <span className="text-slate-900 font-black text-xl flex items-center gap-2">
                       <span className="text-indigo-600 bg-indigo-100 px-2 rounded border-2 border-indigo-200">找</span> 上一轮的图
                    </span>
                </div>
                {difficulty.optionsCount > 4 && (
                    <span className="text-[10px] font-black text-rose-600 bg-rose-100 border-2 border-rose-200 px-2 py-0.5 rounded-md">
                        {difficulty.optionsCount} 选 1
                    </span>
                )}
              </div>
              
              <div className={`grid ${getGridClass()} flex-1 content-start auto-rows-fr`}>
                {options.map((opt, idx) => {
                  let displayStatus = 'normal';
                  if (feedback) {
                      if (opt.id === 'correct-answer') displayStatus = 'correct';
                      else displayStatus = 'disabled';
                  }

                  return (
                    <Card 
                      key={`${opt.id}-${idx}-${roundStartTime}`}
                      content={opt.content}
                      rotation={opt.rotation}
                      status={displayStatus}
                      onClick={() => handleOptionClick(opt)}
                      size={difficulty.optionsCount >= 9 ? "text-3xl" : "text-5xl"}
                      className={`w-full h-full max-h-32 ${difficulty.optionsCount >= 6 ? 'min-h-[70px]' : 'min-h-[100px]'}`}
                    />
                  )
                })}
              </div>
            </div>

            {/* 浮动评价 */}
            {rating && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none animate-popup">
                    <div className="bg-white px-8 py-4 rounded-full border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center transform rotate-6">
                        <span className="text-5xl mb-1 absolute -top-8 -left-6 transform -rotate-12">{rating.icon}</span>
                        <span 
                           className={`text-4xl font-black italic tracking-tighter ${rating.color} stroke-black`}
                           style={{ textShadow: '2px 2px 0px #000' }}
                        >
                           {rating.text}
                        </span>
                    </div>
                </div>
            )}

            {/* 错误反馈 */}
            {feedback === 'wrong' && (
              <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none bg-rose-500/20 backdrop-blur-[2px]">
                 <div className="transform scale-150 p-6 rounded-3xl bg-white text-rose-500 shadow-[8px_8px_0px_0px_#881337] border-4 border-rose-900 animate-shake">
                    <X className="w-16 h-16 stroke-[3px]" />
                 </div>
              </div>
            )}
          </div>
        )}

        {/* === 游戏结束 === */}
        {gameState === 'GAME_OVER' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-fade-in py-8">
            <div className="relative transform rotate-3">
               <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 rounded-full opacity-20"></div>
               <Trophy className="w-32 h-32 text-yellow-400 drop-shadow-[2px_2px_0px_#000] stroke-black stroke-2" />
               <div className="absolute -top-2 -right-2 text-4xl animate-bounce">💀</div>
            </div>
            
            <div className="space-y-1">
              <h2 className="text-5xl font-black text-slate-900" style={{ textShadow: '2px 2px 0px #CBD5E1' }}>GAME OVER</h2>
              <div className="inline-block bg-slate-900 text-white px-3 py-1 rounded font-mono font-bold text-sm">
                  TIME: {formatTime(totalTimePlayed)}
              </div>
            </div>

            <div className="w-full bg-white rounded-2xl border-4 border-slate-900 p-6 grid grid-cols-2 gap-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
               <div className="flex flex-col items-center border-r-2 border-slate-100 pr-2">
                  <span className="text-slate-400 text-xs font-black uppercase tracking-wider mb-1">SCORE</span>
                  <span className="text-5xl font-black text-indigo-600">{score}</span>
               </div>
               <div className="flex flex-col items-center pl-2">
                  <span className="text-slate-400 text-xs font-black uppercase tracking-wider mb-1">BEST</span>
                  <span className="text-5xl font-black text-yellow-500" style={{ textShadow: '1px 1px 0px #000' }}>{highScore}</span>
               </div>
            </div>

            <CartoonButton onClick={startGame} className="w-full text-xl py-4 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:shadow-none">
              <RotateCcw className="w-6 h-6 stroke-[3px]" /> 再玩一局
            </CartoonButton>
          </div>
        )}

      </div>
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-shrink {
          animation-name: shrink;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
        @keyframes popup {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.1) rotate(5deg); opacity: 1; }
          75% { transform: translate(-50%, -50%) scale(0.95) rotate(-2deg); }
          100% { transform: translate(-50%, -50%) scale(1) rotate(6deg); opacity: 0; }
        }
        .animate-popup {
           animation: popup 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes shake {
          0%, 100% { transform: scale(1.5) rotate(0deg); }
          25% { transform: scale(1.5) rotate(-10deg); }
          75% { transform: scale(1.5) rotate(10deg); }
        }
        .animate-shake {
           animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}