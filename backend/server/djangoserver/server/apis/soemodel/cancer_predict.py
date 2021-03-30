from apis.models import Files
import joblib
import numpy as np

# Incoming JSON request Body

# {
#     "radius_mean": 9.173,
#     "perimeter_mean": 59.20,
#     "area_mean": 260.9,
#     "concavity_mean": 0.05988,
#     "concave_points_mean": 0.02180,
#     "radius_se": 0.4098,
#     "area_se": 23.520,
#     "radius_worst": 10.01,
#     "texture_worst": 19.23,
#     "perimeter_worst": 65.59,
#     "area_worst": 310.1,
#     "compactness_worst": 0.16780,
#     "concavity_worst": 0.1397,
#     "concave_points_worst": 0.05087
# }

def cancer_predictor(data_dict):
    
    clf = joblib.load(Files.objects.get(name="cancer_regression").file)
    sc = joblib.load(Files.objects.get(name="cancer_scalar").file)

    data = []
    for _, val in data_dict.items():
        data.append(val)
    data = np.array([data])
    data = sc.transform(data)
    pred = clf.predict(data)
    return pred[0]
