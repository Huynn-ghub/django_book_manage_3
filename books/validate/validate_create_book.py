from datetime import date


def vaidate_create_book(data):
    title = data.get("title")
    author = data.get("author")
    published_date = data.get("published_date")
    price = data.get("price")
    quantity = data.get("quantity")

    if not title or not author:
        return {"error": "Title and author are required"}

    if published_date:
        try:
            if not isinstance(published_date, date):
                date.fromisoformat(published_date)
        except (ValueError, TypeError):
            return {"error": "published_date must be in YYYY-MM-DD format"}

    if price is not None:
        try:
            price_val = float(price)
            if price_val < 0:
                return {"error": "Price must be greater than or equal to 0"}
        except (ValueError, TypeError):
            return {"error": "Price must be a valid number"}

    if quantity is not None:
        try:
            # Check if it's an integer
            # If it's a float like 5.5, it shouldn't be accepted as quantity
            if isinstance(quantity, float) and not quantity.is_integer():
                raise ValueError
            quantity_val = int(quantity)
            if quantity_val < 0:
                return {"error": "Quantity must be greater than or equal to 0"}
        except (ValueError, TypeError):
            return {"error": "Quantity must be a valid integer"}

    return None