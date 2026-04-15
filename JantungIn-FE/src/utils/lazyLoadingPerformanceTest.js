/**
 * Lazy Loading Performance Test Utility
 * This file provides functions to measure and demonstrate the performance improvements
 * achieved by implementing lazy loading across the application.
 */

/**
 * Measures the load time of an image with and without lazy loading
 * @param {string} imageUrl - The URL of the image to test
 * @param {boolean} useLazyLoading - Whether to use lazy loading or not
 * @returns {Promise<number>} - The time taken to load the image in milliseconds
 */
export async function measureImageLoadTime(imageUrl, useLazyLoading = false) {
  return new Promise((resolve) => {
    const startTime = performance.now()

    const img = new Image()

    img.onload = () => {
      const endTime = performance.now()
      resolve(endTime - startTime)
    }

    if (useLazyLoading) {
      img.loading = 'lazy'
    }

    img.src = imageUrl

    // Add to DOM to trigger loading (especially important for lazy loading)
    document.body.appendChild(img)
    img.style.position = 'absolute'
    img.style.left = '-9999px' // Hide off-screen

    // Clean up after load
    img.onload = () => {
      const endTime = performance.now()
      document.body.removeChild(img)
      resolve(endTime - startTime)
    }
  })
}

/**
 * Compares and logs the performance difference between eager and lazy loading
 * @param {Array<string>} imageUrls - Array of image URLs to test
 * @returns {Promise<Object>} - Results of the performance comparison
 */
export async function compareLoadingPerformance(imageUrls) {
  const results = {
    eagerLoading: {
      totalTime: 0,
      individualTimes: [],
    },
    lazyLoading: {
      totalTime: 0,
      individualTimes: [],
    },
    improvement: 0,
  }

  console.log('Starting performance comparison...')

  // First measure eager loading (all images at once)
  // const eagerStartTime = performance.now()

  for (const url of imageUrls) {
    const time = await measureImageLoadTime(url, false)
    results.eagerLoading.individualTimes.push({
      url,
      time: time.toFixed(2),
    })
    results.eagerLoading.totalTime += time
  }

  // Then measure lazy loading
  // const lazyStartTime = performance.now()

  for (const url of imageUrls) {
    const time = await measureImageLoadTime(url, true)
    results.lazyLoading.individualTimes.push({
      url,
      time: time.toFixed(2),
    })
    results.lazyLoading.totalTime += time
  }

  results.eagerLoading.totalTime = results.eagerLoading.totalTime.toFixed(2)
  results.lazyLoading.totalTime = results.lazyLoading.totalTime.toFixed(2)
  results.improvement = (
    ((results.eagerLoading.totalTime - results.lazyLoading.totalTime) /
      results.eagerLoading.totalTime) *
    100
  ).toFixed(2)

  console.log('Performance comparison results:', results)

  return results
}

// Example usage:
// import { compareLoadingPerformance } from './lazyLoadingPerformanceTest';
//
// const imagesToTest = [
//   '/images/heart1.jpg',
//   '/images/heart2.jpg',
//   '/images/heart3.jpg',
//   '/images/hostipal.jpg',
//   '/images/azwin.jpg'
// ];
//
// compareLoadingPerformance(imagesToTest).then(results => {
//   console.log(`Lazy loading improved performance by ${results.improvement}%`);
// });
