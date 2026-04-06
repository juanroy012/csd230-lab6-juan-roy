import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:lab6/core/constants/api_constants.dart';
import 'package:lab6/features/auth/models/auth_response.dart';
import 'package:lab6/features/auth/models/login_request.dart';

class AuthService {
  const AuthService();

  /// Sends login credentials and returns [AuthResponse] on success.
  /// Throws a [String] error message on failure.
  Future<AuthResponse> login(LoginRequest request) async {
    final uri = Uri.parse('${ApiConstants.baseUrl}${ApiConstants.login}');

    final response = await http
        .post(
          uri,
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode(request.toJson()),
        )
        .timeout(const Duration(seconds: 15));

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body) as Map<String, dynamic>;
      return AuthResponse.fromJson(data);
    }

    if (response.statusCode == 401 || response.statusCode == 403) {
      throw 'Invalid username or password.';
    }

    throw 'Login failed (${response.statusCode}). Please try again.';
  }
}

