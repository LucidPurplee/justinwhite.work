import React, { useState, useEffect } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./documentViewport.css";
import Card from "../../library/card.jsx"; // Unfortunate concession, I couldnt find a way to do this cleanly in tailwind 😔

// Modal for mobile
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
          Close Document
        </button>
      </div>
    </div>
  );
};

// Viewport
const MarkdownRenderer = ({ sourceLocation, title, subtitle, className }) => {
  const [markdownContent, setMarkdownContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasRenderError, setHasRenderError] = useState(false);
  const [hasFetchError, setHasFetchError] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  useEffect(() => {
    if (!sourceLocation) {
      setMarkdownContent(null);
      setIsLoading(false);
      setHasFetchError(true);
      return;
    }

    const fetchDocument = async () => {
      setIsLoading(true);
      setHasFetchError(false);
      setHasRenderError(false);
      setMarkdownContent(null);

      try {
        const response = await fetch(sourceLocation);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        setMarkdownContent(text);
      } catch (error) {
        console.error("Document fetch failed:", error);
        setHasFetchError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [sourceLocation]);

  useEffect(() => {
    setHasRenderError(false);
  }, [markdownContent]);

  const handleDownload = () => {
    if (!markdownContent) return;

    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "document"}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReload = () => {
    if (!sourceLocation) return;

    setIsLoading(true);
    setHasFetchError(false);
    setHasRenderError(false);
    setMarkdownContent(null);
    setShowRaw(false);

    fetch(sourceLocation)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((text) => {
        setMarkdownContent(text);
      })
      .catch((error) => {
        console.error("Document fetch failed:", error);
        setHasFetchError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleShare = async () => {
    if (!sourceLocation) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: title || "Document",
          text: subtitle || "Check out this document",
          url: sourceLocation,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Share failed:", error);
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(sourceLocation)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((error) => {
        console.error("Copy failed:", error);
        alert("Could not copy link");
      });
  };

  const handleViewRaw = () => {
    setShowRaw(!showRaw);
  };

  const renderDocumentView = (isMobile = false) => (
    <div
      className={`w-full h-full flex flex-col rounded-lg border-white/10 inset-shadow-[1px_1px_2px_-1px_rgba(255,255,255,.72)] overflow-y-hidden overflow-x-hidden relative`}
      data-theme="prime200"
    >
      <div
        className={`px-16 py-8 w-full shadow-xl overflow-y-scroll ${isMobile ? "flex-1 min-h-0" : "max-h-full flex-1"}`}
      >
        {showRaw ? (
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {markdownContent}
          </pre>
        ) : (
          <div className="md-content">
            <ErrorBoundary fallback={() => setHasRenderError(true)}>
              <Markdown remarkPlugins={[remarkGfm]}>{markdownContent}</Markdown>
            </ErrorBoundary>
          </div>
        )}
      </div>

      <Card
        title={title}
        subtitle={subtitle}
        className="w-full max-w-full bg-base-300/64 hover:bg-base-300/72 !duration-600 !rounded-t-none !rounded-b-lg absolute bottom-0 left-0 right-0 z-10 backdrop-blur-md"
      >
        <div className="py-1 px-2 flex flex-row gap-2">
          <button
            className="btn border bg-base-100/20 border-white/20"
            onClick={handleDownload}
            disabled={!markdownContent}
          >
            Download
          </button>
          <button
            className="btn border bg-base-100/20 border-white/20"
            onClick={handleReload}
            disabled={!sourceLocation}
          >
            Reload
          </button>
          <button
            className="btn border bg-base-100/20 border-white/20"
            onClick={handleShare}
            disabled={!sourceLocation}
          >
            Share
          </button>
          <button
            className="btn border bg-base-100/20 border-white/20"
            onClick={handleViewRaw}
            disabled={!markdownContent}
          >
            {showRaw ? "View Rendered" : "View Raw"}
          </button>
        </div>
      </Card>
    </div>
  );

  // todo : I should probably make this render to the default ui so it works on mobile maybe
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
        className={`p-8 rounded-lg w-full h-full flex flex-col items-center justify-center shadow-xl bg-base-100`}
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
            className="mt-6 btn border border-white/20 inset-shadow-[1px_1px_2px_-1px_rgba(255,255,255,.72)]"
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
    return renderContentArea("loading document from file");
  }

  if (!sourceLocation || hasFetchError || !markdownContent || hasRenderError) {
    const docname = subtitle ? `"${subtitle}"` : "document";
    const docinv = subtitle ? `"${subtitle}"` : "";
    return renderContentArea(
      hasRenderError
        ? `Failed to render ${docname}`
        : `Document ${docinv} does not exist!`,
      hasRenderError
        ? "Report this error please!"
        : "Check the url for a typo!",
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
        {renderDocumentView(false)}
      </div>

      {/* Mobile View */}
      <div className={`block md:hidden w-full h-full ${className || ""}`}>
        <Modal title={title}>
          <div className="flex-1 flex flex-col overflow-hidden gap-4">
            {renderDocumentView(true)}
          </div>
        </Modal>
      </div>
    </>
  );
};

// --- ErrorBoundary ---
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ReactMarkdown error:", error, errorInfo);
    if (this.props.fallback) {
      this.props.fallback();
    }
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

export default MarkdownRenderer;
