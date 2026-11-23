#views
from django.shortcuts import render
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from .serializers import LoginSerializer, ProfileSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from accounts.models import Profile
from .serializers import UserListSerializer, CreateUserSerializer
from rest_framework import generics, permissions
from .models import Demande
from .serializers import DemandeSerializer
from .models import Notification
from .serializers import NotificationSerializer
from .serializers import CustomUserSerializer
from .serializers import TicketSerializer
from .models import Ticket
from rest_framework import viewsets
from .ml_utils import predict_priorite
from . import models
from django.db.models.functions import TruncDate  # ✅ Le bon import pour grouper par jour
from django.db.models import Count, F, Avg, ExpressionWrapper, F, DurationField
from datetime import timedelta
from collections import defaultdict
from django.db.models import Q


class LoginView(APIView):
    permission_classes = [AllowAny] 

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                "token": token.key,
                "username": user.username,
                "role": user.profile.role,
                "photo": user.profile.photo.url if user.profile.photo else None,
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])  
def create_user(request):
    if request.user.profile.role != 'chef':
        return Response({'error': 'Accès refusé'}, status=status.HTTP_403_FORBIDDEN)

    username = request.data.get('username')
    password = request.data.get('password')
    role = request.data.get('role')
    poste = request.data.get('poste')

    if not all([username, password, role]):
        return Response({'error': 'Champs manquants'}, status=status.HTTP_400_BAD_REQUEST)
    
    if role == 'employe' and not (poste or '').strip():
        return Response({'error': 'Le poste est requis pour un employé.'}, status=status.HTTP_400_BAD_REQUEST)


    if role not in ['employe', 'technicien']:
        return Response({'error': 'Rôle invalide'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Utilisateur déjà existant'}, status=status.HTTP_409_CONFLICT)

    user = User.objects.create_user(username=username, password=password)
    profile = user.profile
    profile.role = role
    profile.poste = poste if role == 'employe' else None
    profile.save()

    return Response({'message': f"Utilisateur {username} ({role}) créé avec succès"}, status=status.HTTP_201_CREATED)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user(request, username):
    if request.user.profile.role != 'chef':
        return Response({'error': 'Accès refusé'}, status=403)
    
    try:
        user = User.objects.get(username=username)
        profile = user.profile
    except User.DoesNotExist:
        return Response({'error': 'Utilisateur non trouvé'}, status=404)

    password = request.data.get('password')
    poste = request.data.get('poste')
    role = request.data.get('role')

    if password:
        user.set_password(password)
    user.save()

    if role:
        profile.role = role
    if poste or profile.role == 'employe':
        profile.poste = poste
    profile.save()

    return Response({'message': 'Utilisateur mis à jour avec succès'})



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_users(request):
    if request.user.profile.role != 'chef':
        return Response({'error': 'Accès refusé'}, status=status.HTTP_403_FORBIDDEN)
    
    profiles = Profile.objects.filter(role__in=['employe', 'technicien'])
    serializer = UserListSerializer(profiles, many=True)
    return Response(serializer.data)


class DemandeListCreateView(generics.ListCreateAPIView):
    serializer_class = DemandeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Demande.objects.filter(employe=self.request.user)

    def perform_create(self, serializer):
        demande = serializer.save(employe=self.request.user)

        message = f"Votre demande '{demande.titre}' a bien été créée."

        notification = Notification.objects.create(
            destinataire=self.request.user,
            emetteur=self.request.user,
            message=message
        )

        if demande.priorite == 'haute':
            technicien = Profile.objects.filter(role='technicien').first() 
            if technicien:
                Notification.objects.create(
                    destinataire=technicien.user,
                    emetteur=self.request.user,
                    message=f"Une nouvelle demande urgente a été créée : {demande.titre}"
                )

                
class DemandeDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DemandeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Demande.objects.filter(employe=self.request.user)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notification_as_read(request, notification_id):
    try:
        notification = Notification.objects.get(id=notification_id, destinataire=request.user)
        notification.lu = True
        notification.save()
        return Response({"message": "Notification marquée comme lue."})
    except Notification.DoesNotExist:
        return Response({"error": "Notification non trouvée ou non autorisée."}, status=404)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    only_unread = request.GET.get('unread') == '1'
    queryset = Notification.objects.filter(destinataire=request.user)
    if only_unread:
        queryset = queryset.filter(lu=False)
    serializer = NotificationSerializer(queryset.order_by('-date_creation'), many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_notification(request):
    if request.user.profile.role != 'chef': 
        return Response({"error": "Non autorisé"}, status=403)

    serializer = NotificationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    serializer = ProfileSerializer(request.user.profile)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_profile_photo(request):
    profile = request.user.profile
    photo = request.FILES.get('photo')

    if photo:
        profile.photo = photo
        profile.save()
        return Response({'message': 'Photo de profil mise à jour avec succès'})
    else:
        return Response({'error': 'Aucune photo fournie'}, status=400)



class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        profile = request.user.profile  
        serializer = CustomUserSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class TicketCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = TicketSerializer(data=request.data)
        if serializer.is_valid():
            description = serializer.validated_data.get('description')
            priorite = predict_priorite(description)

            technicien_profile = Profile.objects.filter(role='technicien').first()
            technicien = technicien_profile.user if technicien_profile else None

            ticket = serializer.save(employe=request.user, technicien=technicien, priorite=priorite )

            if technicien:
                Notification.objects.create(
                    destinataire=technicien,
                    emetteur=self.request.user,
                    message=f"Vous avez un nouveau ticket à traiter : {ticket.objet}",
                    ticket=ticket
                )

            return Response(TicketSerializer(ticket).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class TicketListView(generics.ListAPIView):
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Ticket.objects.filter(employe=self.request.user).order_by('-date_creation')


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Ticket.objects.filter(employe=self.request.user)  

class TicketDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Ticket.objects.filter(employe=self.request.user)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def tickets_du_technicien(request):
    if request.user.profile.role != 'technicien':
        return Response({"error": "Accès refusé"}, status=403)

    tickets = Ticket.objects.filter(technicien=request.user).order_by('-date_creation')
    serializer = TicketSerializer(tickets, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def traiter_ticket(request, ticket_id):
    try:
        ticket = Ticket.objects.get(id=ticket_id, technicien=request.user)
    except Ticket.DoesNotExist:
        return Response({"error": "Ticket non trouvé ou non autorisé"}, status=404)

    statut = request.data.get("statut")
    commentaire = request.data.get("commentaire_tech")
    fichier = request.data.get("fichier")

    if statut:
        ticket.statut = statut
    if commentaire:
        ticket.commentaire_tech = commentaire
    if fichier:
        ticket.fichier = fichier
    if statut == 'resolu':
        ticket.date_resolution = timezone.now()
        Notification.objects.create(
            destinataire=ticket.employe,
            emetteur=request.user,
            message=f"Votre ticket '{ticket.objet}' a été marqué comme résolu.",
            ticket=ticket
        )

    ticket.save()

    return Response({"message": "Ticket mis à jour avec succès"})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_notification(request, notification_id):
    try:
        notif = Notification.objects.get(id=notification_id, destinataire=request.user)
        notif.delete()
        return Response({"message": "Notification supprimée."})
    except Notification.DoesNotExist:
        return Response({"error": "Notification introuvable ou non autorisée"}, status=404)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def changer_technicien(request, ticket_id):
    if request.user.profile.role != 'chef':
        return Response({"error": "Non autorisé"}, status=403)

    technicien_id = request.data.get("technicien_id")
    try:
        ticket = Ticket.objects.get(id=ticket_id)
        new_technicien = User.objects.get(id=technicien_id, profile__role='technicien')
        ticket.technicien = new_technicien
        ticket.save()
        return Response({"message": "Technicien réaffecté avec succès"})
    except:
        return Response({"error": "Erreur lors de la réaffectation"}, status=400)


class TicketsTerminesAPIView(APIView):
    def get(self, request):
        tickets = Ticket.objects.filter(statut='resolu')
        serializer = TicketSerializer(tickets, many=True)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def tickets_termines_technicien(request):
    technicien = request.user
    tickets = Ticket.objects.filter(assigned_to=technicien, statut='résolu')
    serializer = TicketSerializer(tickets, many=True)
    return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def tous_les_tickets(request):
    if request.user.profile.role != 'chef':
        return Response({"error": "Accès refusé"}, status=403)

    queryset = Ticket.objects.all().order_by('-date_creation')

    statut = request.GET.get('statut')
    priorite = request.GET.get('priorite')
    technicien_id = request.GET.get('technicien_id')
    technicien_username = request.GET.get('technicien_username')

    if statut:
        queryset = queryset.filter(statut=statut)
    if priorite:
        queryset = queryset.filter(priorite=priorite)
    if technicien_id:
        queryset = queryset.filter(technicien_id=technicien_id)
    if technicien_username:
        queryset = queryset.filter(technicien_username=technicien_username)

    serializer = TicketSerializer(queryset, many=True)
    return Response(serializer.data)



from django.db.models import Count, F 

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def statistiques_tickets(request):
    if request.user.profile.role != 'chef':
        return Response({"error": "Accès refusé"}, status=403)

    try:
        total = Ticket.objects.count()

        par_statut = Ticket.objects.values('statut').annotate(count=Count('id'))
        par_priorite = Ticket.objects.values('priorite').annotate(count=Count('id'))
        par_technicien = Ticket.objects.annotate(
            technicien_nom=F('technicien__username')
        ).values('technicien_nom').annotate(count=Count('id'))

        par_date = Ticket.objects.annotate(
            date=TruncDate('date_creation')
        ).values('date').annotate(count=Count('id')).order_by('date')

        par_poste = Ticket.objects.annotate(
            poste=F('employe__profile__poste')
        ).values('poste').annotate(count=Count('id')).order_by('-count')

        tickets_resolus = Ticket.objects.filter(statut='resolu', date_resolution__isnull=False)

        tickets_duree = tickets_resolus.annotate(
            duree=ExpressionWrapper(F('date_resolution') - F('date_creation'), output_field=DurationField())
        ).annotate(
            date=TruncDate('date_creation')
        ).values('date').annotate(
            temps_moyen=Avg('duree')
        )

        tickets_journaliers = Ticket.objects.annotate(
            date=TruncDate('date_creation')
        ).values('date', 'statut').annotate(count=Count('id'))

        rapide = tickets_resolus.annotate(
            duree=ExpressionWrapper(F('date_resolution') - F('date_creation'), output_field=DurationField()),
            date=TruncDate('date_creation')
        ).values('date').annotate(
            rapides=Count('id', filter=Q(duree__lte=timedelta(days=3))),
            total=Count('id')
        ).annotate(
            taux=(100.0 * F('rapides')) / F('total')
        )

        merged = defaultdict(dict)
        for t in tickets_duree:
            merged[t['date']]['temps_moyen'] = t['temps_moyen'].days if t['temps_moyen'] else 0
        for b in tickets_journaliers:
            key = 'backlog_' + b['statut'].lower().replace(" ", "_")
            merged[b['date']][key] = b['count']
        for r in rapide:
            merged[r['date']]['taux_resolution'] = r['taux']

        courbe_mixed = [
            {
                'date': date.strftime('%Y-%m-%d'),
                'temps_moyen': merged[date].get('temps_moyen', 0),
                'backlog_en_attente': merged[date].get('backlog_en_attente', 0),
                'backlog_en_cours': merged[date].get('backlog_en_cours', 0),
                'taux_resolution': merged[date].get('taux_resolution', 0),
            }
            for date in sorted(merged)
        ]

        return Response({
            "total": total,
            "par_statut": list(par_statut),
            "par_priorite": list(par_priorite),
            "par_technicien": list(par_technicien),
            "par_date": list(par_date),
            "courbe_mixte": courbe_mixed,
            "par_poste": list(par_poste),
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({"error": f"Erreur interne : {str(e)}"}, status=500)


import csv
from django.http import HttpResponse

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_tickets_csv(request):
    if request.user.profile.role != 'chef':
        return Response({"error": "Non autorisé"}, status=403)

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="tickets.csv"'

    writer = csv.writer(response)
    writer.writerow(['ID', 'Objet', 'Description', 'Catégorie', 'Statut', 'Priorité', 'Technicien', 'Date de création'])

    for ticket in Ticket.objects.all():
        writer.writerow([
            ticket.id,
            ticket.objet,
            ticket.description,
            ticket.categorie,
            ticket.statut,
            ticket.priorite,
            ticket.technicien.username if ticket.technicien else "Non assigné",
            ticket.date_creation.strftime('%Y-%m-%d %H:%M')
        ])

    return response


import json
from django.http import JsonResponse
from rest_framework.decorators import api_view
import os
from django.conf import settings

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def rapport_ml(request):
    if request.user.profile.role != 'chef':
        return Response({"error": "Non autorisé"}, status=403)

    rapport_path = os.path.join(settings.BASE_DIR, 'accounts', 'ml_model', 'rapport_ml.json')
    print(rapport_path)
    if not os.path.exists(rapport_path):
        return Response({"error": "Fichier rapport_ml.json introuvable"}, status=404)

    with open(rapport_path, 'r') as f:
        data = json.load(f)
    print(data)
    return JsonResponse(data)


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Notification

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def unread_notifications_count(request):
    count = Notification.objects.filter(destinataire=request.user, lu=False).count()
    return Response({'unread_count': count})