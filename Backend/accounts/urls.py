from django.urls import path,include
from .views import user_list,current_user

urlpatterns = [
    path('users/', user_list, name='user-list'),
    path('me/',current_user,name="current_user")
]
