from django.contrib import admin
from django.urls import path
from api.views import (
    get_ai_score, manage_stock, update_stock, sell_stock,
    user_register, user_login, user_logout, user_settings, user_password_reset,
    verify_email, mpesa_stk_push, mpesa_callback
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # Authentication endpoints
    path('api/auth/register/', user_register, name='user_register'),
    path('api/auth/login/', user_login, name='user_login'),
    path('api/auth/logout/', user_logout, name='user_logout'),
    path('api/auth/password-reset/', user_password_reset, name='user_password_reset'),
    path('api/auth/verify-email/', verify_email, name='verify_email'),

    # Settings endpoint
    path('api/auth/settings/', user_settings, name='user_settings'),

    # Business endpoints
    path('api/score/', get_ai_score, name='get_ai_score'),

    # Stock management endpoints
    path('api/stock/', manage_stock, name='manage_stock'),
    path('api/stock/<int:stock_id>/', update_stock, name='update_stock'),
    path('api/stock/<int:stock_id>/sell/', sell_stock, name='sell_stock'),

    # M-Pesa endpoints
    path('api/mpesa/stkpush/', mpesa_stk_push, name='mpesa_stk_push'),
    path('api/mpesa/callback/', mpesa_callback, name='mpesa_callback'),
]