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

const NORMALIZEDIV = 5;

export function MusicPlayer() {
  // TODO: Implementasikan state management untuk playing, paused, loading
  const bass1MV = useRef(useMotionValue(0)).current;
  const bass2MV = useRef(useMotionValue(0)).current;
  const mid1MV = useRef(useMotionValue(0)).current;
  const mid2MV = useRef(useMotionValue(0)).current;
  const trebleMV = useRef(useMotionValue(0)).current;
  // const { audioRef, bands, isBeat, resumeAudio, maxBass } = useAudioAnalyser();
  const { audioRef, resumeAudio, isBeat } = useAudioAnalyser({
    bass1MV,
    bass2MV,
    mid1MV,
    mid2MV,
    trebleMV,
  });

  const [tags, setTags] = useState<Tags | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (artworkUrl) {
        URL.revokeObjectURL(artworkUrl);
      }
    };
  }, []);

  // const normalizedBass1 = bands.bass1 / NORMALIZEDIV;
  // const normalizedBass2 = bands.bass2 / NORMALIZEDIV;
  // const normalizedMid1 = bands.mid1 / NORMALIZEDIV;
  // const normalizedMid2 = bands.mid2 / NORMALIZEDIV;
  // const normalizedTreble = bands.treble / NORMALIZEDIV;

  // TODO: Implementasikan handler untuk play/pause

  // TODO: Implementasikan komponen music player sesuai desain Figma
  // Struktur yang perlu dibuat:
  // - Container dengan background dan shadow animations
  // - Album artwork dengan rotation dan scale animations
  // - Equalizer bars dengan stagger effect
  // - Progress bar dengan fill animation
  // - Control buttons (play/pause, skip, volume)

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {/* TODO: Implementasikan music player di sini */}

      <div
        className="flex flex-col items-center w-125 h-93.5 bg-[#1A1A1A] font-normal text-white rounded-2xl p-xl"
        style={{
          boxShadow: "0px 0px 40px 0px #8B5CF64D",
          filter: "brightness(1.2) contrast(1.1)",
        }}
      >
        <GetAudioFile
          onMetadata={(tags, file) => {
            setTags(tags);
            setAudioUrl(URL.createObjectURL(file));

            if (tags.picture) {
              const url = pictureToUrl(tags.picture);
              // console.log("AWUrl:", url);
              setArtworkUrl(url);
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
                {tags?.title ?? "No Title"}
              </div>
              <div className="text-sm text-neutral-400">
                {tags?.artist ?? "No Artist"}
              </div>
              {/* <div>{tags?.album ?? "No Album"}</div> */}
            </div>
          </div>
          <div className="absolute flex pl-36 mt-23.5">
            <div className="flex flex-row w-14 h-8 gap-1 justify-center">
              <EqualizerBar toneMV={bass1MV} />
              <EqualizerBar toneMV={bass2MV} />
              <EqualizerBar toneMV={mid1MV} />
              <EqualizerBar toneMV={mid2MV} />
              <EqualizerBar toneMV={trebleMV} />
            </div>
          </div>
        </div>
        <audio
          ref={audioRef}
          src={audioUrl ?? undefined}
          controls
          onPlay={resumeAudio}
          preload="none"
          muted
        />
        {/* <AudioControl /> */}
        {/* <div className="flex"> {isBeat ? "🔥" : ""}</div> */}
      </div>
    </div>
  );
}
