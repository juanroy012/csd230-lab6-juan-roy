package com.juanroy.lab6.pojos;

import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Set;

public class Cart {
    private Set<Product> products = new LinkedHashSet<>();

    public Cart() {
    }

    public Cart(Set<Product> items) {
        this.products = items;
    }

    public void addItem(Product item) {
        products.add(item);
    }

    public Set<Product> getProducts() {
        return products;
    }

    public void setProducts(Set<Product> products) {
        this.products = products;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Cart cart)) return false;
        return Objects.equals(getProducts(), cart.getProducts());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getProducts());
    }

    @Override
    public String toString() {
        return "Cart{" +
                "items=" + products +
                '}';
    }
}
