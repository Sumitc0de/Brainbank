import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) {
  const onEsc = useCallback((e) => { if (e.key === 'Escape') onClose(); }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', onEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => { document.removeEventListener('keydown', onEsc); document.body.style.overflow = ''; };
  }, [isOpen, onEsc]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className={`relative my-3 sm:my-6 w-full ${maxWidth} max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-3rem)] overflow-hidden
              bg-surface-2 border border-edge rounded-xl shadow-2xl`}
          >
            {title && (
              <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-edge bg-surface-2/95 backdrop-blur">
                <h2 className="text-lg font-semibold text-fg leading-none">{title}</h2>
                <button onClick={onClose}
                  aria-label="Close modal"
                  className="p-1.5 rounded-lg text-fg-3 hover:text-fg hover:bg-surface-4/40 transition-colors cursor-pointer shrink-0">
                  <X size={18} />
                </button>
              </div>
            )}
            <div className="max-h-[calc(100vh-5.5rem)] sm:max-h-[calc(100vh-7rem)] overflow-y-auto p-5 sm:p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
