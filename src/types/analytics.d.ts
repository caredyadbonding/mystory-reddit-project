// Global analytics type declarations
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    rdt?: any
  }
}

export {}