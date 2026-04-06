import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import 'package:lab6/core/constants/app_colors.dart';
import 'package:lab6/core/constants/app_spacing.dart';

/// Shimmer skeleton for loading states.
class LoadingShimmer extends StatelessWidget {
  const LoadingShimmer({super.key, this.itemCount = 5});

  final int itemCount;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final base = isDark ? AppColors.darkCard : AppColors.slate200;
    final highlight = isDark ? AppColors.darkCardElevated : AppColors.slate100;

    return Shimmer.fromColors(
      baseColor: base,
      highlightColor: highlight,
      child: ListView.separated(
        physics: const NeverScrollableScrollPhysics(),
        itemCount: itemCount,
        padding: const EdgeInsets.all(AppSpacing.pagePadding),
        separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.sm),
        itemBuilder: (_, __) => const _BookTileSkeleton(),
      ),
    );
  }
}

class _BookTileSkeleton extends StatelessWidget {
  const _BookTileSkeleton();

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final fill = isDark ? AppColors.darkCard : AppColors.slate200;

    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: fill,
        borderRadius: BorderRadius.circular(AppRadius.lg),
      ),
      child: Row(
        children: [
          Container(
            width: 56,
            height: 72,
            decoration: BoxDecoration(
              color: fill,
              borderRadius: BorderRadius.circular(AppRadius.sm),
            ),
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(height: 14, color: fill),
                const SizedBox(height: 8),
                Container(height: 12, width: 140, color: fill),
                const SizedBox(height: 12),
                Container(height: 10, width: 80, color: fill),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Simple inline shimmer box for any widget slot.
class ShimmerBox extends StatelessWidget {
  const ShimmerBox({super.key, required this.width, required this.height, this.radius});

  final double width;
  final double height;
  final double? radius;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Shimmer.fromColors(
      baseColor: isDark ? AppColors.darkCard : AppColors.slate200,
      highlightColor: isDark ? AppColors.darkCardElevated : AppColors.slate100,
      child: Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          color: isDark ? AppColors.darkCard : AppColors.slate200,
          borderRadius: BorderRadius.circular(radius ?? AppRadius.sm),
        ),
      ),
    );
  }
}

