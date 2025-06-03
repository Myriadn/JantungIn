<template>
  <div 
    ref="lazyBgRef" 
    :class="['lazy-background', { 'loaded': isLoaded }]" 
    :style="bgStyle" 
    class="transition-opacity duration-500"
    v-bind="$attrs">
    <slot></slot>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';

export default {
  name: 'LazyBackground',  props: {
    src: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: '/images/loading-placeholder.svg'
    },
    size: {
      type: String,
      default: 'cover'
    },
    position: {
      type: String,
      default: 'center'
    },
    repeat: {
      type: String,
      default: 'no-repeat'
    },
    threshold: {
      type: Number,
      default: 0.1
    },
    rootMargin: {
      type: String,
      default: '0px'
    },
    priority: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const lazyBgRef = ref(null);
    const isLoaded = ref(false);    const bgStyle = computed(() => {
      if (isLoaded.value) {
        return {
          backgroundImage: `url(${props.src})`,
          backgroundSize: props.size,
          backgroundPosition: props.position,
          backgroundRepeat: props.repeat
        };
      }
      return {
        backgroundImage: props.placeholder ? `url(${props.placeholder})` : 'none',
        backgroundSize: props.size,
        backgroundPosition: props.position,
        backgroundRepeat: props.repeat
      };
    });
      onMounted(() => {
      // Load immediately if priority background
      if (props.priority) {
        loadImage();
        return;
      }
      
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              loadImage();
              observer.unobserve(lazyBgRef.value);
            }
          });
        }, {
          threshold: props.threshold,
          rootMargin: props.rootMargin
        });
        
        observer.observe(lazyBgRef.value);
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
      img.src = props.src;
    };

    return {
      lazyBgRef,
      isLoaded,
      bgStyle
    };
  }
};
</script>
