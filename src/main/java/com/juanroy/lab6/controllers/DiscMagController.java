package com.juanroy.lab6.controllers;

import com.juanroy.lab6.entities.CartEntity;
import com.juanroy.lab6.entities.DiscMagEntity;
import com.juanroy.lab6.repositories.CartEntityRepository;
import com.juanroy.lab6.repositories.DiscMagEntityRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/discMags")
public class DiscMagController {

    @Autowired
    private DiscMagEntityRepository discMagRepository;

    @Autowired
    private CartEntityRepository cartRepository;

    @GetMapping
    public String getAllDiscMag(Model model, HttpServletRequest request) {
        model.addAttribute("discMags", discMagRepository.findAll());
        model.addAttribute("currentUri", request.getRequestURI());
        return "/lists/discMagList";
    }

    @GetMapping("/{id}")
    public String getMagazineById(@PathVariable Long id, Model model, HttpServletRequest request) {
        DiscMagEntity discMag = discMagRepository.findById(id).orElse(null);
        model.addAttribute("discMag", discMag);
        model.addAttribute("currentUri", request.getRequestURI());
        return "/details/discMagDetails";
    }

    @GetMapping("/add")
    public String addDiscMagForm(Model model) {
        model.addAttribute("discMag", new DiscMagEntity());
        return "adds/addDiscMag";
    }

    @PostMapping("/add")
    public String addDiscMag(@ModelAttribute DiscMagEntity discMag) {
        discMagRepository.save(discMag);
        return "redirect:/discMags";
    }

    @GetMapping("/edit/{id}")
    public String editDiscMagForm(@PathVariable Long id, Model model) {
        DiscMagEntity discMag = discMagRepository.findById(id).orElse(null);
        model.addAttribute("discMag", discMag);
        return "edits/editDiscMag";
    }

    @PostMapping("/edit/{id}")
    public String editDiscMag(@PathVariable Long id, @ModelAttribute DiscMagEntity updatedDiscMag) {
        DiscMagEntity existingDiscMag = discMagRepository.findById(id).orElse(null);
        if (existingDiscMag != null) {
            existingDiscMag.setName(updatedDiscMag.getName());
            existingDiscMag.setCurrentIssue(updatedDiscMag.getCurrentIssue());
            existingDiscMag.setOrderQty((updatedDiscMag.getOrderQty()));
            existingDiscMag.setCopies(updatedDiscMag.getCopies());
            existingDiscMag.setHasDisc(updatedDiscMag.isHasDisc());
            discMagRepository.save(existingDiscMag);
        }
        return "redirect:/discMags";
    }

    @PostMapping("/delete/{id}")
    public String deleteDiscMag(@PathVariable long id, RedirectAttributes redirectAttributes) {
        List<CartEntity> carts = cartRepository.findAll();
        DiscMagEntity discMag = discMagRepository.findById(id);

        for(CartEntity cart: carts) {
            cart.getProducts().remove(discMag);
        }

        try {
            discMagRepository.deleteById(id);
        } catch (Exception e) {
            // This catches the Foreign Key error if it's in an Order
            redirectAttributes.addFlashAttribute("errorMessage", "Cannot delete: Item is linked to a completed Order!");
        }

        return "redirect:/discMags";
    }
}
