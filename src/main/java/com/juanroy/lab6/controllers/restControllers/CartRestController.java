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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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
    public Map<String, Object> getCart() {
        UserEntity user = resolveUser();
        CartEntity cart = getOrCreateCart(user);
        return toCartResponse(cart);
    }

    @PostMapping("/add/{productId}")
    public Map<String, Object> addToCart(@PathVariable Long productId) {
        UserEntity user = resolveUser();
        CartEntity cart = getOrCreateCart(user);

        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        cart.addProduct(product);
        cartRepository.save(cart);

        return toCartResponse(cart);
    }

    @PostMapping("/remove/{productId}")
    public Map<String, Object> removeFromCart(@PathVariable Long productId) {
        UserEntity user = resolveUser();
        CartEntity cart = getOrCreateCart(user);

        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        cart.getProducts().remove(product);
        cartRepository.save(cart);

        return toCartResponse(cart);
    }

    @PostMapping("/checkout")
    public Map<String, Object> checkout() {
        UserEntity user = resolveUser();
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

    private UserEntity resolveUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing or invalid token");
        }

        String username = authentication.getName();
        if (username == null || username.isBlank() || "anonymousUser".equalsIgnoreCase(username)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing or invalid token");
        }

        UserEntity user = userRepository.findByUsername(username);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found");
        }

        return user;
    }
}
