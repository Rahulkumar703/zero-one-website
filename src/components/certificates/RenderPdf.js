"use client";
import { useRef, useState, useEffect, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import Button from "../button/Button";
import { Skeleton } from "../ui/skeleton";

// Initialize pdf.js worker using workerSrc only to let react-pdf manage lifecycle
if (typeof window !== "undefined") {
  try {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();
  } catch (_) {
    // ignore
  }
}

if (typeof Promise.withResolvers !== "function") {
  Promise.withResolvers = function () {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

const RenderPdf = ({ url, thumbnailMode = false, download = false }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [containerWidth, setContainerWidth] = useState(null);
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize the options to prevent unnecessary reloads
  const renderOptions = useMemo(
    () => ({
      ...(thumbnailMode && {
        disableAutoFetch: true,
        disableStream: true,
        disableFontFace: true,
      }),
    }),
    [thumbnailMode]
  ); // Only recreate when these dependencies change

  // Memoize page options as well
  const pageOptions = useMemo(
    () => ({
      ...(thumbnailMode && {
        renderTextLayer: false,
        renderAnnotationLayer: false,
        scale: 1.0,
      }),
    }),
    [thumbnailMode]
  );

  const resizeDebounceRef = useRef(null);

  // Set up resize observer for container
  useEffect(() => {
    if (!containerRef.current) return;

    // set initial width once
    const initialWidth = containerRef.current.getBoundingClientRect().width;
    setContainerWidth((prev) => prev ?? initialWidth);

    const resizeObserver = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;

      if (resizeDebounceRef.current) clearTimeout(resizeDebounceRef.current);
      resizeDebounceRef.current = setTimeout(() => {
        // ignore tiny changes
        setContainerWidth((prev) =>
          prev && Math.abs(prev - width) < 2 ? prev : width
        );
      }, 300);
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      if (resizeDebounceRef.current) clearTimeout(resizeDebounceRef.current);
    };
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const onDocumentLoadError = (error) => {
    console.error("PDF load error:", error);
    setIsLoading(false);
  };

  // Let react-pdf manage the loading task lifecycle; avoid manual destroy to prevent warnings

  return (
    <div
      className={`relative w-full overflow-hidden rounded-lg border p-4 border-border pointer-events-none ${
        thumbnailMode ? "aspect-video" : ""
      }`}
      ref={containerRef}
    >
      {isLoading && !url && <Skeleton className="w-full aspect-video" />}

      {url && (
        <Document
          key={url}
          file={url}
          options={renderOptions}
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages);
            setIsLoading(false);
          }}
          onLoadError={onDocumentLoadError}
          loading={<Skeleton className="w-full aspect-video" />}
        >
          <Page
            pageNumber={pageNumber}
            width={containerWidth}
            loading={<Skeleton className="w-full aspect-video" />}
            {...pageOptions}
          />
        </Document>
      )}

      {download && url && (
        <div className="absolute bottom-4 right-4">
          <Button onClick={() => window.open(url, "_blank")} size="sm">
            Download
          </Button>
        </div>
      )}
    </div>
  );
};

export default RenderPdf;
