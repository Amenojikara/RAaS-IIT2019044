# Generated by Django 3.1.7 on 2021-03-01 11:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apis', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='email',
            field=models.EmailField(default='', max_length=100),
        ),
    ]
