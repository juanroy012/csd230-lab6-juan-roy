import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lab6/core/constants/app_colors.dart';
import 'package:lab6/core/constants/app_spacing.dart';

/// Navigation item descriptor for the glass bottom nav.
class NavItem {
  const NavItem({
    required this.label,
    required this.icon,
    required this.activeIcon,
    required this.path,
  });

  final String label;
  final IconData icon;
  final IconData activeIcon;
  final String path;
}

/// Frosted-glass bottom navigation bar.
///
/// Design: BackdropFilter blur + translucent fill + hairline top border.
/// Motion: instant indicator repositioning — no spring/bounce.
class GlassBottomNav extends StatelessWidget {
  const GlassBottomNav({super.key, required this.currentIndex, required this.items});

  final int currentIndex;
  final List<NavItem> items;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bottomPadding = MediaQuery.of(context).padding.bottom;

    return ClipRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(
          sigmaX: AppBlur.nav,
          sigmaY: AppBlur.nav,
        ),
        child: Container(
          decoration: BoxDecoration(
            color: isDark
                ? AppColors.darkBackground.withValues(alpha: 0.78)
                : AppColors.lightSurface.withValues(alpha: 0.82),
            border: Border(
              top: BorderSide(
                color: isDark
                    ? AppColors.glassBorderDark
                    : AppColors.lightBorder,
                width: 0.5,
              ),
            ),
          ),
          // Separate the 60-px nav row from the system bottom inset so
          // the Row never fights SafeArea for height.
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              SizedBox(
                height: 60,
                child: Row(
                  children: List.generate(items.length, (i) {
                    return _NavTile(
                      item: items[i],
                      isActive: i == currentIndex,
                      onTap: () => context.go(items[i].path),
                    );
                  }),
                ),
              ),
              // System navigation bar / home-indicator area
              SizedBox(height: bottomPadding),
            ],
          ),
        ),
      ),
    );
  }
}

class _NavTile extends StatelessWidget {
  const _NavTile({
    required this.item,
    required this.isActive,
    required this.onTap,
  });

  final NavItem item;
  final bool isActive;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final activeColor = scheme.primary;
    final inactiveColor = scheme.onSurfaceVariant.withValues(alpha: 0.6);

    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        behavior: HitTestBehavior.opaque,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 180),
          curve: Curves.easeOut,
          // Reduced from AppSpacing.sm (8) → 6 px so the content fits in 60 px
          padding: const EdgeInsets.symmetric(vertical: 6),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Indicator pill — margin reduced from 4 → 2 px
              AnimatedContainer(
                duration: const Duration(milliseconds: 180),
                curve: Curves.easeOut,
                height: 3,
                width: isActive ? 20 : 0,
                margin: const EdgeInsets.only(bottom: 2),
                decoration: BoxDecoration(
                  color: activeColor,
                  borderRadius: BorderRadius.circular(AppRadius.full),
                ),
              ),
              Icon(
                isActive ? item.activeIcon : item.icon,
                size: 22,
                color: isActive ? activeColor : inactiveColor,
              ),
              const SizedBox(height: 2),
              Text(
                item.label,
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
                  color: isActive ? activeColor : inactiveColor,
                  letterSpacing: 0.2,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

