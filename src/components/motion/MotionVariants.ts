import { Variants } from "motion/react";
export const buttonVariants: Variants = {
  // The 'pulse' state for when a file is loaded but not playing
  pulse: {
    boxShadow: "0px 0px 45px 5px rgba(139,92,246,0.8)",
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    },
  },
  // The 'resting' state
  resting: {
    boxShadow: "0px 0px 20px 1px rgba(139,92,246,0.3)",
    transition: { duration: 1, ease: "easeInOut" },
  },
  // The 'spin' command
  spin: {
    rotate: 360,
    transition: { duration: 0.8, ease: "easeInOut" },
  },
};
