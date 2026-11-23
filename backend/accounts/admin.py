#admin.py
from django.contrib import admin
from .models import Profile, Demande, Notification, Ticket

admin.site.register(Profile)
admin.site.register(Demande)
admin.site.register(Notification)
admin.site.register(Ticket)
# Register your models here.

