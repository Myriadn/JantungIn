/**
 * Utility functions and directives for lazy loading
 */

// Create a custom directive that adds loading="lazy" to all images
export const lazyImageDirective = {
  mounted(el) {
    if (el.tagName === 'IMG') {
      el.setAttribute('loading', 'lazy');
    }
  }
};

/**
 * Observer for Intersection Observer API based lazy loading
 * This is a more advanced method that can be used for custom lazy loading
 * of any element, not just images
 */
export class LazyLoadObserver {
  constructor(options = {}) {
    this.options = {
      root: options.root || null,
      rootMargin: options.rootMargin || '0px',
      threshold: options.threshold || 0.1,
      onIntersect: options.onIntersect || this.defaultOnIntersect
    };
    
    this.observer = null;
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.options.onIntersect(entry.target);
            this.observer.unobserve(entry.target);
          }
        });
      }, {
        root: this.options.root,
        rootMargin: this.options.rootMargin,
        threshold: this.options.threshold
      });
    } else {
      // Fallback for browsers that don't support Intersection Observer
      console.warn('IntersectionObserver not supported, lazy loading disabled');
    }
  }

  observe(element) {
    if (this.observer) {
      this.observer.observe(element);
    }
  }
  
  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  defaultOnIntersect(target) {
    if (target.dataset.src) {
      target.src = target.dataset.src;
      target.classList.add('loaded');
    }
  }
}

// A simple function to check if an element is in viewport
export function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.bottom >= 0 &&
    rect.right >= 0 &&
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Preloads critical images to improve user experience
 * @param {Array} imageSources - Array of image sources to preload
 * @param {Function} callback - Optional callback when all images are loaded
 */
export function preloadCriticalImages(imageSources, callback) {
  if (!imageSources || !Array.isArray(imageSources) || imageSources.length === 0) {
    if (callback) callback();
    return;
  }
  
  let loadedCount = 0;
  const totalImages = imageSources.length;
  
  imageSources.forEach(src => {
    const img = new Image();
    img.onload = img.onerror = () => {
      loadedCount++;
      if (loadedCount === totalImages && callback) {
        callback();
      }
    };
    img.src = src;
  });
}
