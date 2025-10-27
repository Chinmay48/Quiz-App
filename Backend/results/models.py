from django.db import models
from accounts.models import Profile
from quizes.models import Quiz,Submission

class StudentResult(models.Model):
    student=models.ForeignKey(Profile,on_delete=models.CASCADE,limit_choices_to={'role':'student'})
    quiz=models.ForeignKey(Quiz,on_delete=models.CASCADE)
    score=models.IntegerField()
    total_questions=models.IntegerField()
    percentage=models.FloatField()
    passed=models.BooleanField(default=False)
    created_at=models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.student.user.username} - {self.quiz.title} ({self.score}/{self.total_questions})"
    

class DepartmentPerformance(models.Model):
    department=models.CharField(max_length=20,choices=Profile.DEPARTMENT_CHOICES)
    year=models.CharField(max_length=5,choices=Profile.YEAR_CHOICES)
    average_score=models.FloatField()
    highest_score=models.FloatField()
    lowest_score=models.FloatField()
    quiz=models.ForeignKey(Quiz,on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.department} Year {self.year} -{self.quiz.title}"

