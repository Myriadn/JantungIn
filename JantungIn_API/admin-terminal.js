'use strict';

const axios = require('axios');
const readline = require('readline');

// Fungsi untuk membuat interface input/output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// URL API
const API_URL = 'http://localhost:3000';

// Variabel untuk menyimpan token
let authToken = '';

// Fungsi untuk melakukan login admin
async function adminLogin(username, password) {
  try {
    console.log('\nAttempting admin login...');
    const response = await axios.post(`${API_URL}/api/admin/login`, {
      username,
      password
    });

    console.log('\n✅ Login berhasil!');
    authToken = response.data.data.token;
    
    console.log('\nData Admin:');
    console.log(`Nama: ${response.data.data.name}`);
    console.log(`Email: ${response.data.data.email}`);
    console.log(`Role: ${response.data.data.role}`);
    
    return true;
  } catch (error) {
    console.error('\n❌ Login gagal:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Message: ${error.response.data.message || 'Unknown error'}`);
    } else {
      console.error(`Error: ${error.message}`);
    }
    return false;
  }
}

// Fungsi untuk mendapatkan daftar pasien
async function getPatients() {
  try {
    console.log('\nMengambil daftar pasien...');
    const response = await axios.get(`${API_URL}/api/admin/patients`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    console.log('\n✅ Daftar pasien berhasil diambil!');
    console.log('\nDaftar Pasien:');
    if (response.data.data.length === 0) {
      console.log('Tidak ada pasien terdaftar.');
    } else {
      response.data.data.forEach((patient, index) => {
        console.log(`\n${index + 1}. ${patient.name}`);
        console.log(`   ID: ${patient.id}`);
        console.log(`   Email: ${patient.email || 'Tidak ada email'}`);
      });
    }
  } catch (error) {
    console.error('\n❌ Gagal mengambil daftar pasien:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Message: ${error.response.data.message || 'Unknown error'}`);
    } else {
      console.error(`Error: ${error.message}`);
    }
  }
}

// Fungsi untuk mencari pasien berdasarkan NIK
async function findPatientByNik(nik) {
  try {
    console.log(`\nMencari pasien dengan NIK: ${nik}...`);
    const response = await axios.post(`${API_URL}/api/admin/patients/find`, 
      { nik }, 
      { headers: { Authorization: `Bearer ${authToken}` } }
    );

    console.log('\n✅ Pasien ditemukan!');
    console.log('\nData Pasien:');
    console.log(`Nama: ${response.data.data.name}`);
    console.log(`ID: ${response.data.data.id}`);
    console.log(`Email: ${response.data.data.email || 'Tidak ada email'}`);
    console.log(`Tanggal Lahir: ${response.data.data.dateOfBirth || 'Tidak ada data'}`);
    
    return response.data.data.id;
  } catch (error) {
    console.error('\n❌ Gagal mencari pasien:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Message: ${error.response.data.message || 'Unknown error'}`);
    } else {
      console.error(`Error: ${error.message}`);
    }
    return null;
  }
}

// Fungsi untuk membuat diagnosis untuk pasien
async function createDiagnosis(patientId) {
  try {
    // Data dummy untuk diagnosis
    const diagnosisData = {
      patientId,
      age: 45,
      sex: 'Male',
      chestPainType: 'Typical Angina',
      restingEcgResults: 'Normal',
      fastingBloodSugar: 120,
      restingBloodPressure: 130,
      maximumHeartRate: 150,
      exerciseInducedAngina: 'No',
      stSegment: 'Normal',
      majorVessels: 0,
      thalassemia: 'Normal',
      serumCholesterol: 200,
      stDepression: 0.5
    };

    console.log('\nMembuat diagnosis untuk pasien...');
    const response = await axios.post(
      `${API_URL}/api/diagnosis`, 
      diagnosisData,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );

    console.log('\n✅ Diagnosis berhasil dibuat!');
    console.log('\nHasil Diagnosis:');
    console.log(`ID: ${response.data.data.id}`);
    console.log(`Hasil Persentase: ${response.data.data.resultPercentage}%`);
    console.log(`Risiko Kardiovaskular: ${response.data.data.cardiovascularRisk}`);
    console.log(`Dibuat pada: ${response.data.data.createdAt}`);
  } catch (error) {
    console.error('\n❌ Gagal membuat diagnosis:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Message: ${error.response.data.message || 'Unknown error'}`);
    } else {
      console.error(`Error: ${error.message}`);
    }
  }
}

// Fungsi utama
async function main() {
  console.log('===== TERMINAL ADMIN JANTUNGIN =====');
  console.log('Login untuk melanjutkan');
  
  rl.question('Username: ', (username) => {
    rl.question('Password: ', async (password) => {
      const loginSuccess = await adminLogin(username, password);
      
      if (loginSuccess) {
        showMenu();
      } else {
        console.log('\nLogin gagal. Program berhenti.');
        rl.close();
      }
    });
  });
}

// Fungsi untuk menampilkan menu
function showMenu() {
  console.log('\n===== MENU ADMIN =====');
  console.log('1. Lihat Daftar Pasien');
  console.log('2. Cari Pasien berdasarkan NIK');
  console.log('3. Buat Diagnosis untuk Pasien');
  console.log('0. Keluar');
  
  rl.question('\nPilih menu: ', async (choice) => {
    switch (choice) {
      case '1':
        await getPatients();
        showMenu();
        break;
      case '2':
        rl.question('\nMasukkan NIK pasien: ', async (nik) => {
          await findPatientByNik(nik);
          showMenu();
        });
        break;
      case '3':
        rl.question('\nMasukkan NIK pasien: ', async (nik) => {
          const patientId = await findPatientByNik(nik);
          if (patientId) {
            await createDiagnosis(patientId);
          }
          showMenu();
        });
        break;
      case '0':
        console.log('\nTerima kasih telah menggunakan sistem admin JantungIn.');
        rl.close();
        break;
      default:
        console.log('\nPilihan tidak valid. Silakan coba lagi.');
        showMenu();
        break;
    }
  });
}

// Jalankan program
main();
