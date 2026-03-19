package com.juanroy.lab6.controllers.restControllers;

import com.juanroy.lab6.entities.CartEntity;
import com.juanroy.lab6.entities.OrderEntity;
import com.juanroy.lab6.entities.ProductEntity;
import com.juanroy.lab6.entities.UserEntity;
import com.juanroy.lab6.pojos.SaleableItem;
import com.juanroy.lab6.repositories.CartEntityRepository;
import com.juanroy.lab6.repositories.OrderEntityRepository;
import com.juanroy.lab6.repositories.ProductEntityRepository;
import com.juanroy.lab6.repositories.UserEntityRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/api/rest/cart")
@CrossOrigin(origins = "*")
public class CartRestController {

    private final CartEntityRepository cartRepository;
    private final UserEntityRepository userRepository;
    private final ProductEntityRepository productRepository;
    private final OrderEntityRepository orderRepository;

    public CartRestController(CartEntityRepository cartRepository,
                              UserEntityRepository userRepository,
                              ProductEntityRepository productRepository,
                              OrderEntityRepository orderRepository) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    @GetMapping
    public Map<String, Object> getCart(@RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        UserEntity user = resolveUser(authorizationHeader);
        CartEntity cart = getOrCreateCart(user);
        return toCartResponse(cart);
    }

    @PostMapping("/add/{productId}")
    public Map<String, Object> addToCart(@PathVariable Long productId,
                                         @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        UserEntity user = resolveUser(authorizationHeader);
        CartEntity cart = getOrCreateCart(user);

        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        cart.addProduct(product);
        cartRepository.save(cart);

        return toCartResponse(cart);
    }

    @PostMapping("/remove/{productId}")
    public Map<String, Object> removeFromCart(@PathVariable Long productId,
                                              @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        UserEntity user = resolveUser(authorizationHeader);
        CartEntity cart = getOrCreateCart(user);

        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        cart.getProducts().remove(product);
        cartRepository.save(cart);

        return toCartResponse(cart);
    }

    @PostMapping("/checkout")
    public Map<String, Object> checkout(@RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        UserEntity user = resolveUser(authorizationHeader);
        CartEntity cart = getOrCreateCart(user);

        Set<ProductEntity> productsInCart = new LinkedHashSet<>(cart.getProducts());
        if (productsInCart.isEmpty()) {
            return Map.of("message", "Cart is empty", "products", new ArrayList<>(), "count", 0, "total", 0.0);
        }

        double total = 0.0;
        for (ProductEntity product : productsInCart) {
            SaleableItem saleableItem = (SaleableItem) product;
            saleableItem.sellItem();
            total += saleableItem.getPrice();
        }

        OrderEntity order = new OrderEntity();
        order.setUser(user);
        order.setProducts(productsInCart);
        order.setTotalAmount(Math.floor(total * 100.0) / 100.0);
        orderRepository.save(order);

        cart.getProducts().clear();
        cartRepository.save(cart);

        return Map.of(
                "message", "Checkout successful",
                "orderId", order.getId(),
                "products", new ArrayList<>(),
                "count", 0,
                "total", 0.0
        );
    }

    private CartEntity getOrCreateCart(UserEntity user) {
        CartEntity cart = cartRepository.findByUser(user);
        if (cart == null) {
            cart = new CartEntity();
            cart.setUser(user);
            cartRepository.save(cart);
        }
        return cart;
    }

    private Map<String, Object> toCartResponse(CartEntity cart) {
        double total = cart.getProducts().stream()
                .mapToDouble(p -> ((SaleableItem) p).getPrice())
                .sum();

        return Map.of(
                "id", cart.getId(),
                "products", new ArrayList<>(cart.getProducts()),
                "count", cart.getProducts().size(),
                "total", Math.floor(total * 100.0) / 100.0
        );
    }

    private UserEntity resolveUser(String authorizationHeader) {
        if (authorizationHeader == null || authorizationHeader.isBlank() || !authorizationHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing token");
        }

        String token = authorizationHeader.substring(7).trim();
        String decoded;

        try {
            decoded = new String(Base64.getDecoder().decode(token), StandardCharsets.UTF_8);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
        }

        String[] parts = decoded.split(":", 2);
        if (parts.length == 0 || parts[0].isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
        }

        UserEntity user = userRepository.findByUsername(parts[0]);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found");
        }

        return user;
    }
}
