package com.juanroy.lab6.controllers.restControllers;

import com.juanroy.lab6.controllers.exceptions.MagazineNotFoundException;
import com.juanroy.lab6.controllers.exceptions.NotMagazineException;
import com.juanroy.lab6.entities.MagazineEntity;
import com.juanroy.lab6.entities.ProductEntity;
import com.juanroy.lab6.repositories.MagazineEntityRepository;
import com.juanroy.lab6.repositories.ProductEntityRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name="Magazine REST API", description="JSON API for managing magazines")
@RestController
@RequestMapping("/api/rest/magazines")
@CrossOrigin(origins = "*")
public class MagazineRestController {
    private final MagazineEntityRepository magazineRepository;
    private final ProductEntityRepository productRepository;

    public MagazineRestController(MagazineEntityRepository magazineRepository, ProductEntityRepository productRepository) {
        this.magazineRepository = magazineRepository;
        this.productRepository = productRepository;
    }

    @Operation(summary = "Get all magazines")
    @ApiResponse(responseCode = "200", description = "Magazine list fetched successfully")
    @GetMapping
    public List<MagazineEntity> all() {
        return magazineRepository.findAll();
    }

    @Operation(summary = "Get magazine by Id")
    @ApiResponse(responseCode = "200", description = "Magazine fetched successfully")
    @ApiResponse(responseCode = "404", description = "Magazine not found")
    @GetMapping("/{id}")
    public MagazineEntity getMagazine(@PathVariable Long id) {
        ProductEntity product = productRepository.findById(id).orElseThrow(()-> new MagazineNotFoundException(id));
        if (!(product instanceof MagazineEntity)) {
            throw new NotMagazineException(id);
        };
        return (MagazineEntity) product;
    }

    @Operation(summary = "Create a new magazine")
    @ApiResponse(responseCode = "201", description = "Magazine successfully created")
    @ApiResponse(responseCode = "400", description = "Bad request - invalid payload")
    @PostMapping
    public MagazineEntity newMagazine (@RequestBody MagazineEntity newMagazine) {
        return magazineRepository.save(newMagazine);
    }

    @Operation(summary = "Update or replace a magazine")
    @ApiResponse(responseCode = "200", description = "Magazine updated successfully")
    @ApiResponse(responseCode = "404", description = "Magazine not found")
    @ApiResponse(responseCode = "400", description = "Bad request - invalid payload")
    @PutMapping("/{id}")
    public MagazineEntity updateMagazine (@PathVariable Long id, @RequestBody MagazineEntity updatedMagazine) {
        ProductEntity product = productRepository.findById(id).orElseThrow(()-> new MagazineNotFoundException(id));
        if (!(product instanceof MagazineEntity)) {
            throw new NotMagazineException(id);
        };
        return magazineRepository.findById(id)
                .map(magazine -> {
                    magazine.setName(updatedMagazine.getName());
                    magazine.setOrderQty(updatedMagazine.getOrderQty());
                    magazine.setPrice(updatedMagazine.getPrice());
                    magazine.setCopies(updatedMagazine.getCopies());
                    magazine.setCurrentIssue(updatedMagazine.getCurrentIssue());
                    return magazineRepository.save(magazine);
                })
                .orElseGet(() -> {
                    updatedMagazine.setId(id);
                    return magazineRepository.save(updatedMagazine);
                });
    }

    @Operation(summary = "Delete a magazine")
    @ApiResponse(responseCode = "200", description = "Magazine deleted successfully")
    @ApiResponse(responseCode = "204", description = "Magazine deleted (no content)")
    @ApiResponse(responseCode = "404", description = "Magazine not found")
    @DeleteMapping("/{id}")
    public String deleteMagazine(@PathVariable Long id) {
        ProductEntity product = productRepository.findById(id).orElseThrow(()-> new MagazineNotFoundException(id));
        if (!(product instanceof MagazineEntity)) {
            throw new NotMagazineException(id);
        };
        magazineRepository.deleteById(id);
        return "Magazine with the ID: " + id + " has been deleted";
    }
}
