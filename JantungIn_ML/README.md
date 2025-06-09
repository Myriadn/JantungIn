# JantungIn - Machine Learning Documentation

## Overview
JantungIn ML adalah sistem prediksi penyakit jantung menggunakan **Multi-Layer Perceptron (MLP)** Neural Network yang dikembangkan dengan TensorFlow/Keras. Model ini dirancang untuk memprediksi kemungkinan seseorang mengalami penyakit jantung berdasarkan 13 parameter medis.

## Dataset
- **Sumber**: [UCI Heart Disease Dataset](https://archive.ics.uci.edu/ml/machine-learning-databases/heart-disease/processed.cleveland.data)
- **Jumlah Sampel**: 303 pasien (setelah preprocessing: 297 sampel)
- **Jumlah Fitur**: 13 parameter medis
- **Target**: Binary classification (0: Tidak ada penyakit jantung, 1: Ada penyakit jantung)

### Fitur Dataset
| Fitur | Deskripsi | Tipe Data |
|-------|-----------|-----------|
| age | Usia pasien | Integer |
| sex | Jenis kelamin (0: Perempuan, 1: Laki-laki) | Category |
| cp | Tipe nyeri dada (1-4) | Category |
| trestbps | Tekanan darah istirahat (mmHg) | Integer |
| chol | Kolesterol serum (mg/dl) | Integer |
| fbs | Gula darah puasa > 120 mg/dl (0: False, 1: True) | Category |
| restecg | Hasil elektrokardiografi istirahat (0-2) | Category |
| thalach | Denyut jantung maksimum | Integer |
| exang | Angina akibat olahraga (0: No, 1: Yes) | Category |
| oldpeak | ST depression | Float |
| slope | Kemiringan segment ST (1-3) | Category |
| ca | Jumlah pembuluh darah utama (0-3) | Integer |
| thal | Hasil thallium scan (3,6,7) | Category |

## Data Preprocessing

### 1. Pembersihan Data
- **Missing Values**: Mendeteksi dan menghapus nilai '?' yang merepresentasikan missing values
- **Data Duplikat**: Tidak ditemukan data duplikat
- **Outlier Removal**: Menghapus 6 outlier berdasarkan analisis boxplot

### 2. Transformasi Data

**Konversi Tipe Data:**
- **Kolom Numerik**: Semua 12 kolom fitur (age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, slope, ca, thal) dikonversi menjadi tipe data numerik integer untuk memastikan konsistensi dalam perhitungan matematika
- **Kolom Kategorikal**: Tujuh kolom (sex, cp, fbs, restecg, exang, slope, thal) yang merepresentasikan variabel kategorikal diubah menjadi tipe kategori untuk optimasi memori dan pemrosesan yang lebih efisien

**Transformasi Target Variable:**
Target variable 'num' dalam dataset asli memiliki 5 kelas (0, 1, 2, 3, 4) yang merepresentasikan tingkat keparahan penyakit jantung. Untuk menyederhanakan menjadi masalah binary classification:
- **Kelas 0**: Tetap sebagai 0 (tidak ada penyakit jantung)
- **Kelas 1, 2, 3, 4**: Diubah menjadi 1 (ada penyakit jantung)

Transformasi ini mengubah masalah multi-class classification menjadi binary classification yang lebih sederhana dan sesuai dengan tujuan aplikasi JantungIn untuk mendeteksi keberadaan penyakit jantung secara umum.

### 3. Standardisasi
- Menggunakan **StandardScaler** untuk normalisasi fitur
- Penting untuk konsistensi prediksi dalam deployment

## Model Architecture

### Multi-Layer Perceptron (MLP)
```python
model = Sequential([
    Dense(64, input_dim=13, activation='relu'),
    Dense(32, activation='relu'),
    Dense(1, activation='sigmoid')
])
```

**Spesifikasi Model:**
- **Input Layer**: 13 neurons (sesuai jumlah fitur)
- **Hidden Layer 1**: 64 neurons dengan ReLU activation
- **Hidden Layer 2**: 32 neurons dengan ReLU activation  
- **Output Layer**: 1 neuron dengan Sigmoid activation (binary classification)
- **Total Parameters**: ~2,800 parameters

### Hyperparameters
- **Optimizer**: Adam
- **Loss Function**: Binary Crossentropy
- **Metrics**: Accuracy
- **Batch Size**: 18
- **Max Epochs**: 100
- **Early Stopping**: Patience 20 dengan monitor val_accuracy

## Training Configuration

### Data Split
- **Training Set**: 90% (261 samples)
- **Test Set**: 10% (30 samples)
- **Random State**: 42 (untuk reproducibility)

### Training Process
```python
early_stop = EarlyStopping(monitor='val_accuracy', mode='max', patience=20, restore_best_weights=True, verbose=1)
history = model.fit(
    X_train, y_train,
    validation_data=(X_test, y_test),
    epochs=100,
    batch_size=18,
    callbacks=[early_stop],
    verbose=1
)
```

## Performance Metrics

### Model Performance
- **Test Accuracy**: **96.67%**
- **Test Loss**: 0.2194
- **Training Stopped**: Epoch 26 (Early Stopping)

### Confusion Matrix Analysis
```
                Predicted
Actual    0    1
   0     [15   1]
   1     [ 0  14]
```

**Key Insights:**
- **Zero False Negatives**: Model tidak melewatkan satupun kasus penyakit jantung
- **One False Positive**: Hanya 1 kasus yang diprediksi positif padahal negatif
- **Sensitivity (Recall)**: 100% - Sangat baik dalam mendeteksi penyakit jantung
- **Specificity**: 93.75% - Baik dalam mengidentifikasi kasus negatif

### Clinical Significance
- **False Negative Rate: 0%** - Sangat penting dalam konteks medis karena tidak ada pasien dengan penyakit jantung yang terlewat
- **False Positive Rate: 6.25%** - Dapat diterima karena lebih baik over-diagnose daripada miss-diagnose

## Model Deployment

### TensorFlow.js Conversion
```python
# Konversi untuk web deployment
MODEL_DIR = './public/model'
tfjs.converters.save_keras_model(model, MODEL_DIR)

# Simpan informasi scaler
scaler_info = {
    'mean': scaler.mean_.tolist(),
    'scale': scaler.scale_.tolist(),
    'feature_names': X.columns.tolist()
}
```

### Saved Model Format
```python
# Untuk production deployment
MODEL_DIR = './saved_model'
tf.saved_model.save(model, MODEL_DIR)
```

## File Structure
```
JantungIn_ML/
├── model/
│   ├── group1-shard1of1.bin    # Model weights (TensorFlow.js)
│   ├── model.json              # Model architecture (TensorFlow.js)
│   └── scaler_info.json        # Preprocessing parameters
├── notebook/
│   └── Notebook_JantungIn.ipynb # Complete ML pipeline
└── README.md
```

## Inference Example
```python
# Input data example
input_data = [63, 1, 1, 145, 233, 1, 2, 150, 0, 2, 3, 0, 6]

# Load model and preprocessing info
model = tf.saved_model.load('./saved_model')
with open('./model/scaler_info.json', 'r') as f:
    scaler_info = json.load(f)

# Preprocessing
scaler = StandardScaler()
scaler.mean_ = scaler_info['mean']
scaler.scale_ = scaler_info['scale']

# Prediction
example_input = np.array([input_data], dtype=np.float32)
example_input_scaled = scaler.transform(example_input)
predictions = model(example_input_scaled)
```

## Dependencies
```python
# Core ML libraries
tensorflow==2.15.0
tensorflowjs==4.17.0
tensorflow-decision-forests==1.8.1

# Data processing
pandas
numpy
scikit-learn

# Visualization
matplotlib
seaborn
```

## Key Features
- ✅ **High Accuracy**: 96.67% test accuracy
- ✅ **Zero False Negatives**: Critical for medical applications
- ✅ **Real-time Inference**: Optimized for web deployment
- ✅ **Robust Preprocessing**: Handles missing values and outliers
- ✅ **Production Ready**: Multiple deployment formats

## Future Improvements
1. **Cross-validation**: Implement k-fold CV for more robust evaluation
2. **Feature Engineering**: Explore feature interactions and polynomial features
3. **Ensemble Methods**: Combine with other algorithms for improved performance
4. **Explainability**: Add SHAP or LIME for model interpretability

## Usage in JantungIn Application
Model ini terintegrasi dengan aplikasi JantungIn untuk memberikan prediksi real-time risiko penyakit jantung berdasarkan input parameter medis pengguna. Tingkat akurasi 96.67% dan zero false negative rate membuatnya sangat reliable untuk screening awal penyakit jantung.