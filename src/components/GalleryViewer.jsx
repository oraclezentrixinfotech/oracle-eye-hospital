"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

export default function GalleryViewer({ items = [], title = "" }) {
  const [containerWidth, setContainerWidth] = useState(1200);
  const [activeIdx, setActiveIdx] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const containerRef = useRef(null);
  const thumbsRef = useRef(null);
  const [hoverStates, setHoverStates] = useState({});

  // Responsive container width tracking
  useEffect(() => {
    function updateWidth() {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth || 1200);
      }
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Direction-aware hover logic matching sgg-style-8
  const getDirection = (e, elem) => {
    const rect = elem.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const x = (e.clientX - rect.left - w / 2) * (w > h ? h / w : 1);
    const y = (e.clientY - rect.top - h / 2) * (h > w ? w / h : 1);
    const direction = Math.round((Math.atan2(y, x) * (180 / Math.PI) + 180) / 90 + 3) % 4;
    // 0: top, 1: right, 2: bottom, 3: left
    return ["top", "right", "bottom", "left"][direction];
  };

  const handleMouseEnter = (idx, e) => {
    const dir = getDirection(e, e.currentTarget);
    setHoverStates((prev) => ({
      ...prev,
      [idx]: `in-${dir}`,
    }));
  };

  const handleMouseLeave = (idx, e) => {
    const dir = getDirection(e, e.currentTarget);
    setHoverStates((prev) => ({
      ...prev,
      [idx]: `out-${dir}`,
    }));
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (activeIdx === null) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveIdx(null);
        setIsZoomed(false);
      } else if (e.key === "ArrowRight") {
        setActiveIdx((prev) => (prev + 1) % items.length);
        setIsZoomed(false);
      } else if (e.key === "ArrowLeft") {
        setActiveIdx((prev) => (prev - 1 + items.length) % items.length);
        setIsZoomed(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIdx, items.length]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (activeIdx !== null && thumbsRef.current) {
      const activeThumb = thumbsRef.current.children[activeIdx];
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  }, [activeIdx]);

  // Calculate justified rows
  const targetRowHeight = containerWidth < 576 ? 130 : containerWidth < 992 ? 160 : 190;
  const margin = 10;

  const rows = [];
  let currentRow = [];
  let currentRowWidth = 0;

  items.forEach((item, index) => {
    const aspect = item.aspectRatio || (item.width && item.height ? item.width / item.height : 1.33);
    const itemWidth = targetRowHeight * aspect;

    currentRow.push({ ...item, index, aspect, computedWidth: itemWidth });
    currentRowWidth += itemWidth;

    const totalMargins = (currentRow.length - 1) * margin;
    const availableWidth = containerWidth - totalMargins;

    if (currentRowWidth >= availableWidth) {
      const scale = availableWidth / currentRowWidth;
      const actualHeight = Math.round(targetRowHeight * scale);
      rows.push({
        height: actualHeight,
        items: currentRow.map((it) => ({
          ...it,
          finalWidth: Math.round(it.computedWidth * scale),
          finalHeight: actualHeight,
        })),
      });
      currentRow = [];
      currentRowWidth = 0;
    }
  });

  // Remaining items in the last row
  if (currentRow.length > 0) {
    rows.push({
      height: targetRowHeight,
      items: currentRow.map((it) => ({
        ...it,
        finalWidth: Math.round(it.computedWidth),
        finalHeight: targetRowHeight,
      })),
      isLastRow: true,
    });
  }

  const activeItem = activeIdx !== null ? items[activeIdx] : null;

  return (
    <>
      <div ref={containerRef} className="gallery-justified-container justified-gallery sgg-style-8">
        {rows.map((row, rIdx) => (
          <div
            key={rIdx}
            className="gallery-row"
            style={{
              display: "flex",
              flexWrap: "nowrap",
              gap: `${margin}px`,
              marginBottom: `${margin}px`,
              justifyContent: row.isLastRow ? "flex-start" : "space-between",
            }}
          >
            {row.items.map((item) => {
              const stateClass = hoverStates[item.index] || "";
              return (
                <div
                  key={item.index}
                  className={`gallery-item-box ${stateClass}`}
                  onClick={() => {
                    setActiveIdx(item.index);
                    setIsZoomed(false);
                  }}
                  onMouseEnter={(e) => handleMouseEnter(item.index, e)}
                  onMouseLeave={(e) => handleMouseLeave(item.index, e)}
                  style={{
                    position: "relative",
                    flex: `0 0 ${item.finalWidth}px`,
                    width: `${item.finalWidth}px`,
                    height: `${item.finalHeight}px`,
                    borderRadius: "6px",
                    overflow: "hidden",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                    backgroundColor: "#e2e8f0",
                  }}
                >
                  <img
                    src={item.src}
                    alt={item.alt || title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.4s ease",
                    }}
                    loading="lazy"
                  />
                  {/* Directional animated overlay */}
                  <div className="sgg-caption">
                    <span className="caption-content">
                      <i className="fa-solid fa-expand" style={{ fontSize: "20px", color: "#fff" }}></i>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Photobox Lightbox Modal */}
      {activeIdx !== null && activeItem && (
        <div
          id="pbOverlay"
          className="show photobox-modal"
          onClick={(e) => {
            if (e.target.id === "pbOverlay" || e.target.classList.contains("pb-backdrop-click")) {
              setActiveIdx(null);
              setIsZoomed(false);
            }
          }}
        >
          {/* Top Bar */}
          <div className="pb-top-bar">
            <div className="pb-title-counter">
              <span className="pb-title">{activeItem.alt || title}</span>
              <span className="pb-counter">
                ({activeIdx + 1}/{items.length})
              </span>
            </div>
            <div className="pb-actions">
              <button
                type="button"
                className="pb-btn"
                title={isZoomed ? "Zoom Out" : "Zoom In"}
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <i className={`fa-solid ${isZoomed ? "fa-magnifying-glass-minus" : "fa-magnifying-glass-plus"}`}></i>
              </button>
              <button
                type="button"
                className="pb-btn pb-close"
                title="Close (Esc)"
                onClick={() => {
                  setActiveIdx(null);
                  setIsZoomed(false);
                }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            type="button"
            className="pb-nav-btn pb-prev"
            title="Previous (Left Arrow)"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIdx((prev) => (prev - 1 + items.length) % items.length);
              setIsZoomed(false);
            }}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          <button
            type="button"
            className="pb-nav-btn pb-next"
            title="Next (Right Arrow)"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIdx((prev) => (prev + 1) % items.length);
              setIsZoomed(false);
            }}
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>

          {/* Main Image Stage */}
          <div className="pb-image-stage pb-backdrop-click">
            <div
              className={`pb-image-wrapper ${isZoomed ? "zoomed" : ""}`}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <img
                key={activeItem.src}
                src={activeItem.src}
                alt={activeItem.alt || title}
                className="pb-main-image"
              />
            </div>
          </div>

          {/* Bottom Thumbnail Strip */}
          <div className="pb-thumbs-wrapper">
            <div className="pb-thumbs-strip" ref={thumbsRef}>
              {items.map((it, idx) => (
                <div
                  key={idx}
                  className={`pb-thumb-item ${idx === activeIdx ? "active" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIdx(idx);
                    setIsZoomed(false);
                  }}
                >
                  <img src={it.src} alt={it.alt} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
