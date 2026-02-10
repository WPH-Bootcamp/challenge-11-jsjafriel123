import { motion, MotionValue, useSpring, useMotionValue } from "motion/react";
import { useTransform } from "motion/react";

type EqualizerBarProps = {
  toneMV: MotionValue<number>;
};
export function EqualizerBar({ toneMV }: EqualizerBarProps) {
  const scaleY = useTransform(toneMV, [0, 1], [0.2, 1.2], { clamp: true });

  return (
    <div
      className="flex items-end w-2 h-8 overflow-hidden"
      //   style={{ boxShadow: "0px 0px 30px 2px rgba(124, 58, 237, 0.6)" }}
    >
      <motion.div
        style={{
          scaleY: scaleY,
          transformOrigin: "bottom",
          boxShadow: "0px 0px 30px 5px rgba(124, 58, 237, 0.6)",
        }}
        className="flex w-2 h-8 bg-primary-300"
      />
    </div>
  );
}
