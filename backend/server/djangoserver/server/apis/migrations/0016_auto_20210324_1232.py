# Generated by Django 3.1.5 on 2021-03-24 07:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apis', '0015_auto_20210312_1141'),
    ]

    operations = [
        migrations.AlterField(
            model_name='throattumordisease',
            name='mri',
            field=models.ImageField(upload_to='mri_images'),
        ),
    ]
