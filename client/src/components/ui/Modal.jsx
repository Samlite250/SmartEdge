import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function Modal({ open, onClose, title, children }) {
  const overlayRef = useRef(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    if (open) window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-lg bg-[#131A28] border border-white/10 rounded-3xl shadow-2xl max-h-[80vh] flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-white/10 text-text-muted hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto px-6 py-4">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
