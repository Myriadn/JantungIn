'use strict';

// Contoh implementasi prediksi sederhana
// Di implementasi sebenarnya Anda akan menggunakan ML model

const predictCardiovascularDisease = async (data) => {
  // Simulasi proses prediksi
  // Catatan: Pada project sebenarnya, Anda bisa mengintegrasikan dengan
  // model ML yang di-deploy di AWS SageMaker, atau menggunakan algoritma ML

  // Contoh implementasi sederhana untuk simulasi
  let riskScore = 0;

  // Faktor usia
  if (data.age > 50) riskScore += 20;
  else if (data.age > 40) riskScore += 10;

  // Faktor jenis kelamin
  if (data.sex === 'Male') riskScore += 5;

  // Faktor nyeri dada
  if (data.chestPainType === 'Typical angina') riskScore += 20;
  else if (data.chestPainType === 'Atypical angina') riskScore += 10;

  // Faktor tekanan darah
  if (data.restingBloodPressure > 140) riskScore += 15;

  // Faktor gula darah
  if (data.fastingBloodSugar > 120) riskScore += 10;

  // Faktor kolesterol
  if (data.serumCholesterol > 240) riskScore += 15;
  else if (data.serumCholesterol > 200) riskScore += 5;
  // Tentukan risk level
  let cardiovascularRisk;
  if (riskScore < 30) cardiovascularRisk = 'Low';
  else if (riskScore < 60) cardiovascularRisk = 'Medium';
  else cardiovascularRisk = 'High';

  // Normalisasi score menjadi persentase (0-100)
  const resultPercentage = Math.min(100, Math.round((riskScore * 100) / 80));

  // Tentukan prediksi berdasarkan cardiovascularRisk
  const prediction = cardiovascularRisk === 'Low' ? 'Tidak Berisiko' : 'Berisiko';

  return {
    resultPercentage,
    cardiovascularRisk,
    prediction,
  };
};

module.exports = {
  predictCardiovascularDisease,
};
