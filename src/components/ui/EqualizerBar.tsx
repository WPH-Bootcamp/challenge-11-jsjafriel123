import { motion, MotionValue } from "motion/react";
import { useTransform } from "motion/react";

type EqualizerBarProps = {
  toneMV: MotionValue<number>;
  offset: number;
  // isLoading: boolean;
};
export function EqualizerBar({ toneMV, offset = 0.2 }: EqualizerBarProps) {
  const scaleY = useTransform(toneMV, [0, 1], [offset, 1.2], {
    clamp: true,
  });

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
        className="flex w-2 h-8 bg-primary-200"
      />
    </div>
  );
}
