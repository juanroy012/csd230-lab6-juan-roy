import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:lab6/core/constants/app_colors.dart';
import 'package:lab6/core/constants/app_spacing.dart';
import 'package:lab6/features/auth/providers/auth_provider.dart';

/// Splash screen — shown once on app launch while session is being restored.
/// Automatically redirects via go_router once auth status is resolved.
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final auth = context.read<AuthProvider>();
      auth.tryRestoreSession();

      // Safety fallback: if auth status doesn't resolve within 5 seconds,
      // force unauthenticated so the app never gets stuck on the splash screen.
      Future.delayed(const Duration(seconds: 5), () {
        if (mounted && auth.status == AuthStatus.initial) {
          auth.forceUnauthenticated();
        }
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: isDark
                ? [AppColors.darkBackground, AppColors.darkSurface, AppColors.primaryVariant.withValues(alpha: 0.3)]
                : [AppColors.lightBackground, AppColors.primaryLighter.withValues(alpha: 0.4), AppColors.lightSurface],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // App icon
                Container(
                  width: 88,
                  height: 88,
                  decoration: BoxDecoration(
                    color: AppColors.primary,
                    borderRadius: BorderRadius.circular(AppRadius.xl),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.primary.withValues(alpha: 0.35),
                        blurRadius: 32,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: const Icon(
                    Icons.auto_stories_rounded,
                    size: 44,
                    color: Colors.white,
                  ),
                )
                    .animate()
                    .scale(begin: const Offset(0.8, 0.8), duration: 400.ms, curve: Curves.easeOut)
                    .fadeIn(duration: 400.ms),

                const SizedBox(height: AppSpacing.lg),

                Text(
                  'Libris',
                  style: Theme.of(context).textTheme.displayMedium?.copyWith(
                        color: AppColors.primary,
                        fontWeight: FontWeight.w700,
                      ),
                )
                    .animate(delay: 200.ms)
                    .fadeIn(duration: 350.ms)
                    .slideY(begin: 0.1, end: 0, duration: 350.ms, curve: Curves.easeOut),

                const SizedBox(height: AppSpacing.sm),

                Text(
                  'Your personal library, everywhere.',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                )
                    .animate(delay: 350.ms)
                    .fadeIn(duration: 350.ms),

                const SizedBox(height: AppSpacing.xxxl),

                SizedBox(
                  width: 24,
                  height: 24,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: AppColors.primary.withValues(alpha: 0.5),
                  ),
                )
                    .animate(delay: 500.ms)
                    .fadeIn(duration: 300.ms),
              ],
            ),
          ),
        ),
      ),
    );
  }
}


