/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const ICON = { success: CheckCircle, error: XCircle, info: Info };
const COLOR = {
  success: 'border-green/25 bg-green/5',
  error:   'border-red/25 bg-red/5',
  info:    'border-cyan/25 bg-cyan/5',
};
const IC = { success: 'text-green', error: 'text-red', info: 'text-cyan' };

let _id = 0;
let _add = null;

export function toast(message, type = 'info') {
  _add?.({ id: ++_id, message, type });
}

export function ToastContainer() {
  const [list, setList] = useState([]);

  const add = useCallback((t) => {
    setList((p) => [...p, t]);
    setTimeout(() => setList((p) => p.filter((x) => x.id !== t.id)), 4000);
  }, []);

  useEffect(() => { _add = add; return () => { _add = null; }; }, [add]);

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {list.map((t) => {
          const Icon = ICON[t.type] || ICON.info;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border
                backdrop-blur-xl shadow-elevated max-w-sm ${COLOR[t.type] || COLOR.info}`}
            >
              <Icon size={16} className={IC[t.type]} />
              <span className="text-sm text-fg flex-1">{t.message}</span>
              <button onClick={() => setList((p) => p.filter((x) => x.id !== t.id))} className="text-fg-4 hover:text-fg cursor-pointer">
                <X size={13} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
