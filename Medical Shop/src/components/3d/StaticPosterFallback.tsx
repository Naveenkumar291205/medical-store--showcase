import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Heart, Sparkles, Activity, Pill } from 'lucide-react';

export const StaticPosterFallback: React.FC = () => {
  return (
    <div className="relative w-full h-[480px] flex items-center justify-center overflow-hidden select-none">
      {/* Ambient glowing backdrop */}
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/10 via-emerald-500/10 to-transparent rounded-3xl filter blur-2xl opacity-70" />

      {/* Floating 2.5D Capsule Graphic */}
      <motion.div
        animate={{
          y: [-8, 8, -8],
          rotate: [-3, 3, -3],
        }}
        transition={{
          repeat: Infinity,
          duration: 5,
          ease: 'easeInOut',
        }}
        className="relative z-10 w-72 h-72 flex items-center justify-center"
      >
        {/* Soft Shadow below */}
        <div className="absolute -bottom-8 w-48 h-8 bg-brand-blue/20 rounded-full filter blur-lg" />

        {/* 3D-Look Pill Composite */}
        <div className="relative w-56 h-28 rounded-full shadow-2xl p-1.5 flex items-center justify-between border border-white/80 bg-white/40 backdrop-blur-md rotate-[-25deg]">
          {/* Left Capsule half (Blue Glass) */}
          <div className="w-1/2 h-full rounded-l-full bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center relative overflow-hidden shadow-inner">
            <div className="absolute top-1 left-2 w-16 h-4 bg-white/40 rounded-full filter blur-[1px]" />
            <Pill className="w-8 h-8 text-white/90 transform -rotate-45" />
          </div>
          
          {/* Right Capsule half (Emerald Fresh) */}
          <div className="w-1/2 h-full rounded-r-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center relative overflow-hidden shadow-inner">
            <div className="absolute top-1 right-2 w-16 h-4 bg-white/40 rounded-full filter blur-[1px]" />
            <Activity className="w-7 h-7 text-white/90" />
          </div>
        </div>

        {/* Floating Medical Badges */}
        <motion.div
          animate={{ y: [6, -6, 6] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="absolute -top-4 -right-4 glass-panel p-3 rounded-2xl shadow-soft flex items-center gap-2 border border-white"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-xs font-semibold text-brand-text">
            <span>100% Verified</span>
            <p className="text-[10px] text-brand-muted font-normal">Authentic Stocks</p>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 0.5 }}
          className="absolute -bottom-2 -left-4 glass-panel p-3 rounded-2xl shadow-soft flex items-center gap-2 border border-white"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-brand-blue">
            <Heart className="w-5 h-5 fill-brand-blue/20" />
          </div>
          <div className="text-xs font-semibold text-brand-text">
            <span>Fast Express</span>
            <p className="text-[10px] text-brand-muted font-normal">2-Hour Delivery</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Orbiting particle dots */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
        className="absolute w-96 h-96 border border-dashed border-brand-blue/20 rounded-full pointer-events-none flex items-start justify-center"
      >
        <div className="w-3 h-3 bg-brand-blue rounded-full shadow-glow-blue -mt-1.5" />
      </motion.div>
    </div>
  );
};
