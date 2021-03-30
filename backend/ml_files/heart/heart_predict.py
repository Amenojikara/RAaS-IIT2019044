# Linear Regression - 80.23% accuracy

# import pickle
import joblib
import pandas as pd

clf = joblib.load("heart_lr.pkl")
scaler = joblib.load("heart_scaler.pkl")

# cp - [0 ,1 ,2, 3]
# thal - [0, 1, 2, 3]
# slope - [0, 1, 2]

training_cols = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang',
       'oldpeak', 'slope', 'ca', 'thal', 'cp_0', 'cp_1', 'cp_2', 'cp_3', 'thal_0', 'thal_1',
       'thal_2', 'thal_3', 'slope_0', 'slope_1', 'slope_2']

original_cols = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach','exang', 
       'oldpeak', 'slope', 'ca', 'thal' ]

# data_arr = [63,	1,	3,	145,	233,	1,	0,	150,	0,	2.3,	0,	0,	1]  ## ---> 1
# [57,	1,	0,	130,	131,	0,	1,	115,	1,	1.2,	1,	1,	3,	1,	0,	0,	0,	0,	0,	0,	1,	0,	1,	0]
# data = [57,	1,	0,	130,	131,	0,	1,	115,	1,	1.2,	1,	1,	3,	1,	0,	0,	0,	0,	0,	0,	1,	0,	1,	0]
data_dict = {
        'age': 57,
        'sex': 1,
        'cp': 0,
        'trestbps': 130 ,
        'chol': 131,
        'fbs': 0,
        'restecg': 1,
        'thalach': 115,
        'exang': 1,
        'oldpeak': 1.2,
        'slope': 1,
        'ca': 1,
        'thal': 3
        }
# data_dict = {
#     "age": 59,
#     "sex": 1,
#     "cp": 0,
#     "trestbps": 164 ,
#     "chol": 176,
#     "fbs": 1,
#     "restecg": 0 ,
#     "thalach": 90,
#     "exang": 0,
#     "oldpeak": 1,
#     "slope": 1,
#     "ca": 2,
#     "thal": 1
# }

data = []
cp = [0,0,0,0]
thal = [0,0,0,0,]
slope = [0,0,0]

for feature, val in data_dict.items():
    if(feature == 'cp'):
        cp[val] = 1
    if(feature == 'thal'):
        thal[val] = 1
    if(feature == 'slope'):
        slope[val] = 1        
    data.append(val)
    
data = data + cp + thal + slope

df = pd.DataFrame([data], columns=training_cols)
df[df.columns] = scaler.transform(df[df.columns])

prediction = clf.predict(df)

print(prediction[0])
