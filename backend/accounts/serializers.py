#serializers.py
from rest_framework import serializers
from .models import User
from .models import Profile
from django.contrib.auth import authenticate
from .models import Demande
from .models import Notification
from .models import Ticket


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Identifiants invalides")

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')

    class Meta:
        model = Profile
        fields = ['username', 'role', 'photo', 'poste']    

class UserListSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username')
    poste = serializers.CharField(read_only=True)

    class Meta:
        model = Profile
        fields = ['id', 'username', 'role', 'poste']

class CreateUserSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=[('employe', 'Employé'), ('technicien', 'Technicien')])


class DemandeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Demande
        fields = '__all__'
        read_only_fields = ['employe', 'date_creation']


class NotificationSerializer(serializers.ModelSerializer):
    employe_username = serializers.CharField(source='emetteur.username', read_only=True)
    employe_photo = serializers.ImageField(source='emetteur.profile.photo', read_only=True)
    employe_poste = serializers.CharField(source='emetteur.profile.poste', read_only=True)
    ticket_id = serializers.IntegerField(source='ticket.id', read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'destinataire', 'message', 'lu', 'date_creation', 'employe_username', 'employe_photo', 'employe_poste', 'ticket_id']


class UpdateProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', required=False)

    class Meta:
        model = Profile
        fields = ['username', 'photo', 'poste']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        username = user_data.get('username')

        if username:
            instance.user.username = username
            instance.user.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance

class CustomUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', required=False)
    email = serializers.EmailField(source='user.email', required=False)
    password = serializers.CharField(write_only=True, required=False)
    photo = serializers.ImageField(required=False)
    role = serializers.CharField(required=False)

    class Meta:
        model = Profile
        fields = ['username', 'email', 'password', 'photo', 'role', 'poste']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        
        if 'username' in user_data:
            instance.user.username = user_data['username']


        if 'email' in user_data:
            instance.user.email = user_data['email']
        if 'password' in validated_data:
            instance.user.set_password(validated_data['password'])

        instance.user.save()

        if 'photo' in validated_data:
            instance.photo = validated_data['photo']
        if 'role' in validated_data:
            instance.role = validated_data['role']

        instance.save()
        return instance


class TicketSerializer(serializers.ModelSerializer):
    employe_username = serializers.CharField(source='employe.username', read_only=True)
    employe_photo = serializers.ImageField(source='employe.profile.photo', read_only=True)
    employe_poste = serializers.CharField(source='employe.profile.poste', read_only=True)

    technicien_username = serializers.CharField(source='technicien.username', read_only=True)


    class Meta:
        model = Ticket
        fields = [
            'id', 'objet', 'description', 'categorie', 'fichier', 'statut', 'date_creation', 'date_modification', 'technicien', 'commentaire_tech', 'priorite', 'technicien_username', 'employe_username', 'employe_photo', 'employe_poste'
        ]
        read_only_fields = ['statut', 'date_creation', 'technicien']

    def update(self, instance, validated_data):
        instance.objet = validated_data.get('objet', instance.objet)
        instance.description = validated_data.get('description', instance.description)
        instance.categorie = validated_data.get('categorie', instance.categorie)

        fichier = validated_data.get('fichier', None)
        if fichier:
            instance.fichier = fichier

        instance.save()
        return instance



