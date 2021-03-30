from apis.models import Files
import joblib
import numpy as np
import pandas as pd

# Incoming JSON request Body

# {
#     "Pregnancies": 1,
#     "Glucose": 89,
#     "BloodPressure": 66,
#     "SkinThickness": 23,
#     "Insulin": 94,
#     "BMI": 28.1,
#     "DiabetesPedigreeFunction": 0.167,
#     "Age": 21
# }

def diabetes_predictor(data_dict):
    
    scaler = joblib.load(Files.objects.get(name="diabetes_scaler").file)
    clf = joblib.load(Files.objects.get(name="diabetes_rf").file)

    cols = ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin',
       'BMI', 'DiabetesPedigreeFunction', 'Age']

    data = []
    for _, val in data_dict.items():
        data.append(val)
    
    data = np.array([data])

    input_val = pd.DataFrame(data, columns=cols)
    input_scaled = pd.DataFrame(scaler.transform(input_val),columns=cols)

    prediction = clf.predict(input_val)

    return prediction[0]
