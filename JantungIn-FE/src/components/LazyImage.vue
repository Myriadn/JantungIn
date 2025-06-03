<template>
  <img
    ref="lazyImgRef"
    :class="['lazy-image', { 'fade-in': isLoaded }, loadingClass]"
    :src="isLoaded ? src : placeholder"
    :alt="alt"
    @load="onLoad"
    v-bind="$attrs"
  />
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'LazyImage',
  props: {
    src: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '/images/loading-placeholder.svg'
    },
    errorPlaceholder: {
      type: String,
      default: '/images/error-placeholder.svg'
    },
    threshold: {
      type: Number,
      default: 0.1
    },
    rootMargin: {
      type: String,
      default: '200px'
    },
    priority: {
      type: Boolean,
      default: false
    },
    loadingClass: {
      type: String,
      default: ''
    }
  },  setup(props) {
    const lazyImgRef = ref(null);
    const isLoaded = ref(false);
    const hasError = ref(false);
    
    onMounted(() => {
      // Load immediately if priority image
      if (props.priority) {
        loadImage();
        return;
      }
      
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              loadImage();
              observer.unobserve(lazyImgRef.value);
            }
          });
        }, {
          threshold: props.threshold,
          rootMargin: props.rootMargin
        });
        
        observer.observe(lazyImgRef.value);
      } else {
        // Fallback for browsers that don't support Intersection Observer
        loadImage();
      }
    });

    const loadImage = () => {
      const img = new Image();
      img.onload = () => {
        isLoaded.value = true;
      };
      img.onerror = () => {
        hasError.value = true;
        lazyImgRef.value.src = props.errorPlaceholder;
      };
      img.src = props.src;
    };

    const onLoad = () => {
      if (lazyImgRef.value.src === props.src) {
        isLoaded.value = true;
      }
    };

    return {
      lazyImgRef,
      isLoaded,
      onLoad
    };
  }
};
</script>

<style scoped>
.lazy-image {
  opacity: 0.5;
  transition: opacity 0.5s ease-in;
}
.lazy-image.fade-in {
  opacity: 1;
}
</style>
