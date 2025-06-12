<template>
  <button
    @click="handlePrint"
    class="print-button px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition-colors flex items-center justify-center"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5 mr-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z"
      />
    </svg>
    {{ label }}
  </button>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: 'Cetak Laporan'
  }
})

const emit = defineEmits(['print'])

const handlePrint = () => {
  emit('print')
}
</script>

<style scoped>
.print-button {
  transition: all 0.2s ease;
}

.print-button:hover {
  transform: translateY(-1px);
}

.print-button:active {
  transform: translateY(1px);
}
</style>
