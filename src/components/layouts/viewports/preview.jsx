import React, { useState, useEffect, useRef } from "react";
import Card from "../../library/card.jsx";

// --- Full-Screen Modal Always Visible on Mobile ---
const Modal = ({ title, children }) => {
  const handleCloseAndNavigate = () => {
    window.location.href = '/';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-base-100"
    >
      <div className="w-full h-full flex flex-col p-4">
        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
        <button
          onClick={handleCloseAndNavigate}
          className="btn btn-lg w-full max-w-full border border-white/20 mt-4"
        >
          Close Preview
        </button>
      </div>
    </div>
  );
};

/**
 * Renders an HTML page inside an iframe, handling missing content and fetch errors.
 */
const IframeRenderer = ({ sourceLocation, liveLocation, title, subtitle, className }) => {
  const [isDocumentReachable, setIsDocumentReachable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFetchError, setHasFetchError] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!sourceLocation) {
      setIsDocumentReachable(false);
      setIsLoading(false);
      setHasFetchError(true);
      return;
    }

    const checkDocumentReachability = async () => {
      setIsLoading(true);
      setHasFetchError(false);
      setIsDocumentReachable(false);

      try {
        const response = await fetch(sourceLocation);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        setIsDocumentReachable(true);
      } catch (error) {
        console.error("Document reachability check failed:", error);
        setHasFetchError(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkDocumentReachability();
  }, [sourceLocation]);

  const handleReload = () => {
    if (iframeRef.current) iframeRef.current.src = iframeRef.current.src;
  };

  const handleViewRaw = () => {
    window.open(sourceLocation, "_blank", "noopener,noreferrer");
  };

  const handleLivePage = () => {
    if (liveLocation) window.open(liveLocation, "_blank", "noopener,noreferrer");
  };

  const renderPreviewView = (isMobile = false) => (
    <>
      <div
        className={`p-1 rounded-lg w-full shadow-xl overflow-hidden ${isMobile ? 'flex-1 min-h-0' : 'max-h-full flex-1'}`}
        data-theme="prime200"
      >
        <iframe
          ref={iframeRef}
          src={sourceLocation}
          title={title}
          className="w-full h-full border-none rounded-md bg-white"
          lazy
          sandbox
        />
      </div>

      <Card title={title} subtitle={subtitle} className="w-full">
        <div className="pb-1 px-2 flex flex-row gap-2">
          <button className="btn border border-white/20" onClick={handleReload}>
            Reload
          </button>
          <button className="btn border border-white/20" onClick={handleViewRaw}>
            View Raw
          </button>
          {liveLocation && (
            <button className="btn border border-white/20" onClick={handleLivePage}>
              Live Page
            </button>
          )}
        </div>
      </Card>
    </>
  );

  const renderContentArea = (message) => (
    <div className="flex-1 flex flex-col overflow-hidden gap-4 hidden md:block">
      <div
        className="p-8 rounded-lg w-full max-h-full flex-1 shadow-xl"
        data-theme="prime200"
      >
        <p className="text-yellow-500 font-semibold">{message}</p>
      </div>
      <div className="skeleton bg-white/0 h-16 w-full"></div>
    </div>
  );

  if (isLoading) {
    return renderContentArea("generating preview");
  }

  if (!sourceLocation || hasFetchError || !isDocumentReachable) {
    return renderContentArea("An issue occurred while attempting to generate a preview");
  }

  return (
    <>
      {/* Desktop View */}
      <div className={`hidden md:flex flex-1 flex-col overflow-hidden gap-4 ${className || ""}`}>
        {renderPreviewView(false)}
      </div>

      {/* Mobile View */}
      <div className={`block md:hidden w-full h-full ${className || ""}`}>
        <Modal title={title}>
          <div className="flex-1 flex flex-col overflow-hidden gap-4">
            {renderPreviewView(true)}
          </div>
        </Modal>
      </div>
    </>
  );
};

export default IframeRenderer;