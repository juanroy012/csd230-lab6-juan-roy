import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:phosphor_flutter/phosphor_flutter.dart';
import 'package:provider/provider.dart';
import 'package:lab6/core/constants/app_colors.dart';
import 'package:lab6/core/constants/app_spacing.dart';
import 'package:lab6/core/widgets/app_button.dart';
import 'package:lab6/core/widgets/app_card.dart';
import 'package:lab6/core/widgets/role_guard.dart';
import 'package:lab6/features/auth/providers/auth_provider.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.pagePadding),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Profile', style: Theme.of(context).textTheme.headlineMedium)
                  .animate()
                  .fadeIn(duration: 250.ms),

              const SizedBox(height: AppSpacing.lg),

              // ── Avatar + name card ────────────────────────────────────
              AppCard(
                elevated: true,
                child: Row(
                  children: [
                    Container(
                      width: 60,
                      height: 60,
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [AppColors.primary, AppColors.accentViolet],
                        ),
                        borderRadius: BorderRadius.circular(AppRadius.xl),
                      ),
                      child: Center(
                        child: Text(
                          (auth.username?.isNotEmpty == true
                              ? auth.username![0].toUpperCase()
                              : 'U'),
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            auth.username ?? 'User',
                            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                  fontWeight: FontWeight.w600,
                                ),
                          ),
                          const SizedBox(height: 2),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: AppSpacing.sm,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: auth.isAdmin
                                  ? AppColors.accentViolet.withValues(alpha: 0.12)
                                  : AppColors.primary.withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(AppRadius.full),
                            ),
                            child: Text(
                              auth.isAdmin ? 'Administrator' : 'Member',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: auth.isAdmin ? AppColors.accentViolet : AppColors.primary,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              )
                  .animate(delay: 60.ms)
                  .fadeIn(duration: 280.ms)
                  .slideY(begin: 0.04, end: 0, duration: 280.ms, curve: Curves.easeOut),

              const SizedBox(height: AppSpacing.lg),

              // ── Settings section ──────────────────────────────────────
              _SectionLabel(label: 'Preferences'),

              _SettingsTile(
                icon: PhosphorIconsRegular.moon,
                label: 'Appearance',
                subtitle: isDark ? 'Dark mode' : 'Light mode',
                onTap: () {},
              ),

              _SettingsTile(
                icon: PhosphorIconsRegular.bell,
                label: 'Notifications',
                subtitle: 'Manage alerts',
                onTap: () => context.go('/notifications'),
              ),

              const SizedBox(height: AppSpacing.md),

              // ── Admin section ─────────────────────────────────────────
              AdminOnly(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _SectionLabel(label: 'Administration'),
                    _SettingsTile(
                      icon: PhosphorIconsRegular.books,
                      label: 'Manage Catalog',
                      subtitle: 'Add, edit and remove books',
                      onTap: () => context.go('/books'),
                    ),
                    _SettingsTile(
                      icon: PhosphorIconsRegular.plus,
                      label: 'Add New Book',
                      subtitle: 'Create a new catalog entry',
                      onTap: () => context.push('/admin/books/new'),
                    ),
                    const SizedBox(height: AppSpacing.md),
                  ],
                ),
              ),

              // ── Account section ───────────────────────────────────────
              _SectionLabel(label: 'Account'),

              _SettingsTile(
                icon: PhosphorIconsRegular.info,
                label: 'About Libris',
                subtitle: 'Version 1.0.0',
                onTap: () {},
              ),

              const SizedBox(height: AppSpacing.lg),

              // ── Sign out ──────────────────────────────────────────────
              SizedBox(
                width: double.infinity,
                child: AppButton(
                  label: 'Sign out',
                  variant: AppButtonVariant.danger,
                  leading: Icon(PhosphorIconsRegular.signOut, size: 16),
                  isExpanded: true,
                  onPressed: () async {
                    final ok = await showDialog<bool>(
                      context: context,
                      builder: (ctx) => AlertDialog(
                        title: const Text('Sign out'),
                        content: const Text('Are you sure you want to sign out?'),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(ctx, false),
                            child: const Text('Cancel'),
                          ),
                          TextButton(
                            onPressed: () => Navigator.pop(ctx, true),
                            style: TextButton.styleFrom(foregroundColor: AppColors.error),
                            child: const Text('Sign out'),
                          ),
                        ],
                      ),
                    );
                    if (ok == true && context.mounted) {
                      await context.read<AuthProvider>().logout();
                      // GoRouter redirect handles navigation to /login
                    }
                  },
                ),
              )
                  .animate(delay: 200.ms)
                  .fadeIn(duration: 280.ms),

              const SizedBox(height: AppSpacing.xl),
            ],
          ),
        ),
      ),
    );
  }
}

class _SectionLabel extends StatelessWidget {
  const _SectionLabel({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.sm),
      child: Text(
        label.toUpperCase(),
        style: Theme.of(context).textTheme.labelSmall?.copyWith(
              letterSpacing: 1.2,
              color: Theme.of(context).colorScheme.onSurfaceVariant,
            ),
      ),
    );
  }
}

class _SettingsTile extends StatelessWidget {
  const _SettingsTile({
    required this.icon,
    required this.label,
    required this.onTap,
    this.subtitle,
  });

  final IconData icon;
  final String label;
  final String? subtitle;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.xs),
      child: Material(
        color: isDark ? AppColors.darkCard : AppColors.lightCard,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: onTap,
          child: Container(
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.md,
              vertical: AppSpacing.sm + 2,
            ),
            decoration: BoxDecoration(
              border: Border.all(
                color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                width: 1,
              ),
              borderRadius: BorderRadius.circular(AppRadius.lg),
            ),
            child: Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: AppColors.primary.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(AppRadius.sm),
                  ),
                  child: Icon(icon, size: 18, color: AppColors.primary),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(label, style: Theme.of(context).textTheme.labelLarge),
                      if (subtitle != null)
                        Text(
                          subtitle!,
                          style: Theme.of(context).textTheme.labelSmall?.copyWith(
                                color: Theme.of(context).colorScheme.onSurfaceVariant,
                              ),
                        ),
                    ],
                  ),
                ),
                Icon(
                  PhosphorIconsRegular.arrowRight,
                  size: 14,
                  color: Theme.of(context).colorScheme.onSurfaceVariant.withValues(alpha: 0.5),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}


