import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useUI } from '../context/UIContext';

export default function GlobalUI() {
  const { toast } = useUI();

  return (
    <>
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-10 left-1/2 bg-white/10 border border-white/20 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-[100] min-w-[320px] justify-center backdrop-blur-xl"
          >
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm font-black uppercase tracking-widest">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
