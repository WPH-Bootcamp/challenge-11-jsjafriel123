"use client";
import type { Tags } from "jsmediatags/dist/jsmediatags.min.js";
import { div } from "motion/react-client";

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
  return (
    <div className="flex w-full justify-end">
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
        }}
        className="hidden"
      />
      <label
        htmlFor="audio-upload"
        className="flex cursor-pointer underline text-xs font-medium hover:scale-110 text-neutral-400"
      >
        Open File
      </label>
    </div>
  );
}
