#models.py
from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User

def user_directory_path(instance, filename):
    return f'profile_pics/user_{instance.user.id}/{filename}'

class Profile(models.Model):
    ROLE_CHOICES = [
        ('chef', 'Chef de service'),
        ('technicien', 'Technicien'),
        ('employe', 'Employé'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    photo = models.ImageField(upload_to=user_directory_path, blank=True, null=True) 
    poste = models.CharField(max_length=100, blank=True, null=True)


    def __str__(self):
        return f"{self.user.username} - {self.role}"


class Demande(models.Model):
    STATUT_CHOICES = [
        ('en_attente', 'En attente'),
        ('en_cours', 'En cours'),
        ('resolu', 'Résolu'),
    ]

    PRIORITE_CHOICES = [
        ('basse', 'Basse'),
        ('moyenne', 'Moyenne'),
        ('haute', 'Haute'),
    ]

    employe = models.ForeignKey(User, on_delete=models.CASCADE)
    titre = models.CharField(max_length=200)
    description = models.TextField()
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='en_attente')
    priorite = models.CharField(max_length=20, choices=PRIORITE_CHOICES, default='moyenne')
    fichier = models.FileField(upload_to='fichiers_demandes/', null=True, blank=True)
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titre
    
class Notification(models.Model):
    destinataire = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    emetteur = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications_envoyees', null=True, blank=True)  # 👈 Ajouté
    ticket = models.ForeignKey('Ticket', on_delete=models.CASCADE, null=True, blank=True)
    message = models.TextField()
    lu = models.BooleanField(default=False)
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notif pour {self.destinataire.username} - {self.message[:20]}"



User = get_user_model()

CATEGORIES = [
    ('réseau', 'Réseau'),
    ('matériel', 'Matériel'),
    ('logiciel', 'Logiciel'),
]

PRIORITES = [
    ('basse', 'Basse'),
    ('moyenne', 'Moyenne'),
    ('haute', 'Haute'),
]
class Ticket(models.Model):
    employe = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tickets')
    technicien = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='tickets_traite')
    objet = models.CharField(max_length=255)
    description = models.TextField()
    categorie = models.CharField(max_length=20, choices=CATEGORIES)
    priorite = models.CharField(max_length=20, choices=PRIORITES, default='moyenne')
    fichier = models.FileField(upload_to='tickets/files/', blank=True, null=True)
    statut = models.CharField(max_length=20, default='en_attente')
    commentaire_tech = models.TextField(blank=True, null=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    date_resolution = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.objet} ({self.objet})"







