from django.urls import path,include
from .views import user_list,current_user,change_password
urlpatterns = [
    path('users/', user_list, name='user-list'),
    path('me/',current_user,name="current_user"),
    path('change_password/',change_password,name="change_password")
]
