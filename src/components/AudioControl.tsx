"use client";
import { useState, useEffect } from "react";
import { formatTime } from "./utilities/SecondsToTime";
import { motion } from "motion/react";

type AudioControlProps = {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  src?: string | undefined;
  onPlay?: () => Promise<void>;
};

export function AudioControl({ audioRef, src, onPlay }: AudioControlProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);

  //   console.log("AudioControl audioRef:", audioRef);
  const isFile = Boolean(src);
  const audio = audioRef.current;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      //   console.log("Audio finished");
      setIsPlaying(false);
      // nextTrack();
      // resetUI();
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = async () => {
    if (!audio) return;

    await onPlay?.();

    if (audio.paused) {
      await audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }

    // console.log("Audio:", audio);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = Math.min(1, Math.max(0, val));
      setVolume(val);
    }
  };

  return (
    <div className="flex flex-col w-full h-152 gap-4">
      <audio
        ref={audioRef}
        src={src ?? undefined}
        //   controls
        // onPlay={onPlay}
        preload="none"
        // muted
      />
      {/* Progress Bar */}
      <div className="flex w-full h-2 bg-gray-800 rounded-full">
        <motion.div
          style={{
            scaleX: currentTime / duration,
            transformOrigin: "left",
            boxShadow: "0px 0px 30px 5px rgba(124, 58, 237, 0.6)",
          }}
          className="flex w-full h-2 bg-primary-200 rounded-l-full rounded-r-none"
        />
      </div>
      {/* Progress Time */}
      <div className="flex justify-between items-center w-full h-6">
        <div className="flex text-xs text-neutral-500">
          {formatTime(currentTime)}
        </div>
        <div className="flex text-xs text-neutral-500">
          {formatTime(duration)}
        </div>
      </div>
      {/* Controller */}
      <div className="flex w-full h-14 justify-center items-center gap-4 ">
        <img
          src="/assets/icon-Shuffle.svg"
          alt="Shuffle"
          className="size-9 p-2 rounded-md cursor-pointer"
        />
        <img
          src="/assets/icon-Back.svg"
          alt="Previous"
          className="size-9 p-2 rounded-md cursor-pointer"
        />
        <img
          src={isPlaying ? "/assets/icon-Pause.svg" : "/assets/icon-Play.svg"}
          alt={isPlaying ? "Pause" : "Play"}
          onClick={isFile ? togglePlay : undefined}
          className={`flex justify-center items-center size-14 rounded-full p-4 ${isFile ? (isPlaying ? "bg-primary-200 cursor-pointer" : "bg-primary-300 cursor-pointer") : "bg-neutral-500 cursor-not-allowed"}`}
        />
        <img
          src="/assets/icon-Forward.svg"
          alt="Next"
          className="size-9 p-2 rounded-md cursor-pointer"
        />
        <img
          src="/assets/icon-Repeat.svg"
          alt="Repeat"
          className="size-9 p-2 rounded-md cursor-pointer"
        />
      </div>
      {/* Volume */}
      <div className="flex items-center w-full h-4 gap-2 ">
        <img src="/assets/icon-Volume.svg" alt="Volume" className="size-4" />
        <div className="relative flex w-111 h-1 bg-neutral-800 rounded-full">
          <div
            className="absolute flex h-full bg-neutral-500 rounded-full"
            style={{ width: `${volume * 100}%` }}
          />
          <input
            disabled={!isFile}
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            //   defaultValue={0.5}
            onChange={handleVolume}
            className="absolute flex items-center w-full h-1 appearance-none bg-transparent cursor-pointer z-10 
               [&::-webkit-slider-thumb]:appearance-none
               [&::-webkit-slider-thumb]:size-2
               [&::-webkit-slider-thumb]:object-center
               [&::-webkit-slider-thumb]:rounded-full
               [&::-webkit-slider-thumb]:bg-primary-100
               [&::-webkit-slider-thumb]:border
               [&::-webkit-slider-thumb]:border-primary-300
               [&::-webkit-slider-thumb]:shadow-[0_0_60px_10px_rgba(124, 58, 237, 0.6)]"
          />
        </div>
      </div>
    </div>
  );
}
