/// Spacing, radius, elevation, and blur design tokens for Libris.
abstract final class AppSpacing {
  // ── Spacing scale (8-pt grid) ─────────────────────────────────────────────
  static const double xs = 4.0;
  static const double sm = 8.0;
  static const double md = 16.0;
  static const double lg = 24.0;
  static const double xl = 32.0;
  static const double xxl = 48.0;
  static const double xxxl = 64.0;

  // ── Semantic shortcuts ────────────────────────────────────────────────────
  static const double pagePadding = md;
  static const double cardPadding = md;
  static const double sectionGap = lg;
  static const double itemGap = sm;
  static const double formGap = md;
}

abstract final class AppRadius {
  static const double sm = 8.0;
  static const double md = 12.0;
  static const double lg = 16.0;
  static const double xl = 24.0;
  static const double xxl = 32.0;
  static const double full = 999.0;
}

abstract final class AppElevation {
  static const double none = 0.0;
  static const double low = 2.0;
  static const double mid = 6.0;
  static const double high = 12.0;
  static const double dialog = 24.0;
}

abstract final class AppBlur {
  // sigmaX / sigmaY values for BackdropFilter
  static const double subtle = 8.0;
  static const double nav = 20.0;
  static const double overlay = 30.0;
}

abstract final class AppDuration {
  static const quick = Duration(milliseconds: 150);
  static const normal = Duration(milliseconds: 250);
  static const slow = Duration(milliseconds: 350);
}

