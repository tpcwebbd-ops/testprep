// components/video-management/VideoPlayer.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward, Settings, ArrowLeft, Download } from 'lucide-react';
import { UploadedVideo } from './store/type';

interface VideoPlayerProps {
  video: UploadedVideo;
  onBack: () => void;
}

const VideoPlayer = ({ video, onBack }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPlaying && showControls) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, showControls]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    if (!videoRef.current) return;
    const time = value[0];
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!videoRef.current) return;
    const vol = value[0];
    videoRef.current.volume = vol;
    setVolume(vol);
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const skip = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += seconds;
  };

  const changePlaybackRate = (rate: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-white/60 backdrop-blur-md">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h3 className="font-semibold text-lg text-gray-900">{video.name}</h3>
      </div>

      <div
        ref={containerRef}
        className="relative bg-black rounded-2xl overflow-hidden shadow-2xl group"
        onMouseMove={() => setShowControls(true)}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        <video ref={videoRef} src={video.url} className="w-full aspect-video" onClick={togglePlay} />

        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="text-white font-medium drop-shadow-lg">{video.name}</div>
            <Button variant="ghost" size="icon" onClick={() => window.open(video.url, '_blank')} className="text-white hover:bg-white/20">
              <Download className="h-5 w-5" />
            </Button>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-white text-sm font-medium min-w-[60px]">{formatTime(currentTime)}</span>
              <Slider value={[currentTime]} max={duration || 100} step={0.1} onValueChange={handleSeek} className="flex-1" />
              <span className="text-white text-sm font-medium min-w-[60px] text-right">{formatTime(duration)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white hover:bg-white/20 h-12 w-12">
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>

                <Button variant="ghost" size="icon" onClick={() => skip(-10)} className="text-white hover:bg-white/20">
                  <SkipBack className="h-5 w-5" />
                </Button>

                <Button variant="ghost" size="icon" onClick={() => skip(10)} className="text-white hover:bg-white/20">
                  <SkipForward className="h-5 w-5" />
                </Button>

                <div className="flex items-center gap-2 ml-2 group/volume">
                  <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-white/20">
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                  <div className="w-0 group-hover/volume:w-24 overflow-hidden transition-all duration-300">
                    <Slider value={[isMuted ? 0 : volume]} max={1} step={0.01} onValueChange={handleVolumeChange} className="w-24" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)} className="text-white hover:bg-white/20">
                    <Settings className="h-5 w-5" />
                  </Button>

                  {showSettings && (
                    <div className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-md rounded-lg p-2 min-w-[120px]">
                      <div className="text-white text-sm font-medium mb-2 px-2">Playback Speed</div>
                      {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(rate => (
                        <button
                          key={rate}
                          onClick={() => changePlaybackRate(rate)}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                            playbackRate === rate ? 'bg-purple-600 text-white' : 'text-white hover:bg-white/10'
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
                  {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
