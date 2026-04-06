import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:phosphor_flutter/phosphor_flutter.dart';
import 'package:provider/provider.dart';
import 'package:lab6/core/constants/app_colors.dart';
import 'package:lab6/core/constants/app_spacing.dart';
import 'package:lab6/core/widgets/app_button.dart';
import 'package:lab6/core/widgets/app_snackbar.dart';
import 'package:lab6/core/widgets/loading_shimmer.dart';
import 'package:lab6/core/widgets/role_guard.dart';
import 'package:lab6/features/auth/providers/auth_provider.dart';
import 'package:lab6/features/books/models/book_model.dart';
import 'package:lab6/features/books/providers/books_provider.dart';
import 'package:lab6/features/cart/providers/cart_provider.dart';

class BookDetailScreen extends StatefulWidget {
  const BookDetailScreen({super.key, required this.bookId});

  final int bookId;

  @override
  State<BookDetailScreen> createState() => _BookDetailScreenState();
}

class _BookDetailScreenState extends State<BookDetailScreen> {
  BookModel? _book;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _loadBook());
  }

  void _loadBook() {
    final provider = context.read<BooksProvider>();
    // Try to find it in the already-loaded list first
    final found = provider.findById(widget.bookId);
    if (found != null) {
      setState(() {
        _book = found;
        _loading = false;
      });
    } else {
      // Fetch all and retry
      final token = context.read<AuthProvider>().token;
      if (token != null) {
        provider.fetchAll(token).then((_) {
          if (mounted) {
            setState(() {
              _book = provider.findById(widget.bookId);
              _loading = false;
            });
          }
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    if (_loading) {
      return Scaffold(
        appBar: AppBar(
          leading: BackButton(onPressed: () => context.pop()),
        ),
        body: const LoadingShimmer(itemCount: 3),
      );
    }

    final book = _book;
    if (book == null) {
      return Scaffold(
        appBar: AppBar(leading: BackButton(onPressed: () => context.pop())),
        body: const Center(child: Text('Book not found.')),
      );
    }

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // ── Hero header ───────────────────────────────────────────────
          SliverAppBar(
            expandedHeight: 260,
            pinned: true,
            leading: IconButton(
              icon: Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: isDark
                      ? AppColors.darkCard.withValues(alpha: 0.8)
                      : Colors.white.withValues(alpha: 0.8),
                  borderRadius: BorderRadius.circular(AppRadius.md),
                ),
                child: Icon(PhosphorIconsRegular.arrowLeft, size: 18),
              ),
              onPressed: () => context.pop(),
            ),
            actions: [
              AdminOnly(
                child: IconButton(
                  icon: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: isDark
                          ? AppColors.darkCard.withValues(alpha: 0.8)
                          : Colors.white.withValues(alpha: 0.8),
                      borderRadius: BorderRadius.circular(AppRadius.md),
                    ),
                    child: Icon(PhosphorIconsRegular.pencilSimple, size: 18),
                  ),
                  onPressed: () => context.push('/admin/books/${book.id}/edit'),
                  tooltip: 'Edit book',
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      AppColors.primaryVariant,
                      AppColors.primary,
                      AppColors.accentViolet.withValues(alpha: 0.6),
                    ],
                  ),
                ),
                child: SafeArea(
                  child: Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const SizedBox(height: AppSpacing.xl),
                        Container(
                          width: 100,
                          height: 130,
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(AppRadius.lg),
                            border: Border.all(
                              color: AppColors.glassBorderLight,
                              width: 1,
                            ),
                          ),
                          child: Icon(
                            Icons.auto_stories_rounded,
                            size: 48,
                            color: Colors.white.withValues(alpha: 0.9),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),

          // ── Content ───────────────────────────────────────────────────
          SliverPadding(
            padding: const EdgeInsets.all(AppSpacing.pagePadding),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                // Title + author
                Text(
                  book.name,
                  style: Theme.of(context).textTheme.headlineMedium,
                )
                    .animate()
                    .fadeIn(duration: 300.ms)
                    .slideY(begin: 0.05, end: 0, duration: 300.ms, curve: Curves.easeOut),

                const SizedBox(height: AppSpacing.xs),

                Text(
                  'by ${book.author}',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                ).animate(delay: 60.ms).fadeIn(duration: 300.ms),

                const SizedBox(height: AppSpacing.lg),

                // Metadata chips row
                Wrap(
                  spacing: AppSpacing.sm,
                  runSpacing: AppSpacing.sm,
                  children: [
                    _MetaChip(
                      icon: PhosphorIconsRegular.tag,
                      label: '\$${book.price.toStringAsFixed(2)}',
                      color: AppColors.primary,
                    ),
                    _MetaChip(
                      icon: PhosphorIconsRegular.package,
                      label: '${book.copies} copies',
                      color: book.inStock ? AppColors.successDim : AppColors.errorDim,
                    ),
                    _MetaChip(
                      icon: book.inStock
                          ? PhosphorIconsRegular.checkCircle
                          : PhosphorIconsRegular.prohibit,
                      label: book.inStock ? 'Available' : 'Out of stock',
                      color: book.inStock ? AppColors.successDim : AppColors.errorDim,
                    ),
                  ],
                ).animate(delay: 100.ms).fadeIn(duration: 300.ms),

                const SizedBox(height: AppSpacing.xl),

                const Divider(),

                const SizedBox(height: AppSpacing.lg),

                // Description placeholder
                Text(
                  'About this book',
                  style: Theme.of(context).textTheme.titleSmall,
                ),
                const SizedBox(height: AppSpacing.sm),
                Text(
                  '${book.name} is part of the Libris catalog. '
                  'This title is authored by ${book.author} and is currently '
                  '${book.inStock ? 'available with ${book.copies} copies in stock' : 'out of stock'}.',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                        height: 1.7,
                      ),
                ).animate(delay: 140.ms).fadeIn(duration: 300.ms),

                const SizedBox(height: AppSpacing.xxxl),
              ]),
            ),
          ),
        ],
      ),

      // ── Bottom action bar ─────────────────────────────────────────────────
      bottomNavigationBar: RoleGuard(
        allowedRoles: const ['USER', 'ROLE_USER'],
        child: _UserActionBar(book: book),
      ),
    );
  }
}

class _UserActionBar extends StatelessWidget {
  const _UserActionBar({required this.book});

  final BookModel book;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      padding: EdgeInsets.only(
        left: AppSpacing.pagePadding,
        right: AppSpacing.pagePadding,
        bottom: MediaQuery.of(context).padding.bottom + AppSpacing.md,
        top: AppSpacing.md,
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
      child: Row(
        children: [
          Expanded(
            child: AppButton(
              label: book.inStock ? 'Add to Cart' : 'Notify Me',
              onPressed: book.inStock
                  ? () {
                      context.read<CartProvider>().addItem(book);
                      showAppSnackbar(
                        context,
                        message: '"${book.name}" added to cart.',
                        kind: SnackKind.success,
                      );
                    }
                  : null,
              leading: Icon(
                book.inStock ? PhosphorIconsRegular.shoppingCart : PhosphorIconsRegular.bell,
                size: 16,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _MetaChip extends StatelessWidget {
  const _MetaChip({
    required this.icon,
    required this.label,
    required this.color,
  });

  final IconData icon;
  final String label;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.sm,
        vertical: AppSpacing.xs,
      ),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.10),
        borderRadius: BorderRadius.circular(AppRadius.full),
        border: Border.all(color: color.withValues(alpha: 0.25), width: 1),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 13, color: color),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: color),
          ),
        ],
      ),
    );
  }
}

