# import pickle
import pandas as pd
import joblib
import numpy as np
from apis.models import Files

# Incoming JSON request Body

# {
#     "age": 48,
#     "sex": 1,
#     "cp": 0,
#     "trestbps": 130 ,
#     "chol": 256,
#     "fbs": 1,
#     "restecg": 0 ,
#     "thalach": 150,
#     "exang": 1,
#     "oldpeak": 0,
#     "slope": 2,
#     "ca": 2,
#     "thal": 3
# }

def heart_predictor(data_dict): 
    
    scaler = joblib.load(Files.objects.get(name="heart_scaler").file)
    clf = joblib.load(Files.objects.get(name="heart_lr").file)
    training_cols = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang',
       'oldpeak', 'slope', 'ca', 'thal', 'cp_0', 'cp_1', 'cp_2', 'cp_3', 'thal_0', 'thal_1',
       'thal_2', 'thal_3', 'slope_0', 'slope_1', 'slope_2']

    data = []
    cp = [0,0,0,0]
    thal = [0,0,0,0]
    slope = [0,0,0]

    for feature, val in data_dict.items():
        if(feature == 'cp'):
            cp[int(val)] = 1
        if(feature == 'thal'):
            thal[int(val)] = 1
        if(feature == 'slope'):
            slope[int(val)] = 1
        data.append(int(val))
    data = data + cp + thal + slope

    
    df = pd.DataFrame([data], columns=training_cols)
    df[df.columns] = scaler.transform(df[df.columns])

    prediction = clf.predict(df)
    return prediction[0]
    