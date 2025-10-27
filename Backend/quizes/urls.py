from django.urls import path
from .views import quiz_list_create,answer_list_create,submission_list_create,question_list_create,quiz_delete,quiz_details,quiz_update,finalize_submission,submission_status

urlpatterns = [
    path('quizzes/',quiz_list_create,name='quizzes'),
    path('question/',question_list_create,name='questions'),
    path('submission/',submission_list_create,name='submission'),
    path('answers/',answer_list_create,name='answer'),
    path('quizzes/<int:quiz_id>/delete/',quiz_delete,name='quiz_delete'),
    path('quizzes/<int:quiz_id>/',quiz_details,name='quiz_detail'),
    path('quizzes/<int:quiz_id>/update/', quiz_update, name='quiz_update'),
    path('submission/<int:submission_id>/finish/',finalize_submission,name='final_submission'),
    path('<int:quiz_id>/submission-status/',submission_status,name='submission_status'),
    
    
]
