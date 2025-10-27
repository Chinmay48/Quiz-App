from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    ROLE_CHOICES=[
        ('faculty','Faculty'),
        ('student','Student'),
    ]
    
    DEPARTMENT_CHOICES=[
        ('COMP','COMP'),
        ('IT','IT'),
        ('AIDS','AIDS'),
        ('AIML','AIML'),
        ('EXTC','EXTC'),
        ('MECH','MECH'),
        ('IOT','IOT'),
        
    ]
    
    YEAR_CHOICES=[
        ('FE','FE'),
        ('SE','SE'),
        ('TE','TE'),
        ('BE','BE'),
    ]
    
    user=models.OneToOneField(User,on_delete=models.CASCADE)
    role=models.CharField(max_length=20,choices=ROLE_CHOICES)
    
    department=models.CharField(max_length=20,choices=DEPARTMENT_CHOICES)
    
    year=models.CharField(max_length=10,choices=YEAR_CHOICES,null=True,blank=True)
    
    def __str__(self):
        return f"{self.user.username}-{self.role}"