from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from .models import Quiz,Answer,Submission,Question
from .serializers import AnswerSerializer,QuestionSerializer,SubmissionSerializer,QuizSerializer
from rest_framework import status
from accounts.models import Profile
from django.shortcuts import get_object_or_404
from results.views import calculate_student_result
@api_view(['GET','POST'])
def quiz_list_create(request):
    
    profile=Profile.objects.get(user=request.user)
    if request.method=='GET':
        if profile.role=='faculty':
            print(request.user)
            quizzes=Quiz.objects.filter(faculty=profile)
        elif profile.role=='student':
            quizzes=Quiz.objects.filter(department=profile.department,year=profile.year)
        else:
            quizzes=Quiz.objects.none()
        serializer=QuizSerializer(quizzes,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
    elif request.method=='POST':
        if profile.role!='faculty':
            return Response({'error':'Only Faculty can creare quiz'},status=status.HTTP_403_FORBIDDEN)
        serializer=QuizSerializer(data=request.data, context={'faculty': profile})
        if serializer.is_valid():
            quiz=serializer.save()
            
            send_quiz_notification_email(quiz)
            
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET','POST'])
def question_list_create(request):
    user=request.user
    profile=Profile.objects.get(user=user)
    if request.method=='GET':
        if profile.role=='faculty':
            questions=Question.objects.filter(quiz__faculty=user)
        elif profile.role=='student':
            questions=Question.objects.filter(quiz__department=profile.department,quiz__year=profile.year)
        else:
            questions=Question.objects.none()
        serializer=QuestionSerializer(questions,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    elif request.method=='POST':
        if profile.role!='faculty':
            return Response({'error':'Only Faculty can add Question'},status=status.HTTP_403_FORBIDDEN)
        serializer=QuestionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET','POST'])
def submission_list_create(request):
    user=request.user
    profile=Profile.objects.get(user=user)
    
    if request.method=='GET':
        if profile.role=='faculty':
            submissions=Submission.objects.filter(quiz__faculty=user)
        elif profile.role=='student':
            submissions=Submission.objects.filter(student=user)
        else:
            submissions=Submission.objects.none()
        serializer=SubmissionSerializer(submissions,many=True)
    
    elif request.method == 'POST':
        if profile.role != 'student':
            return Response({'error': 'Only students can submit quiz'}, status=status.HTTP_403_FORBIDDEN)
        
        quiz_id = request.data.get('quiz')
        if not quiz_id:
            return Response({'error': 'Quiz ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        quiz = Quiz.objects.get(id=quiz_id)
        submission = Submission.objects.create(student=profile, quiz=quiz)

        serializer = SubmissionSerializer(submission)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
@api_view(['GET','POST'])    

def answer_list_create(request):
    if request.method=='GET':
        answer=Answer.objects.all()
        serializer=AnswerSerializer(answer,many=True)
        return Response(serializer.data)
    
    elif request.method=='POST':
        print(request.data)
        serializer=AnswerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
            
        
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def quiz_delete(request,quiz_id):
    profile=get_object_or_404(Profile,user=request.user)
    print(profile)
    
    if profile.role!='faculty':
        return Response({'error':'Only Faculty can delete teh Quiz'},status=status.HTTP_403_FORBIDDEN)
    quiz=get_object_or_404(Quiz,id=quiz_id)
    
    if quiz.faculty != profile:
        return Response(
            {'error': 'You do not have permission to delete this quiz'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    quiz.delete()
    return Response({'message':'Quiz deleted succesfully'},status=status.HTTP_200_OK)

@api_view(['GET'])
def quiz_details(request,quiz_id):
    quiz=get_object_or_404(Quiz,id=quiz_id)
    serializer=QuizSerializer(quiz)
    return Response(serializer.data,status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def quiz_update(request, quiz_id):
    # Get the logged-in user's profile
    profile = get_object_or_404(Profile, user=request.user)

    if profile.role != 'faculty':
        return Response({'error': 'Only Faculty can update the Quiz'}, status=status.HTTP_403_FORBIDDEN)

    # Fetch the quiz
    quiz = get_object_or_404(Quiz, id=quiz_id)

    # Check ownership
    if quiz.faculty != profile:
        return Response({'error': 'You do not have permission to update this quiz'}, status=status.HTTP_403_FORBIDDEN)

    # Update quiz fields
    serializer = QuizSerializer(quiz, data=request.data, partial=True, context={'faculty': profile})
    if serializer.is_valid():
        serializer.save()

        # If questions are included, update them
        if 'questions' in request.data:
            # Delete old questions
            quiz.questions.all().delete()
            for q in request.data['questions']:
                Question.objects.create(
                    quiz=quiz,
                    text=q.get('text', ''),
                    option1=q.get('option1', ''),
                    option2=q.get('option2', ''),
                    option3=q.get('option3', ''),
                    option4=q.get('option4', ''),
                    correct_option=q.get('correct_option', '')
                )

        return Response({'message': 'Quiz updated successfully'}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def finalize_submission(request,submission_id):
    try:
        submission=Submission.objects.get(id=submission_id)
    except Submission.DoesNotExist:
        return Response({'error':'Submission not found'},status=status.HTTP_404_NOT_FOUND)
    
    answers=Answer.objects.filter(submission=submission)
    total_score=0
    for ans in answers:
        if ans.selected_option==ans.question.correct_option:
            total_score+=1
        
    submission.score=total_score
    submission.save()
    
    result_data = calculate_student_result(submission)
    return Response({'message':'Quiz submitted succesfully'},status=status.HTTP_201_CREATED)

@api_view(['GET'])
def submission_status(request,quiz_id):
    try:
        student_profile = Profile.objects.get(user=request.user, role="student")
    except Profile.DoesNotExist:
        return Response({'error': 'Student profile not found'}, status=404)

    attempted = Submission.objects.filter(quiz_id=quiz_id, student=student_profile).exists()

    return Response({'attempted': attempted})
    


def send_quiz_notification_email(quiz):
    from .models import Profile
    students = Profile.objects.filter(role='student', department=quiz.department, year=quiz.year)
    recipients = [s.user.email for s in students if s.user.email]

    if not recipients:
        return

    subject = f" New Quiz: {quiz.title}"
    text_content = f"A new quiz '{quiz.title}' has been created. Check your dashboard."
    html_content = render_to_string('emails/new_quiz.html', {
        'quiz_title': quiz.title,
        'faculty_name': quiz.faculty.user.get_full_name(),
        'department': quiz.department,
        'year': quiz.year,
        
    })

    from django.core.mail import EmailMultiAlternatives
    from django.conf import settings

    for email in recipients:
        msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [email])
        msg.attach_alternative(html_content, "text/html")
        msg.send()