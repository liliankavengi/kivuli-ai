from django.contrib import admin
from django.urls import path
from api.views import get_ai_score

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/score/<int:business_id>/', get_ai_score), # New endpoint
]