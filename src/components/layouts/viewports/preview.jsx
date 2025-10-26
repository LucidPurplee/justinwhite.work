import React, { useState, useEffect, useRef } from "react";
import Card from "../../library/card.jsx";

// mobile modal/ui
const Modal = ({ title, children }) => {
  const handleCloseAndNavigate = () => {
    window.location.href = "/";
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-base-100">
      <div className="w-full h-full flex flex-col p-4">
        <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
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

// viewport
const IframeRenderer = ({
  sourceLocation,
  liveLocation,
  title,
  subtitle,
  className,
}) => {
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
        console.log(sourceLocation);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
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
    if (liveLocation)
      window.open(liveLocation, "_blank", "noopener,noreferrer");
  };

  const renderPreviewView = (isMobile = false) => (
    <div
      className={`w-full h-full flex flex-col rounded-xl border-white/10 shadow-[inset_0_-1px_1px_rgba(255,255,255,.3)] overflow-y-hidden overflow-x-hidden relative`}
      data-theme="prime200"
    >
      <div
        className={`p-2 w-full shadow-xl overflow-y-auto ${isMobile ? "flex-1 min-h-0" : "max-h-full flex-1"}`}
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

      <Card
        title={title}
        subtitle={subtitle}
        className="w-full max-w-full bg-base-300/64 hover:bg-base-300/72 !duration-600 !rounded-t-none !rounded-b-lg absolute bottom-0 left-0 right-0 z-10 backdrop-blur-lg"
      >
        <div className="py-1 px-2 flex flex-row gap-2">
          <button className="btn border bg-base-100/20 border-white/20" 
          onClick={handleReload}>
            Reload
          </button>
          {liveLocation != sourceLocation && (
            <button
              className="btn border bg-base-100/20 border-white/20"
              onClick={handleViewRaw}
            >
              View Raw
            </button>
          )}
          {liveLocation && (
            <button
              className="btn border bg-base-100/20 border-white/20"
              onClick={handleLivePage}
            >
              Live Page
            </button>
          )}
        </div>
      </Card>
    </div>
  );

  // todo : I should probably make this render to the default ui so it works on mobile maybe
  const renderPreviewViewOld = (isMobile = false) => (
    <>
      <div
        className={`p-1 rounded-xl w-full shadow-xl overflow-hidden ${isMobile ? "flex-1 min-h-0" : "max-h-full flex-1"}`}
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
        <div className="py-1 px-2 flex flex-row gap-2">
          <button className="btn border border-white/20" onClick={handleReload}>
            Reload
          </button>
          {liveLocation != sourceLocation && (
            <button
              className="btn border border-white/20"
              onClick={handleViewRaw}
            >
              View Raw
            </button>
          )}
          {liveLocation && (
            <button
              className="btn border border-white/20"
              onClick={handleLivePage}
            >
              Live Page
            </button>
          )}
        </div>
      </Card>
    </>
  );

  const renderContentArea = (
    message,
    additional = "",
    className = "",
    showReloadOptions = false,
    showLoader = true
  ) => (
    <div
      className={`flex-1 flex flex-col overflow-hidden gap-4 hidden md:block bg-transparent`}
      data-theme="prime200"
    >
      <div
        className={`p-8 rounded-xl w-full h-full flex flex-col items-center justify-center shadow-xl bg-base-100`}
      >
        {showLoader && (
          <span
            className={`loading loading-spinner loading-xl my-4 text-base-content ${className}`}
          ></span>
        )}
        <h1 className={`font-semibold text-base opacity-80 ${className}`}>
          {message}
        </h1>
        <p className="text-sm opacity-60">{additional}</p>
        {showReloadOptions && (
          <button
            className="mt-6 btn border border-white/20 shadow-[inset_0_-1px_1px_rgba(255,255,255,.3)]"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        )}
      </div>
      <div className="skeleton bg-w- h-16 w-full"></div>
    </div>
  );

  if (isLoading) {
    return renderContentArea("generating preview");
  }

  if (!sourceLocation || hasFetchError || !isDocumentReachable) {
    return renderContentArea(
      "Unable to generate a preview",
      "does the requested page exist?",
      "text-warning",
      true,
      false
    );
  }

  return (
    <>
      {/* Desktop View */}
      <div
        className={`hidden md:flex flex-1 flex-col overflow-hidden gap-4 ${className || ""}`}
      >
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
