import tensorflow as tf
import tensorflowjs as tfjs
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from untitled17 import model, scaler, X, columns

# Save model for TensorFlow.js
MODEL_DIR = './public/model'

# Save the model in TensorFlow.js format
tfjs.converters.save_keras_model(model, MODEL_DIR)

# Save scaler information (mean and variance) for preprocessing in JavaScript
scaler_info = {
    'mean': scaler.mean_.tolist(),
    'scale': scaler.scale_.tolist(),
    'feature_names': X.columns.tolist()
}

import json
with open(f'{MODEL_DIR}/scaler_info.json', 'w') as f:
    json.dump(scaler_info, f)

print(f"Model and scaler exported to {MODEL_DIR}")
