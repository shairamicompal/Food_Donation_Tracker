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
    birthday = models.DateField(blank=True, null=True)  # 🎂 Changed from age to birthday
    
    def __str__(self):
        return f"{self.user.username} - {self.role}"
