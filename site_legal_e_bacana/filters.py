import django_filters
from .models import Evento


class EventoFilter(django_filters.FilterSet):
    Evento_nome = django_filters.CharFilter(lookup_expr='icontains', label='Nome do evento')
    Evento_tipo = django_filters.CharFilter(lookup_expr='icontains', label='Tipo')
    Evento_materia = django_filters.CharFilter(lookup_expr='icontains', label='Matéria')
    Evento_entrega = django_filters.DateFilter(label='Data de entrega')

    class Meta:
        model = Evento
        fields = ['Evento_nome', 'Evento_tipo', 'Evento_materia', 'Evento_entrega']
