from rest_framework import serializers
from .models import (User, 
                     HeartDisease, 
                     CancerDisease, 
                     DiabetesDisease,
                     ThroatTumorDisease)

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'

class HeartDiseaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeartDisease
        fields = "__all__"

class CancerDiseaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = CancerDisease
        fields = "__all__"

class DiabetesDiseaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiabetesDisease
        fields = '__all__'

class ThroatTumorDiseaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ThroatTumorDisease
        fields = '__all__'
