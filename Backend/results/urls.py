from django.urls import path
from .views import get_student_result
urlpatterns = [
    path('quiz/<int:quiz_id>/',get_student_result,name='get_student_result')
]
