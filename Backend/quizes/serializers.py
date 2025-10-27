from rest_framework import serializers
from .models import Quiz, Question, Submission, Answer
from accounts.models import Profile
from django.contrib.auth.models import User

# --- Quiz Serializer with nested Questions ---
class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'text', 'option1', 'option2', 'option3', 'option4', 'correct_option']

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True,required=False)  # nested questions
    faculty = serializers.StringRelatedField(read_only=True)  # faculty will be set automatically

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'faculty', 'department', 'description', 'year', 'end_time', 'start_time', 'duration', 'created_at', 'questions']

    def create(self, validated_data):
        questions_data = validated_data.pop('questions')
        # Set the faculty automatically from context (passed from view)
        faculty = self.context['faculty']
        quiz = Quiz.objects.create(faculty=faculty, **validated_data)
        for question_data in questions_data:
            Question.objects.create(quiz=quiz, **question_data)
        return quiz
    
    def update(self, instance, validated_data):
        questions_data = validated_data.pop('questions', None)

        # Update Quiz fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if questions_data is not None:
            # Simple strategy: delete all existing questions and recreate
            instance.questions.all().delete()
            for question_data in questions_data:
                Question.objects.create(quiz=instance, **question_data)

        return instance
# --- Answer Serializer ---
class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'submission', 'question', 'selected_option']

# --- Submission Serializer ---
class SubmissionSerializer(serializers.ModelSerializer):
    answer = AnswerSerializer(many=True, read_only=True)
    student = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Submission
        fields = ['id', 'quiz', 'student', 'submitted_at', 'score', 'answer']
