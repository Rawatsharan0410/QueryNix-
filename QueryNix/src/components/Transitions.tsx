
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

export const FadeIn = ({ 
  children, 
  delay = 0,
  duration = 0.5,
  className = "",
}: { 
  children: ReactNode; 
  delay?: number;
  duration?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export const SlideUp = ({ 
  children, 
  delay = 0,
  duration = 0.5,
  className = "",
}: { 
  children: ReactNode; 
  delay?: number;
  duration?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export const SlideIn = ({ 
  children, 
  direction = 'right',
  delay = 0,
  duration = 0.5,
  className = "",
}: { 
  children: ReactNode; 
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
}) => {
  const directionMap = {
    left: { x: -20, y: 0 },
    right: { x: 20, y: 0 },
    up: { x: 0, y: -20 },
    down: { x: 0, y: 20 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directionMap[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const ScaleIn = ({ 
  children, 
  delay = 0,
  duration = 0.5,
  className = "",
}: { 
  children: ReactNode; 
  delay?: number;
  duration?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerChildren = ({ 
  children,
  staggerDelay = 0.1,
  className = "",
}: { 
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {React.Children.map(children, (child) => (
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};