from rest_framework import serializers
from.models import StudentResult

class StudentResultSerializer(serializers.ModelSerializer):
    quiz_title=serializers.CharField(source='quiz.title',read_only=True)
    student_name=serializers.CharField(source='student.user.username',read_only=True)
    
    class Meta:
        model=StudentResult
        fields=[
            'id','student_name','quiz_title','score','total_questions','percentage','passed','created_at'
        ]