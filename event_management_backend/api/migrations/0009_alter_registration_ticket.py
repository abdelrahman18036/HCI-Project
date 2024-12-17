# Generated by Django 5.1.3 on 2024-12-17 14:58

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_tickettype_alter_ticket_ticket_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='registration',
            name='ticket',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='registrations', to='api.ticket'),
        ),
    ]
