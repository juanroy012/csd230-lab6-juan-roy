import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lab6/features/auth/providers/auth_provider.dart';

/// Renders [child] only when the authenticated user satisfies [allowedRoles].
/// Shows [fallback] (or nothing) otherwise.
///
/// Usage:
/// ```dart
/// RoleGuard(
///   allowedRoles: ['ADMIN'],
///   child: AdminActionButton(),
/// )
/// ```
class RoleGuard extends StatelessWidget {
  const RoleGuard({
    super.key,
    required this.allowedRoles,
    required this.child,
    this.fallback,
  });

  final List<String> allowedRoles;
  final Widget child;
  final Widget? fallback;

  @override
  Widget build(BuildContext context) {
    final role = context.select<AuthProvider, String?>((p) => p.role);
    final allowed = role != null &&
        allowedRoles.any((r) => r.toUpperCase() == role.toUpperCase());
    if (allowed) return child;
    return fallback ?? const SizedBox.shrink();
  }
}

/// Admin-only guard shorthand.
class AdminOnly extends StatelessWidget {
  const AdminOnly({super.key, required this.child, this.fallback});

  final Widget child;
  final Widget? fallback;

  @override
  Widget build(BuildContext context) {
    return RoleGuard(
      allowedRoles: const ['ADMIN'],
      fallback: fallback,
      child: child,
    );
  }
}

