package com.juanroy.lab6.controllers.restControllers;

import com.juanroy.lab6.controllers.exceptions.HandheldConsoleNotFoundException;
import com.juanroy.lab6.controllers.exceptions.NotHandheldConsoleException;
import com.juanroy.lab6.entities.ProductEntity;
import com.juanroy.lab6.nicheEntities.HandheldConsoleEntity;
import com.juanroy.lab6.repositories.HandheldConsoleEntityRepository;
import com.juanroy.lab6.repositories.ProductEntityRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Handheld Console REST API", description = "JSON API for managing handheld consoles")
@RestController
@RequestMapping("/api/rest/handheld-consoles")
@CrossOrigin(origins = "*")
public class HandheldConsoleRestController {

    private final HandheldConsoleEntityRepository handheldRepository;
    private final ProductEntityRepository productRepository;

    public HandheldConsoleRestController(HandheldConsoleEntityRepository handheldRepository,
                                          ProductEntityRepository productRepository) {
        this.handheldRepository = handheldRepository;
        this.productRepository = productRepository;
    }

    @Operation(summary = "Get all handheld consoles")
    @ApiResponse(responseCode = "200", description = "Handheld console list fetched successfully")
    @GetMapping
    public List<HandheldConsoleEntity> all() {
        return handheldRepository.findAll();
    }

    @Operation(summary = "Get a handheld console by ID")
    @ApiResponse(responseCode = "200", description = "Handheld console fetched successfully")
    @ApiResponse(responseCode = "404", description = "Handheld console not found")
    @ApiResponse(responseCode = "422", description = "Item is not a handheld console")
    @GetMapping("/{id}")
    public HandheldConsoleEntity getHandheld(@PathVariable Long id) {
        ProductEntity product = productRepository.findById(id)
                .orElseThrow(() -> new HandheldConsoleNotFoundException(id));
        if (!(product instanceof HandheldConsoleEntity)) throw new NotHandheldConsoleException(id);
        return (HandheldConsoleEntity) product;
    }

    @Operation(summary = "Create a new handheld console")
    @ApiResponse(responseCode = "201", description = "Handheld console created")
    @ApiResponse(responseCode = "400", description = "Bad request - invalid payload")
    @PostMapping
    public HandheldConsoleEntity newHandheld(@RequestBody HandheldConsoleEntity newHandheld) {
        return handheldRepository.save(newHandheld);
    }

    @Operation(summary = "Update or replace a handheld console")
    @ApiResponse(responseCode = "200", description = "Handheld console updated successfully")
    @ApiResponse(responseCode = "404", description = "Handheld console not found")
    @ApiResponse(responseCode = "422", description = "Item is not a handheld console")
    @PutMapping("/{id}")
    public HandheldConsoleEntity updateHandheld(@PathVariable Long id,
                                                 @RequestBody HandheldConsoleEntity updated) {
        ProductEntity product = productRepository.findById(id)
                .orElseThrow(() -> new HandheldConsoleNotFoundException(id));
        if (!(product instanceof HandheldConsoleEntity)) throw new NotHandheldConsoleException(id);
        return handheldRepository.findById(id)
                .map(h -> {
                    h.setName(updated.getName());
                    h.setManufacturer(updated.getManufacturer());
                    h.setPrice(updated.getPrice());
                    h.setQuantity(updated.getQuantity());
                    h.setBatteryLifeHours(updated.getBatteryLifeHours());
                    return handheldRepository.save(h);
                })
                .orElseGet(() -> {
                    updated.setId(id);
                    return handheldRepository.save(updated);
                });
    }

    @Operation(summary = "Delete a handheld console")
    @ApiResponse(responseCode = "200", description = "Handheld console deleted successfully")
    @ApiResponse(responseCode = "404", description = "Handheld console not found")
    @ApiResponse(responseCode = "422", description = "Item is not a handheld console")
    @DeleteMapping("/{id}")
    public String deleteHandheld(@PathVariable Long id) {
        ProductEntity product = productRepository.findById(id)
                .orElseThrow(() -> new HandheldConsoleNotFoundException(id));
        if (!(product instanceof HandheldConsoleEntity)) throw new NotHandheldConsoleException(id);
        handheldRepository.deleteById(id);
        return "Handheld console with ID: " + id + " has been deleted";
    }
}

