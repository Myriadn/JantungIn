# JantungIn Inference Model

Komponen Machine Learning dari aplikasi JantungIn yang menggunakan algoritma MLP (Multilayer Perceptron) untuk memprediksi risiko penyakit jantung berdasarkan data input pengguna.

## Deskripsi

Model inferensi ini dirancang untuk mengklasifikasikan status kesehatan kardiovaskular pengguna ke dalam kategori **Normal** atau **Risiko Penyakit Jantung** berdasarkan faktor-faktor risiko yang dimasukkan. Komponen ini diintegrasikan dengan JantungIn API untuk memproses data dan mengembalikan hasil prediksi.

## Teknologi

- **TensorFlow.js**: Library machine learning untuk JavaScript
- **Vite**: Build tool untuk aplikasi web modern
- **Tailwind CSS**: Utility-first CSS framework
- **Python**: Untuk pengembangan dan ekspor model

## Struktur Proyek

```
Inference/
├── model/                 # Model ML yang telah dilatih
│   ├── group1-shard1of1.bin  # File binary model
│   ├── model.json         # Konfigurasi model
│   └── scaler_info.json   # Informasi normalisasi
├── python/                # Script Python untuk pembuatan model
│   ├── export_model.py    # Skrip untuk mengekspor model ke format TensorFlow.js
│   └── untitled17.py      # Notebook untuk pemodelan
├── src/                   # Kode sumber frontend
├── public/                # File statis
├── image/                 # Aset gambar
└── data clean.csv         # Dataset untuk pengujian
```

## Instalasi

1. Pastikan Anda memiliki Node.js (v14 atau lebih baru) dan npm.

2. Instal dependensi yang diperlukan:

   ```bash
   npm install
   ```

3. Jalankan server pengembangan:

   ```bash
   npm run dev
   ```

   Aplikasi akan tersedia di `http://localhost:3000`

## Performa Model

- Model MLP yang diimplementasikan mencapai akurasi pengujian **94.67%** dalam membedakan kasus Normal dan Penyakit Jantung.
- Model telah dioptimalkan, dan peningkatan akurasi lebih lanjut sulit dicapai pada tahap ini.
- Peningkatan UI/UX direncanakan dan akan diimplementasikan segera.

## Integrasi dengan JantungIn

Model inferensi ini terintegrasi dengan komponen lain dari aplikasi JantungIn:

1. **Integrasi dengan Backend**: Model ini diakses oleh JantungIn API untuk memproses prediksi
2. **Akses Data**: Menggunakan data yang dikirimkan dari frontend melalui API
3. **Hasil Prediksi**: Mengembalikan hasil prediksi yang ditampilkan di frontend

## Pengembangan Model

Untuk mengembangkan model lebih lanjut:

1. Gunakan skrip Python di direktori `/python` untuk melatih model baru
2. Ekspor model ke format TensorFlow.js menggunakan `export_model.py`
3. Ganti file model di direktori `/model`

## Kontributor

- Ridho Alkhoiri
- Muhammad Rizqy Hidayah
- Farhan Abdul Mukhlis

## Lisensi

Proyek ini dilisensikan di bawah [Lisensi MIT](LICENSE)
