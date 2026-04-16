from django.contrib import admin
from .models import BusinessProfile, Transaction, Stock, UserProfile

admin.site.register(UserProfile)
admin.site.register(BusinessProfile)
admin.site.register(Transaction)
admin.site.register(Stock)