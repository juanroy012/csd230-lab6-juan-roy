import 'package:flutter/foundation.dart';
import 'package:lab6/features/books/models/book_model.dart';
import 'package:lab6/features/books/services/books_service.dart';

enum LoadState { idle, loading, success, error }

class BooksProvider extends ChangeNotifier {
  BooksProvider(this._service);

  final BooksService _service;

  List<BookModel> _books = [];
  LoadState _state = LoadState.idle;
  String? _error;

  List<BookModel> get books => _books;
  LoadState get state => _state;
  String? get error => _error;
  bool get isLoading => _state == LoadState.loading;

  // ── Read ──────────────────────────────────────────────────────────────────

  Future<void> fetchAll(String token, {VoidCallback? onUnauthorized}) async {
    _state = LoadState.loading;
    _error = null;
    notifyListeners();

    try {
      _books = await _service.getAll(token);
      _state = LoadState.success;
    } on String catch (msg) {
      _error = msg;
      _state = LoadState.error;
      // If the backend rejected the token, tell the caller to log out.
      if (msg.contains('401') && onUnauthorized != null) {
        onUnauthorized();
        return;
      }
    } catch (e) {
      _error = 'Unable to load books. Please check your connection.';
      _state = LoadState.error;
    }
    notifyListeners();
  }

  // ── Derived helpers ───────────────────────────────────────────────────────

  List<BookModel> search(String query) {
    if (query.trim().isEmpty) return _books;
    final q = query.toLowerCase();
    return _books
        .where((b) =>
            b.name.toLowerCase().contains(q) ||
            b.author.toLowerCase().contains(q))
        .toList();
  }

  BookModel? findById(int id) {
    try {
      return _books.firstWhere((b) => b.id == id);
    } catch (_) {
      return null;
    }
  }

  int get totalCopies => _books.fold(0, (s, b) => s + b.copies);
  int get inStockCount => _books.where((b) => b.inStock).length;
  int get outOfStockCount => _books.where((b) => !b.inStock).length;

  // ── Admin CRUD ────────────────────────────────────────────────────────────

  Future<void> addBook(BookModel book, String token) async {
    final created = await _service.create(book, token);
    _books = [..._books, created];
    notifyListeners();
  }

  Future<void> updateBook(BookModel book, String token) async {
    final updated = await _service.update(book, token);
    _books = _books.map((b) => b.id == updated.id ? updated : b).toList();
    notifyListeners();
  }

  Future<void> deleteBook(int id, String token) async {
    await _service.delete(id, token);
    _books = _books.where((b) => b.id != id).toList();
    notifyListeners();
  }
}

