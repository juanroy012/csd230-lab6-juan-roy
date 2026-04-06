/// Backend API constants.
/// The base URL points to the Spring Boot backend.
/// Vite dev-proxy is not relevant here; mobile targets the real backend directly.
abstract final class ApiConstants {
  // Change to your machine IP (e.g. http://192.168.x.x:8080) when running on
  // a physical device; localhost only works on Android emulator / iOS simulator.
  static const String baseUrl = 'http://10.0.2.2:8080';
  static const String apiPrefix = '/api/rest';

  // ── Auth ──────────────────────────────────────────────────────────────────
  static String get login => '$apiPrefix/auth/login';

  // ── Catalog endpoints ─────────────────────────────────────────────────────
  static String get books => '$apiPrefix/books';
  static String book(int id) => '$apiPrefix/books/$id';

  static String get magazines => '$apiPrefix/magazines';
  static String magazine(int id) => '$apiPrefix/magazines/$id';

  static String get discMags => '$apiPrefix/discmags';
  static String discMag(int id) => '$apiPrefix/discmags/$id';

  static String get tickets => '$apiPrefix/tickets';
  static String ticket(int id) => '$apiPrefix/tickets/$id';

  static String get handheldConsoles => '$apiPrefix/handheld-consoles';
  static String handheldConsole(int id) => '$apiPrefix/handheld-consoles/$id';

  static String get homeConsoles => '$apiPrefix/home-consoles';
  static String homeConsole(int id) => '$apiPrefix/home-consoles/$id';

  // ── Cart endpoints ────────────────────────────────────────────────────────
  static String get cart => '$apiPrefix/cart';
  static String cartAdd(int productId) => '$apiPrefix/cart/add/$productId';
  static String cartRemove(int productId) => '$apiPrefix/cart/remove/$productId';
  static String get cartCheckout => '$apiPrefix/cart/checkout';
}

