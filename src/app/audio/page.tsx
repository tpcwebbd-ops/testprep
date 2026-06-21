'use client';

import Image from 'next/image';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, Loader2, AlertCircle, Smartphone, Music, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Easily configurable audio source
const AUDIO_SRC = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
const AUDIO_TITLE = 'Enigmatic Horizon';
const AUDIO_ARTIST = 'Ambient Soundscapes';
const AUDIO_ALBUM = 'Echoes of Eternity';
const AUDIO_ARTWORK_URL = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60';

export default function AudioPlayerPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Player state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPwaTip, setShowPwaTip] = useState<boolean>(true);
  const [userInteracted, setUserInteracted] = useState<boolean>(false);

  // Time formatter (mm:ss)
  const formatTime = (timeInSeconds: number): string => {
    if (isNaN(timeInSeconds)) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Setup Media Session API (for lock screen & background controls)
  const updateMediaSession = useCallback(() => {
    if (typeof window !== 'undefined' && 'mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: AUDIO_TITLE,
        artist: AUDIO_ARTIST,
        album: AUDIO_ALBUM,
        artwork: [{ src: AUDIO_ARTWORK_URL, sizes: '512x512', type: 'image/jpeg' }],
      });

      // Update position state for systems that support it
      try {
        navigator.mediaSession.setPositionState({
          duration: duration || 0,
          playbackRate: 1.0,
          position: currentTime || 0,
        });
      } catch (error) {
        // Position state might throw if mismatched parameters are passed during load
        console.error('Failed to update mediaSession position state:', error);
      }
    }
  }, [duration, currentTime]);

  // Playback handlers
  const handlePlay = useCallback(async () => {
    setUserInteracted(true);
    if (!audioRef.current) return;

    try {
      setErrorMsg(null);
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err: unknown) {
      console.error('Action/Autoplay block:', err);
      setIsPlaying(false);
      setErrorMsg('Playback was blocked or failed. Please interact with the screen first to grant browser audio permissions.');
    }
  }, []);

  const handlePause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const togglePlayPause = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  // Seeking forward / backward (seconds)
  const seek = useCallback((seconds: number) => {
    if (!audioRef.current) return;
    let targetTime = audioRef.current.currentTime + seconds;
    if (targetTime < 0) targetTime = 0;
    if (targetTime > duration) targetTime = duration;

    audioRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
  }, [duration]);

  // Seek bar scrubber manual change
  const handleScrubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const targetValue = parseFloat(e.target.value);
    audioRef.current.currentTime = targetValue;
    setCurrentTime(targetValue);
  };

  // Volume slider manual change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      audioRef.current.muted = newVolume === 0;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    audioRef.current.muted = newMuteState;
    if (!newMuteState && volume === 0) {
      // Restore default audible volume if unmuting a zeroed slider
      setVolume(0.5);
      audioRef.current.volume = 0.5;
    }
  };

  // Media Session action callbacks
  useEffect(() => {
    if (typeof window !== 'undefined' && 'mediaSession' in navigator) {
      const ms = navigator.mediaSession;

      try {
        ms.setActionHandler('play', handlePlay);
        ms.setActionHandler('pause', handlePause);
        ms.setActionHandler('seekbackward', () => seek(-10));
        ms.setActionHandler('seekforward', () => seek(10));

        // Handle direct scrubbing from lockscreen controls if supported
        ms.setActionHandler('seekto', details => {
          if (audioRef.current && details.seekTime !== undefined) {
            audioRef.current.currentTime = details.seekTime;
            setCurrentTime(details.seekTime);
          }
        });
      } catch (err) {
        console.warn('Media Session API action handlers rejected:', err);
      }
    }
  }, [handlePlay, handlePause, seek]);

  // Audio lifecycle & setup
  useEffect(() => {
    const audioObj = audioRef.current;
    if (!audioObj) return;

    // Loading & duration readiness info
    const onLoadedMetadata = () => {
      setDuration(audioObj.duration);
      setIsLoading(false);
      setErrorMsg(null);
    };

    const onTimeUpdate = () => {
      setCurrentTime(audioObj.currentTime);
    };

    const onCanPlay = () => {
      setIsLoading(false);
    };

    const onWaiting = () => {
      setIsLoading(true);
    };

    const onPlaying = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };

    const onPause = () => {
      setIsPlaying(false);
    };

    const onError = (e: Event) => {
      console.error('Audio error event:', e);
      setIsLoading(false);
      setErrorMsg('Failed to stream background audio. Please verify your internet connection or the audio source URL.');
    };

    // Attach native media listeners
    audioObj.addEventListener('loadedmetadata', onLoadedMetadata);
    audioObj.addEventListener('timeupdate', onTimeUpdate);
    audioObj.addEventListener('canplay', onCanPlay);
    audioObj.addEventListener('waiting', onWaiting);
    audioObj.addEventListener('playing', onPlaying);
    audioObj.addEventListener('pause', onPause);
    audioObj.addEventListener('error', onError);

    // Apply initial configuration safely
    audioObj.volume = volume;
    audioObj.muted = isMuted;

    return () => {
      audioObj.removeEventListener('loadedmetadata', onLoadedMetadata);
      audioObj.removeEventListener('timeupdate', onTimeUpdate);
      audioObj.removeEventListener('canplay', onCanPlay);
      audioObj.removeEventListener('waiting', onWaiting);
      audioObj.removeEventListener('playing', onPlaying);
      audioObj.removeEventListener('pause', onPause);
      audioObj.removeEventListener('error', onError);
    };
  }, [volume, isMuted]);

  // Update Media Session state when duration or currentTime changes
  useEffect(() => {
    updateMediaSession();
  }, [updateMediaSession]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 md:p-8 font-sans antialiased relative overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Absolute Ambient Background Lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Container */}
      <header className="w-full max-w-md mx-auto text-center py-4 z-10 flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-cyan-400 animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-widest text-slate-400 font-semibold">PWA Background Player</span>
        </div>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[10px] text-slate-400 font-mono tracking-wider">SECURE LIVE</span>
        </div>
      </header>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        preload="metadata"
        playsInline // CRITICAL for keeping audio inline instead of native full-screen wrapper inside Safari
      />

      {/* Content Center */}
      <main className="flex-1 w-full max-w-md mx-auto flex flex-col justify-center py-8 z-10">
        {/* Error notification banner if any */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 rounded-xl bg-rose-500/15 border border-rose-500/25 text-rose-300 text-sm flex gap-3 items-start"
            >
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <div>
                <p className="font-medium">Playback Alert</p>
                <p className="text-xs text-rose-300/80 mt-1 leading-relaxed">{errorMsg}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Art, Wave and Status Canvas */}
        <div className="relative mb-8 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 aspect-square flex flex-col items-center justify-center shadow-2xl backdrop-blur-md group overflow-hidden">
          {/* Animated Glow Border */}
          <div
            className={`absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-transparent to-violet-500/20 transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-30'}`}
          />

          {/* Interactive vinyl-like image or artwork */}
          <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-2xl mb-6 border-2 border-white/5">
            <Image
              src={AUDIO_ARTWORK_URL}
              alt={AUDIO_TITLE}
              fill
              sizes="(min-width: 768px) 224px, 192px"
              className={`object-cover select-none transition-transform duration-10000 ease-linear ${isPlaying ? 'scale-105' : 'scale-100'}`}
              referrerPolicy="no-referrer"
              priority
            />

            {/* Play state indicator layer */}
            <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center backdrop-blur-[2px]">
              {isLoading ? (
                <div className="p-4 rounded-full bg-slate-950/80 shadow-lg border border-slate-800 text-cyan-400 animate-spin">
                  <Loader2 className="w-8 h-8" />
                </div>
              ) : (
                <motion.div
                  animate={{
                    scale: isPlaying ? [1, 1.05, 1] : 1,
                    rotate: isPlaying ? 360 : 0,
                  }}
                  transition={{
                    scale: { repeat: Infinity, duration: 4 },
                    rotate: { repeat: Infinity, duration: 25, ease: 'linear' },
                  }}
                  className={`w-20 h-20 rounded-full border border-white/10 flex items-center justify-center ${isPlaying ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-950/80 text-white'}`}
                >
                  <Music className="w-8 h-8" />
                </motion.div>
              )}
            </div>
          </div>

          {/* Titles & Info */}
          <div className="text-center w-full z-10 px-2">
            <h1 className="text-xl font-semibold tracking-tight text-white line-clamp-1">{AUDIO_TITLE}</h1>
            <p className="text-cyan-400/90 text-sm mt-1 font-medium">{AUDIO_ARTIST}</p>
            <p className="text-slate-400 text-xs mt-0.5 font-mono tracking-tight">{AUDIO_ALBUM}</p>
          </div>

          {/* Live Waveform Visualization Bars */}
          <div className="flex gap-1.5 justify-center items-end h-8 mt-4">
            {Array.from({ length: 16 }).map((_, i) => {
              const delay = i * 0.12;
              const duration = 0.8 + Math.random() * 0.7;
              return (
                <motion.div
                  key={i}
                  className={`w-1 rounded-full ${isPlaying ? 'bg-cyan-400' : 'bg-slate-700'}`}
                  animate={isPlaying ? { height: ['8px', '28px', '8px'] } : { height: '4px' }}
                  transition={{
                    repeat: Infinity,
                    duration: duration,
                    delay: delay,
                    ease: 'easeInOut',
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Audio Slider Controls */}
        <div className="space-y-3 mb-8 bg-slate-900/40 p-5 rounded-2xl border border-white/5 backdrop-blur-sm">
          {/* Progress Slider Track */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleScrubChange}
              disabled={isLoading || duration === 0}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none transition-all disabled:opacity-50"
              style={{
                background: `linear-gradient(to right, #22d3ee ${(currentTime / (duration || 100)) * 100}%, #1e293b ${(currentTime / (duration || 100)) * 100}%)`,
              }}
            />
          </div>

          {/* Volume Control Box */}
          <div className="flex items-center justify-between pt-1 border-t border-white/5 gap-3">
            <button onClick={toggleMute} className="text-slate-400 hover:text-cyan-400 transition-colors p-1" aria-label={isMuted ? 'Unmute' : 'Mute'}>
              {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="flex-1 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
              style={{
                background: `linear-gradient(to right, #22d3ee ${(isMuted ? 0 : volume) * 100}%, #1e293b ${(isMuted ? 0 : volume) * 100}%)`,
              }}
            />
            <span className="text-xs font-mono text-slate-400 w-8 text-right">{Math.round((isMuted ? 0 : volume) * 100)}%</span>
          </div>
        </div>

        {/* Master Control Buttons */}
        <div className="flex justify-center items-center gap-6 mb-8">
          {/* Seek Backward 10s */}
          <button
            onClick={() => seek(-10)}
            disabled={isLoading}
            className="p-3 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-slate-700 transition-all active:scale-95 disabled:opacity-50"
            title="Backward 10s"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          {/* Master Play / Pause Button with morphing size */}
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={togglePlayPause}
            disabled={isLoading && !userInteracted}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all border outline-none ${
              isPlaying
                ? 'bg-gradient-to-tr from-cyan-600 to-indigo-600 border-cyan-400/30 text-white shadow-cyan-500/10 hover:shadow-cyan-500/20'
                : 'bg-white border-white text-slate-950 hover:bg-slate-200'
            } disabled:opacity-50`}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-7 h-7 fill-white text-white" /> : <Play className="w-7 h-7 fill-slate-950 text-slate-950 ml-1" />}
          </motion.button>

          {/* Seek Forward 10s */}
          <button
            onClick={() => seek(10)}
            disabled={isLoading}
            className="p-3 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-slate-700 transition-all active:scale-95 disabled:opacity-50"
            title="Forward 10s"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Informative Instructions for Background Audio */}
        <AnimatePresence>
          {showPwaTip && (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-cyan-500/20 rounded-2xl p-5 shadow-xl relative"
            >
              <button
                onClick={() => setShowPwaTip(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-md"
                aria-label="Close tips"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex gap-2.5 items-center mb-3">
                <Smartphone className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold text-sm text-white flex items-center gap-1.5">
                  How Background Sync Works
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold uppercase tracking-wider">
                    PWA Best Practice
                  </span>
                </h3>
              </div>

              <ul className="space-y-2 text-xs text-slate-400 leading-relaxed pl-1">
                <li className="flex gap-2 items-start">
                  <span className="text-cyan-400 font-bold font-mono">1.</span>
                  <span>
                    <strong>Locking & Switching:</strong> The app utilizes the universal <strong>HTML5 Audio API</strong> with absolute visibility bypass to
                    ensure standard continuous background play when you locks screen or switches apps.
                  </span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="text-cyan-400 font-bold font-mono">2.</span>
                  <span>
                    <strong>Media Session Widget:</strong> Control playback directly via Android notification shades, Windows controls, or iOS Dynamic Islands
                    using natively wrapped Media Handlers.
                  </span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="text-cyan-400 font-bold font-mono">3.</span>
                  <span>
                    <strong>Interactivity Mandate:</strong> Mobile OS and desktop browsers block audio autoplay. You must trigger playback by physically
                    clicking the <strong>Play button</strong>.
                  </span>
                </li>
              </ul>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1 text-cyan-400/80">
                  <Sparkles className="w-3.5 h-3.5" /> Ideal for offline PWAs
                </span>
                <span className="text-[10px]">HTML5 + MediaSession API Ready</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer copyright and note block */}
      <footer className="w-full max-w-md mx-auto text-center py-4 z-10 border-t border-white/5 mt-8">
        <p className="text-[11px] text-slate-500 font-mono leading-relaxed">Powered by seamless browser system background context handlers.</p>
        <p className="text-[10px] text-slate-600 mt-1">Background continuous audio relies heavily on mobile OS thread scheduling policies.</p>
      </footer>
    </div>
  );
}
