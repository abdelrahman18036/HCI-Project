# Generated by Django 5.1.3 on 2024-12-17 12:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_populate_tickettypes'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ticket',
            name='ticket_type',
            field=models.CharField(choices=[('general', 'General Admission'), ('vip', 'VIP')], max_length=20),
        ),
        migrations.DeleteModel(
            name='TicketType',
        ),
    ]
