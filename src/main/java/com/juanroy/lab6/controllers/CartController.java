package com.juanroy.lab6.controllers;

import com.juanroy.lab6.entities.*;
import com.juanroy.lab6.pojos.SaleableItem;
import com.juanroy.lab6.repositories.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.security.Principal;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Controller
@RequestMapping("/cart")
public class CartController {
    @Autowired
    private CartEntityRepository cartRepository;
    @Autowired
    private OrderEntityRepository orderRepository;
    @Autowired
    private UserEntityRepository userRepository;
    @Autowired
    private ProductEntityRepository productRepository;

    private CartEntity getCartForCurrentUser (Principal principal) {
        String username = principal.getName();
        UserEntity user = userRepository.findByUsername(username);
        CartEntity cart = cartRepository.findByUser(user);

        if (cart == null) {
            cart = new CartEntity();
            cart.setUser(user);
            cartRepository.save(cart);
        }
        return cart;
    }

    private List<OrderEntity> getOrdersForCurrentUser (Principal principal) {
        String username = principal.getName();
        UserEntity user = userRepository.findByUsername(username);

        return orderRepository.findAllByUser(user);
    }

    // 1. View the contents of the cart
    @GetMapping
    public String viewCart(Model model, Principal principal) {
        CartEntity cart = getCartForCurrentUser(principal);
        model.addAttribute("cart", cart);
        return "details/cartDetails";
    }

    @PostMapping("/add/{productId}")
    public String addToCart(@PathVariable Long productId,
                            Principal principal,
                            HttpServletRequest request,
                            @RequestParam(value = "returnTo", required = false) String returnTo) {

        CartEntity cart = getCartForCurrentUser(principal);
        ProductEntity product = productRepository.findById(productId).orElse(null);
        if (product != null) {
            cart.addProduct(product);
            cartRepository.save(cart);
        }

        if (returnTo != null && !returnTo.isBlank()) {
            String trimmed = returnTo.trim();
            if (trimmed.startsWith("/") && !trimmed.contains("://")) {
                return "redirect:" + trimmed;
            }
        }

        String referer = request.getHeader("Referer");
        if (referer != null && !referer.isEmpty()) {
            try {
                URI uri = new URI(referer);
                String path = uri.getPath();
                String contextPath = request.getContextPath();
                if (contextPath != null && !contextPath.isEmpty() && path.startsWith(contextPath)) {
                    path = path.substring(contextPath.length());
                    if (path.isEmpty()) path = "/";
                }
                String query = uri.getQuery();
                String redirectTarget = path + (query != null && !query.isEmpty() ? "?" + query : "");
                return "redirect:" + redirectTarget;
            } catch (URISyntaxException e) {
                // If URI parsing fails, fall back to redirecting to home
                return "redirect:/";
            }
        }

        return "redirect:/";
    }

    // 3. Remove item from cart
    @PostMapping("/remove/{productId}")
    public String removeFromCart(@PathVariable Long productId, Principal principal) {
        CartEntity cart = getCartForCurrentUser(principal);
        ProductEntity product = productRepository.findById(productId).orElse(null);
        if(product != null) {
            cart.getProducts().remove(product);
            cartRepository.save(cart);
        }
        return "redirect:/cart";
    }

    @GetMapping("/checkout")
    public String checkoutMenu(Model model, Principal principal) {
        OrderEntity order = new OrderEntity();

        CartEntity cart = getCartForCurrentUser(principal);

        Set<ProductEntity> products = new LinkedHashSet<>();

        double totalPrice = 0;

        for(ProductEntity product: cart.getProducts()) {
            if (product != null) {
                totalPrice += product.getPrice();
                products.add(product);
            }
        }

        totalPrice = Math.floor(totalPrice*100)/100;
        order.setProducts(products);

        if (totalPrice != 0) {
            order.setTotalAmount(totalPrice);
        }

        model.addAttribute("order", order);

        return "/details/checkoutDetails";
    }

    @PostMapping("/checkout")
    public String checkout(@ModelAttribute OrderEntity order, Principal principal) {
        CartEntity cart = getCartForCurrentUser(principal);

        cart.getProducts().forEach((SaleableItem::sellItem));
        cart.getProducts().removeAll(cart.getProducts());
        order.setUser(userRepository.findByUsername(principal.getName()));
        orderRepository.save(order);

        return "redirect:/";
    }

    @GetMapping("/orders")
    public String orderList(Model model, Principal principal) {
        List<OrderEntity> orders = getOrdersForCurrentUser(principal);
        model.addAttribute("orders", orders);
        return "/lists/orderList";
    }

    @GetMapping("/order/{id}")
    public String orderDetails(@PathVariable Long id, Model model) {
        OrderEntity order = orderRepository.findById(id).orElse(null);
        if (order == null) {
            return "redirect:/cart/orders";
        }
        Set<ProductEntity> products = order.getProducts();
        model.addAttribute("products", products);
        model.addAttribute("order", order);
        return "/details/orderDetails";
    }
}

