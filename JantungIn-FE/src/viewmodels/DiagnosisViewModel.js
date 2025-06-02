import { ref, reactive, computed } from 'vue'
import diagnosisService from '@/services/DiagnosisService'

/**
 * Diagnosis ViewModel
 * Handles diagnosis form and submission
 */
export function useDiagnosisViewModel() {
  // Form state
  const symptomQuestions = ref([])
  const symptoms = reactive({})
  const patientInfo = reactive({
    name: '',
    nik: '',
    age: '',
    gender: '',
  })

  // UI state
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const currentStep = ref(0)
  const error = ref(null)
  const diagnosisResult = ref(null)
  const isOfflineMode = ref(!navigator.onLine)

  // Steps for the diagnosis form
  const steps = [
    { id: 'patient-info', title: 'Informasi Pasien' },
    { id: 'symptoms', title: 'Gejala' },
    { id: 'submit', title: 'Konfirmasi' },
    { id: 'result', title: 'Hasil' },
  ]

  // Computed properties
  const isLastStep = computed(() => currentStep.value === steps.length - 2) // Before result
  const isFirstStep = computed(() => currentStep.value === 0)
  const currentStepTitle = computed(() => steps[currentStep.value].title)
  const progress = computed(() => (currentStep.value / (steps.length - 1)) * 100)

  const isPatientInfoValid = computed(() => {
    return patientInfo.name && patientInfo.nik && patientInfo.age && patientInfo.gender
  })

  const hasSymptomsSelected = computed(() => {
    return Object.values(symptoms).some((value) => value === true)
  })

  const isFormValid = computed(() => {
    if (currentStep.value === 0) {
      return isPatientInfoValid.value
    } else if (currentStep.value === 1) {
      return hasSymptomsSelected.value
    }
    return true
  })

  /**
   * Load symptom questions
   */
  const loadSymptomQuestions = async () => {
    try {
      isLoading.value = true
      error.value = null

      const questions = await diagnosisService.getSymptomQuestions()
      symptomQuestions.value = questions

      // Initialize symptoms object
      questions.forEach((question) => {
        if (!(question.id in symptoms)) {
          symptoms[question.id] = false
        }
      })
    } catch (err) {
      console.error('Error loading questions:', err)
      error.value = 'Failed to load diagnosis questions. Please try again later.'
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Submit diagnosis for processing
   */
  const submitDiagnosis = async () => {
    try {
      isSubmitting.value = true
      error.value = null

      if (!navigator.onLine) {
        throw new Error('Diagnosis submission requires an internet connection')
      }

      const diagnosisData = {
        patientInfo: { ...patientInfo },
        symptoms: { ...symptoms },
      }

      const result = await diagnosisService.submitDiagnosis(diagnosisData)
      diagnosisResult.value = result

      // Move to results step
      currentStep.value = steps.length - 1
    } catch (err) {
      console.error('Error submitting diagnosis:', err)
      error.value = err.message || 'Failed to submit diagnosis. Please try again later.'
    } finally {
      isSubmitting.value = false
    }
  }

  /**
   * Go to next step in form
   */
  const nextStep = () => {
    if (!isFormValid.value) return

    if (isLastStep.value) {
      submitDiagnosis()
    } else {
      currentStep.value++
    }
  }

  /**
   * Go to previous step in form
   */
  const prevStep = () => {
    if (!isFirstStep.value) {
      currentStep.value--
    }
  }

  /**
   * Reset form to start
   */
  const resetForm = () => {
    // Reset patient info
    Object.keys(patientInfo).forEach((key) => {
      patientInfo[key] = ''
    })

    // Reset symptoms
    Object.keys(symptoms).forEach((key) => {
      symptoms[key] = false
    })

    // Reset UI state
    currentStep.value = 0
    diagnosisResult.value = null
    error.value = null
  }

  // Initialize
  loadSymptomQuestions()

  // Monitor online status
  window.addEventListener('online', () => {
    isOfflineMode.value = false
  })
  window.addEventListener('offline', () => {
    isOfflineMode.value = true
  })

  return {
    // State
    symptomQuestions,
    symptoms,
    patientInfo,
    isLoading,
    isSubmitting,
    currentStep,
    error,
    diagnosisResult,
    isOfflineMode,
    steps,

    // Computed
    isLastStep,
    isFirstStep,
    currentStepTitle,
    progress,
    isPatientInfoValid,
    hasSymptomsSelected,
    isFormValid,

    // Methods
    nextStep,
    prevStep,
    submitDiagnosis,
    resetForm,
  }
}
