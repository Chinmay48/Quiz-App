from django.shortcuts import render
from quizes.models import Answer
from accounts.models import Profile
from .models import StudentResult
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import StudentResultSerializer

def calculate_student_result(submission):
    answers=Answer.objects.filter(submission=submission)
    total_questions=answers.count()
    
    correct_answer=sum(
        1 for ans in answers if ans.selected_option==ans.question.correct_option
    )
    
    percentage=(correct_answer/total_questions)*100 if total_questions>0 else 0
    
    passed=percentage>=40
    
    StudentResult.objects.update_or_create(
        student=submission.student,
        quiz=submission.quiz,
        defaults={
            'score':correct_answer,
            'total_questions':total_questions,
            'percentage':percentage,
            'passed':passed
        }
    )
    return {
        'score': correct_answer,
        'total_questions': total_questions,
        'percentage': percentage,
        'passed': passed
    }

@api_view(['GET'])    
def get_student_result(request,quiz_id):
    student_profile=Profile.objects.get(user=request.user)
    try:
        result=StudentResult.objects.get(student=student_profile,quit=quiz_id)
    except StudentResult.DoesNotExist:
        return Response({'error':'Result Not found'},status=status.HTTP_404_NOT_FOUND)
    
    serializer=StudentResultSerializer(result)
    return Response(serializer.data)