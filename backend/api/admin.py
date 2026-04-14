from django.contrib import admin
from .models import BusinessProfile, Transaction, Stock

admin.site.register(BusinessProfile)
admin.site.register(Transaction)
admin.site.register(Stock)