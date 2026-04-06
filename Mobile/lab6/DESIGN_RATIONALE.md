# Libris — Design Rationale

> Online Library System · Flutter Mobile Client

---

## 1. Color Choices

| Token | Value | Reason |
|---|---|---|
| `primary` | `#3D52A0` — deep indigo | Calm, trustworthy, associates with knowledge and depth |
| `primaryLight` | `#7091E6` — periwinkle | Lightened for dark-mode primary (maintains contrast) |
| `accent` | `#48CAE4` — soft cyan | Fresh, interactive highlight; complements indigo without competing |
| `accentViolet` | `#9B72CF` — soft violet | Secondary accent for covers, gradients, admin badges |
| `success` | `#2DD4BF` — teal-green | Accessible, not neon; readable on both themes |
| `warning` | `#F59E0B` — amber | Industry standard; high recognisability |
| `error` | `#EF4444` — muted red | Accessible (WCAG AA contrast); not alarming |

### Surface Strategy

- **Light mode**: off-white blue-tinted background (`#F0F4FF`) layers on pure white cards for a soft depth hierarchy without harsh contrast.
- **Dark mode**: near-black navy (`#080B14`) → `#0E1120` → `#161B2E` for a 3-step elevation stack that feels premium without being pitch-black.

---

## 2. Typography

**Family:** JetBrains Mono (via `google_fonts` at runtime).

**Rationale:**  
JetBrains Mono is the development stand-in for Iosevka Nerd Font. Both are clean monospace/programming-inspired display fonts that bring a contemporary, technical-literary character fitting for a library product.

**To swap to Iosevka Nerd Font:**
1. Download `IosevkaNerdFont-Regular.ttf`, `IosevkaNerdFont-Bold.ttf`, `IosevkaNerdFont-Medium.ttf` from [nerdfonts.com](https://www.nerdfonts.com)
2. Place them in `assets/fonts/`
3. Declare the family in `pubspec.yaml` under `flutter.fonts`
4. Replace all `GoogleFonts.jetBrainsMono(...)` calls in `lib/core/theme/app_theme.dart` with `TextStyle(fontFamily: 'IosevkaNerdFont', ...)`

**Scale:** 8 defined sizes (11–32 pt), all with lineHeight and letterSpacing tuned per size to maintain rhythm across the app.

---

## 3. Motion Decisions

Motion is **deliberately minimal**. The guiding principle is: *animations should aid comprehension, not demonstrate capability.*

| Context | Effect | Duration |
|---|---|---|
| Screen entry | `fadeIn` + `slideY(0.05)` | 250–300 ms |
| List items | Staggered `fadeIn` + `slideY` per-item | 30 ms offset, 220–250 ms |
| Empty/error states | `fadeIn` + `slideY` | 300 ms |
| Nav indicator pill | `AnimatedContainer` width 0 → 20 | 180 ms |
| Login form fields | Sequential `fadeIn` + `slideY` with 40 ms delay steps | 280–300 ms |

**Explicitly avoided:**
- Spring/bounce physics
- Parallax scroll effects
- Chained multi-step sequences
- Long-duration (> 400 ms) transitions
- Rotation or scale-heavy reveals

All easing uses `Curves.easeOut` — natural deceleration, no overshoot.

---

## 4. Role-Based UX Logic

Two roles with clearly differentiated experiences:

### Admin
- **Dashboard** (Home) shows 3 stat cards: Total Books / In Stock / Out of Stock
- Quick-action row: Add Book / Catalog / Search
- Bottom nav label: "Dashboard" instead of "Home"
- Book list tiles expose Edit + Delete icon buttons inline
- FAB / "Add" button visible in catalog header
- `/admin/books/new` and `/admin/books/:id/edit` routes accessible
- Profile shows "Administration" section with Manage Catalog + Add Book shortcuts
- Profile badge reads "Administrator" in violet

### User  
- **Discover** (Home) shows a horizontal featured-books scroll strip
- Quick-action row: Browse / Cart / Search
- Cart badge on nav bar shows unread item count
- Book detail screen shows "Add to Cart" primary action
- No access to admin routes (go_router redirect guard enforces this)
- Profile badge reads "Member" in indigo

### Implementation

```
// Route guard in app_router.dart
if (!authProvider.isAdmin && location.startsWith('/admin')) {
  return '/home';  // silently redirect non-admins
}

// In-widget conditional rendering via RoleGuard widget
RoleGuard(
  allowedRoles: ['ADMIN'],
  child: EditAndDeleteButtons(),
)

// AdminOnly shorthand
AdminOnly(child: AddBookFAB())
```

The `RoleGuard` widget reads `AuthProvider.role` via `context.select` (minimising rebuilds) and renders `SizedBox.shrink()` for unauthorised roles — zero flash, zero placeholder.

---

## 5. Glassmorphism Bottom Nav

Built with Flutter's native `BackdropFilter` + `ImageFilter.blur`:

```
ClipRect(
  BackdropFilter(sigmaX: 20, sigmaY: 20)
  Container(
    color: darkBackground.withOpacity(0.78)  // or white × 0.82
    border-top: 0.5px glassBorder
    SafeArea > Row of _NavTile
  )
)
```

The `extendBody: true` on the root `Scaffold` lets page content slide behind the glass. The effect is visible when a list scrolls — items can be seen through the bar.

---

## 6. Project Structure

```
lib/
├── core/
│   ├── constants/     app_colors, app_spacing, api_constants
│   ├── theme/         app_theme (light + dark ThemeData)
│   └── widgets/       glass_bottom_nav, app_button, app_card,
│                      app_text_field, app_search_bar,
│                      loading_shimmer, empty_state, error_state,
│                      app_snackbar, role_guard
├── features/
│   ├── auth/          models, services, providers, screens
│   ├── books/         models, services, providers, screens
│   ├── cart/          models, providers, screens
│   ├── search/        screens
│   ├── notifications/ screens
│   └── profile/       screens
└── navigation/
    ├── app_router.dart   GoRouter + redirect guards
    └── main_shell.dart   StatefulNavigationShell + glass nav
```

---

## 7. Backend Integration Points

| Endpoint | Used in |
|---|---|
| `POST /api/rest/auth/login` | `AuthService.login()` |
| `GET /api/rest/books` | `BooksService.getAll()` |
| `GET /api/rest/books/:id` | `BooksService.getById()` |
| `POST /api/rest/books` | `BooksService.create()` *(admin)* |
| `PUT /api/rest/books/:id` | `BooksService.update()` *(admin)* |
| `DELETE /api/rest/books/:id` | `BooksService.delete()` *(admin)* |
| `POST /api/rest/cart/checkout` | `CartProvider.checkout()` |

All requests include `Authorization: Bearer <jwt>` from `AuthProvider.token`.

The `ApiConstants.baseUrl` defaults to `http://10.0.2.2:8080` (Android emulator localhost alias). Change to your machine's LAN IP for physical device testing.

