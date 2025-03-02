'use client'


export function sendGAEvent(action: any, params = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', action, params);
  }
}


export function useAnalytics() {
  return {
    sendEvent: sendGAEvent
  };
}