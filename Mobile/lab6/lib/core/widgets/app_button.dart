import 'package:flutter/material.dart';
import 'package:lab6/core/constants/app_colors.dart';
import 'package:lab6/core/constants/app_spacing.dart';

enum AppButtonVariant { primary, secondary, ghost, danger }

/// Reusable button with primary / secondary / ghost / danger variants.
class AppButton extends StatelessWidget {
  const AppButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.variant = AppButtonVariant.primary,
    this.leading,
    this.trailing,
    this.isLoading = false,
    this.isExpanded = false,
  });

  final String label;
  final VoidCallback? onPressed;
  final AppButtonVariant variant;
  final Widget? leading;
  final Widget? trailing;
  final bool isLoading;
  final bool isExpanded;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final (bg, fg, border) = switch (variant) {
      AppButtonVariant.primary => (
          AppColors.primary,
          Colors.white,
          Colors.transparent,
        ),
      AppButtonVariant.secondary => (
          isDark ? AppColors.darkCardElevated : AppColors.slate100,
          scheme.onSurface,
          isDark ? AppColors.darkBorder : AppColors.lightBorder,
        ),
      AppButtonVariant.ghost => (
          Colors.transparent,
          AppColors.primary,
          Colors.transparent,
        ),
      AppButtonVariant.danger => (
          AppColors.error.withValues(alpha: 0.12),
          AppColors.error,
          Colors.transparent,
        ),
    };

    Widget content = Row(
      mainAxisSize: isExpanded ? MainAxisSize.max : MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (isLoading)
          SizedBox(
            width: 16,
            height: 16,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              valueColor: AlwaysStoppedAnimation(fg),
            ),
          )
        else ...[
          if (leading != null) ...[
            IconTheme(data: IconThemeData(color: fg, size: 18), child: leading!),
            const SizedBox(width: AppSpacing.sm),
          ],
          Text(
            label,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: onPressed == null ? fg.withValues(alpha: 0.4) : fg,
            ),
          ),
          if (trailing != null) ...[
            const SizedBox(width: AppSpacing.sm),
            IconTheme(data: IconThemeData(color: fg, size: 18), child: trailing!),
          ],
        ],
      ],
    );

    return AnimatedOpacity(
      duration: const Duration(milliseconds: 150),
      opacity: onPressed == null ? 0.5 : 1.0,
      child: Material(
        color: bg,
        borderRadius: BorderRadius.circular(AppRadius.md),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: isLoading ? null : onPressed,
          child: Container(
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.lg,
              vertical: AppSpacing.md,
            ),
            decoration: border != Colors.transparent
                ? BoxDecoration(
                    border: Border.all(color: border, width: 1.0),
                    borderRadius: BorderRadius.circular(AppRadius.md),
                  )
                : null,
            child: content,
          ),
        ),
      ),
    );
  }
}

/// Icon-only circular / rounded button.
class AppIconButton extends StatelessWidget {
  const AppIconButton({
    super.key,
    required this.icon,
    required this.onPressed,
    this.tooltip,
    this.size = 40,
    this.iconSize = 20,
    this.color,
    this.backgroundColor,
  });

  final IconData icon;
  final VoidCallback? onPressed;
  final String? tooltip;
  final double size;
  final double iconSize;
  final Color? color;
  final Color? backgroundColor;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Tooltip(
      message: tooltip ?? '',
      child: Material(
        color: backgroundColor ??
            (isDark ? AppColors.darkCardElevated : AppColors.slate100),
        borderRadius: BorderRadius.circular(AppRadius.md),
        child: InkWell(
          borderRadius: BorderRadius.circular(AppRadius.md),
          onTap: onPressed,
          child: SizedBox(
            width: size,
            height: size,
            child: Icon(
              icon,
              size: iconSize,
              color: color ?? scheme.onSurface,
            ),
          ),
        ),
      ),
    );
  }
}

