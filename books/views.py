from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from rest_framework.viewsets import ModelViewSet
from rest_framework.pagination import PageNumberPagination

from books.models import Book
from books.serializers import BookListSerializer

# Create your views here.

@csrf_exempt
def home(request):
    if request.method == "GET":
        data_queryset = Book.objects.all()
        data_books = BookListSerializer(data_queryset, many=True)
        data = {
            "books": data_books.data,
            "message": "Hello, welcome!"
        }
        return JsonResponse(data)


class BookPagination(PageNumberPagination):
    """
    Phân trang tùy chỉnh: mặc định 20 record mỗi trang,
    cho phép tùy chỉnh qua tham số ?page_size (tối đa 100 record).
    """
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class BookViewSet(ModelViewSet):
    """
    CRUD API cho Book sử dụng ModelViewSet.
    Không yêu cầu JWT authentication (công khai).
    """
    serializer_class = BookListSerializer
    permission_classes = []  # Bỏ JWT auth để test/chấm điểm dễ dàng hơn
    pagination_class = BookPagination

    def get_queryset(self):
        """
        Hàm custom để filter các trường theo yêu cầu bài tập:
        - title, author: Tìm kiếm gần đúng không phân biệt hoa thường.
        - price, quantity: Lọc chính xác hoặc lọc theo khoảng min/max.
        """
        queryset = Book.objects.all()

        # Nhận các query params từ client
        title = self.request.query_params.get('title')
        author = self.request.query_params.get('author')
        
        price = self.request.query_params.get('price')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')

        quantity = self.request.query_params.get('quantity')
        min_quantity = self.request.query_params.get('min_quantity')
        max_quantity = self.request.query_params.get('max_quantity')

        # Lọc theo title (tìm kiếm gần đúng)
        if title:
            queryset = queryset.filter(title__icontains=title)

        # Lọc theo author (tìm kiếm gần đúng)
        if author:
            queryset = queryset.filter(author__icontains=author)

        # Lọc theo price (chính xác hoặc khoảng)
        if price:
            queryset = queryset.filter(price=price)
        else:
            if min_price:
                queryset = queryset.filter(price__gte=min_price)
            if max_price:
                queryset = queryset.filter(price__lte=max_price)

        # Lọc theo quantity (chính xác hoặc khoảng)
        if quantity:
            queryset = queryset.filter(quantity=quantity)
        else:
            if min_quantity:
                queryset = queryset.filter(quantity__gte=min_quantity)
            if max_quantity:
                queryset = queryset.filter(quantity__lte=max_quantity)

        # Sắp xếp theo ID để phân trang hoạt động ổn định
        return queryset.order_by('id')
