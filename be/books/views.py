from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from books.models import Book
from books.serializers import BookListSerializer


# ─── Helper: Phân trang ───────────────────────────────────────────────────────

def paginate(queryset, request):
    page_size = request.query_params.get('page_size', 20)
    try:
        page_size = min(int(page_size), 100)
    except (ValueError, TypeError):
        page_size = 20

    paginator = Paginator(queryset, page_size)
    page_number = request.query_params.get('page', 1)

    try:
        page_obj = paginator.page(page_number)
    except PageNotAnInteger:
        page_obj = paginator.page(1)
    except EmptyPage:
        page_obj = paginator.page(paginator.num_pages)

    return {
        'count': paginator.count,
        'total_pages': paginator.num_pages,
        'page': page_obj.number,
        'page_size': page_size,
        'next': page_obj.next_page_number() if page_obj.has_next() else None,
        'previous': page_obj.previous_page_number() if page_obj.has_previous() else None,
        'results': list(page_obj.object_list),
    }


# ─── Logout View ──────────────────────────────────────────────────────────────

class LogoutView(APIView):
    """
    POST /api/logout/
    Body: { "refresh_token": "<refresh_token>" }
    Blacklist refresh token để vô hiệu hóa phiên đăng nhập.
    Yêu cầu Bearer token trong header.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request: Request):
        refresh_token = request.data.get('refresh_token')
        if not refresh_token:
            return Response(
                {"error": "refresh_token is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response({"message": "Đăng xuất thành công."}, status=status.HTTP_200_OK)


# ─── Book ViewSet ─────────────────────────────────────────────────────────────

class BookViewSet(ModelViewSet):
    serializer_class = BookListSerializer

    def get_permissions(self):
        """
        - list, retrieve: AllowAny (không cần đăng nhập)
        - create, update, partial_update, destroy: IsAuthenticated (cần JWT)
        """
        if self.action in ('list', 'retrieve'):
            return [AllowAny()]
        return [IsAuthenticated()]

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
        paged = paginate(queryset, request)
        serializer = self.serializer_class(paged['results'], many=True)
        return Response({
            'count': paged['count'],
            'total_pages': paged['total_pages'],
            'page': paged['page'],
            'page_size': paged['page_size'],
            'next': paged['next'],
            'previous': paged['previous'],
            'results': serializer.data,
        }, status=status.HTTP_200_OK)

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
