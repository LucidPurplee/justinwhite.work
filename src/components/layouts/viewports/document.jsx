import React, { useState, useEffect } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./documentViewport.css";
import Card from "../../library/card.jsx"; // Unfortunate concession, I couldnt find a way to do this cleanly in tailwind 😔

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
                    Close Document
                </button>
            </div>
        </div>
    );
};

// A basic viewport (visually the same as the preview viewport), renders a markdown file instead of a url.
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
    
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'document'}.md`;
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
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(text => {
        setMarkdownContent(text);
      })
      .catch(error => {
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
          title: title || 'Document',
          text: subtitle || 'Check out this document',
          url: sourceLocation
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Share failed:', error);
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sourceLocation)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch(error => {
        console.error('Copy failed:', error);
        alert('Could not copy link');
      });
  };

  const handleViewRaw = () => {
    setShowRaw(!showRaw);
  };

  const renderDocumentView = (isMobile = false) => (
    <>
      <div
        className={`p-8 rounded-lg w-full shadow-xl overflow-y-auto ${isMobile ? 'flex-1 min-h-0' : 'max-h-full flex-1'}`}
        data-theme="prime200"
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

      <Card title={title} subtitle={subtitle} className="w-full">
        <div className="py-1 px-2 flex flex-row gap-2">
          <button 
            className="btn border border-white/20" 
            onClick={handleDownload}
            disabled={!markdownContent}
          >
            Download
          </button>
          <button 
            className="btn border border-white/20" 
            onClick={handleReload}
            disabled={!sourceLocation}
          >
            Reload
          </button>
          <button 
            className="btn border border-white/20" 
            onClick={handleShare}
            disabled={!sourceLocation}
          >
            Share
          </button>
          <button 
            className="btn border border-white/20" 
            onClick={handleViewRaw}
            disabled={!markdownContent}
          >
            {showRaw ? 'View Rendered' : 'View Raw'}
          </button>
        </div>
      </Card>
    </>
  );

  const renderContentArea = (message) => (
    <div className="flex-1 flex flex-col overflow-hidden gap-4">
      <div
        className="p-8 rounded-lg w-full max-h-full flex-1 shadow-xl"
        data-theme="prime200"
      >
        <p className="text-yellow-500 font-semibold">{message}</p>
        <span class="loading loading-spinner loading-xl"></span>
      </div>
      <div className="skeleton bg-white/1 h-16 w-full"></div>
    </div>
  );

  if (isLoading) {
    return renderContentArea("Loading document...");
  }

  if (!sourceLocation || hasFetchError || !markdownContent || hasRenderError) {
    const message = hasRenderError 
      ? "Document could not be rendered"
      : "Document could not be found";
    return renderContentArea(message);
  }

  return (
    <>
      {/* Desktop View */}
      <div className={`hidden md:flex flex-1 flex-col overflow-hidden gap-4 ${className || ""}`}>
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