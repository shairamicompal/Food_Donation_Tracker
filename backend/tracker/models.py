from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('donor', 'Donor'),
        ('organization', 'Organization')
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    address = models.TextField(blank=True, null=True)
    birthday = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.role}"

class Donation(models.Model):
    DONATION_TYPE_CHOICES = [
        ('donate', 'Donate'),
        ('waste', 'Waste')
    ]

    PICKUP_OPTIONS = [
        ('self_delivery', 'Self-delivery'),
        ('request_pickup', 'Request pickup')
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined')
    ]

    donor = models.ForeignKey(User, on_delete=models.CASCADE)  # Who is donating
    organization = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='received_donations'
    )
    food_type = models.CharField(max_length=100)
    quantity = models.CharField(max_length=100)  # "10 loaves", "5 kg", etc.
    expiration_date = models.DateField(null=True, blank=True)  # ✅ made optional
    pickup_option = models.CharField(
        max_length=50,
        choices=PICKUP_OPTIONS,
        blank=True,
        null=True
    )
    notes = models.TextField(blank=True, null=True)
    donation_type = models.CharField(max_length=10, choices=DONATION_TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"{self.food_type} ({self.quantity}) - {self.donation_type}"
