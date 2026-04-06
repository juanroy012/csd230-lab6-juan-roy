import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:phosphor_flutter/phosphor_flutter.dart';
import 'package:lab6/core/constants/app_colors.dart';
import 'package:lab6/core/constants/app_spacing.dart';
import 'package:lab6/core/widgets/empty_state.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  static final _demoItems = [
    _NotifItem(
      icon: PhosphorIconsRegular.bookOpen,
      title: 'New title available',
      body: '"Clean Code" has been added to the catalog.',
      time: '2h ago',
      isUnread: true,
      color: AppColors.primary,
    ),
    _NotifItem(
      icon: PhosphorIconsRegular.checkCircle,
      title: 'Order confirmed',
      body: 'Your order for "The Pragmatic Programmer" is confirmed.',
      time: '1d ago',
      isUnread: true,
      color: AppColors.success,
    ),
    _NotifItem(
      icon: PhosphorIconsRegular.warning,
      title: 'Low stock alert',
      body: '"Design Patterns" has only 1 copy left.',
      time: '3d ago',
      isUnread: false,
      color: AppColors.warning,
    ),
    _NotifItem(
      icon: PhosphorIconsRegular.info,
      title: 'System update',
      body: 'The catalog has been refreshed with 14 new titles.',
      time: '5d ago',
      isUnread: false,
      color: AppColors.info,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(
                AppSpacing.pagePadding,
                AppSpacing.md,
                AppSpacing.pagePadding,
                AppSpacing.md,
              ),
              child: Row(
                children: [
                  Text('Notifications', style: Theme.of(context).textTheme.headlineMedium),
                  const Spacer(),
                  TextButton(
                    onPressed: () {},
                    child: const Text('Mark all read'),
                  ),
                ],
              ),
            ),

            if (_demoItems.isEmpty)
              const Expanded(
                child: EmptyState(
                  title: 'No notifications',
                  subtitle: 'You are all caught up.',
                  icon: Icons.notifications_none_rounded,
                ),
              )
            else
              Expanded(
                child: ListView.separated(
                  padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pagePadding),
                  itemCount: _demoItems.length,
                  separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.xs),
                  itemBuilder: (ctx, i) {
                    return _NotifTile(item: _demoItems[i])
                        .animate(delay: (i * 40).ms)
                        .fadeIn(duration: 250.ms)
                        .slideX(begin: 0.03, end: 0, duration: 250.ms, curve: Curves.easeOut);
                  },
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _NotifItem {
  const _NotifItem({
    required this.icon,
    required this.title,
    required this.body,
    required this.time,
    required this.isUnread,
    required this.color,
  });

  final IconData icon;
  final String title;
  final String body;
  final String time;
  final bool isUnread;
  final Color color;
}

class _NotifTile extends StatelessWidget {
  const _NotifTile({required this.item});

  final _NotifItem item;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final scheme = Theme.of(context).colorScheme;

    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: item.isUnread
            ? (isDark
                ? item.color.withValues(alpha: 0.06)
                : item.color.withValues(alpha: 0.04))
            : (isDark ? AppColors.darkCard : AppColors.lightCard),
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(
          color: item.isUnread
              ? item.color.withValues(alpha: 0.2)
              : (isDark ? AppColors.darkBorder : AppColors.lightBorder),
          width: 1,
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 38,
            height: 38,
            decoration: BoxDecoration(
              color: item.color.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(AppRadius.md),
            ),
            child: Icon(item.icon, size: 18, color: item.color),
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        item.title,
                        style: Theme.of(context).textTheme.labelLarge?.copyWith(
                              fontWeight: item.isUnread ? FontWeight.w600 : FontWeight.w500,
                            ),
                      ),
                    ),
                    if (item.isUnread)
                      Container(
                        width: 7,
                        height: 7,
                        decoration: BoxDecoration(
                          color: item.color,
                          shape: BoxShape.circle,
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 2),
                Text(
                  item.body,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: scheme.onSurfaceVariant,
                      ),
                ),
                const SizedBox(height: AppSpacing.xs),
                Text(
                  item.time,
                  style: Theme.of(context).textTheme.labelSmall?.copyWith(
                        color: scheme.onSurfaceVariant.withValues(alpha: 0.6),
                      ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}


