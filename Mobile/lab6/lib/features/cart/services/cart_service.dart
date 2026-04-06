import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:lab6/core/constants/api_constants.dart';

/// Response returned by the backend checkout endpoint.
class CheckoutResponse {
  const CheckoutResponse({
    required this.orderId,
    required this.message,
    required this.total,
    required this.count,
  });

  final int orderId;
  final String message;
  final double total;
  final int count;

  factory CheckoutResponse.fromJson(Map<String, dynamic> json) =>
      CheckoutResponse(
        orderId: (json['orderId'] as num?)?.toInt() ?? 0,
        message: (json['message'] as String?) ?? 'Checkout successful',
        total: (json['total'] as num?)?.toDouble() ?? 0.0,
        count: (json['count'] as num?)?.toInt() ?? 0,
      );
}

class CartService {
  const CartService();

  Map<String, String> _headers(String token) => {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      };

  /// Adds a product to the server-side cart.
  Future<void> addProduct(int productId, String token) async {
    await http
        .post(
          Uri.parse('${ApiConstants.baseUrl}${ApiConstants.cartAdd(productId)}'),
          headers: _headers(token),
        )
        .timeout(const Duration(seconds: 10));
  }

  /// Removes a product from the server-side cart.
  Future<void> removeProduct(int productId, String token) async {
    await http
        .post(
          Uri.parse(
              '${ApiConstants.baseUrl}${ApiConstants.cartRemove(productId)}'),
          headers: _headers(token),
        )
        .timeout(const Duration(seconds: 10));
  }

  /// Syncs local cart items to the backend, then calls checkout.
  /// [productIds] is the de-duplicated list of product IDs currently in cart.
  Future<CheckoutResponse> syncAndCheckout(
      List<int> productIds, String token) async {
    // Add each product once to the backend cart
    for (final id in productIds) {
      await addProduct(id, token);
    }

    final res = await http
        .post(
          Uri.parse('${ApiConstants.baseUrl}${ApiConstants.cartCheckout}'),
          headers: _headers(token),
        )
        .timeout(const Duration(seconds: 15));

    if (res.statusCode == 200 || res.statusCode == 201) {
      return CheckoutResponse.fromJson(
          jsonDecode(res.body) as Map<String, dynamic>);
    }
    throw 'Checkout failed (${res.statusCode}).';
  }
}

