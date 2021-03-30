#IMPORTING MODULES

from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.views import APIView

from .models import (User, 
                     HeartDisease, 
                     CancerDisease,
                     DiabetesDisease,
                     ThroatTumorDisease)

from .serializers import (UserSerializer, 
                          HeartDiseaseSerializer, 
                          CancerDiseaseSerializer,
                          DiabetesDiseaseSerializer,
                          ThroatTumorDiseaseSerializer)

from .soemodel import (heart_predictor, 
                       cancer_predictor,
                       diabetes_predictor,
                       throat_tumor_predictor
                    )


### API VIEWS

class UserAPIView(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data
        data["email"] = data["fname"] + data["lname"] + "@gmail.com"
        print(data)
        serializer = UserSerializer(data = data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class HeartDiseaseAPIView(APIView):
    def get(self, request):
        tests = HeartDisease.objects.all()
        serializer = HeartDiseaseSerializer(tests, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        data_dict = request.data
        prediction = heart_predictor(data_dict)
        # print(prediction)
        data_dict['prediction'] = prediction

        serializer = HeartDiseaseSerializer(data = data_dict)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CancerDiseaseAPIView(APIView):
    def get(self, request):
        tests = CancerDisease.objects.all()
        serializer = CancerDiseaseSerializer(tests, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        data_dict = request.data
        prediction = cancer_predictor(data_dict)
        data_dict['prediction'] = prediction
        serializer = CancerDiseaseSerializer(data = data_dict)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DiabetesDiseaseAPIView(APIView):
    def get(self, request):
        tests = DiabetesDisease.objects.all()
        serializer = DiabetesDiseaseSerializer(tests, many=True)
        return Response(serializer.data)

    def post(self, request):
        data_dict = request.data
        prediction = diabetes_predictor(data_dict)
        data_dict['prediction'] = prediction
        serializer = DiabetesDiseaseSerializer(data = data_dict)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ThroatTumorDiseaseAPIView(APIView):
    def get(self, request):
        tests = ThroatTumorDisease.objects.all()
        serializer = ThroatTumorDiseaseSerializer(tests, many=True)
        return Response(serializer.data)

   
    def post(self, request):
        data_dict = request.data
        serializer = ThroatTumorDiseaseSerializer(data=data_dict)
        if serializer.is_valid():
            serializer_instance = serializer.save()
            predJSON = throat_tumor_predictor(data_dict['title'])
            serializer_instance.prediction = predJSON
            serializer_instance.save()
            return Response(serializer_instance.prediction, status=status.HTTP_201_CREATED)
        elif serializer.errors():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class FilesView(APIView):
    def get(self, request):
        return Response(request.data)

