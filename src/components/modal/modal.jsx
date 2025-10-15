import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Modal({ tag, title, renderURL, children }) {
  const [isOpen, setIsOpen] = useState(false);

  // Sync open state with hash
  useEffect(() => {
    const sync = () => setIsOpen(window.location.hash === tag);
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    sync();
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, [tag]);

  const handleClose = () => {
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search
    );
    setIsOpen(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="bg-base-100 rounded-lg shadow-xl max-w-4xl w-full min-h-[80vh] overflow-auto flex flex-col"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {title && (
              <div className="px-4 py-2 border-b border-base-300 flex justify-between items-center">
                <h2 className="text-xl font-bold">{title}</h2>
                <div className="flex gap-2">
                  {renderURL && (
                    <a
                      href={renderURL}
                      className="btn btn-sm btn-ghost btn-square"
                      title="Open Fullscreen"
                    >
                      ⛶
                    </a>
                  )}
                  <button
                    onClick={handleClose}
                    className="btn btn-sm btn-ghost btn-square"
                    title="Close"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {renderURL ? (
              <div className="relative flex-1 w-full h-[80vh]">
                <iframe
                  src={renderURL + "#fullscreen"}
                  className="absolute inset-0 w-full h-full border-none rounded-b-lg"
                />
              </div>
            ) : (
              <div className="p-4 flex-1 overflow-auto">{children}</div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
