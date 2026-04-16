from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('owner', 'Business Owner'),
        ('staff', 'Staff Member'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15, blank=True)
    business_name = models.CharField(max_length=255, blank=True)
    industry = models.CharField(max_length=100, blank=True)
    is_email_verified = models.BooleanField(default=False)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='owner')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.role}"

class BusinessProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    industry = models.CharField(max_length=100)
    owner_phone = models.CharField(max_length=15) # M-Pesa number
    registration_number = models.CharField(max_length=100, blank=True)
    tax_pin = models.CharField(max_length=100, blank=True)
    physical_address = models.TextField(blank=True)
    website = models.URLField(blank=True)
    trust_score = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class MpesaCheckout(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    checkout_request_id = models.CharField(max_length=100, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    phone_number = models.CharField(max_length=15)
    is_completed = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.checkout_request_id}"

class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=50) # e.g., 'Sale', 'Expense'
    mpesa_receipt_number = models.CharField(max_length=50, unique=True)
    ai_category = models.CharField(max_length=100, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.mpesa_receipt_number} - {self.amount}"

class Stock(models.Model):
    STATUS_CHOICES = [
        ('in_stock', 'In Stock'),
        ('low_stock', 'Low Stock'),
        ('out_of_stock', 'Out of Stock'),
        ('sold', 'Sold'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stocks')
    item_name = models.CharField(max_length=255)
    category = models.CharField(max_length=100, blank=True)
    quantity = models.IntegerField(default=0)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    minimum_quantity = models.IntegerField(default=5)  # Alert when below this
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_stock')
    date_added = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-date_added']

    def __str__(self):
        return f"{self.item_name} - {self.quantity} units"