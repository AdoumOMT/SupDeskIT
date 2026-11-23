#urls.py
from django.urls import path
from .views import LoginView
from .views import create_user, list_users
from .views import DemandeListCreateView, DemandeDetailView
from .views import get_notifications, send_notification
from .views import get_profile, update_profile_photo
from .views import UpdateProfileView
from .views import TicketCreateView, TicketListView, TicketViewSet, mark_notification_as_read
from rest_framework.routers import DefaultRouter
from .views import tickets_du_technicien, traiter_ticket, tickets_termines_technicien, delete_notification, tous_les_tickets, statistiques_tickets, export_tickets_csv, rapport_ml, unread_notifications_count, update_user
from .views import changer_technicien

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('create/', create_user),
    path('users/', list_users),
    path('demandes/', DemandeListCreateView.as_view(), name='list_create_demandes'),
    path('demandes/<int:pk>/', DemandeDetailView.as_view(), name='detail_demande'),
    path('notifications/', get_notifications),
    path('notifications/send/', send_notification),
    path('profile/', get_profile),
    path('profile/photo/', update_profile_photo),
    path('profile/update/', UpdateProfileView.as_view(), name='update_profile'),
    path('tickets/create/', TicketCreateView.as_view(), name='ticket-create'),
    path('tickets/', TicketListView.as_view(), name='ticket-list'),
    path('notifications/<int:notification_id>/mark_as_read/', mark_notification_as_read),
    path('tickets/<int:ticket_id>/changer_technicien/', changer_technicien),
    path('tickets/technicien/', tickets_du_technicien),
    path('tickets/technicien/<int:ticket_id>/traiter/', traiter_ticket),
    path('tickets/technicien/termines/', tickets_termines_technicien),
    path('notifications/<int:notification_id>/delete/', delete_notification),
    path('tickets/tous/', tous_les_tickets),
    path('tickets/statistiques/', statistiques_tickets),
    path('tickets/export/', export_tickets_csv),
    path('rapport_ml/', rapport_ml, name='rapport_ml'),
    path('notifications/unread_count/', unread_notifications_count),
    path('update/<username>/', update_user),


]


router = DefaultRouter()
router.register(r'tickets', TicketViewSet, basename='ticket')
urlpatterns += router.urls





