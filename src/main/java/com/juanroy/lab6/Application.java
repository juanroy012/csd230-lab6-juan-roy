package com.juanroy.lab6;

import com.juanroy.lab6.entities.*;
import com.juanroy.lab6.nicheEntities.*;
import com.juanroy.lab6.repositories.*;
import jakarta.transaction.Transactional;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.time.LocalDateTime;
import java.util.List;


@SpringBootApplication
public class Application implements CommandLineRunner {

    private final ProductEntityRepository productRepository;
    private final CartEntityRepository cartRepository;
    private final UserEntityRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TicketEntityRepository ticketRepository;
    private final HandheldConsoleEntityRepository handheldRepository;
    private final HomeConsoleEntityRepository homeConsoleRepository;

    public Application(ProductEntityRepository productRepository,
                       CartEntityRepository cartRepository,
                       UserEntityRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       TicketEntityRepository ticketRepository,
                       HandheldConsoleEntityRepository handheldRepository,
                       HomeConsoleEntityRepository homeConsoleRepository) {
        this.productRepository = productRepository;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.ticketRepository = ticketRepository;
        this.handheldRepository = handheldRepository;
        this.homeConsoleRepository = homeConsoleRepository;
    }

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {

        // ── Users ────────────────────────────────────────────────────────────
        if (userRepository.count() == 0) {
            userRepository.save(new UserEntity("admin", passwordEncoder.encode("admin123"), "ADMIN"));
            userRepository.save(new UserEntity("alice", passwordEncoder.encode("alice123"), "USER"));
            userRepository.save(new UserEntity("bob",   passwordEncoder.encode("bob123"),   "USER"));
            System.out.println("Seeded users: admin / alice / bob");
        }

        // ── Cart ─────────────────────────────────────────────────────────────
        if (cartRepository.count() == 0) {
            cartRepository.save(new CartEntity());
            System.out.println("Seeded default cart");
        }

        // ── Books ─────────────────────────────────────────────────────────────
        if (productRepository.findAll().stream().noneMatch(p -> p instanceof BookEntity)) {
            productRepository.save(new BookEntity("Clean Code",                    39.99, 12, "Robert C. Martin"));
            productRepository.save(new BookEntity("The Pragmatic Programmer",      44.99,  8, "David Thomas"));
            productRepository.save(new BookEntity("Design Patterns",               49.99,  5, "Gang of Four"));
            productRepository.save(new BookEntity("Effective Java",                42.99, 10, "Joshua Bloch"));
            productRepository.save(new BookEntity("You Don't Know JS",             29.99, 15, "Kyle Simpson"));
            productRepository.save(new BookEntity("Introduction to Algorithms",    74.99,  4, "Cormen et al."));
            System.out.println("Seeded books");
        }

        // ── Magazines ─────────────────────────────────────────────────────────
        if (productRepository.findAll().stream().noneMatch(p -> p instanceof MagazineEntity && !(p instanceof DiscMagEntity))) {
            productRepository.save(new MagazineEntity("National Geographic",  9.99, 40, 80,  LocalDateTime.of(2025, 12, 1, 0, 0)));
            productRepository.save(new MagazineEntity("Scientific American",  8.99, 30, 60,  LocalDateTime.of(2026,  1, 1, 0, 0)));
            productRepository.save(new MagazineEntity("Popular Mechanics",    7.99, 25, 50,  LocalDateTime.of(2026,  2, 1, 0, 0)));
            productRepository.save(new MagazineEntity("Wired",                6.99, 35, 70,  LocalDateTime.of(2026,  3, 1, 0, 0)));
            productRepository.save(new MagazineEntity("TIME",                 5.99, 50, 100, LocalDateTime.of(2026,  3, 1, 0, 0)));
            System.out.println("Seeded magazines");
        }

        // ── Disc Magazines ────────────────────────────────────────────────────
        if (productRepository.findAll().stream().noneMatch(p -> p instanceof DiscMagEntity)) {
            productRepository.save(new DiscMagEntity("PC Gamer",                12.99, 20, 40, LocalDateTime.of(2026, 2, 1, 0, 0), true));
            productRepository.save(new DiscMagEntity("Linux Format",            10.99, 15, 30, LocalDateTime.of(2026, 1, 1, 0, 0), true));
            productRepository.save(new DiscMagEntity("3D Artist",               13.99, 10, 20, LocalDateTime.of(2025,12, 1, 0, 0), true));
            productRepository.save(new DiscMagEntity("ImagineFX",               11.99, 12, 25, LocalDateTime.of(2026, 3, 1, 0, 0), false));
            productRepository.save(new DiscMagEntity("Game Developer Magazine",  9.99, 18, 36, LocalDateTime.of(2026, 2, 1, 0, 0), false));
            System.out.println("Seeded disc magazines");
        }

        // ── Tickets ───────────────────────────────────────────────────────────
        if (ticketRepository.count() == 0) {
            ticketRepository.save(new TicketEntity("Coldplay World Tour 2026",       149.99));
            ticketRepository.save(new TicketEntity("NBA Finals — Game 7",            299.99));
            ticketRepository.save(new TicketEntity("Spider-Man: Beyond — IMAX",       22.99));
            ticketRepository.save(new TicketEntity("Cirque du Soleil — Alegria",      89.99));
            ticketRepository.save(new TicketEntity("Montreal Jazz Festival",          59.99));
            ticketRepository.save(new TicketEntity("Formula 1 Canadian Grand Prix", 199.99));
            System.out.println("Seeded tickets");
        }

        // ── Handheld Consoles ─────────────────────────────────────────────────
        if (handheldRepository.count() == 0) {
            handheldRepository.save(new HandheldConsoleEntity("Nintendo Switch 2",      "Nintendo", 449.99, 20, 9));
            handheldRepository.save(new HandheldConsoleEntity("Steam Deck OLED",        "Valve",    549.99, 12, 12));
            handheldRepository.save(new HandheldConsoleEntity("PlayStation Portable 2", "Sony",     399.99,  8, 8));
            handheldRepository.save(new HandheldConsoleEntity("Game Boy Advance SP",    "Nintendo",  79.99, 30, 7));
            handheldRepository.save(new HandheldConsoleEntity("Analogue Pocket",        "Analogue", 219.99, 10, 6));
            System.out.println("Seeded handheld consoles");
        }

        // ── Home Consoles ─────────────────────────────────────────────────────
        if (homeConsoleRepository.count() == 0) {
            homeConsoleRepository.save(new HomeConsoleEntity("PlayStation 5 Pro",    "Sony",      699.99, 15, "8K"));
            homeConsoleRepository.save(new HomeConsoleEntity("Xbox Series X",        "Microsoft", 499.99, 18, "4K"));
            homeConsoleRepository.save(new HomeConsoleEntity("Nintendo Switch 2 Dock","Nintendo", 149.99, 25, "4K"));
            homeConsoleRepository.save(new HomeConsoleEntity("PlayStation 4 Slim",   "Sony",      299.99, 30, "1080p"));
            homeConsoleRepository.save(new HomeConsoleEntity("Xbox One S",           "Microsoft", 249.99, 22, "4K UHD"));
            System.out.println("Seeded home consoles");
        }

        for (String username : List.of("admin", "alice", "bob")) {
            UserEntity user = userRepository.findByUsername(username);
            if (user == null) continue;

            CartEntity userCart = cartRepository.findByUser(user);
            if (userCart == null) {
                userCart = new CartEntity();
                userCart.setUser(user);
                cartRepository.save(userCart);
            }
        }
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**").allowedOrigins("*");
            }
        };
    }
}
