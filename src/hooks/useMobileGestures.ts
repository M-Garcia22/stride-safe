
import { useEffect, useRef, useState } from 'react';

interface GestureState {
  scale: number;
  translateX: number;
  translateY: number;
  rotation: number;
}

interface GestureCallbacks {
  onPinchZoom?: (scale: number) => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onDoubleTap?: () => void;
}

export const useMobileGestures = (callbacks: GestureCallbacks = {}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [gestureState, setGestureState] = useState<GestureState>({
    scale: 1,
    translateX: 0,
    translateY: 0,
    rotation: 0
  });

  const touchStartRef = useRef<TouchList | null>(null);
  const lastTapRef = useRef<number>(0);
  const initialDistanceRef = useRef<number>(0);
  const initialScaleRef = useRef<number>(1);

  // Calculate distance between two touches
  const getTouchDistance = (touches: TouchList): number => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  // Calculate swipe direction and distance
  const getSwipeData = (startTouch: Touch, endTouch: Touch) => {
    const deltaX = endTouch.clientX - startTouch.clientX;
    const deltaY = endTouch.clientY - startTouch.clientY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
    
    return { deltaX, deltaY, distance, angle };
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let isGesturing = false;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = e.touches;
      
      if (e.touches.length === 2) {
        // Pinch gesture start
        initialDistanceRef.current = getTouchDistance(e.touches);
        initialScaleRef.current = gestureState.scale;
        isGesturing = true;
        e.preventDefault();
      } else if (e.touches.length === 1) {
        // Potential swipe or tap
        const now = Date.now();
        const timeDiff = now - lastTapRef.current;
        
        if (timeDiff < 300 && timeDiff > 0) {
          // Double tap detected
          callbacks.onDoubleTap?.();
          e.preventDefault();
        }
        lastTapRef.current = now;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialDistanceRef.current > 0) {
        // Pinch zoom
        const currentDistance = getTouchDistance(e.touches);
        const scale = (currentDistance / initialDistanceRef.current) * initialScaleRef.current;
        
        setGestureState(prev => ({ ...prev, scale: Math.max(0.5, Math.min(3, scale)) }));
        callbacks.onPinchZoom?.(scale);
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isGesturing) {
        isGesturing = false;
        return;
      }

      if (touchStartRef.current && touchStartRef.current.length === 1 && e.changedTouches.length === 1) {
        const startTouch = touchStartRef.current[0];
        const endTouch = e.changedTouches[0];
        const { deltaX, deltaY, distance } = getSwipeData(startTouch, endTouch);
        
        // Minimum distance for swipe detection
        if (distance > 50) {
          const absX = Math.abs(deltaX);
          const absY = Math.abs(deltaY);
          
          if (absX > absY) {
            // Horizontal swipe
            if (deltaX > 0) {
              callbacks.onSwipeRight?.();
            } else {
              callbacks.onSwipeLeft?.();
            }
          } else {
            // Vertical swipe
            if (deltaY > 0) {
              callbacks.onSwipeDown?.();
            } else {
              callbacks.onSwipeUp?.();
            }
          }
        }
      }
      
      touchStartRef.current = null;
    };

    // Add passive: false to allow preventDefault
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [callbacks, gestureState.scale]);

  const resetGestures = () => {
    setGestureState({
      scale: 1,
      translateX: 0,
      translateY: 0,
      rotation: 0
    });
  };

  return {
    elementRef,
    gestureState,
    resetGestures
  };
};
