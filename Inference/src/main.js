import * as tf from '@tensorflow/tfjs';

// DOM elements
const predictBtn = document.getElementById('predict-btn');
const resultText = document.getElementById('result-text');
const loader = document.getElementById('loader');

// Model and preprocessing variables
let model;
let scalerInfo;

// Feature names as used in the Python code - making sure to match the original model order
const featureNames = [
  'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 
  'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
];

// Load model and scaler info
async function loadModel() {
  try {
    // Show loading indicator
    loader.style.display = 'block';
    resultText.textContent = 'Loading model...';
    
    // Updated paths with explicit base URL
    const baseUrl = window.location.origin;
    
    // Load model with correct path
    model = await tf.loadLayersModel(`${baseUrl}/model/model.json`);
    
    // Load scaler information with correct path
    const response = await fetch(`${baseUrl}/model/scaler_info.json`);
    
    if (!response.ok) {
      throw new Error(`Failed to load scaler info: ${response.status} ${response.statusText}`);
    }
    
    scalerInfo = await response.json();
    
    resultText.textContent = 'Model loaded. Ready for predictions!';
    loader.style.display = 'none';
  } catch (error) {
    console.error('Error loading model:', error);
    resultText.textContent = 'Error loading model: ' + error.message;
    loader.style.display = 'none';
  }
}

// Scale input features using saved scaler parameters
function scaleFeatures(features) {
  return features.map((value, i) => {
    return (value - scalerInfo.mean[i]) / scalerInfo.scale[i];
  });
}

// Get all input values
function getInputValues() {
  const inputValues = {};
  featureNames.forEach(feature => {
    const element = document.getElementById(feature);
    if (element) {
      inputValues[feature] = parseFloat(element.value);
    }
  });
  return inputValues;
}

// Validate form inputs
function validateForm() {
  let isValid = true;
  let firstInvalidField = null;
  
  featureNames.forEach(feature => {
    const element = document.getElementById(feature);
    if (element) {
      const value = element.value.trim();
      const isInvalid = value === '' || isNaN(parseFloat(value));
      
      // Add/remove validation styling
      if (isInvalid) {
        element.classList.add('invalid');
        if (!firstInvalidField) firstInvalidField = element;
        isValid = false;
      } else {
        element.classList.remove('invalid');
      }
    }
  });
  
  if (!isValid && firstInvalidField) {
    firstInvalidField.focus();
  }
  
  return isValid;
}

// Make prediction with model
async function predict() {
  try {
    // Validate form
    if (!validateForm()) {
      resultText.textContent = 'Please fill in all fields with valid values';
      // Show results section if hidden
      document.querySelector('.mt-10').style.display = 'block';
      return;
    }
    
    // Check if model is loaded
    if (!model || !scalerInfo) {
      resultText.textContent = 'Model not loaded. Please wait or refresh the page.';
      // Show results section if hidden
      document.querySelector('.mt-10').style.display = 'block';
      return;
    }

    // Show results section if hidden
    document.querySelector('.mt-10').style.display = 'block';

    // Show loading indicator
    loader.style.display = 'block';
    resultText.textContent = 'Making prediction...';
    
    // Get input values
    const inputValues = getInputValues();
    
    // Arrange features in the same order as in the training data
    const orderedFeatures = featureNames.map(name => inputValues[name]);
    
    // Scale features
    const scaledFeatures = scaleFeatures(orderedFeatures);
    
    // Convert to tensor and reshape for model
    const inputTensor = tf.tensor2d([scaledFeatures]);
    
    // Run inference
    const prediction = await model.predict(inputTensor);
    const probabilityValue = prediction.dataSync()[0];
    
    // Convert to percentage and display result
    const percentage = (probabilityValue * 100).toFixed(2);
    
    // Get patient name for personalized message
    const patientName = document.getElementById('patientName').value.trim() || 'Patient';
    
    if (probabilityValue >= 0.5) {
      resultText.innerHTML = `<div class="text-center">
                              <div class="text-2xl font-bold text-red-600 mb-2">HIGH RISK: ${percentage}%</div>
                              <p class="mb-1">${patientName} has a high probability of heart disease.</p>
                              <p>Please consult with a cardiologist for further evaluation.</p>
                              </div>`;
    } else {
      resultText.innerHTML = `<div class="text-center">
                              <div class="text-2xl font-bold text-green-600 mb-2">LOW RISK: ${percentage}%</div>
                              <p class="mb-1">${patientName} has a low probability of heart disease.</p>
                              <p>Maintain a healthy lifestyle and regular check-ups.</p>
                              </div>`;
    }
    
    // Clean up tensors
    inputTensor.dispose();
    prediction.dispose();
    
    // Hide loading indicator
    loader.style.display = 'none';
    
  } catch (error) {
    console.error('Prediction error:', error);
    resultText.textContent = 'Error making prediction: ' + error.message;
    loader.style.display = 'none';
  }
}

// Add event listener to predict button
predictBtn.addEventListener('click', predict);

// Add event listener for form validation on input change
featureNames.forEach(feature => {
  const element = document.getElementById(feature);
  if (element) {
    element.addEventListener('input', function() {
      if (this.classList.contains('invalid') && this.value.trim() !== '') {
        this.classList.remove('invalid');
      }
    });
  }
});

// Add form submit event to prevent default behavior
const form = document.getElementById('diagnosis-form');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    predict();
  });
}

// Load model on page load
window.addEventListener('DOMContentLoaded', loadModel);
