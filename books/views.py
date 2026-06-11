from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from rest_framework.viewsets import ModelViewSet
from rest_framework.pagination import PageNumberPagination
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status

from books.models import Book
from books.serializers import BookListSerializer

class BookPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class BookViewSet(ModelViewSet):
    serializer_class = BookListSerializer
    permission_classes = []
    pagination_class = BookPagination

    def get_queryset(self):
        queryset = Book.objects.all()

        title        = self.request.query_params.get('title')
        author       = self.request.query_params.get('author')
        price        = self.request.query_params.get('price')
        min_price    = self.request.query_params.get('min_price')
        max_price    = self.request.query_params.get('max_price')
        quantity     = self.request.query_params.get('quantity')
        min_quantity = self.request.query_params.get('min_quantity')
        max_quantity = self.request.query_params.get('max_quantity')

        if title:
            queryset = queryset.filter(title__icontains=title)

        if author:
            queryset = queryset.filter(author__icontains=author)

        if price:
            queryset = queryset.filter(price=price)
        else:
            if min_price:
                queryset = queryset.filter(price__gte=min_price)
            if max_price:
                queryset = queryset.filter(price__lte=max_price)

        if quantity:
            queryset = queryset.filter(quantity=quantity)
        else:
            if min_quantity:
                queryset = queryset.filter(quantity__gte=min_quantity)
            if max_quantity:
                queryset = queryset.filter(quantity__lte=max_quantity)

        return queryset.order_by('id')

    def list(self, request: Request, *args, **kwargs):
        queryset = self.get_queryset()
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request)
        serializer = self.serializer_class(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def create(self, request: Request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request: Request, *args, **kwargs):
        pk = kwargs.get('pk')
        try:
            book = Book.objects.get(pk=pk)
        except Book.DoesNotExist:
            return Response({"error": f"Không tìm thấy sách có id={pk}."}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.serializer_class(book)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request: Request, *args, **kwargs):
        pk = kwargs.get('pk')
        try:
            book = Book.objects.get(pk=pk)
        except Book.DoesNotExist:
            return Response({"error": f"Không tìm thấy sách có id={pk}."}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.serializer_class(book, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request: Request, *args, **kwargs):
        pk = kwargs.get('pk')
        try:
            book = Book.objects.get(pk=pk)
        except Book.DoesNotExist:
            return Response({"error": f"Không tìm thấy sách có id={pk}."}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.serializer_class(book, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request: Request, *args, **kwargs):
        pk = kwargs.get('pk')
        try:
            book = Book.objects.get(pk=pk)
        except Book.DoesNotExist:
            return Response({"error": f"Không tìm thấy sách có id={pk}."}, status=status.HTTP_404_NOT_FOUND)
        book.delete()
        return Response({"message": f"Đã xóa sách có id={pk}."}, status=status.HTTP_204_NO_CONTENT)
