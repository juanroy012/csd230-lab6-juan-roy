import 'package:flutter/material.dart';
import 'package:phosphor_flutter/phosphor_flutter.dart';
import 'package:lab6/core/constants/app_colors.dart';
import 'package:lab6/core/constants/app_spacing.dart';

enum SnackKind { info, success, warning, error }

/// Shows a styled floating snackbar / toast.
void showAppSnackbar(
  BuildContext context, {
  required String message,
  SnackKind kind = SnackKind.info,
  Duration duration = const Duration(seconds: 3),
}) {
  final (color, icon) = switch (kind) {
    SnackKind.info => (AppColors.info, PhosphorIconsRegular.info),
    SnackKind.success => (AppColors.success, PhosphorIconsRegular.checkCircle),
    SnackKind.warning => (AppColors.warning, PhosphorIconsRegular.warning),
    SnackKind.error => (AppColors.error, PhosphorIconsRegular.xCircle),
  };

  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      duration: duration,
      content: Row(
        children: [
          Icon(icon, size: 18, color: color),
          const SizedBox(width: AppSpacing.sm),
          Expanded(
            child: Text(
              message,
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w500,
                color: Colors.white,
              ),
            ),
          ),
        ],
      ),
    ),
  );
}

