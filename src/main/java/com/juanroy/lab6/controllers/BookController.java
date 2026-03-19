package com.juanroy.lab6.controllers;

import com.juanroy.lab6.entities.BookEntity;
import com.juanroy.lab6.entities.CartEntity;
import com.juanroy.lab6.repositories.BookEntityRepository;
import com.juanroy.lab6.repositories.CartEntityRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Tag(name = "Books", description = "Operations related to book management")
@Controller
@RequestMapping("/books")
public class BookController {
    @Autowired
    private BookEntityRepository bookRepository;

    @Autowired
    private CartEntityRepository cartRepository;

    @Operation(summary = "Get all books", description = "Retrieve a list of all books available in the system.")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved list of books")
    @GetMapping
    public String getAllBook(Model model, HttpServletRequest request) {
        model.addAttribute("books", bookRepository.findAll());
        model.addAttribute("currentUri", request.getRequestURI());
        return "/lists/bookList";
    }

    @GetMapping("/{id}")
    public String getBookById(@PathVariable Long id, Model model, HttpServletRequest request) {
        BookEntity book = bookRepository.findById(id).orElse(null);
        model.addAttribute("book", book);
        model.addAttribute("currentUri", request.getRequestURI());
        return "/details/bookDetails";
    }

    @GetMapping("/add")
    public String addBookForm(Model model) {
        model.addAttribute("book", new BookEntity());
        return "adds/addBook";
    }

    @PostMapping("/add")
    public String addBook(@ModelAttribute BookEntity book) {
        bookRepository.save(book);
        return "redirect:/books";
    }

    @GetMapping("/edit/{id}")
    public String editBookForm(@PathVariable Long id, Model model) {
        BookEntity book = bookRepository.findById(id).orElse(null);
        model.addAttribute("book", book);
        return "edits/editBook";
    }

    @PostMapping("/edit/{id}")
    public String editBook(@PathVariable Long id, @ModelAttribute BookEntity updatedBook) {
        BookEntity existingBook = bookRepository.findById(id).orElse(null);
        if (existingBook != null) {
            existingBook.setAuthor(updatedBook.getAuthor());
            existingBook.setName(updatedBook.getName());
            existingBook.setPrice(updatedBook.getPrice());
            existingBook.setCopies(updatedBook.getCopies());
            bookRepository.save(existingBook);
        }
        return "redirect:/books";
    }

    @PostMapping("/delete/{id}")
    public String deleteBook(@PathVariable long id, RedirectAttributes redirectAttributes) {
        List<CartEntity> carts = cartRepository.findAll();
        BookEntity book = bookRepository.findById(id);

        for(CartEntity cart: carts) {
            cart.getProducts().remove(book);
        }

        try {
            bookRepository.deleteById(id);
        } catch (Exception e) {
            // This catches the Foreign Key error if it's in an Order
            redirectAttributes.addFlashAttribute("errorMessage", "Cannot delete: Item is linked to a completed Order!");
        }

        return "redirect:/books";
    }
}
