import joblib
import pandas as pd
import numpy as np
# from sklearn.preprocessing import StandardScaler
# scaler = StandardScaler()

scaler = joblib.load("diabetes_scaler.pkl")
clf = joblib.load("diabetes_rf.pkl")

cols = ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin',
       'BMI', 'DiabetesPedigreeFunction', 'Age']

# data = [6, 148, 72, 35, 0, 33.6, 0.627, 50] ## 1
# data = [0, 137, 40, 35, 168, 43.1, 2.288, 33] ## 1
data = [1,	89,	66,	23,	94,	28.1,	0.167,	21] ## 0
# data = [7,	100,	0,	0,	0,	30.0,	0.484,	32] ## 1
data = np.array([data])

input_val = pd.DataFrame(data, columns=cols)
input_scaled = pd.DataFrame(scaler.transform(input_val),columns=cols)



prediction = clf.predict(input_val)

print(prediction)
