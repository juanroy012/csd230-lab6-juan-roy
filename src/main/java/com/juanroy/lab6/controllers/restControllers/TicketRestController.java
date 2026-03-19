package com.juanroy.lab6.controllers.restControllers;

import com.juanroy.lab6.controllers.exceptions.NotTicketException;
import com.juanroy.lab6.controllers.exceptions.TicketNotFoundException;
import com.juanroy.lab6.entities.ProductEntity;
import com.juanroy.lab6.entities.TicketEntity;
import com.juanroy.lab6.repositories.ProductEntityRepository;
import com.juanroy.lab6.repositories.TicketEntityRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Ticket REST API", description = "JSON API for managing tickets")
@RestController
@RequestMapping("/api/rest/tickets")
@CrossOrigin(origins = "*")
public class TicketRestController {

    private final TicketEntityRepository ticketRepository;
    private final ProductEntityRepository productRepository;

    public TicketRestController(TicketEntityRepository ticketRepository,
                                ProductEntityRepository productRepository) {
        this.ticketRepository = ticketRepository;
        this.productRepository = productRepository;
    }

    @Operation(summary = "Get all tickets")
    @ApiResponse(responseCode = "200", description = "Ticket list fetched successfully")
    @GetMapping
    public List<TicketEntity> all() {
        return ticketRepository.findAll();
    }

    @Operation(summary = "Get a ticket by ID")
    @ApiResponse(responseCode = "200", description = "Ticket fetched successfully")
    @ApiResponse(responseCode = "404", description = "Ticket not found")
    @ApiResponse(responseCode = "422", description = "Item is not a ticket")
    @GetMapping("/{id}")
    public TicketEntity getTicket(@PathVariable Long id) {
        ProductEntity product = productRepository.findById(id)
                .orElseThrow(() -> new TicketNotFoundException(id));
        if (!(product instanceof TicketEntity)) throw new NotTicketException(id);
        return (TicketEntity) product;
    }

    @Operation(summary = "Create a new ticket")
    @ApiResponse(responseCode = "201", description = "Ticket created")
    @ApiResponse(responseCode = "400", description = "Bad request - invalid payload")
    @PostMapping
    public TicketEntity newTicket(@RequestBody TicketEntity newTicket) {
        return ticketRepository.save(newTicket);
    }

    @Operation(summary = "Update or replace a ticket")
    @ApiResponse(responseCode = "200", description = "Ticket updated successfully")
    @ApiResponse(responseCode = "404", description = "Ticket not found")
    @ApiResponse(responseCode = "422", description = "Item is not a ticket")
    @PutMapping("/{id}")
    public TicketEntity updateTicket(@PathVariable Long id, @RequestBody TicketEntity updatedTicket) {
        ProductEntity product = productRepository.findById(id)
                .orElseThrow(() -> new TicketNotFoundException(id));
        if (!(product instanceof TicketEntity)) throw new NotTicketException(id);
        return ticketRepository.findById(id)
                .map(ticket -> {
                    ticket.setName(updatedTicket.getName());
                    ticket.setPrice(updatedTicket.getPrice());
                    return ticketRepository.save(ticket);
                })
                .orElseGet(() -> {
                    updatedTicket.setId(id);
                    return ticketRepository.save(updatedTicket);
                });
    }

    @Operation(summary = "Delete a ticket")
    @ApiResponse(responseCode = "200", description = "Ticket deleted successfully")
    @ApiResponse(responseCode = "404", description = "Ticket not found")
    @ApiResponse(responseCode = "422", description = "Item is not a ticket")
    @DeleteMapping("/{id}")
    public String deleteTicket(@PathVariable Long id) {
        ProductEntity product = productRepository.findById(id)
                .orElseThrow(() -> new TicketNotFoundException(id));
        if (!(product instanceof TicketEntity)) throw new NotTicketException(id);
        ticketRepository.deleteById(id);
        return "Ticket with ID: " + id + " has been deleted";
    }
}

