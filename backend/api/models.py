from django.db import models

class BusinessProfile(models.Model):
    name = models.CharField(max_length=255)
    industry = models.CharField(max_length=100)
    owner_phone = models.CharField(max_length=15) # M-Pesa number
    trust_score = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Transaction(models.Model):
    business = models.ForeignKey(BusinessProfile, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2) # Fixed typo here too
    transaction_type = models.CharField(max_length=50) # e.g., 'Sale', 'Expense'
    mpesa_receipt_number = models.CharField(max_length=50, unique=True)
    ai_category = models.CharField(max_length=100, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.mpesa_receipt_number} - {self.amount}"