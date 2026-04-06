import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:phosphor_flutter/phosphor_flutter.dart';
import 'package:provider/provider.dart';
import 'package:lab6/core/constants/app_colors.dart';
import 'package:lab6/core/constants/app_spacing.dart';
import 'package:lab6/core/widgets/app_card.dart';
import 'package:lab6/core/widgets/loading_shimmer.dart';
import 'package:lab6/core/widgets/empty_state.dart';
import 'package:lab6/core/widgets/role_guard.dart';
import 'package:lab6/features/auth/providers/auth_provider.dart';
import 'package:lab6/features/books/models/book_model.dart';
import 'package:lab6/features/books/providers/books_provider.dart';
import 'package:lab6/features/cart/providers/cart_provider.dart';

/// Home / Discover screen — role-aware.
/// Admin sees stats dashboard + quick actions.
/// User sees a discovery feed and featured books.
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final auth = context.read<AuthProvider>();
      if (auth.token != null) {
        context.read<BooksProvider>().fetchAll(
          auth.token!,
          onUnauthorized: () => auth.forceUnauthenticated(),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      body: CustomScrollView(
        slivers: [
          // ── App bar ──────────────────────────────────────────────────────
          SliverAppBar(
            expandedHeight: 120,
            pinned: true,
            backgroundColor: Theme.of(context).colorScheme.surface,
            flexibleSpace: FlexibleSpaceBar(
              titlePadding: const EdgeInsets.only(
                left: AppSpacing.pagePadding,
                bottom: AppSpacing.md,
              ),
              title: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Hello, ${auth.username ?? 'Reader'}',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                        ),
                  ),
                  Text(
                    auth.isAdmin ? 'Dashboard' : 'Discover',
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),
                ],
              ),
            ),
            actions: [
              AdminOnly(
                child: IconButton(
                  icon: Icon(PhosphorIconsRegular.plus, size: 22),
                  tooltip: 'Add book',
                  onPressed: () => context.push('/admin/books/new'),
                ),
              ),
              IconButton(
                icon: Icon(PhosphorIconsRegular.bell, size: 22),
                tooltip: 'Notifications',
                onPressed: () => context.go('/notifications'),
              ),
              const SizedBox(width: AppSpacing.sm),
            ],
          ),

          // ── Body ─────────────────────────────────────────────────────────
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pagePadding),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                // Admin stats row
                AdminOnly(child: _AdminStatsSection()),
                AdminOnly(child: const SizedBox(height: AppSpacing.sectionGap)),

                // Role-aware quick actions
                _QuickActionsRow(isAdmin: auth.isAdmin),
                const SizedBox(height: AppSpacing.sectionGap),

                // Recent / Featured books
                _SectionHeader(
                  title: auth.isAdmin ? 'All Catalog' : 'Featured Books',
                  actionLabel: 'View all',
                  onAction: () => context.go('/books'),
                ),
                const SizedBox(height: AppSpacing.md),

                _FeaturedBooksSection(),
                const SizedBox(height: AppSpacing.xxl),
              ]),
            ),
          ),
        ],
      ),
    );
  }
}

// ── Admin stats ───────────────────────────────────────────────────────────────

class _AdminStatsSection extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final books = context.watch<BooksProvider>();

    if (books.isLoading) {
      return SizedBox(
        height: 120,
        child: Row(
          children: List.generate(
            3,
            (_) => Expanded(
              child: Padding(
                padding: const EdgeInsets.only(right: AppSpacing.sm),
                child: ShimmerBox(width: double.infinity, height: 110, radius: AppRadius.lg),
              ),
            ),
          ),
        ),
      );
    }

    return Row(
      children: [
        Expanded(
          child: StatCard(
            label: 'Total books',
            value: '${books.books.length}',
            icon: PhosphorIconsRegular.books,
            accentColor: AppColors.primary,
          ),
        ),
        const SizedBox(width: AppSpacing.sm),
        Expanded(
          child: StatCard(
            label: 'In stock',
            value: '${books.inStockCount}',
            icon: PhosphorIconsRegular.checkCircle,
            accentColor: AppColors.success,
          ),
        ),
        const SizedBox(width: AppSpacing.sm),
        Expanded(
          child: StatCard(
            label: 'Out of stock',
            value: '${books.outOfStockCount}',
            icon: PhosphorIconsRegular.warning,
            accentColor: AppColors.warning,
          ),
        ),
      ],
    )
        .animate()
        .fadeIn(duration: 300.ms)
        .slideY(begin: 0.05, end: 0, duration: 300.ms, curve: Curves.easeOut);
  }
}

// ── Quick actions ─────────────────────────────────────────────────────────────

class _QuickActionsRow extends StatelessWidget {
  const _QuickActionsRow({required this.isAdmin});

  final bool isAdmin;

  @override
  Widget build(BuildContext context) {
    final actions = isAdmin
        ? [
            _Action(PhosphorIconsRegular.plus, 'Add Book', () => context.push('/admin/books/new')),
            _Action(PhosphorIconsRegular.books, 'Catalog', () => context.go('/books')),
            _Action(PhosphorIconsRegular.magnifyingGlass, 'Search', () => context.go('/search')),
          ]
        : [
            _Action(PhosphorIconsRegular.books, 'Browse', () => context.go('/books')),
            _Action(PhosphorIconsRegular.shoppingCart, 'Cart', () => context.go('/cart')),
            _Action(PhosphorIconsRegular.magnifyingGlass, 'Search', () => context.go('/search')),
          ];

    return Row(
      children: actions
          .map(
            (a) => Expanded(
              child: Padding(
                padding: const EdgeInsets.only(right: AppSpacing.sm),
                child: _QuickActionTile(action: a),
              ),
            ),
          )
          .toList(),
    )
        .animate()
        .fadeIn(duration: 300.ms, delay: 100.ms)
        .slideY(begin: 0.05, end: 0, duration: 300.ms, curve: Curves.easeOut);
  }
}

class _Action {
  const _Action(this.icon, this.label, this.onTap);

  final IconData icon;
  final String label;
  final VoidCallback onTap;
}

class _QuickActionTile extends StatelessWidget {
  const _QuickActionTile({required this.action});

  final _Action action;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      onTap: action.onTap,
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.sm,
        vertical: AppSpacing.md,
      ),
      child: Column(
        children: [
          Icon(action.icon, size: 22, color: AppColors.primary),
          const SizedBox(height: AppSpacing.xs),
          Text(
            action.label,
            style: Theme.of(context).textTheme.labelSmall,
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}

// ── Featured books — 2-column Amazon-style grid ───────────────────────────────

class _FeaturedBooksSection extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final books = context.watch<BooksProvider>();

    if (books.isLoading) {
      return GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 0.58,
          crossAxisSpacing: AppSpacing.sm,
          mainAxisSpacing: AppSpacing.sm,
        ),
        itemCount: 4,
        itemBuilder: (_, __) => ShimmerBox(
          width: double.infinity,
          height: double.infinity,
          radius: AppRadius.lg,
        ),
      );
    }

    if (books.state == LoadState.error) {
      return ErrorState(
        message: books.error ?? 'Could not load books.',
        onRetry: () {
          final auth = context.read<AuthProvider>();
          final token = auth.token;
          if (token != null) {
            context.read<BooksProvider>().fetchAll(
              token,
              onUnauthorized: () => auth.forceUnauthenticated(),
            );
          }
        },
      );
    }

    if (books.books.isEmpty) {
      return const EmptyState(
        title: 'No books yet',
        subtitle: 'The catalog is empty. Check back later.',
        icon: Icons.auto_stories_outlined,
      );
    }

    final featured = books.books.take(10).toList();

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.58,
        crossAxisSpacing: AppSpacing.sm,
        mainAxisSpacing: AppSpacing.sm,
      ),
      itemCount: featured.length,
      itemBuilder: (_, i) => _BookGridCard(book: featured[i]),
    )
        .animate()
        .fadeIn(duration: 300.ms, delay: 150.ms)
        .slideY(begin: 0.05, end: 0, duration: 300.ms, curve: Curves.easeOut);
  }
}

/// Amazon-style portrait product card for the home-screen grid.
class _BookGridCard extends StatelessWidget {
  const _BookGridCard({required this.book});

  final BookModel book;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final isAdmin = context.read<AuthProvider>().isAdmin;

    return GestureDetector(
      onTap: () => context.push('/books/${book.id}'),
      child: Container(
        decoration: BoxDecoration(
          color: isDark ? AppColors.darkCard : AppColors.lightCard,
          borderRadius: BorderRadius.circular(AppRadius.lg),
          border: Border.all(
            color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
            width: 1,
          ),
          boxShadow: isDark
              ? null
              : [
                  BoxShadow(
                    color: AppColors.slate300.withValues(alpha: 0.45),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Cover image area ─────────────────────────────────────────────
            Expanded(
              flex: 5,
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      AppColors.primary.withValues(alpha: 0.75),
                      AppColors.accentViolet.withValues(alpha: 0.6),
                    ],
                  ),
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(AppRadius.lg),
                    topRight: Radius.circular(AppRadius.lg),
                  ),
                ),
                child: Stack(
                  children: [
                    Center(
                      child: Icon(
                        Icons.auto_stories_rounded,
                        color: Colors.white.withValues(alpha: 0.85),
                        size: 40,
                      ),
                    ),
                    // Stock badge — top-right corner
                    Positioned(
                      top: 8,
                      right: 8,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 6,
                          vertical: 3,
                        ),
                        decoration: BoxDecoration(
                          color: book.inStock
                              ? AppColors.success.withValues(alpha: 0.9)
                              : AppColors.error.withValues(alpha: 0.9),
                          borderRadius: BorderRadius.circular(AppRadius.sm),
                        ),
                        child: Text(
                          book.inStock ? 'In stock' : 'Out',
                          style: const TextStyle(
                            fontSize: 9,
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // ── Info area ─────────────────────────────────────────────────────
            Expanded(
              flex: 4,
              child: Padding(
                padding: const EdgeInsets.fromLTRB(
                  AppSpacing.sm,
                  AppSpacing.sm,
                  AppSpacing.sm,
                  AppSpacing.sm,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Title
                    Text(
                      book.name,
                      style: Theme.of(context).textTheme.labelMedium?.copyWith(
                            fontWeight: FontWeight.w700,
                            height: 1.25,
                          ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 3),
                    // Author
                    Text(
                      book.author,
                      style: Theme.of(context).textTheme.labelSmall?.copyWith(
                            color: Theme.of(context).colorScheme.onSurfaceVariant,
                          ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const Spacer(),
                    // Price
                    Text(
                      '\$${book.price.toStringAsFixed(2)}',
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(
                            color: AppColors.primary,
                            fontWeight: FontWeight.w700,
                          ),
                    ),
                    // Add to Cart — users only
                    if (!isAdmin) ...[
                      const SizedBox(height: 6),
                      SizedBox(
                        width: double.infinity,
                        height: 30,
                        child: ElevatedButton(
                          onPressed: book.inStock
                              ? () =>
                                  context.read<CartProvider>().addItem(book)
                              : null,
                          style: ElevatedButton.styleFrom(
                            padding: EdgeInsets.zero,
                            shape: RoundedRectangleBorder(
                              borderRadius:
                                  BorderRadius.circular(AppRadius.sm),
                            ),
                            textStyle: const TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          child: const Text('Add to Cart'),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Section header ────────────────────────────────────────────────────────────

class _SectionHeader extends StatelessWidget {
  const _SectionHeader({
    required this.title,
    this.actionLabel,
    this.onAction,
  });

  final String title;
  final String? actionLabel;
  final VoidCallback? onAction;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Text(title, style: Theme.of(context).textTheme.titleMedium),
        const Spacer(),
        if (actionLabel != null && onAction != null)
          TextButton(
            onPressed: onAction,
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(actionLabel!),
                const SizedBox(width: 4),
                Icon(PhosphorIconsRegular.arrowRight, size: 14),
              ],
            ),
          ),
      ],
    );
  }
}




