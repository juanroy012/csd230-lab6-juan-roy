import 'package:flutter/material.dart';

/// Design-token color palette for Libris.
///
/// Palette rationale:
///  • Primary indigo  → calm, trustworthy, knowledge-focused
///  • Cyan accent     → freshness and interactivity highlights
///  • Slate neutrals  → timeless, readable backgrounds and text
///  • Semantic colors → accessible, not oversaturated
abstract final class AppColors {
  // ── Brand ────────────────────────────────────────────────────────────────
  static const primary = Color(0xFF3D52A0);
  static const primaryVariant = Color(0xFF2D3A8C);
  static const primaryLight = Color(0xFF7091E6);
  static const primaryLighter = Color(0xFFADBBE3);

  static const accent = Color(0xFF48CAE4); // soft cyan
  static const accentViolet = Color(0xFF9B72CF); // soft violet

  // ── Neutral slate scale ───────────────────────────────────────────────────
  static const slate50 = Color(0xFFF8FAFC);
  static const slate100 = Color(0xFFF1F5F9);
  static const slate200 = Color(0xFFE2E8F0);
  static const slate300 = Color(0xFFCBD5E1);
  static const slate400 = Color(0xFF94A3B8);
  static const slate500 = Color(0xFF64748B);
  static const slate600 = Color(0xFF475569);
  static const slate700 = Color(0xFF334155);
  static const slate800 = Color(0xFF1E293B);
  static const slate900 = Color(0xFF0F172A);

  // ── Semantic ──────────────────────────────────────────────────────────────
  static const success = Color(0xFF2DD4BF);
  static const successDim = Color(0xFF0D9488);
  static const warning = Color(0xFFF59E0B);
  static const warningDim = Color(0xFFD97706);
  static const error = Color(0xFFEF4444);
  static const errorDim = Color(0xFFDC2626);
  static const info = Color(0xFF60A5FA);

  // ── Light-mode surfaces ───────────────────────────────────────────────────
  static const lightBackground = Color(0xFFF0F4FF);
  static const lightSurface = Color(0xFFFFFFFF);
  static const lightCard = Color(0xFFFFFFFF);
  static const lightCardTinted = Color(0xFFF6F8FF);
  static const lightBorder = Color(0xFFE2E8F0);
  static const lightTextPrimary = Color(0xFF1A1E2E);
  static const lightTextSecondary = Color(0xFF64748B);

  // ── Dark-mode surfaces ────────────────────────────────────────────────────
  static const darkBackground = Color(0xFF080B14);
  static const darkSurface = Color(0xFF0E1120);
  static const darkCard = Color(0xFF161B2E);
  static const darkCardElevated = Color(0xFF1E2540);
  static const darkBorder = Color(0xFF252B40);
  static const darkTextPrimary = Color(0xFFEEF0FA);
  static const darkTextSecondary = Color(0xFF94A3B8);

  // ── Glass effects ─────────────────────────────────────────────────────────
  static const glassDarkFill = Color(0xB3080B14); // 70% dark bg
  static const glassLightFill = Color(0xCCFFFFFF); // 80% white
  static const glassBorderLight = Color(0x33FFFFFF); // 20% white stroke
  static const glassBorderDark = Color(0x1AFFFFFF); // 10% white stroke
}

