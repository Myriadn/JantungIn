<template>
  <!-- This component doesn't render anything, it only preloads images -->
  <div style="display: none;"></div>
</template>

<script setup>
import { onMounted } from 'vue';
import { preloadCriticalImages } from '@/utils/lazyLoadUtils';

// Props to receive image URLs to preload
const props = defineProps({
  images: {
    type: Array,
    default: () => []
  },
  priority: {
    type: Boolean,
    default: false
  }
});

onMounted(() => {
  if (props.images && props.images.length > 0) {
    // Use requestIdleCallback if available for non-priority images
    if (!props.priority && window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        preloadCriticalImages(props.images);
      });
    } else {
      preloadCriticalImages(props.images);
    }
  }
});
</script>
