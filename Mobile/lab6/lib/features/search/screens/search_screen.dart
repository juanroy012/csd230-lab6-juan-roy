import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:phosphor_flutter/phosphor_flutter.dart';
import 'package:provider/provider.dart';
import 'package:lab6/core/constants/app_colors.dart';
import 'package:lab6/core/constants/app_spacing.dart';
import 'package:lab6/core/widgets/app_search_bar.dart';
import 'package:lab6/core/widgets/empty_state.dart';
import 'package:lab6/core/widgets/loading_shimmer.dart';
import 'package:lab6/features/auth/providers/auth_provider.dart';
import 'package:lab6/features/books/models/book_model.dart';
import 'package:lab6/features/books/providers/books_provider.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final _ctrl = TextEditingController();
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
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final books = context.watch<BooksProvider>();
    final results = _query.isNotEmpty ? books.search(_query) : <BookModel>[];

    return Scaffold(
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(
                AppSpacing.pagePadding,
                AppSpacing.md,
                AppSpacing.pagePadding,
                AppSpacing.sm,
              ),
              child: Text('Search', style: Theme.of(context).textTheme.headlineMedium),
            ),

            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pagePadding),
              child: AppSearchBar(
                controller: _ctrl,
                hint: 'Title, author...',
                autofocus: false,
                onChanged: (q) => setState(() => _query = q),
                onSubmitted: (q) => setState(() => _query = q),
              ),
            ),

            const SizedBox(height: AppSpacing.md),

            Expanded(
              child: _buildResults(context, books, results),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildResults(
    BuildContext context,
    BooksProvider books,
    List<BookModel> results,
  ) {
    if (books.isLoading) return const LoadingShimmer();

    if (_query.isEmpty) {
      return const EmptyState(
        title: 'Start searching',
        subtitle: 'Enter a title or author name above.',
        icon: Icons.manage_search_rounded,
      );
    }

    if (results.isEmpty) {
      return EmptyState(
        title: 'No results',
        subtitle: 'No matches found for "$_query".',
        icon: PhosphorIconsRegular.magnifyingGlass,
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.pagePadding,
        vertical: AppSpacing.xs,
      ),
      itemCount: results.length,
      separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.sm),
      itemBuilder: (ctx, i) {
        final book = results[i];
        return _SearchResultTile(book: book)
            .animate(delay: (i * 30).ms)
            .fadeIn(duration: 220.ms)
            .slideX(begin: 0.03, end: 0, duration: 220.ms, curve: Curves.easeOut);
      },
    );
  }
}

class _SearchResultTile extends StatelessWidget {
  const _SearchResultTile({required this.book});

  final BookModel book;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return ListTile(
      onTap: () => context.push('/books/${book.id}'),
      tileColor: isDark
          ? AppColors.darkCard
          : AppColors.lightCard,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.lg),
        side: BorderSide(
          color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
          width: 1,
        ),
      ),
      contentPadding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm,
      ),
      leading: Container(
        width: 44,
        height: 44,
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
          size: 20,
        ),
      ),
      title: Text(
        book.name,
        style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600),
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
      ),
      subtitle: Text(
        book.author,
        style: Theme.of(context).textTheme.bodySmall,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
      ),
      trailing: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            '\$${book.price.toStringAsFixed(2)}',
            style: Theme.of(context).textTheme.labelMedium?.copyWith(
                  color: AppColors.primary,
                  fontWeight: FontWeight.w600,
                ),
          ),
          const SizedBox(width: AppSpacing.sm),
          Icon(PhosphorIconsRegular.arrowRight, size: 14, color: scheme.onSurfaceVariant),
        ],
      ),
    );
  }
}


