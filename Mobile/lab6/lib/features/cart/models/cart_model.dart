import 'package:lab6/features/books/models/book_model.dart';

/// A single line item in the cart.
class CartItem {
  CartItem({required this.book, this.quantity = 1});

  final BookModel book;
  int quantity;

  double get subtotal => book.price * quantity;
}

/// Local cart model (managed in-memory, synced to backend on checkout).
class CartModel {
  final List<CartItem> _items = [];

  List<CartItem> get items => List.unmodifiable(_items);

  int get count => _items.fold(0, (sum, i) => sum + i.quantity);

  double get total => _items.fold(0.0, (sum, i) => sum + i.subtotal);

  bool get isEmpty => _items.isEmpty;

  void add(BookModel book) {
    final existing = _items.where((i) => i.book.id == book.id);
    if (existing.isNotEmpty) {
      existing.first.quantity++;
    } else {
      _items.add(CartItem(book: book));
    }
  }

  void remove(int bookId) {
    _items.removeWhere((i) => i.book.id == bookId);
  }

  void decrement(int bookId) {
    final idx = _items.indexWhere((i) => i.book.id == bookId);
    if (idx == -1) return;
    if (_items[idx].quantity <= 1) {
      _items.removeAt(idx);
    } else {
      _items[idx].quantity--;
    }
  }

  void clear() => _items.clear();
}

