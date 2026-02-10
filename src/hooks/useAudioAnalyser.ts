"use client";

import { useEffect, useRef, useState } from "react";
import { MotionValue } from "motion/react";

const DECAY_RATE = 0.65;
const CYCLE_RATE = 10;
const NORMALIZEDIV = 2;

type AudioMotionTargets = {
  bass1MV: MotionValue<number>;
  bass2MV: MotionValue<number>;
  mid1MV: MotionValue<number>;
  mid2MV: MotionValue<number>;
  trebleMV: MotionValue<number>;
};
export function useAudioAnalyser({
  bass1MV,
  bass2MV,
  mid1MV,
  mid2MV,
  trebleMV,
}: AudioMotionTargets) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null);

  const [frequencies, setFrequencies] = useState<Uint8Array | null>(null);
  const [bands, setBands] = useState({
    bass1: 0,
    bass2: 0,
    mid1: 0,
    mid2: 0,
    treble: 0,
  });
  const [isBeat, setIsBeat] = useState(false);
  //   const [maxBass, setMaxBass] = useState(0);
  const lastBassRef = useRef(0);
  const maxBass1Ref = useRef(1);
  const maxBass2Ref = useRef(1);
  const maxMid1Ref = useRef(1);
  const maxMid2Ref = useRef(1);
  const maxTrebleRef = useRef(1);

  const [maxBass, setMaxBass] = useState(0);
  const smoothBass1Ref = useRef(0);
  const smoothBass2Ref = useRef(0);
  const smoothMid1Ref = useRef(0);
  const smoothMid2Ref = useRef(0);
  const smoothTrebleRef = useRef(0);
  const cycleCount = useRef(CYCLE_RATE);

  const resumeAudio = async () => {
    if (!audioContextRef.current) return;

    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }
  };

  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.8;

    const source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;

    const update = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      const freqCopy = new Uint8Array(dataArrayRef.current);
      setFrequencies(freqCopy);
      // ---- Frequency bands ----
      const nyquist = audioContext.sampleRate / 2;
      const binSize = nyquist / freqCopy.length;

      const freqToBin = (freq: number) => Math.floor(freq / binSize);

      const bassLo = freqCopy.slice(freqToBin(20), freqToBin(60));
      const bassHi = freqCopy.slice(freqToBin(60), freqToBin(250));
      const midLo = freqCopy.slice(freqToBin(250), freqToBin(1500));
      const midHi = freqCopy.slice(freqToBin(1500), freqToBin(2500));
      const trebleHi = freqCopy.slice(freqToBin(2500), freqToBin(6000));

      const avg = (arr: Uint8Array) =>
        arr.reduce((a, b) => a + b, 0) / arr.length;
      const max = (arr: Uint8Array) => arr.reduce((a, b) => (b > a ? b : a), 0);

      const bass1 = max(bassLo);
      const bass2 = max(bassHi);
      const mid1 = max(midLo);
      const mid2 = max(midHi);
      const treble = max(trebleHi);

      maxBass1Ref.current = Math.max(maxBass1Ref.current, bass1);
      maxBass2Ref.current = Math.max(maxBass2Ref.current, bass2);
      maxMid1Ref.current = Math.max(maxMid1Ref.current, mid1);
      maxMid2Ref.current = Math.max(maxMid2Ref.current, mid2);
      maxTrebleRef.current = Math.max(maxTrebleRef.current, treble);

      const normBass1 = bass1 / maxBass1Ref.current / NORMALIZEDIV;
      const normBass2 = bass2 / maxBass2Ref.current / NORMALIZEDIV;
      const normMid1 = mid1 / maxMid1Ref.current / NORMALIZEDIV;
      const normMid2 = mid2 / maxMid2Ref.current / NORMALIZEDIV;
      const normTreble = treble / maxTrebleRef.current / NORMALIZEDIV;

      //   setBands({ bass, mid, treble });
      if (normBass1 > smoothBass1Ref.current) {
        smoothBass1Ref.current = normBass1;
      } else {
        smoothBass1Ref.current *= DECAY_RATE;
      }
      if (normBass2 > smoothBass2Ref.current) {
        smoothBass2Ref.current = normBass2;
      } else {
        smoothBass2Ref.current *= DECAY_RATE;
      }
      if (normMid1 > smoothMid1Ref.current) {
        smoothMid1Ref.current = mid1;
      } else {
        smoothMid1Ref.current *= DECAY_RATE;
      }
      if (normMid2 > smoothMid2Ref.current) {
        smoothMid2Ref.current = mid2;
      } else {
        smoothMid2Ref.current *= DECAY_RATE;
      }
      if (normTreble > smoothTrebleRef.current) {
        smoothTrebleRef.current = treble;
      } else {
        smoothTrebleRef.current *= DECAY_RATE;
      }
      // Optional clamp
      if (smoothBass1Ref.current < 0.01) smoothBass1Ref.current = 0;
      if (smoothBass2Ref.current < 0.01) smoothBass2Ref.current = 0;
      //  if (smoothMid1Ref.current < 0.01)  smoothMid1Ref.current = 0;
      //  if (smoothMid2Ref.current < 0.01)  smoothMid2Ref.current = 0;
      //  if (smoothTrebleRef.current < 0.01)  smoothTrebleRef.current = 0;

      // setBands((prev) => ({
      //   ...prev,
      //   bass1: smoothBass1Ref.current,
      //   bass2: smoothBass2Ref.current,
      //   mid1: normMid1,
      //   mid2: normMid2,
      //   treble: normTreble,
      //   bass1: bass1,
      //   bass2: bass2,
      //   mid1: mid1,
      //   mid2: mid2,
      //   treble: treble,
      // }));

      // ---- Beat detection (bass spike) ----
      const lastBass = lastBassRef.current;
      const threshold = lastBass * 1.25;
      //   if (bass > maxBassRef.current) {
      //     maxBassRef.current = bass;
      //     setMaxBass(bass);
      //   }
      setIsBeat(bass2 > threshold && bass2 > 60);
      // setIsBeat(bass1 > lastBass || bass2 > lastBass);

      lastBassRef.current = bass1;
      bass1MV.set(normBass1);
      bass2MV.set(normBass2);
      mid1MV.set(normMid1);
      mid2MV.set(normMid2);
      trebleMV.set(normTreble);
      requestAnimationFrame(update);
    };

    update();

    return () => {
      audioContext.close();
    };
  }, []);

  return {
    audioRef,
    // frequencies,
    // bands,
    resumeAudio,
    isBeat,
    // maxBass,
  };
}
