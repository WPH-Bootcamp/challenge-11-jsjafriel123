"use client";
import type { Tags } from "jsmediatags/dist/jsmediatags.min.js";
import { useState } from "react";
type GetAudioFileProps = {
  onMetadata: (tags: Tags, file: File) => void;
};

async function readMetadata(file: File, onMetadata: (tags: Tags) => void) {
  const jsmediatags = (await import("jsmediatags/dist/jsmediatags.min.js"))
    .default;

  jsmediatags.read(file, {
    onSuccess: ({ tags }) => {
      onMetadata(tags);
      console.log(tags.title, tags.artist);
    },
    onError: console.error,
  });
}

export function GetAudioFile({ onMetadata }: GetAudioFileProps) {
  const [audioUrl, setAudioUrl] = useState(false);

  return (
    <div className="flex w-full justify-end z-10">
      <input
        id="audio-upload"
        type="file"
        accept="audio/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          readMetadata(file, (tags) => {
            onMetadata(tags, file);
          });
          setAudioUrl(true);
        }}
        className="hidden"
      />
      <label
        htmlFor="audio-upload"
        className={`flex cursor-pointer text-[12px] text-primary-300 font-medium hover:scale-110  drop-shadow-[0_0_10px_rgba(167,139,250,1)] z-20 ${audioUrl ? "brightness-100" : "brightness-150"}`}
      >
        Open
      </label>
    </div>
  );
}
