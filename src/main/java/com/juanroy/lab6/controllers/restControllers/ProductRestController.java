package com.juanroy.lab6.controllers.restControllers;

import com.juanroy.lab6.entities.ProductEntity;
import com.juanroy.lab6.repositories.ProductEntityRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Tag(name = "Product REST API", description = "JSON API for viewing all products")
@RestController
@RequestMapping("/api/rest/products")
@CrossOrigin(origins = "*")
public class ProductRestController {

    private final ProductEntityRepository productRepository;

    public ProductRestController(ProductEntityRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Operation(summary = "Get all products")
    @ApiResponse(responseCode = "200", description = "Product list fetched successfully")
    @GetMapping
    public List<ProductEntity> all() {
        return productRepository.findAll();
    }

    @Operation(summary = "Get a product by ID")
    @ApiResponse(responseCode = "200", description = "Product fetched successfully")
    @ApiResponse(responseCode = "404", description = "Product not found")
    @GetMapping("/{id}")
    public ProductEntity getById(@PathVariable Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Could not find product with ID: " + id));
    }
}

