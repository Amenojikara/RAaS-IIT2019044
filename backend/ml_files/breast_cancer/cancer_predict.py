# Logistic Regression --- 0.9615384615384616 %
# M - Malignant - 1
# B - Benign - 0
 
# import pickle
import joblib
import numpy as np
# from sklearn.metrics import accuracy_score

cols = ['radius_mean', 'perimeter_mean', 'area_mean', 'concavity_mean',
       'concave_points_mean', 'radius_se', 'area_se', 'radius_worst',
       'texture_worst', 'perimeter_worst', 'area_worst', 'compactness_worst',
       'concavity_worst', 'concave_points_worst']
classifier = joblib.load("cancer_regression.pkl")
scanner = joblib.load("cancer_scalar.pkl")

# clf = pickle.load(open("cancer_regression.pkl", "rb"))
# sc = pickle.load(open("cancer_scalar.pkl", "rb"))
# x_test = pickle.load(open("x_test.pkl", "rb"))

#####
# [7.76,	47.92,	181.0,	0.0,	0.0, 0.3857,	19.15,	9.456,	30.37,	59.16,	268.6,	0.06444,	0.0,	0.0]  -----> 0
# [12.45,	82.57,	477.1,	0.15780,	0.08089,	0.3345,	27.19,	15.470,	23.75,	103.40,	741.6,	0.52490,	0.5355,	0.1741] ---> 1
# [11.200,	70.67,	386.0,	0.000000,	0.00000,	0.3141,	22.81,	11.920,	38.30,	75.19,	439.6,	0.05494,	0.00000 , 0.00000] ----> 0
# [10.160,	64.73,	311.7,	0.005025,	0.01116,	0.2441,	16.80,	10.650,	22.88,	67.88,	347.3,	0.12000,	0.01005,	0.02232]
# [10.290,65.67,321.4,0.059990,0.02738,0.2199,14.46,10.840,34.91,69.57,357.6,0.17100,0.20000,0.09127]
#####

# data = np.array([[10.290,65.67,321.4,0.059990,0.02738,0.2199,14.46,10.840,34.91,69.57,357.6,0.17100,0.20000,0.09127]])
# data = sc.transform(data)

# y_pred = clf.predict(data)
# print(y_pred)

data = scanner.transform(np.array([[9.173,	59.20,	260.9,	0.05988,	0.02180,	0.4098,	23.520,	10.01,	19.23,	65.59,	310.1,	0.16780,	0.1397,	0.05087]]))
y_predic = classifier.predict(data)
print(y_predic)
