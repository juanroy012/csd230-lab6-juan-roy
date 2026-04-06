import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lab6/features/auth/providers/auth_provider.dart';
import 'package:lab6/features/auth/screens/login_screen.dart';
import 'package:lab6/features/auth/screens/splash_screen.dart';
import 'package:lab6/features/books/models/book_model.dart';
import 'package:lab6/features/books/screens/admin_book_form_screen.dart';
import 'package:lab6/features/books/screens/book_detail_screen.dart';
import 'package:lab6/features/books/screens/books_list_screen.dart';
import 'package:lab6/features/books/screens/home_screen.dart';
import 'package:lab6/features/cart/screens/cart_screen.dart';
import 'package:lab6/features/notifications/screens/notifications_screen.dart';
import 'package:lab6/features/profile/screens/profile_screen.dart';
import 'package:lab6/features/search/screens/search_screen.dart';
import 'package:lab6/navigation/main_shell.dart';

/// Creates the GoRouter instance.
/// [authProvider] is passed in so that [refreshListenable] can trigger
/// redirect evaluation whenever auth state changes.
GoRouter createRouter(AuthProvider authProvider) {
  return GoRouter(
    initialLocation: '/splash',
    refreshListenable: authProvider,
    redirect: (context, state) {
      final status = authProvider.status;
      final location = state.matchedLocation;

      // Still resolving the persisted session — stay on splash
      if (status == AuthStatus.initial) {
        return location == '/splash' ? null : '/splash';
      }

      final isAuth = authProvider.isAuthenticated;

      // Once auth status is resolved, always leave the splash screen.
      // This was the hang bug: treating /splash as an auth page caused
      // unauthenticated users to stay on splash forever (redirect returned null).
      if (location == '/splash') {
        return isAuth ? '/home' : '/login';
      }

      final isOnLogin = location == '/login';

      if (!isAuth && !isOnLogin) return '/login';
      if (isAuth && isOnLogin) return '/home';

      // Admin-only route guard: redirect non-admins trying to access /admin/*
      if (!authProvider.isAdmin && location.startsWith('/admin')) {
        return '/home';
      }

      return null; // no redirect
    },
    routes: [
      // ── Public ──────────────────────────────────────────────────────────
      GoRoute(
        path: '/splash',
        builder: (_, __) => const SplashScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (_, __) => const LoginScreen(),
      ),

      // ── Out-of-shell routes (no bottom nav) ──────────────────────────────
      GoRoute(
        path: '/books/:id',
        builder: (ctx, state) {
          final id = int.tryParse(state.pathParameters['id'] ?? '') ?? 0;
          return BookDetailScreen(bookId: id);
        },
      ),
      GoRoute(
        path: '/admin/books/new',
        builder: (_, __) => const AdminBookFormScreen(),
      ),
      GoRoute(
        path: '/admin/books/:id/edit',
        builder: (ctx, state) {
          final book = state.extra as BookModel?;
          return AdminBookFormScreen(existingBook: book);
        },
      ),
      GoRoute(
        path: '/cart',
        builder: (_, __) => const CartScreen(),
      ),

      // ── Primary shell (persistent bottom nav) ───────────────────────────
      StatefulShellRoute.indexedStack(
        builder: (ctx, state, shell) => MainShell(navigationShell: shell),
        branches: [
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/home',
                builder: (_, __) => const HomeScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/books',
                builder: (_, __) => const BooksListScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/search',
                builder: (_, __) => const SearchScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/notifications',
                builder: (_, __) => const NotificationsScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/profile',
                builder: (_, __) => const ProfileScreen(),
              ),
            ],
          ),
        ],
      ),
    ],
    errorBuilder: (ctx, state) => Scaffold(
      body: Center(
        child: Text('Page not found: ${state.error}'),
      ),
    ),
  );
}



