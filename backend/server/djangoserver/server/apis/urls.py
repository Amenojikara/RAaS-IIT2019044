from django.urls import path, include
from .views import (UserAPIView, 
                    HeartDiseaseAPIView, 
                    CancerDiseaseAPIView, 
                    DiabetesDiseaseAPIView,
                    ThroatTumorDiseaseAPIView,
                    FilesView)

from rest_framework.routers import DefaultRouter

urlpatterns = [
    path('throat-tumor/', ThroatTumorDiseaseAPIView.as_view()),
    path('diabetes/', DiabetesDiseaseAPIView.as_view()),
    path('cancer/', CancerDiseaseAPIView.as_view()),
    path('files/', FilesView.as_view()),
    path('heart/', HeartDiseaseAPIView.as_view()),
    path('user/', UserAPIView.as_view())
]