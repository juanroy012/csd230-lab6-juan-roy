import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:lab6/features/auth/models/auth_response.dart';
import 'package:lab6/features/auth/models/login_request.dart';
import 'package:lab6/features/auth/services/auth_service.dart';

// SharedPreferences keys
const _kToken = 'auth_token';
const _kUsername = 'auth_username';
const _kRole = 'auth_role';

enum AuthStatus { initial, loading, authenticated, unauthenticated, error }

/// Central authentication state.
/// Extends [ChangeNotifier] so go_router can listen via [refreshListenable].
class AuthProvider extends ChangeNotifier {
  AuthProvider(this._service);

  final AuthService _service;

  AuthStatus _status = AuthStatus.initial;
  String? _token;
  String? _username;
  String? _role;
  String? _error;

  AuthStatus get status => _status;
  String? get token => _token;
  String? get username => _username;
  String? get role => _role;
  String? get error => _error;

  bool get isAuthenticated => _status == AuthStatus.authenticated;
  bool get isAdmin => _role?.toUpperCase() == 'ADMIN';
  bool get isLoading => _status == AuthStatus.loading;

  /// Called once on app start to restore a persisted session.
  Future<void> tryRestoreSession() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(_kToken);
    if (token != null) {
      _token = token;
      _username = prefs.getString(_kUsername);
      _role = prefs.getString(_kRole);
      _status = AuthStatus.authenticated;
    } else {
      _status = AuthStatus.unauthenticated;
    }
    notifyListeners();
  }

  /// Called when the splash screen safety timeout fires, or when a 401 is
  /// received from the backend with a stored token (expired / revoked).
  void forceUnauthenticated() {
    _token = null;
    _username = null;
    _role = null;
    _error = null;
    _status = AuthStatus.unauthenticated;
    // Also clear persisted session so the expired token isn't used again.
    SharedPreferences.getInstance().then((prefs) {
      prefs.remove(_kToken);
      prefs.remove(_kUsername);
      prefs.remove(_kRole);
    });
    notifyListeners();
  }

  Future<void> login(String username, String password) async {
    _status = AuthStatus.loading;
    _error = null;
    notifyListeners();

    try {
      final response = await _service.login(
        LoginRequest(username: username, password: password),
      );
      await _persistSession(response);
      _token = response.token;
      _username = response.username;
      _role = response.role;
      _status = AuthStatus.authenticated;
    } on String catch (msg) {
      _error = msg;
      _status = AuthStatus.error;
    } catch (_) {
      _error = 'Could not connect to the server.';
      _status = AuthStatus.error;
    }

    notifyListeners();
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_kToken);
    await prefs.remove(_kUsername);
    await prefs.remove(_kRole);
    _token = null;
    _username = null;
    _role = null;
    _error = null;
    _status = AuthStatus.unauthenticated;
    notifyListeners();
  }

  Future<void> _persistSession(AuthResponse r) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_kToken, r.token);
    await prefs.setString(_kUsername, r.username);
    await prefs.setString(_kRole, r.role);
  }
}

