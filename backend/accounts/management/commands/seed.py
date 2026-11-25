from datetime import timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from accounts.models import Ticket, Notification


class Command(BaseCommand):
    help = "Initialise les comptes et données de démonstration pour SupDeskIT"

    def handle(self, *args, **kwargs):
        demo_users = [
            {
                "username": "employe_demo",
                "email": "employe@supdeskit.ma",
                "password": "Password123!",
                "role": "employe",
                "poste": "Bureau 1",
                "is_staff": False,
            },
            {
                "username": "tech_demo",
                "email": "tech@supdeskit.ma",
                "password": "Password123!",
                "role": "technicien",
                "poste": "Support IT",
                "is_staff": False,
            },
            {
                "username": "chef_demo",
                "email": "chef@supdeskit.ma",
                "password": "Password123!",
                "role": "chef",
                "poste": "Chef de service IT",
                "is_staff": True,
            },
        ]

        created_users = {}

        for data in demo_users:
            user = User.objects.filter(username=data["username"]).first()

            if user:
                self.stdout.write(
                    self.style.WARNING(f"Utilisateur déjà existant : {user.username}")
                )
            else:
                user = User.objects.create_user(
                    username=data["username"],
                    email=data["email"],
                    password=data["password"],
                )
                if data["is_staff"]:
                    user.is_staff = True
                    user.is_superuser = True
                    user.save()

                profile = user.profile
                profile.role = data["role"]
                profile.poste = data["poste"]
                profile.save()

                self.stdout.write(
                    self.style.SUCCESS(
                        f"Compte créé : {user.username} ({data['role']})"
                    )
                )

            created_users[data["role"]] = user

        if Ticket.objects.count() == 0:
            employe = created_users["employe"]
            technicien = created_users["technicien"]

            ticket_attente = Ticket.objects.create(
                employe=employe,
                technicien=technicien,
                objet="Connexion Wi-Fi instable en salle de réunion",
                description="Déconnexions fréquentes depuis ce matin sur le réseau interne.",
                categorie="réseau",
                priorite="haute",
                statut="en_attente",
            )

            Ticket.objects.create(
                employe=employe,
                technicien=technicien,
                objet="Installation d'un logiciel métier",
                description="Besoin de la suite bureautique et d'analyse sur le poste Bureau 1.",
                categorie="logiciel",
                priorite="moyenne",
                statut="en_cours",
                commentaire_tech="Prise en charge en cours, vérification de la licence.",
            )

            ticket_resolu = Ticket.objects.create(
                employe=employe,
                technicien=technicien,
                objet="Écran secondaire ne s'allume plus",
                description="Aucun signal vidéo détecté sur le deuxième moniteur.",
                categorie="matériel",
                priorite="basse",
                statut="resolu",
                commentaire_tech="Câble HDMI remplacé et affichage testé.",
                date_resolution=timezone.now() - timedelta(hours=3),
            )

            Notification.objects.create(
                destinataire=technicien,
                emetteur=employe,
                ticket=ticket_attente,
                message=f"Vous avez un nouveau ticket à traiter : {ticket_attente.objet}",
            )

            Notification.objects.create(
                destinataire=employe,
                emetteur=technicien,
                ticket=ticket_resolu,
                message=f"Votre ticket '{ticket_resolu.objet}' a été marqué comme résolu.",
            )

            self.stdout.write(
                self.style.SUCCESS("3 tickets et 2 notifications de démonstration créés.")
            )