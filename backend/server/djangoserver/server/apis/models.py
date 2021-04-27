from django.db import models

# Create your models here.

class User(models.Model):
    fname = models.CharField(max_length=100)
    lname = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, default='')

    def __str__(self):
        return self.fname + self.lname;

class HeartDisease(models.Model):
    age = models.IntegerField()
    sex = models.IntegerField()
    cp = models.FloatField()
    trestbps = models.FloatField()
    chol = models.FloatField()
    fbs = models.FloatField()
    restecg = models.FloatField()
    thalach = models.FloatField()
    exang = models.FloatField()
    oldpeak = models.FloatField()
    slope = models.FloatField()
    ca = models.FloatField()
    thal = models.FloatField()
    prediction = models.IntegerField(null=True)

    def __str__(self):
        return "Test_Heart#"

class CancerDisease(models.Model):
    radius_mean = models.FloatField()
    perimeter_mean = models.FloatField()
    area_mean = models.FloatField()
    concavity_mean = models.FloatField()
    concave_points_mean = models.FloatField()
    radius_se = models.FloatField()
    area_se = models.FloatField()
    radius_worst = models.FloatField()
    texture_worst = models.FloatField()
    perimeter_worst = models.FloatField()
    area_worst = models.FloatField()
    compactness_worst = models.FloatField()
    concavity_worst = models.FloatField()
    concave_points_worst = models.FloatField()
    prediction = models.IntegerField(null=True)

    def __str__(self):
        return "CancerTest#"

class DiabetesDisease(models.Model):
    Pregnancies = models.FloatField()
    Glucose = models.FloatField()
    BloodPressure = models.FloatField()
    SkinThickness = models.FloatField()
    Insulin = models.FloatField()
    BMI = models.FloatField()
    DiabetesPedigreeFunction = models.FloatField()
    Age = models.IntegerField()
    prediction = models.IntegerField(null=True)

    def __str__(self):
        return "Diabetes#"

class ThroatTumorDisease(models.Model):
    title = models.CharField(max_length=1000, default="ThroatTumorMRI")
    # mri = models.ImageField(upload_to="mri_images")
    # mri = models.CharField(max_length=100, default="mri_image")
    # prediction = models.ImageField(upload_to='throat_prediction', null=True)
    prediction = models.JSONField(null=True)

    def __str__(self):
        return self.title

class Files(models.Model):
    name = models.CharField(max_length=100, default="")
    file = models.FileField()

    def __str__(self):
        return self.name




####### SAMPLE DATAS FOR TESTING ######

'''
Heart disease

59	1	0	164	176	1	0	90	0	1	1	2	1
55	0	0	128	205	0	2	130	1	2	1	1	3
60	0	0	150	258	0	0	157	0	2.6	1	2	3
57	0	1	130	236	0	0	174	0	0	1	1	2
48	1	0	130	256	1	0	150	1	0	2	2	3

{
    "age": 48,
    "sex": 1,
    "cp": 0,
    "trestbps": 130 ,
    "chol": 256,
    "fbs": 1,
    "restecg": 0 ,
    "thalach": 150,
    "exang": 1,
    "oldpeak": 0,
    "slope": 2,
    "ca": 2,
    "thal": 3  
    "prediction": 0
}
'''

'''
Breast Cancer

14.050	91.38	600.4	0.044620	0.04304	0.3645	29.84	15.300	33.17	100.20	706.7	0.22640	0.13260	0.10480
10.160	64.73,	311.7,	0.005025,	0.01116,	0.2441,	16.80,	10.650,	22.88,	67.88,	347.3,	0.12000,	0.01005,	0.02232
[9.173,	59.20,	260.9,	0.05988,	0.02180,	0.4098,	23.520,	10.01,	19.23,	65.59,	310.1,	0.16780,	0.1397,	0.05087]
{
    "radius_mean": 9.173,
    "perimeter_mean": 59.20,
    "area_mean": 260.9,
    "concavity_mean":0.05988,
    "concave_points_mean": 0.02180,
    "radius_se":0.4098,
    "area_se":23.520,
    "radius_worst":10.01,
    "texture_worst":19.23,
    "perimeter_worst":65.59,
    "area_worst":310.1,
    "compactness_worst":0.16780,
    "concavity_worst":0.1397,
    "concave_points_worst":0.05087
}

{
"radius_mean": 7.76,
"perimeter_mean": 47.92,
"area_mean": 181.0,
"concavity_mean": 0.0,
"concave_points_mean": 0.0,
"radius_se":0.3857,
"area_se":19.15,
"radius_worst":9.456,
"texture_worst":30.37,
"perimeter_worst":59.16,
"area_worst":268.6,
"compactness_worst":0.06444,
"concavity_worst":0.0,
"concave_points_worst":0.0
}
'''


'''
Diabetes

{
    "Pregnancies": 1,
    "Glucose": 89,
    "BloodPressure": 66,
    "SkinThickness": 23,
    "Insulin": 94,
    "BMI": 28.1,
    "DiabetesPedigreeFunction": 0.167,
    "Age": 21
}

'''
