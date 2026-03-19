package com.juanroy.lab6.controllers.restControllers;

import com.juanroy.lab6.controllers.exceptions.HomeConsoleNotFoundException;
import com.juanroy.lab6.controllers.exceptions.NotHomeConsoleException;
import com.juanroy.lab6.entities.ProductEntity;
import com.juanroy.lab6.nicheEntities.HomeConsoleEntity;
import com.juanroy.lab6.repositories.HomeConsoleEntityRepository;
import com.juanroy.lab6.repositories.ProductEntityRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Home Console REST API", description = "JSON API for managing home consoles")
@RestController
@RequestMapping("/api/rest/home-consoles")
@CrossOrigin(origins = "*")
public class HomeConsoleRestController {

    private final HomeConsoleEntityRepository homeConsoleRepository;
    private final ProductEntityRepository productRepository;

    public HomeConsoleRestController(HomeConsoleEntityRepository homeConsoleRepository,
                                      ProductEntityRepository productRepository) {
        this.homeConsoleRepository = homeConsoleRepository;
        this.productRepository = productRepository;
    }

    @Operation(summary = "Get all home consoles")
    @ApiResponse(responseCode = "200", description = "Home console list fetched successfully")
    @GetMapping
    public List<HomeConsoleEntity> all() {
        return homeConsoleRepository.findAll();
    }

    @Operation(summary = "Get a home console by ID")
    @ApiResponse(responseCode = "200", description = "Home console fetched successfully")
    @ApiResponse(responseCode = "404", description = "Home console not found")
    @ApiResponse(responseCode = "422", description = "Item is not a home console")
    @GetMapping("/{id}")
    public HomeConsoleEntity getHomeConsole(@PathVariable Long id) {
        ProductEntity product = productRepository.findById(id)
                .orElseThrow(() -> new HomeConsoleNotFoundException(id));
        if (!(product instanceof HomeConsoleEntity)) throw new NotHomeConsoleException(id);
        return (HomeConsoleEntity) product;
    }

    @Operation(summary = "Create a new home console")
    @ApiResponse(responseCode = "201", description = "Home console created")
    @ApiResponse(responseCode = "400", description = "Bad request - invalid payload")
    @PostMapping
    public HomeConsoleEntity newHomeConsole(@RequestBody HomeConsoleEntity newHomeConsole) {
        return homeConsoleRepository.save(newHomeConsole);
    }

    @Operation(summary = "Update or replace a home console")
    @ApiResponse(responseCode = "200", description = "Home console updated successfully")
    @ApiResponse(responseCode = "404", description = "Home console not found")
    @ApiResponse(responseCode = "422", description = "Item is not a home console")
    @PutMapping("/{id}")
    public HomeConsoleEntity updateHomeConsole(@PathVariable Long id,
                                                @RequestBody HomeConsoleEntity updated) {
        ProductEntity product = productRepository.findById(id)
                .orElseThrow(() -> new HomeConsoleNotFoundException(id));
        if (!(product instanceof HomeConsoleEntity)) throw new NotHomeConsoleException(id);
        return homeConsoleRepository.findById(id)
                .map(h -> {
                    h.setName(updated.getName());
                    h.setManufacturer(updated.getManufacturer());
                    h.setPrice(updated.getPrice());
                    h.setQuantity(updated.getQuantity());
                    h.setMaxResolution(updated.getMaxResolution());
                    return homeConsoleRepository.save(h);
                })
                .orElseGet(() -> {
                    updated.setId(id);
                    return homeConsoleRepository.save(updated);
                });
    }

    @Operation(summary = "Delete a home console")
    @ApiResponse(responseCode = "200", description = "Home console deleted successfully")
    @ApiResponse(responseCode = "404", description = "Home console not found")
    @ApiResponse(responseCode = "422", description = "Item is not a home console")
    @DeleteMapping("/{id}")
    public String deleteHomeConsole(@PathVariable Long id) {
        ProductEntity product = productRepository.findById(id)
                .orElseThrow(() -> new HomeConsoleNotFoundException(id));
        if (!(product instanceof HomeConsoleEntity)) throw new NotHomeConsoleException(id);
        homeConsoleRepository.deleteById(id);
        return "Home console with ID: " + id + " has been deleted";
    }
}

