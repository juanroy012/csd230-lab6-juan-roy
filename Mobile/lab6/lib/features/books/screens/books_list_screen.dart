import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:phosphor_flutter/phosphor_flutter.dart';
import 'package:provider/provider.dart';
import 'package:lab6/core/constants/app_colors.dart';
import 'package:lab6/core/constants/app_spacing.dart';
import 'package:lab6/core/widgets/app_button.dart';
import 'package:lab6/core/widgets/app_search_bar.dart';
import 'package:lab6/core/widgets/empty_state.dart';
import 'package:lab6/core/widgets/loading_shimmer.dart';
import 'package:lab6/core/widgets/role_guard.dart';
import 'package:lab6/features/auth/providers/auth_provider.dart';
import 'package:lab6/features/books/models/book_model.dart';
import 'package:lab6/features/books/providers/books_provider.dart';

class BooksListScreen extends StatefulWidget {
  const BooksListScreen({super.key});

  @override
  State<BooksListScreen> createState() => _BooksListScreenState();
}

class _BooksListScreenState extends State<BooksListScreen> {
  final _searchCtrl = TextEditingController();
  String _query = '';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final auth = context.read<AuthProvider>();
      final books = context.read<BooksProvider>();
      if (books.state == LoadState.idle && auth.token != null) {
        books.fetchAll(auth.token!);
      }
    });
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final books = context.watch<BooksProvider>();
    final auth = context.watch<AuthProvider>();
    final results = books.search(_query);

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // ── Top bar ───────────────────────────────────────────────────
            Padding(
              padding: const EdgeInsets.fromLTRB(
                AppSpacing.pagePadding,
                AppSpacing.md,
                AppSpacing.pagePadding,
                AppSpacing.sm,
              ),
              child: Row(
                children: [
                  Text(
                    'Catalog',
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),
                  const Spacer(),
                  AdminOnly(
                    child: AppButton(
                      label: 'Add',
                      onPressed: () => context.push('/admin/books/new'),
                      variant: AppButtonVariant.primary,
                      leading: Icon(PhosphorIconsRegular.plus, size: 16),
                    ),
                  ),
                ],
              ),
            ),

            // ── Search bar ────────────────────────────────────────────────
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pagePadding),
              child: AppSearchBar(
                controller: _searchCtrl,
                hint: 'Search by title or author...',
                onChanged: (q) => setState(() => _query = q),
              ),
            ),

            const SizedBox(height: AppSpacing.sm),

            // ── List ──────────────────────────────────────────────────────
            Expanded(
              child: _buildBody(context, books, results, auth),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBody(
    BuildContext context,
    BooksProvider books,
    List<BookModel> results,
    AuthProvider auth,
  ) {
    if (books.isLoading) return const LoadingShimmer();

    if (books.state == LoadState.error) {
      return ErrorState(
        message: books.error ?? 'Could not load books.',
        onRetry: () {
          if (auth.token != null) books.fetchAll(auth.token!);
        },
      );
    }

    if (results.isEmpty) {
      return EmptyState(
        title: _query.isNotEmpty ? 'No results for "$_query"' : 'No books yet',
        subtitle: _query.isNotEmpty
            ? 'Try a different title or author.'
            : 'The catalog is empty.',
        icon: PhosphorIconsRegular.books,
        actionLabel: auth.isAdmin ? 'Add first book' : null,
        onAction: auth.isAdmin ? () => context.push('/admin/books/new') : null,
      );
    }

    return RefreshIndicator(
      onRefresh: () async {
        if (auth.token != null) await books.fetchAll(auth.token!);
      },
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.pagePadding,
          vertical: AppSpacing.sm,
        ),
        itemCount: results.length,
        separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.sm),
        itemBuilder: (ctx, i) {
          return _BookListTile(book: results[i])
              .animate(delay: (i * 30).ms)
              .fadeIn(duration: 250.ms)
              .slideY(begin: 0.04, end: 0, duration: 250.ms, curve: Curves.easeOut);
        },
      ),
    );
  }
}

// ── Book list tile ────────────────────────────────────────────────────────────

class _BookListTile extends StatelessWidget {
  const _BookListTile({required this.book});

  final BookModel book;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final scheme = Theme.of(context).colorScheme;

    return Material(
      color: isDark ? AppColors.darkCard : AppColors.lightCard,
      borderRadius: BorderRadius.circular(AppRadius.lg),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () => context.push('/books/${book.id}'),
        child: Container(
          decoration: BoxDecoration(
            border: Border.all(
              color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
              width: 1,
            ),
            borderRadius: BorderRadius.circular(AppRadius.lg),
          ),
          padding: const EdgeInsets.all(AppSpacing.md),
          child: Row(
            children: [
              // Cover
              Container(
                width: 52,
                height: 68,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      AppColors.primary.withValues(alpha: 0.65),
                      AppColors.accentViolet.withValues(alpha: 0.45),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(AppRadius.sm),
                ),
                child: Icon(
                  Icons.auto_stories_rounded,
                  color: Colors.white.withValues(alpha: 0.8),
                  size: 26,
                ),
              ),

              const SizedBox(width: AppSpacing.md),

              // Info
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      book.name,
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 2),
                    Text(
                      book.author,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: scheme.onSurfaceVariant,
                          ),
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    Row(
                      children: [
                        Text(
                          '\$${book.price.toStringAsFixed(2)}',
                          style: Theme.of(context).textTheme.labelMedium?.copyWith(
                                color: AppColors.primary,
                                fontWeight: FontWeight.w600,
                              ),
                        ),
                        const SizedBox(width: AppSpacing.sm),
                        _StockBadge(inStock: book.inStock, copies: book.copies),
                      ],
                    ),
                  ],
                ),
              ),

              // Admin actions
              AdminOnly(
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    IconButton(
                      icon: Icon(PhosphorIconsRegular.pencilSimple, size: 18),
                      color: scheme.onSurfaceVariant,
                      onPressed: () => context.push('/admin/books/${book.id}/edit'),
                      tooltip: 'Edit',
                    ),
                    IconButton(
                      icon: Icon(PhosphorIconsRegular.trash, size: 18),
                      color: AppColors.error.withValues(alpha: 0.7),
                      onPressed: () => _confirmDelete(context),
                      tooltip: 'Delete',
                    ),
                  ],
                ),
              ),

              if (!context.read<AuthProvider>().isAdmin)
                Icon(
                  PhosphorIconsRegular.arrowRight,
                  size: 16,
                  color: scheme.onSurfaceVariant.withValues(alpha: 0.5),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _confirmDelete(BuildContext context) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete book'),
        content: Text('Remove "${book.name}" from the catalog? This cannot be undone.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: TextButton.styleFrom(foregroundColor: AppColors.error),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
    if (ok == true && context.mounted) {
      final auth = context.read<AuthProvider>();
      if (auth.token != null) {
        await context.read<BooksProvider>().deleteBook(book.id, auth.token!);
      }
    }
  }
}

class _StockBadge extends StatelessWidget {
  const _StockBadge({required this.inStock, required this.copies});

  final bool inStock;
  final int copies;

  @override
  Widget build(BuildContext context) {
    final color = inStock ? AppColors.successDim : AppColors.errorDim;
    final bg = inStock ? AppColors.success.withValues(alpha: 0.12) : AppColors.error.withValues(alpha: 0.12);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(AppRadius.full),
      ),
      child: Text(
        inStock ? '$copies left' : 'Out of stock',
        style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: color),
      ),
    );
  }
}

