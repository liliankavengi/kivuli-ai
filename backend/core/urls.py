from django.contrib import admin
from django.urls import path
from api.views import get_ai_score, manage_stock, update_stock, sell_stock

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/score/<int:business_id>/', get_ai_score),
    path('api/stock/<int:business_id>/', manage_stock),
    path('api/stock/<int:business_id>/<int:stock_id>/', update_stock),
    path('api/stock/<int:business_id>/<int:stock_id>/sell/', sell_stock),
]