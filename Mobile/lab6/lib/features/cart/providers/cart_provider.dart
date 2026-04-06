import 'package:flutter/foundation.dart';
import 'package:lab6/features/books/models/book_model.dart';
import 'package:lab6/features/cart/models/cart_model.dart';
import 'package:lab6/features/cart/services/cart_service.dart';

class CartProvider extends ChangeNotifier {
  CartProvider({CartService? service})
      : _service = service ?? const CartService();

  final CartModel _cart = CartModel();
  final CartService _service;

  /// Set on a successful checkout — contains the order id & total from backend.
  CheckoutResponse? lastCheckout;

  CartModel get cart => _cart;
  int get count => _cart.count;
  double get total => _cart.total;
  bool get isEmpty => _cart.isEmpty;

  void addItem(BookModel book) {
    _cart.add(book);
    notifyListeners();
  }

  void removeItem(int bookId) {
    _cart.remove(bookId);
    notifyListeners();
  }

  void decrementItem(int bookId) {
    _cart.decrement(bookId);
    notifyListeners();
  }

  void clear() {
    _cart.clear();
    notifyListeners();
  }

  /// Syncs the local cart to the backend, calls checkout, then clears.
  /// Throws a [String] error message on failure.
  Future<void> checkout(String token) async {
    final productIds = _cart.items.map((i) => i.book.id).toList();
    lastCheckout =
        await _service.syncAndCheckout(productIds, token);
    _cart.clear();
    notifyListeners();
  }
}

