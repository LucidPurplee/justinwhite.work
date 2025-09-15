import React, { useEffect, useState } from "react";

export default function Modal({ tag, title, renderURL, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    const handleUrlChange = () => {
      setCurrentUrl(window.location.href);
    };

    // Listen to back/forward navigation
    window.addEventListener("popstate", handleUrlChange);

    // Initial check on mount
    handleUrlChange();

    return () => {
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, []);

  // Re-evaluate modal visibility whenever URL changes
  useEffect(() => {
    const hash = window.location.hash || "";
    setIsOpen(hash === tag);
  }, [currentUrl, tag]);

  if (!isOpen) return null;

  const handleClose = () => {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-base-100 rounded-lg shadow-xl max-w-4xl w-full min-h-[80vh] overflow-auto relative flex flex-col">
        {title && (
          <div className="px-4 py-2 border-b border-base-300 flex justify-between items-center">
            <h2 className="text-xl font-bold">{title}</h2>
            <div className="flex gap-2">
              {renderURL && (
                <a
                  href={renderURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-ghost"
                  title="Open Fullscreen"
                >
                  ⛶
                </a>
              )}
              <button
                onClick={handleClose}
                className="btn btn-sm btn-ghost"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {renderURL ? (
          <iframe
            src={renderURL + "#fullscreen"}
            className="flex-1 w-full h-[80vh] border-none rounded-b-lg"
          />
        ) : (
          <div className="p-4 flex-1 overflow-auto">{children}</div>
        )}
      </div>
    </div>
  );
}