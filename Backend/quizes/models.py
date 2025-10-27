from django.db import models

from accounts.models import Profile
from django.utils import timezone

class Quiz(models.Model):
    title=models.CharField(max_length=100)
    description=models.TextField(blank=True,null=True)
    
    faculty=models.ForeignKey(Profile,on_delete=models.CASCADE,limit_choices_to={'role':'faculty'})
    
    department=models.CharField(max_length=20,choices=Profile.DEPARTMENT_CHOICES)
    
    year=models.CharField(
        max_length=5,choices=Profile.YEAR_CHOICES
    )
    start_time=models.DateTimeField(null=True, blank=True)
    end_time=models.DateTimeField()
    duration=models.DurationField()
    
    created_at=models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title}-{self.department}-{self.ye}"
    

class Question(models.Model):
    quiz=models.ForeignKey(Quiz,on_delete=models.CASCADE,related_name="questions")
    text=models.TextField()
    option1=models.CharField(max_length=255)
    option2=models.CharField(max_length=255)
    option3=models.CharField(max_length=255)
    option4=models.CharField(max_length=255)
    
    CORRECT_CHOICES=[
        ('1','Option 1'),
        ('2','Option 2'),
        ('3','Option 3'),
        ('4','Option 4'),
    ]
    
    correct_option=models.CharField(max_length=1,choices=CORRECT_CHOICES)
    
    def __str__(self):
        return f"{self.text[:50]}"
    
class Submission(models.Model):
    student=models.ForeignKey(Profile,on_delete=models.CASCADE,limit_choices_to={'role':"student"})
    
    quiz=models.ForeignKey(Quiz,on_delete=models.CASCADE)
    submitted_at=models.DateTimeField(default=timezone.now)
    
    score=models.IntegerField(default=0)
    def __str__(self):
        return f"{self.student.user.username}-{self.quiz.title}"
    
class Answer(models.Model):
    submission=models.ForeignKey(Submission,on_delete=models.CASCADE)
    question=models.ForeignKey(Question,on_delete=models.CASCADE)
    selected_option=models.CharField(max_length=1,choices=Question.CORRECT_CHOICES)
    
    def __str__(self):
        return f"Answer by {self.submission.student.user.name} for {self.question.id}"
    

    
    