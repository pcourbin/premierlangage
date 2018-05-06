# Generated by Django 2.0.5 on 2018-05-06 11:04

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Sandbox',
            fields=[
                ('name', models.CharField(max_length=50)),
                ('url', models.CharField(help_text='http://127.0.0.1:8000/sandbox/?action=execute', max_length=860, primary_key=True, serialize=False)),
                ('priority', models.IntegerField(default=200, help_text='0 - 2147483647, the smallest number have the highest piority)')),
            ],
        ),
    ]
