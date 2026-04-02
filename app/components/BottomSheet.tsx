"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface BottomSheetProps {
  children: ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  snapPoints?: number[]; // Percentage heights: [30, 60, 90]
  defaultSnap?: number; // Index of snapPoints
  title?: string;
  showHandle?: boolean;
}

export default function BottomSheet({
  children,
  isOpen = true,
  onClose,
  snapPoints = [30, 60, 90],
  defaultSnap = 0,
  title,
  showHandle = true,
}: BottomSheetProps) {
  const [currentSnap, setCurrentSnap] = useState(defaultSnap);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  const snapHeight = snapPoints[currentSnap] ?? 30;

  useEffect(() => {
    if (!isOpen && onClose) {
      onClose();
    }
  }, [isOpen, onClose]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0]?.clientY ?? 0);
    setCurrentY(e.touches[0]?.clientY ?? 0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setCurrentY(e.touches[0]?.clientY ?? 0);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const delta = startY - currentY;
    const threshold = 50; // Minimum swipe distance

    if (Math.abs(delta) > threshold) {
      if (delta > 0) {
        // Swiped up - go to next snap point
        if (currentSnap < snapPoints.length - 1) {
          setCurrentSnap(currentSnap + 1);
        }
      } else {
        // Swiped down - go to previous snap point
        if (currentSnap > 0) {
          setCurrentSnap(currentSnap - 1);
        } else if (onClose) {
          // At minimum snap, close the sheet
          onClose();
        }
      }
    }

    setStartY(0);
    setCurrentY(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setCurrentY(e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setCurrentY(e.clientY);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const delta = startY - currentY;
    const threshold = 50;

    if (Math.abs(delta) > threshold) {
      if (delta > 0 && currentSnap < snapPoints.length - 1) {
        setCurrentSnap(currentSnap + 1);
      } else if (delta < 0) {
        if (currentSnap > 0) {
          setCurrentSnap(currentSnap - 1);
        } else if (onClose) {
          onClose();
        }
      }
    }

    setStartY(0);
    setCurrentY(0);
  };

  if (!isOpen) return null;

  const translateY = isDragging ? currentY - startY : 0;
  const maxTranslate = 100; // Limit dragging distance

  return (
    <>
      {/* Backdrop - only visible on mobile */}
      <div
        className="fixed inset-0 bg-black/20 z-40 lg:hidden"
        style={{
          opacity: isDragging ? Math.max(0.2, 1 - Math.abs(translateY) / 200) : 1,
        }}
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.12)] lg:hidden"
        style={{
          height: `${snapHeight}vh`,
          transform: `translateY(${Math.min(Math.max(translateY, -maxTranslate), maxTranslate)}px)`,
          transition: isDragging ? "none" : "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Handle bar */}
        {showHandle && (
          <div className="flex items-center justify-center py-3 cursor-grab active:cursor-grabbing">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </div>
        )}

        {/* Title */}
        {title && (
          <div className="px-6 pb-3 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto overscroll-contain" style={{ height: `calc(${snapHeight}vh - ${title ? "80px" : "40px"})` }}>
          {children}
        </div>
      </div>
    </>
  );
}
