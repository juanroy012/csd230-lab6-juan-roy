import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:phosphor_flutter/phosphor_flutter.dart';
import 'package:provider/provider.dart';
import 'package:lab6/core/constants/app_colors.dart';
import 'package:lab6/core/constants/app_spacing.dart';
import 'package:lab6/core/widgets/app_button.dart';
import 'package:lab6/core/widgets/app_snackbar.dart';
import 'package:lab6/core/widgets/empty_state.dart';
import 'package:lab6/features/auth/providers/auth_provider.dart';
import 'package:lab6/features/cart/models/cart_model.dart';
import 'package:lab6/features/cart/providers/cart_provider.dart';

class CartScreen extends StatefulWidget {
  const CartScreen({super.key});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  bool _checkingOut = false;

  Future<void> _checkout() async {
    final auth = context.read<AuthProvider>();
    if (auth.token == null) return;

    setState(() => _checkingOut = true);
    try {
      final cartProvider = context.read<CartProvider>();
      await cartProvider.checkout(auth.token!);
      if (mounted) {
        final orderId = cartProvider.lastCheckout?.orderId;
        showAppSnackbar(
          context,
          message: orderId != null
              ? 'Order #$orderId placed successfully!'
              : 'Order placed successfully!',
          kind: SnackKind.success,
        );
      }
    } on String catch (msg) {
      if (mounted) {
        showAppSnackbar(context, message: msg, kind: SnackKind.error);
      }
    } catch (_) {
      if (mounted) {
        showAppSnackbar(
          context,
          message: 'Checkout failed. Please try again.',
          kind: SnackKind.error,
        );
      }
    } finally {
      if (mounted) setState(() => _checkingOut = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final cart = context.watch<CartProvider>();
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // ── Header ────────────────────────────────────────────────────
            Padding(
              padding: const EdgeInsets.fromLTRB(
                AppSpacing.pagePadding,
                AppSpacing.md,
                AppSpacing.pagePadding,
                AppSpacing.sm,
              ),
              child: Row(
                children: [
                  IconButton(
                    icon: Icon(PhosphorIconsRegular.arrowLeft, size: 20),
                    onPressed: () => context.pop(),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  Text('Cart', style: Theme.of(context).textTheme.headlineMedium),
                  const Spacer(),
                  if (!cart.isEmpty)
                    TextButton(
                      onPressed: () {
                        context.read<CartProvider>().clear();
                        showAppSnackbar(context, message: 'Cart cleared.', kind: SnackKind.info);
                      },
                      child: const Text('Clear all'),
                    ),
                ],
              ),
            ),

            // ── Items ─────────────────────────────────────────────────────
            Expanded(
              child: cart.isEmpty
                  ? EmptyState(
                      title: 'Your cart is empty',
                      subtitle: 'Browse the catalog and add books to your cart.',
                      icon: PhosphorIconsRegular.shoppingCart,
                      actionLabel: 'Browse Books',
                      onAction: () => context.go('/books'),
                    )
                  : ListView.separated(
                      padding: const EdgeInsets.symmetric(
                        horizontal: AppSpacing.pagePadding,
                        vertical: AppSpacing.sm,
                      ),
                      itemCount: cart.cart.items.length,
                      separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.sm),
                      itemBuilder: (_, i) {
                        final item = cart.cart.items[i];
                        return _CartItemTile(item: item)
                            .animate(delay: (i * 40).ms)
                            .fadeIn(duration: 250.ms)
                            .slideX(begin: 0.04, end: 0, duration: 250.ms, curve: Curves.easeOut);
                      },
                    ),
            ),

            // ── Summary + checkout ────────────────────────────────────────
            if (!cart.isEmpty)
              Container(
                padding: EdgeInsets.only(
                  left: AppSpacing.pagePadding,
                  right: AppSpacing.pagePadding,
                  top: AppSpacing.md,
                  bottom: MediaQuery.of(context).padding.bottom + AppSpacing.md,
                ),
                decoration: BoxDecoration(
                  color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
                  border: Border(
                    top: BorderSide(
                      color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                      width: 1,
                    ),
                  ),
                ),
                child: Column(
                  children: [
                    Row(
                      children: [
                        Text(
                          '${cart.count} item${cart.count != 1 ? 's' : ''}',
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                        const Spacer(),
                        Text(
                          'Total: \$${cart.total.toStringAsFixed(2)}',
                          style: Theme.of(context).textTheme.titleSmall?.copyWith(
                                color: AppColors.primary,
                                fontWeight: FontWeight.w700,
                              ),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.md),
                    SizedBox(
                      width: double.infinity,
                      child: AppButton(
                        label: 'Place Order  —  \$${cart.total.toStringAsFixed(2)}',
                        onPressed: _checkingOut ? null : _checkout,
                        isLoading: _checkingOut,
                        isExpanded: true,
                      ),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _CartItemTile extends StatelessWidget {
  const _CartItemTile({required this.item});

  final CartItem item;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cart = context.read<CartProvider>();

    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkCard : AppColors.lightCard,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(
          color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
          width: 1,
        ),
      ),
      child: Row(
        children: [
          // Mini cover
          Container(
            width: 44,
            height: 56,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  AppColors.primary.withValues(alpha: 0.6),
                  AppColors.accentViolet.withValues(alpha: 0.4),
                ],
              ),
              borderRadius: BorderRadius.circular(AppRadius.sm),
            ),
            child: Icon(
              Icons.auto_stories_rounded,
              color: Colors.white.withValues(alpha: 0.8),
              size: 22,
            ),
          ),

          const SizedBox(width: AppSpacing.md),

          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.book.name,
                  style: Theme.of(context).textTheme.titleSmall?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                Text(
                  item.book.author,
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                const SizedBox(height: AppSpacing.xs),
                Text(
                  '\$${item.subtotal.toStringAsFixed(2)}',
                  style: Theme.of(context).textTheme.labelMedium?.copyWith(
                        color: AppColors.primary,
                        fontWeight: FontWeight.w600,
                      ),
                ),
              ],
            ),
          ),

          // Quantity controls
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              _QtyButton(
                icon: PhosphorIconsRegular.minus,
                onTap: () => cart.decrementItem(item.book.id),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm),
                child: Text(
                  '${item.quantity}',
                  style: Theme.of(context).textTheme.titleSmall,
                ),
              ),
              _QtyButton(
                icon: PhosphorIconsRegular.plus,
                onTap: () => cart.addItem(item.book),
              ),
            ],
          ),

          const SizedBox(width: AppSpacing.sm),

          IconButton(
            icon: Icon(PhosphorIconsRegular.trash, size: 18, color: AppColors.error.withValues(alpha: 0.7)),
            onPressed: () => cart.removeItem(item.book.id),
            tooltip: 'Remove',
          ),
        ],
      ),
    );
  }
}

class _QtyButton extends StatelessWidget {
  const _QtyButton({required this.icon, required this.onTap});

  final IconData icon;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 28,
        height: 28,
        decoration: BoxDecoration(
          color: isDark ? AppColors.darkCardElevated : AppColors.slate100,
          borderRadius: BorderRadius.circular(AppRadius.sm),
          border: Border.all(
            color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
            width: 1,
          ),
        ),
        child: Icon(icon, size: 14),
      ),
    );
  }
}

