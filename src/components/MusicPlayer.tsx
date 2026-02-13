"use client";

// TODO: Import dependencies yang diperlukan
import { motion, useMotionValue } from "motion/react";
import { EqualizerBar } from "./ui/EqualizerBar";
import { GetAudioFile } from "./GetAudioFile";
import type { Tags } from "jsmediatags/dist/jsmediatags.min.js";
import { useState, useEffect, useRef } from "react";
import { useAudioAnalyser } from "@/hooks/useAudioAnalyser";
import { pictureToUrl } from "./utilities/PictureToUrl";
import { AudioControl } from "./AudioControl";
import { animate, stagger } from "motion";

const NORMALIZEDIV = 5;

export function MusicPlayer() {
  // TODO: Implementasikan state management untuk playing, paused, loading
  const bass1MV = useRef(useMotionValue(0)).current;
  const bass2MV = useRef(useMotionValue(0)).current;
  const mid1MV = useRef(useMotionValue(0)).current;
  const mid2MV = useRef(useMotionValue(0)).current;
  const trebleMV = useRef(useMotionValue(0)).current;
  const animateRef = useRef<any>(null);

  const [tags, setTags] = useState<Tags | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const { audioRef, resumeAudio, isBeat } = useAudioAnalyser({
    bass1MV,
    bass2MV,
    mid1MV,
    mid2MV,
    trebleMV,
  });

  useEffect(() => {
    const player = audioRef.current;
    if (!player) return;

    const updateStatus = () => setIsPaused(player.paused);

    // Listen for native audio events
    player.addEventListener("play", updateStatus);
    player.addEventListener("pause", updateStatus);

    return () => {
      player.removeEventListener("play", updateStatus);
      player.removeEventListener("pause", updateStatus);
      if (artworkUrl) {
        URL.revokeObjectURL(artworkUrl);
      }
    };
  }, []);

  // TODO: Implementasikan handler untuk play/pause

  // TODO: Implementasikan komponen music player sesuai desain Figma
  // Struktur yang perlu dibuat:
  // - Container dengan background dan shadow animations
  // - Album artwork dengan rotation dan scale animations
  // - Equalizer bars dengan stagger effect
  // - Progress bar dengan fill animation
  // - Control buttons (play/pause, skip, volume)
  useEffect(() => {
    const bars = document.querySelectorAll(".bar");
    if (isPaused) {
      animateRef.current = animate(
        bars,
        // { transform: "translateY(-10px)" },  transform collides the initial scaleY styling of the bar
        { y: -20 },
        {
          duration: 1,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
          delay: stagger(0.2, { startDelay: -0.5 }),
        },
      );
    }
    return () => {
      if (animateRef.current) {
        animateRef.current.stop();
        animateRef.current = null;
        // animate(bars, { transform: "translateY(0px)" }, { duration: 0 });
        animate(bars, { y: 0 }, { duration: 0 });
      }
    };
  }, [isPaused]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* TODO: Implementasikan music player di sini */}

      <div
        className="relative flex flex-col items-center w-125 h-93.5 rounded-2xl p-xl gap-4"
        style={
          isPaused || !audioUrl
            ? {
                backgroundColor: "#0F0F0F",
              }
            : {
                backgroundColor: "#1A1A1A",
                boxShadow: "0px 0px 40px 0px #8B5CF64D",
                filter: "brightness(1.2) contrast(1.1)",
              }
        }
      >
        <div
          className={`${audioUrl ? "hidden" : "block"} absolute w-125 h-93.5 rounded-2xl z-10 bg-[#0F0F0F]/50`}
        />
        <div className="flex flex-col">
          <GetAudioFile
            onMetadata={(tags, file) => {
              setTags(tags);
              setAudioUrl(URL.createObjectURL(file));

              if (tags.picture) {
                const url = pictureToUrl(tags.picture);
                // console.log("AWUrl:", url);
                setArtworkUrl(url);
              } else {
                setArtworkUrl(null);
              }
            }}
          />
          <div className="flex flex-col justify-between w-117 h-35.5">
            <div className="relative flex flex-row w-117 h-30 gap-6">
              <motion.img
                initial={{
                  scale: 1,
                  boxShadow: "0px 0px 0px 0px rgba(124, 58, 237, 0)",
                }}
                animate={{
                  scale: isBeat ? 1.05 : 1,
                  filter: isBeat
                    ? "brightness(1.2) contrast(1.1)"
                    : "brightness(1) contrast(1)",
                  boxShadow: isBeat
                    ? "0px 0px 30px 5px rgba(124, 58, 237, 0.6)"
                    : "0px 0px 0px 0px rgba(124, 58, 237, 0)",
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                  mass: 0.5,
                }}
                src={artworkUrl ?? "/assets/Album-Art.png"}
                alt={tags?.album ?? "Album artwork"}
                className="flex size-30 rounded-xl"
              />
              <div className="flex flex-col justify-center gap-1.25">
                <div className="text-lg font-semibold text-neutral-100">
                  {tags?.title ?? "Song Title"}
                </div>
                <div className="text-sm text-neutral-400">
                  {tags?.artist ?? "Artist"}
                </div>
                {/* <div>{tags?.album ?? "No Album"}</div> */}
              </div>
            </div>
            <div className="absolute flex pl-36 mt-27.5">
              <div className="flex flex-row w-14 h-8 gap-1 justify-center">
                <EqualizerBar toneMV={bass1MV} offset={audioUrl ? 0.2 : 0.5} />
                <EqualizerBar toneMV={bass2MV} offset={audioUrl ? 0.2 : 0.5} />
                <EqualizerBar toneMV={mid1MV} offset={audioUrl ? 0.2 : 0.5} />
                <EqualizerBar toneMV={mid2MV} offset={audioUrl ? 0.2 : 0.5} />
                <EqualizerBar toneMV={trebleMV} offset={audioUrl ? 0.2 : 0.5} />
              </div>
            </div>
          </div>
        </div>
        <AudioControl
          audioRef={audioRef}
          src={audioUrl ?? undefined}
          onPlay={resumeAudio}
        />
      </div>
    </div>
  );
}
