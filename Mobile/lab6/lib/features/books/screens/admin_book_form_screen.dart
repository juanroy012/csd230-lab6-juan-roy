import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:phosphor_flutter/phosphor_flutter.dart';
import 'package:provider/provider.dart';
import 'package:lab6/core/constants/app_colors.dart';
import 'package:lab6/core/constants/app_spacing.dart';
import 'package:lab6/core/widgets/app_button.dart';
import 'package:lab6/core/widgets/app_snackbar.dart';
import 'package:lab6/core/widgets/app_text_field.dart';
import 'package:lab6/features/auth/providers/auth_provider.dart';
import 'package:lab6/features/books/models/book_model.dart';
import 'package:lab6/features/books/providers/books_provider.dart';

/// Admin-only form for creating or editing a [BookModel].
/// Pass [existingBook] to switch to edit mode.
class AdminBookFormScreen extends StatefulWidget {
  const AdminBookFormScreen({super.key, this.existingBook});

  final BookModel? existingBook;

  @override
  State<AdminBookFormScreen> createState() => _AdminBookFormScreenState();
}

class _AdminBookFormScreenState extends State<AdminBookFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _authorCtrl = TextEditingController();
  final _priceCtrl = TextEditingController();
  final _copiesCtrl = TextEditingController();

  bool _saving = false;

  bool get _isEdit => widget.existingBook != null;

  @override
  void initState() {
    super.initState();
    final b = widget.existingBook;
    if (b != null) {
      _nameCtrl.text = b.name;
      _authorCtrl.text = b.author;
      _priceCtrl.text = b.price.toStringAsFixed(2);
      _copiesCtrl.text = '${b.copies}';
    }
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _authorCtrl.dispose();
    _priceCtrl.dispose();
    _copiesCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    final auth = context.read<AuthProvider>();
    if (auth.token == null) return;

    setState(() => _saving = true);

    try {
      final draft = BookModel(
        id: widget.existingBook?.id ?? 0,
        name: _nameCtrl.text.trim(),
        author: _authorCtrl.text.trim(),
        price: double.parse(_priceCtrl.text.trim()),
        copies: int.parse(_copiesCtrl.text.trim()),
      );

      final provider = context.read<BooksProvider>();

      if (_isEdit) {
        await provider.updateBook(draft, auth.token!);
        if (mounted) {
          showAppSnackbar(context, message: 'Book updated.', kind: SnackKind.success);
          context.pop();
        }
      } else {
        await provider.addBook(draft, auth.token!);
        if (mounted) {
          showAppSnackbar(context, message: 'Book added to catalog.', kind: SnackKind.success);
          context.pop();
        }
      }
    } on String catch (msg) {
      if (mounted) showAppSnackbar(context, message: msg, kind: SnackKind.error);
    } catch (_) {
      if (mounted) {
        showAppSnackbar(context, message: 'Operation failed. Please try again.', kind: SnackKind.error);
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: Icon(PhosphorIconsRegular.arrowLeft, size: 20),
          onPressed: () => context.pop(),
        ),
        title: Text(_isEdit ? 'Edit Book' : 'Add Book'),
        actions: [
          if (_isEdit)
            IconButton(
              icon: Icon(PhosphorIconsRegular.trash, size: 20, color: AppColors.error),
              tooltip: 'Delete book',
              onPressed: () => _confirmDelete(context),
            ),
          const SizedBox(width: AppSpacing.sm),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.pagePadding),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Decorative header card
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(AppSpacing.lg),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [AppColors.primary, AppColors.primaryVariant],
                    ),
                    borderRadius: BorderRadius.circular(AppRadius.lg),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        _isEdit ? PhosphorIconsRegular.pencilSimple : PhosphorIconsRegular.plus,
                        size: 28,
                        color: Colors.white,
                      ),
                      const SizedBox(width: AppSpacing.md),
                      Text(
                        _isEdit ? 'Editing "${widget.existingBook!.name}"' : 'New book entry',
                        style: Theme.of(context).textTheme.titleSmall?.copyWith(
                              color: Colors.white.withValues(alpha: 0.9),
                            ),
                      ),
                    ],
                  ),
                )
                    .animate()
                    .fadeIn(duration: 300.ms)
                    .slideY(begin: 0.04, end: 0, duration: 300.ms, curve: Curves.easeOut),

                const SizedBox(height: AppSpacing.xl),

                AppTextField(
                  controller: _nameCtrl,
                  label: 'Title',
                  hint: 'e.g. The Great Gatsby',
                  leading: Icon(PhosphorIconsRegular.bookOpen, size: 18),
                  textInputAction: TextInputAction.next,
                  validator: (v) =>
                      (v == null || v.trim().isEmpty) ? 'Title is required.' : null,
                )
                    .animate(delay: 60.ms)
                    .fadeIn(duration: 280.ms)
                    .slideY(begin: 0.04, end: 0, duration: 280.ms, curve: Curves.easeOut),

                const SizedBox(height: AppSpacing.formGap),

                AppTextField(
                  controller: _authorCtrl,
                  label: 'Author',
                  hint: 'e.g. F. Scott Fitzgerald',
                  leading: Icon(PhosphorIconsRegular.user, size: 18),
                  textInputAction: TextInputAction.next,
                  validator: (v) =>
                      (v == null || v.trim().isEmpty) ? 'Author is required.' : null,
                )
                    .animate(delay: 90.ms)
                    .fadeIn(duration: 280.ms)
                    .slideY(begin: 0.04, end: 0, duration: 280.ms, curve: Curves.easeOut),

                const SizedBox(height: AppSpacing.formGap),

                Row(
                  children: [
                    Expanded(
                      child: AppTextField(
                        controller: _priceCtrl,
                        label: 'Price (USD)',
                        hint: '0.00',
                        leading: Icon(PhosphorIconsRegular.currencyDollar, size: 18),
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        textInputAction: TextInputAction.next,
                        validator: (v) {
                          if (v == null || v.trim().isEmpty) return 'Required.';
                          if (double.tryParse(v.trim()) == null) return 'Enter a valid number.';
                          return null;
                        },
                      ),
                    ),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: AppTextField(
                        controller: _copiesCtrl,
                        label: 'Copies',
                        hint: '0',
                        leading: Icon(PhosphorIconsRegular.stackSimple, size: 18),
                        keyboardType: TextInputType.number,
                        textInputAction: TextInputAction.done,
                        onFieldSubmitted: (_) => _submit(),
                        validator: (v) {
                          if (v == null || v.trim().isEmpty) return 'Required.';
                          if (int.tryParse(v.trim()) == null) return 'Must be a whole number.';
                          return null;
                        },
                      ),
                    ),
                  ],
                )
                    .animate(delay: 120.ms)
                    .fadeIn(duration: 280.ms)
                    .slideY(begin: 0.04, end: 0, duration: 280.ms, curve: Curves.easeOut),

                const SizedBox(height: AppSpacing.xl),

                SizedBox(
                  width: double.infinity,
                  child: AppButton(
                    label: _isEdit ? 'Save Changes' : 'Add to Catalog',
                    onPressed: _saving ? null : _submit,
                    isLoading: _saving,
                    isExpanded: true,
                    leading: Icon(
                      _isEdit ? PhosphorIconsRegular.floppyDisk : PhosphorIconsRegular.plus,
                      size: 16,
                    ),
                  ),
                )
                    .animate(delay: 160.ms)
                    .fadeIn(duration: 280.ms)
                    .slideY(begin: 0.04, end: 0, duration: 280.ms, curve: Curves.easeOut),
              ],
            ),
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
        content: Text('Remove "${widget.existingBook!.name}" permanently?'),
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
        await context.read<BooksProvider>().deleteBook(
              widget.existingBook!.id,
              auth.token!,
            );
        if (context.mounted) {
          showAppSnackbar(context, message: 'Book deleted.', kind: SnackKind.info);
          context.go('/books');
        }
      }
    }
  }
}


