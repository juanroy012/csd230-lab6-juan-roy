/// POST /api/rest/auth/login  — response body.
class AuthResponse {
  const AuthResponse({
    required this.token,
    required this.username,
    required this.role,
  });

  final String token;
  final String username;
  final String role;

  factory AuthResponse.fromJson(Map<String, dynamic> json) => AuthResponse(
        token: json['token'] as String,
        username: json['username'] as String,
        role: json['role'] as String,
      );
}

