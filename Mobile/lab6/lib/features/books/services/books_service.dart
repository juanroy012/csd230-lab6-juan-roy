import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:lab6/core/constants/api_constants.dart';
import 'package:lab6/features/books/models/book_model.dart';

class BooksService {
  const BooksService();

  Map<String, String> _headers(String token) => {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      };

  Future<List<BookModel>> getAll(String token) async {
    final res = await http
        .get(Uri.parse('${ApiConstants.baseUrl}${ApiConstants.books}'),
            headers: _headers(token))
        .timeout(const Duration(seconds: 15));

    if (res.statusCode == 200) {
      final list = jsonDecode(res.body) as List;
      return list.map((e) => BookModel.fromJson(e as Map<String, dynamic>)).toList();
    }
    throw 'Failed to load books (${res.statusCode}).';
  }

  Future<BookModel> getById(int id, String token) async {
    final res = await http
        .get(Uri.parse('${ApiConstants.baseUrl}${ApiConstants.book(id)}'),
            headers: _headers(token))
        .timeout(const Duration(seconds: 15));

    if (res.statusCode == 200) {
      return BookModel.fromJson(jsonDecode(res.body) as Map<String, dynamic>);
    }
    throw 'Failed to load book (${res.statusCode}).';
  }

  Future<BookModel> create(BookModel book, String token) async {
    final res = await http
        .post(Uri.parse('${ApiConstants.baseUrl}${ApiConstants.books}'),
            headers: _headers(token), body: jsonEncode(book.toJson()))
        .timeout(const Duration(seconds: 15));

    if (res.statusCode == 200 || res.statusCode == 201) {
      return BookModel.fromJson(jsonDecode(res.body) as Map<String, dynamic>);
    }
    throw 'Failed to create book (${res.statusCode}).';
  }

  Future<BookModel> update(BookModel book, String token) async {
    final res = await http
        .put(Uri.parse('${ApiConstants.baseUrl}${ApiConstants.book(book.id)}'),
            headers: _headers(token), body: jsonEncode(book.toJson()))
        .timeout(const Duration(seconds: 15));

    if (res.statusCode == 200) {
      return BookModel.fromJson(jsonDecode(res.body) as Map<String, dynamic>);
    }
    throw 'Failed to update book (${res.statusCode}).';
  }

  Future<void> delete(int id, String token) async {
    final res = await http
        .delete(Uri.parse('${ApiConstants.baseUrl}${ApiConstants.book(id)}'),
            headers: _headers(token))
        .timeout(const Duration(seconds: 15));

    if (res.statusCode != 200 && res.statusCode != 204) {
      throw 'Failed to delete book (${res.statusCode}).';
    }
  }
}

