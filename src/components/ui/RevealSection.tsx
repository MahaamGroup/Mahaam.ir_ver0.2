import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface RevealSectionProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export const RevealSection: React.FC<RevealSectionProps> = ({
  children,
  delay = 0,
  direction = 'up',
  distance = 32,
  duration = 0.65,
  className = '',
  once = true,
  ...props
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance, x: 0 };
      case 'down':
        return { y: -distance, x: 0 };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      case 'none':
      default:
        return { x: 0, y: 0 };
    }
  };

  const initialOffset = getInitialPosition();

  return (
    <motion.div
      initial={{ opacity: 0, ...initialOffset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
