from django.contrib import admin
from .models import (User, 
                     HeartDisease, 
                     CancerDisease, 
                     DiabetesDisease, 
                     ThroatTumorDisease,
                     Files)

# Register your models here.

admin.site.register(User)
admin.site.register(HeartDisease)
admin.site.register(CancerDisease)
admin.site.register(DiabetesDisease)
admin.site.register(ThroatTumorDisease)
admin.site.register(Files)
