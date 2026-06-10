from django.contrib import admin
from books.models import Book


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'author', 'published_date')
    search_fields = ('title', 'author')
    list_filter = ('published_date',)
    ordering = ('-id',)
