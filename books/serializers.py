from books.models import Book
from rest_framework import serializers
from books.validate.validate_create_book import vaidate_create_book

class BookListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = "__all__"

    def validate(self, attrs):
        # Trích xuất dữ liệu đầy đủ (kết hợp dữ liệu cũ nếu là update/PATCH)
        validate_data = {}
        if self.instance:
            validate_data['title'] = self.instance.title
            validate_data['author'] = self.instance.author
            validate_data['published_date'] = self.instance.published_date
            validate_data['price'] = self.instance.price
            validate_data['quantity'] = self.instance.quantity

        for key, value in attrs.items():
            validate_data[key] = value

        errors = vaidate_create_book(validate_data)
        if errors:
            raise serializers.ValidationError(errors)
        return attrs
