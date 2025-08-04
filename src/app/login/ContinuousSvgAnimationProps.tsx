import React from 'react';
import { motion } from 'framer-motion';

interface ContinuousSvgAnimationProps {
  width?: number | string;
  height?: number | string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  duration?: number;
}

const ContinuousSvgAnimation: React.FC<ContinuousSvgAnimationProps> = ({
  width = '100%',
  height = '100%',
  primaryColor = 'rgba(59, 130, 246, 0.7)', // Semi-transparent blue
  secondaryColor = 'rgba(16, 185, 129, 0.7)', // Semi-transparent green
  backgroundColor = 'rgba(243, 244, 246, 0.2)', // Very light gray with transparency
  duration = 8, // Animation duration in seconds
}) => {
  // Define radial gradient for glass effect
  const glassGradientId = 'glassGradient';
  const highlightGradientId = 'highlightGradient';

  // Animation variants for the circular elements
  const circleVariants = {
    animate: {
      scale: [1, 1.2, 0.9, 1.1, 1],
      opacity: [0.7, 1, 0.8, 0.9, 0.7],
      transition: {
        duration: duration,
        ease: 'easeInOut',
        times: [0, 0.25, 0.5, 0.75, 1],
        repeat: Infinity,
      },
    },
  };

  // Animation variants for the waves
  const waveVariants = {
    animate: (custom: number) => ({
      d: [
        'M0,64 C20,40 40,30 60,40 C80,50 100,70 120,60 C140,50 160,20 180,30 C200,40 220,60 240,50 C260,40 280,30 300,40 C320,50 340,70 360,60 C380,50 400,30 420,40 C440,50 460,70 480,60 C500,50 520,30 540,40 C560,50 580,70 600,60',
        'M0,60 C20,50 40,60 60,50 C80,40 100,20 120,30 C140,40 160,60 180,50 C200,40 220,20 240,30 C260,40 280,60 300,50 C320,40 340,20 360,30 C380,40 400,60 420,50 C440,40 460,20 480,30 C500,40 520,60 540,50 C560,40 580,20 600,30',
        'M0,50 C20,60 40,50 60,60 C80,70 100,40 120,50 C140,60 160,50 180,60 C200,70 220,40 240,50 C260,60 280,50 300,60 C320,70 340,40 360,50 C380,60 400,50 420,60 C440,70 460,40 480,50 C500,60 520,50 540,60 C560,70 580,40 600,50',
        'M0,40 C20,30 40,50 60,40 C80,30 100,50 120,40 C140,30 160,50 180,40 C200,30 220,50 240,40 C260,30 280,50 300,40 C320,30 340,50 360,40 C380,30 400,50 420,40 C440,30 460,50 480,40 C500,30 520,50 540,40 C560,30 580,50 600,40',
        'M0,64 C20,40 40,30 60,40 C80,50 100,70 120,60 C140,50 160,20 180,30 C200,40 220,60 240,50 C260,40 280,30 300,40 C320,50 340,70 360,60 C380,50 400,30 420,40 C440,50 460,70 480,60 C500,50 520,30 540,40 C560,50 580,70 600,60',
      ],
      transition: {
        duration: duration,
        ease: 'easeInOut',
        times: [0, 0.25, 0.5, 0.75, 1],
        delay: custom * 0.5, // Staggered delay
        repeat: Infinity,
      },
    }),
  };

  // Animation for rotating elements
  const rotateVariants = {
    animate: (custom: number) => ({
      rotate: [0, 360],
      transition: {
        duration: duration * (custom === 1 ? 2 : 1), // Different durations
        ease: 'linear',
        repeat: Infinity,
      },
    }),
  };

  // Color transition animations with glass effect
  const colorVariants = {
    animate: {
      fill: [primaryColor, secondaryColor, primaryColor],
      filter: ['url(#glassFilter)', 'url(#glassFilter)', 'url(#glassFilter)'],
      transition: {
        duration: duration * 1.5,
        ease: 'easeInOut',
        repeat: Infinity,
      },
    },
  };

  // Shimmer effect for glass highlights
  const shimmerVariants = {
    animate: {
      x: ['-100%', '100%'],
      transition: {
        duration: duration * 0.75,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'mirror' as const,
      },
    },
  };

  return (
    <div style={{ width, height, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <motion.svg
        viewBox="0 0 400 400"
        width="100%"
        height="100%"
        style={{
          backgroundColor,
          borderRadius: '20px',
          overflow: 'hidden',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(230,230,250,0.05) 100%)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          backdropFilter: 'blur(4px)',
        }}
        initial="initial"
        animate="animate"
      >
        {/* Define filters and gradients for glass effect */}
        <defs>
          <filter id="glassFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>

          <radialGradient id={glassGradientId} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.8)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.2)" />
          </radialGradient>

          <linearGradient id={highlightGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.6)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>

          <clipPath id="circleClip">
            <circle cx="200" cy="200" r="160" />
          </clipPath>
        </defs>

        {/* Background with frosted glass effect */}
        <rect
          x="20"
          y="20"
          width="360"
          height="360"
          rx="180"
          ry="180"
          fill="rgba(255, 255, 255, 0.1)"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="1"
          filter="url(#glassFilter)"
        />

        {/* Background circles */}
        <motion.circle
          cx="200"
          cy="200"
          r="160"
          fill="none"
          stroke={primaryColor}
          strokeWidth="1"
          strokeDasharray="4 4"
          variants={rotateVariants}
          custom={1}
          style={{ transformOrigin: 'center', backgroundColor }}
          filter="url(#glassFilter)"
        />

        <motion.circle
          cx="200"
          cy="200"
          r="140"
          fill="none"
          stroke={secondaryColor}
          strokeWidth="0.5"
          strokeDasharray="8 8"
          variants={rotateVariants}
          custom={0.8}
          style={{ transformOrigin: 'center' }}
          filter="url(#glassFilter)"
        />

        {/* Center elements group with glass effect */}
        <g clipPath="url(#circleClip)">
          {/* Animated waves with glass effect */}
          <motion.path
            d="M0,64 C20,40 40,30 60,40 C80,50 100,70 120,60 C140,50 160,20 180,30 C200,40 220,60 240,50 C260,40 280,30 300,40 C320,50 340,70 360,60 C380,50 400,30 420,40 C440,50 460,70 480,60 C500,50 520,30 540,40 C560,50 580,70 600,60"
            fill="none"
            stroke={`url(#${glassGradientId})`}
            strokeWidth="3"
            strokeLinecap="round"
            style={{ backgroundColor }}
            variants={waveVariants}
            custom={0}
            transform="translate(-100, 120) scale(1, 0.5)"
            filter="url(#glassFilter)"
          />

          <motion.path
            d="M0,50 C20,60 40,50 60,60 C80,70 100,40 120,50 C140,60 160,50 180,60 C200,70 220,40 240,50 C260,60 280,50 300,60 C320,70 340,40 360,50 C380,60 400,50 420,60 C440,70 460,40 480,50 C500,60 520,50 540,60 C560,70 580,40 600,50"
            fill="none"
            stroke={secondaryColor}
            strokeWidth="3"
            strokeLinecap="round"
            variants={waveVariants}
            style={{ backgroundColor }}
            custom={1}
            transform="translate(-100, 180) scale(1, 0.5)"
            filter="url(#glassFilter)"
          />

          <motion.path
            d="M0,40 C20,30 40,50 60,40 C80,30 100,50 120,40 C140,30 160,50 180,40 C200,30 220,50 240,40 C260,30 280,50 300,40 C320,30 340,50 360,40 C380,30 400,50 420,40 C440,30 460,50 480,40 C500,30 520,50 540,40 C560,30 580,50 600,40"
            fill="none"
            stroke={primaryColor}
            strokeWidth="3"
            strokeLinecap="round"
            style={{ backgroundColor }}
            variants={waveVariants}
            custom={2}
            transform="translate(-100, 240) scale(1, 0.5)"
            filter="url(#glassFilter)"
          />
        </g>

        {/* Glass sphere in center */}
        <motion.circle
          cx="200"
          cy="200"
          r="60"
          fill={`url(#${glassGradientId})`}
          variants={circleVariants}
          opacity={0.9}
          filter="url(#glassFilter)"
          stroke="rgba(255, 255, 255, 0.8)"
          strokeWidth="1"
        />

        <motion.circle cx="200" cy="200" r="40" variants={colorVariants} filter="url(#glassFilter)" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.5" />

        {/* Highlight effect on glass */}
        <motion.ellipse cx="180" cy="180" rx="20" ry="15" fill="rgba(255, 255, 255, 0.4)" variants={shimmerVariants} />

        {/* Orbital small circles with glass effect */}
        <motion.g variants={rotateVariants} custom={0.5} style={{ transformOrigin: 'center' }}>
          <motion.circle
            cx="200"
            cy="90"
            r="15"
            fill={`url(#${glassGradientId})`}
            variants={circleVariants}
            filter="url(#glassFilter)"
            stroke="rgba(255, 255, 255, 0.6)"
            strokeWidth="0.5"
          />
          <motion.circle
            cx="200"
            cy="310"
            r="15"
            fill={`url(#${glassGradientId})`}
            variants={circleVariants}
            filter="url(#glassFilter)"
            stroke="rgba(255, 255, 255, 0.6)"
            strokeWidth="0.5"
          />
        </motion.g>

        <motion.g variants={rotateVariants} custom={0.75} style={{ transformOrigin: 'center', backgroundColor }}>
          <motion.circle
            cx="90"
            cy="200"
            r="15"
            fill={`url(#${glassGradientId})`}
            variants={circleVariants}
            filter="url(#glassFilter)"
            stroke="rgba(255, 255, 255, 0.6)"
            strokeWidth="0.5"
            style={{ backgroundColor }}
          />
          <motion.circle
            cx="310"
            cy="200"
            r="15"
            fill={`url(#${glassGradientId})`}
            variants={circleVariants}
            filter="url(#glassFilter)"
            stroke="rgba(255, 255, 255, 0.6)"
            strokeWidth="0.5"
          />
        </motion.g>
      </motion.svg>
    </div>
  );
};

export default ContinuousSvgAnimation;
