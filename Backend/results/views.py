from django.shortcuts import render
from quizes.models import Answer
from django.db.models import Count,Min,Max,Avg
from accounts.models import Profile
from quizes.models import Quiz
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
        result=StudentResult.objects.get(student=student_profile,quiz=quiz_id)
    except StudentResult.DoesNotExist:
        return Response({'error':'Result Not found'},status=status.HTTP_404_NOT_FOUND)
    
    serializer=StudentResultSerializer(result)
    return Response(serializer.data,status=status.HTTP_200_OK)


@api_view(['GET'])
def faculty_analytics(request):
    faculty=request.user.profile
    department=faculty.department
    
    total_student=Profile.objects.filter(department=department,role='student').count()
    total_quizes=Quiz.objects.filter(faculty=faculty).count()
    
    year_performance=(
        StudentResult.objects.filter(quiz__faculty=faculty)
        .values('quiz__year').annotate(avg_percentage=Avg('percentage'))
        
    )
    
    quiz_summary=(
        StudentResult.objects.filter(quiz__faculty=faculty)
        .values('quiz_id','quiz__title')
        .annotate(
            attempted=Count('student',distinct=True),
            max_score=Max('score'),
            min_score=Min('score'),
            avg_score=Avg('score')            
        )
    )
    
    
    return Response({
        "total_students":total_student,
        "total_quizzes":total_quizes,
        "year_performance":list(year_performance),
        "quiz_summary":list(quiz_summary)
    },status=status.HTTP_200_OK)
    
    
@api_view(['GET'])
def quiz_detail_analytics(request, quiz_id):
    results = StudentResult.objects.filter(quiz_id=quiz_id).select_related('student__user')

    data = [{
        "student": r.student.user.username,
        "score": r.score,
        "percentage": r.percentage,
        "passed": r.passed
    } for r in results]

    return Response({"students": data})
