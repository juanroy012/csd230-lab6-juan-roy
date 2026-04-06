import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:phosphor_flutter/phosphor_flutter.dart';
import 'package:provider/provider.dart';
import 'package:lab6/core/constants/app_colors.dart';
import 'package:lab6/core/constants/app_spacing.dart';
import 'package:lab6/core/widgets/app_button.dart';
import 'package:lab6/core/widgets/app_text_field.dart';
import 'package:lab6/features/auth/providers/auth_provider.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _userCtrl = TextEditingController();
  final _passCtrl = TextEditingController();

  @override
  void dispose() {
    _userCtrl.dispose();
    _passCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    await context.read<AuthProvider>().login(
          _userCtrl.text.trim(),
          _passCtrl.text,
        );
    // Router redirect handles navigation after auth state change
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final auth = context.watch<AuthProvider>();

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: isDark
                ? [AppColors.darkBackground, AppColors.darkSurface]
                : [AppColors.lightBackground, AppColors.primaryLighter.withValues(alpha: 0.25)],
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.lg,
              vertical: AppSpacing.xl,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: AppSpacing.xl),

                // ── Branding ───────────────────────────────────────────────
                Row(
                  children: [
                    Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(
                        color: AppColors.primary,
                        borderRadius: BorderRadius.circular(AppRadius.md),
                      ),
                      child: const Icon(
                        Icons.auto_stories_rounded,
                        size: 26,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(width: AppSpacing.md),
                    Text(
                      'Libris',
                      style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                            color: AppColors.primary,
                            fontWeight: FontWeight.w700,
                          ),
                    ),
                  ],
                )
                    .animate()
                    .fadeIn(duration: 300.ms)
                    .slideX(begin: -0.05, end: 0, duration: 300.ms, curve: Curves.easeOut),

                const SizedBox(height: AppSpacing.xxl),

                // ── Headline ───────────────────────────────────────────────
                Text(
                  'Sign in',
                  style: Theme.of(context).textTheme.displayMedium,
                )
                    .animate(delay: 80.ms)
                    .fadeIn(duration: 300.ms)
                    .slideY(begin: 0.05, end: 0, duration: 300.ms, curve: Curves.easeOut),

                const SizedBox(height: AppSpacing.sm),

                Text(
                  'Access your library, collections, and more.',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                )
                    .animate(delay: 120.ms)
                    .fadeIn(duration: 300.ms),

                const SizedBox(height: AppSpacing.xl),

                // ── Form ───────────────────────────────────────────────────
                Form(
                  key: _formKey,
                  child: Column(
                    children: [
                      AppTextField(
                        controller: _userCtrl,
                        label: 'Username',
                        hint: 'Enter your username',
                        leading: Icon(
                          PhosphorIconsRegular.user,
                          size: 18,
                          color: isDark ? AppColors.darkTextSecondary : AppColors.slate400,
                        ),
                        keyboardType: TextInputType.text,
                        textInputAction: TextInputAction.next,
                        autofillHints: const [AutofillHints.username],
                        validator: (v) =>
                            (v == null || v.trim().isEmpty) ? 'Username is required.' : null,
                      )
                          .animate(delay: 160.ms)
                          .fadeIn(duration: 300.ms)
                          .slideY(begin: 0.05, end: 0, duration: 300.ms, curve: Curves.easeOut),

                      const SizedBox(height: AppSpacing.formGap),

                      AppTextField(
                        controller: _passCtrl,
                        label: 'Password',
                        hint: 'Enter your password',
                        leading: Icon(
                          PhosphorIconsRegular.lock,
                          size: 18,
                          color: isDark ? AppColors.darkTextSecondary : AppColors.slate400,
                        ),
                        isPassword: true,
                        textInputAction: TextInputAction.done,
                        autofillHints: const [AutofillHints.password],
                        onFieldSubmitted: (_) => _submit(),
                        validator: (v) =>
                            (v == null || v.isEmpty) ? 'Password is required.' : null,
                      )
                          .animate(delay: 200.ms)
                          .fadeIn(duration: 300.ms)
                          .slideY(begin: 0.05, end: 0, duration: 300.ms, curve: Curves.easeOut),
                    ],
                  ),
                ),

                // ── Error banner ───────────────────────────────────────────
                if (auth.status == AuthStatus.error && auth.error != null) ...[
                  const SizedBox(height: AppSpacing.md),
                  _ErrorBanner(message: auth.error!),
                ],

                const SizedBox(height: AppSpacing.xl),

                // ── Submit ─────────────────────────────────────────────────
                SizedBox(
                  width: double.infinity,
                  child: AppButton(
                    label: 'Sign in',
                    onPressed: auth.isLoading ? null : _submit,
                    isLoading: auth.isLoading,
                    isExpanded: true,
                  ),
                )
                    .animate(delay: 240.ms)
                    .fadeIn(duration: 300.ms)
                    .slideY(begin: 0.05, end: 0, duration: 300.ms, curve: Curves.easeOut),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _ErrorBanner extends StatelessWidget {
  const _ErrorBanner({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm,
      ),
      decoration: BoxDecoration(
        color: AppColors.error.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(AppRadius.md),
        border: Border.all(color: AppColors.error.withValues(alpha: 0.3)),
      ),
      child: Row(
        children: [
          Icon(PhosphorIconsRegular.warning, size: 16, color: AppColors.error),
          const SizedBox(width: AppSpacing.sm),
          Expanded(
            child: Text(
              message,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: AppColors.error,
                  ),
            ),
          ),
        ],
      ),
    ).animate().fadeIn(duration: 200.ms).slideY(begin: -0.05, end: 0, duration: 200.ms);
  }
}

