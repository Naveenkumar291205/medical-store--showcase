import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface SuccessMotif3DProps {
  size?: 'sm' | 'md' | 'lg';
  title?: string;
  subtitle?: string;
}

export const SuccessMotif3D: React.FC<SuccessMotif3DProps> = ({
  size = 'md',
  title,
  subtitle
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  }[size];

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }[size];

  return (
    <div className="flex flex-col items-center justify-center text-center p-4">
      <div className="relative flex items-center justify-center">
        {/* Glowing pulse ripples */}
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
          className={`absolute ${sizeClasses} rounded-full bg-emerald-500/20 filter blur-md`}
        />

        {/* 3D-effect Sphere / Checkmark circle */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 18, delay: 0.1 }}
          className={`${sizeClasses} rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 border-2 border-white/80 relative overflow-hidden`}
        >
          {/* Top highlight shine */}
          <div className="absolute top-1 inset-x-3 h-1/3 bg-white/30 rounded-full filter blur-[1px]" />
          
          <motion.div
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Check className={`${iconSizes} stroke-[3]`} />
          </motion.div>
        </motion.div>
      </div>

      {title && (
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-xl font-heading font-bold text-brand-text"
        >
          {title}
        </motion.h3>
      )}

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-1 text-sm text-brand-muted max-w-sm"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};
