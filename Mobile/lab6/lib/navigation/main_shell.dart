import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:phosphor_flutter/phosphor_flutter.dart';
import 'package:provider/provider.dart';
import 'package:lab6/core/constants/app_colors.dart';
import 'package:lab6/core/widgets/glass_bottom_nav.dart';
import 'package:lab6/features/auth/providers/auth_provider.dart';
import 'package:lab6/features/cart/providers/cart_provider.dart';

/// Persistent scaffold shell that wraps all primary routes.
/// Houses the glassmorphism bottom navigation bar.
class MainShell extends StatelessWidget {
  const MainShell({super.key, required this.navigationShell});

  final StatefulNavigationShell navigationShell;

  static const _userNavItems = [
    NavItem(
      label: 'Home',
      icon: PhosphorIconsRegular.house,
      activeIcon: PhosphorIconsFill.house,
      path: '/home',
    ),
    NavItem(
      label: 'Books',
      icon: PhosphorIconsRegular.books,
      activeIcon: PhosphorIconsFill.books,
      path: '/books',
    ),
    NavItem(
      label: 'Search',
      icon: PhosphorIconsRegular.magnifyingGlass,
      activeIcon: PhosphorIconsFill.magnifyingGlass,
      path: '/search',
    ),
    NavItem(
      label: 'Alerts',
      icon: PhosphorIconsRegular.bell,
      activeIcon: PhosphorIconsFill.bell,
      path: '/notifications',
    ),
    NavItem(
      label: 'Profile',
      icon: PhosphorIconsRegular.user,
      activeIcon: PhosphorIconsFill.user,
      path: '/profile',
    ),
  ];

  static const _adminNavItems = [
    NavItem(
      label: 'Dashboard',
      icon: PhosphorIconsRegular.house,
      activeIcon: PhosphorIconsFill.house,
      path: '/home',
    ),
    NavItem(
      label: 'Catalog',
      icon: PhosphorIconsRegular.books,
      activeIcon: PhosphorIconsFill.books,
      path: '/books',
    ),
    NavItem(
      label: 'Search',
      icon: PhosphorIconsRegular.magnifyingGlass,
      activeIcon: PhosphorIconsFill.magnifyingGlass,
      path: '/search',
    ),
    NavItem(
      label: 'Alerts',
      icon: PhosphorIconsRegular.bell,
      activeIcon: PhosphorIconsFill.bell,
      path: '/notifications',
    ),
    NavItem(
      label: 'Profile',
      icon: PhosphorIconsRegular.user,
      activeIcon: PhosphorIconsFill.user,
      path: '/profile',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final cart = context.watch<CartProvider>();
    final navItems = auth.isAdmin ? _adminNavItems : _userNavItems;

    return Scaffold(
      body: navigationShell,
      extendBody: true, // body goes behind the glass nav
      bottomNavigationBar: Stack(
        alignment: Alignment.topRight,
        children: [
          GlassBottomNav(
            currentIndex: navigationShell.currentIndex,
            items: navItems,
          ),
          // Cart badge for user role
          if (!auth.isAdmin && cart.count > 0)
            Positioned(
              top: 6,
              right: _cartBadgeRightOffset(context),
              child: _CartBadge(count: cart.count),
            ),
        ],
      ),
    );
  }

  /// Approximates the right-offset for the cart badge on the "Books" tab.
  double _cartBadgeRightOffset(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    // Books tab is index 1 of 5 → its center is at screenWidth * (1.5/5)
    final tabWidth = screenWidth / 5;
    return screenWidth - tabWidth * 2 + tabWidth * 0.3;
  }
}

class _CartBadge extends StatelessWidget {
  const _CartBadge({required this.count});

  final int count;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 16,
      height: 16,
      decoration: const BoxDecoration(
        color: AppColors.error,
        shape: BoxShape.circle,
      ),
      child: Center(
        child: Text(
          count > 9 ? '9+' : '$count',
          style: const TextStyle(
            color: Colors.white,
            fontSize: 9,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
    );
  }
}


