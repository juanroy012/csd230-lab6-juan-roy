package com.juanroy.lab6.controllers.restControllers;

import com.juanroy.lab6.controllers.exceptions.DiscMagNotFoundException;
import com.juanroy.lab6.controllers.exceptions.NotDiscMagException;
import com.juanroy.lab6.entities.CartEntity;
import com.juanroy.lab6.entities.DiscMagEntity;
import com.juanroy.lab6.entities.ProductEntity;
import com.juanroy.lab6.repositories.CartEntityRepository;
import com.juanroy.lab6.repositories.DiscMagEntityRepository;
import com.juanroy.lab6.repositories.ProductEntityRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "DiscMag REST API", description = "JSON API for managing disc magazines")
@RestController
@RequestMapping("/api/rest/discmags")
@CrossOrigin(origins = "*")
public class DiscMagRestController {

    private final DiscMagEntityRepository discMagRepository;
    private final ProductEntityRepository productRepository;
    private final CartEntityRepository cartRepository;

    public DiscMagRestController(DiscMagEntityRepository discMagRepository,
                                  ProductEntityRepository productRepository,
                                  CartEntityRepository cartRepository) {
        this.discMagRepository = discMagRepository;
        this.productRepository = productRepository;
        this.cartRepository = cartRepository;
    }

    @Operation(summary = "Get all disc magazines")
    @ApiResponse(responseCode = "200", description = "Disc magazine list fetched successfully")
    @GetMapping
    public List<DiscMagEntity> all() {
        return discMagRepository.findAll();
    }

    @Operation(summary = "Get a disc magazine by ID")
    @ApiResponse(responseCode = "200", description = "Disc magazine fetched successfully")
    @ApiResponse(responseCode = "404", description = "Disc magazine not found")
    @ApiResponse(responseCode = "422", description = "Item is not a disc magazine")
    @GetMapping("/{id}")
    public DiscMagEntity getDiscMag(@PathVariable Long id) {
        ProductEntity product = productRepository.findById(id)
                .orElseThrow(() -> new DiscMagNotFoundException(id));
        if (!(product instanceof DiscMagEntity)) {
            throw new NotDiscMagException(id);
        }
        return (DiscMagEntity) product;
    }

    @Operation(summary = "Create a new disc magazine")
    @ApiResponse(responseCode = "201", description = "Disc magazine created")
    @ApiResponse(responseCode = "400", description = "Bad request - invalid payload")
    @PostMapping
    public DiscMagEntity newDiscMag(@RequestBody DiscMagEntity newDiscMag) {
        return discMagRepository.save(newDiscMag);
    }

    @Operation(summary = "Update or replace a disc magazine")
    @ApiResponse(responseCode = "200", description = "Disc magazine updated successfully")
    @ApiResponse(responseCode = "404", description = "Disc magazine not found")
    @ApiResponse(responseCode = "400", description = "Bad request - invalid payload")
    @ApiResponse(responseCode = "422", description = "Item is not a disc magazine")
    @PutMapping("/{id}")
    public DiscMagEntity updateDiscMag(@PathVariable Long id, @RequestBody DiscMagEntity updatedDiscMag) {
        ProductEntity product = productRepository.findById(id)
                .orElseThrow(() -> new DiscMagNotFoundException(id));
        if (!(product instanceof DiscMagEntity)) {
            throw new NotDiscMagException(id);
        }
        return discMagRepository.findById(id)
                .map(discMag -> {
                    discMag.setName(updatedDiscMag.getName());
                    discMag.setPrice(updatedDiscMag.getPrice());
                    discMag.setCopies(updatedDiscMag.getCopies());
                    discMag.setOrderQty(updatedDiscMag.getOrderQty());
                    discMag.setCurrentIssue(updatedDiscMag.getCurrentIssue());
                    discMag.setHasDisc(updatedDiscMag.isHasDisc());
                    return discMagRepository.save(discMag);
                })
                .orElseGet(() -> {
                    updatedDiscMag.setId(id);
                    return discMagRepository.save(updatedDiscMag);
                });
    }

    @Operation(summary = "Delete a disc magazine")
    @ApiResponse(responseCode = "200", description = "Disc magazine deleted successfully")
    @ApiResponse(responseCode = "404", description = "Disc magazine not found")
    @ApiResponse(responseCode = "422", description = "Item is not a disc magazine")
    @DeleteMapping("/{id}")
    public String deleteDiscMag(@PathVariable Long id) {
        ProductEntity product = productRepository.findById(id)
                .orElseThrow(() -> new DiscMagNotFoundException(id));
        if (!(product instanceof DiscMagEntity)) {
            throw new NotDiscMagException(id);
        }
        // Remove from all carts first
        List<CartEntity> carts = cartRepository.findAll();
        DiscMagEntity discMag = (DiscMagEntity) product;
        for (CartEntity cart : carts) {
            cart.getProducts().remove(discMag);
        }
        discMagRepository.deleteById(id);
        return "Disc magazine with ID: " + id + " has been deleted";
    }
}

