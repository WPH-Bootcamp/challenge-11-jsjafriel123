import { motion, MotionValue } from "motion/react";
import { useTransform, useSpring } from "motion/react";
import { Variants } from "motion/react";
import { stagger } from "motion/react";
type EqualizerBarProps = {
  toneMV: MotionValue<number>;
  offset: number;
  // isLoading: boolean;
};

const jumpVariants: Variants = {
  jump: {
    transform: "translateY(-30px)",
    transition: {
      duration: 0.6,
      ease: "easeInOut",
      repeate: Infinity,
      repeatType: "mirror",
      // delay: stagger(0.2, { startDelay: -0.5 }),
    },
  },
};
export function EqualizerBar({ toneMV, offset = 0.2 }: EqualizerBarProps) {
  const smoothValue = useSpring(toneMV, { stiffness: 200, damping: 10 });
  const scaleY = useTransform(smoothValue, [0, 1], [offset, 1.2], {
    clamp: true,
  });

  return (
    <div className="flex items-end w-2 h-8 overflow-hidden">
      <motion.div
        style={{
          scaleY,
          // scaleY: scaleY,
          transformOrigin: "bottom",
          boxShadow: "0px 0px 30px 5px rgba(124, 58, 237, 0.6)",
        }}
        className="flex w-2 h-8 bg-primary-200"
        // variants={jumpVariants}
        // animate={"jump"}
      />
    </div>
  );
}
