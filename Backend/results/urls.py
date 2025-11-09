from django.urls import path
from .views import get_student_result,faculty_analytics,quiz_detail_analytics
urlpatterns = [
    path('quiz/<int:quiz_id>/',get_student_result,name='get_student_result'),
    path('faculty-analytics/',faculty_analytics,name='faculty_analytics'),
    path('quiz-detail-analytics/<int:quiz_id>/',quiz_detail_analytics,name='quiz_details_analytics')
]
