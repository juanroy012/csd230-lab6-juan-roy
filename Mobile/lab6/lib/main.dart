import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:lab6/core/theme/app_theme.dart';
import 'package:lab6/features/auth/providers/auth_provider.dart';
import 'package:lab6/features/auth/services/auth_service.dart';
import 'package:lab6/features/books/providers/books_provider.dart';
import 'package:lab6/features/books/services/books_service.dart';
import 'package:lab6/features/cart/providers/cart_provider.dart';
import 'package:lab6/navigation/app_router.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  // Prevent Google Fonts from downloading at runtime — use bundled/cached fonts only.
  // This removes the main-thread network stall that causes ~300 dropped frames on first boot.
  GoogleFonts.config.allowRuntimeFetching = false;

  // Edge-to-edge rendering (transparent status + nav bars)
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      systemNavigationBarColor: Colors.transparent,
    ),
  );
  SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);

  runApp(const LibrisApp());
}

class LibrisApp extends StatelessWidget {
  const LibrisApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        // Auth must be registered first — the router depends on it
        ChangeNotifierProvider(
          create: (_) => AuthProvider(const AuthService()),
        ),
        ChangeNotifierProvider(
          create: (_) => BooksProvider(const BooksService()),
        ),
        ChangeNotifierProvider(create: (_) => CartProvider()),
      ],
      child: const _RouterWrapper(),
    );
  }
}

/// Wrapped so that [AuthProvider] is available in context when [createRouter] runs.
class _RouterWrapper extends StatefulWidget {
  const _RouterWrapper();

  @override
  State<_RouterWrapper> createState() => _RouterWrapperState();
}

class _RouterWrapperState extends State<_RouterWrapper> {
  late final _router = createRouter(context.read<AuthProvider>());

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Libris',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light(),
      darkTheme: AppTheme.dark(),
      themeMode: ThemeMode.system,
      routerConfig: _router,
    );
  }
}
