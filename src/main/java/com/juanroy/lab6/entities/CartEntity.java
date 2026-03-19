package com.juanroy.lab6.entities;

import jakarta.persistence.*;

import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "cart_entity")
public class CartEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_id", nullable = false)
    private Long id;
    // LinkedHashSet for NO duplicate items

    @OneToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "cart_products",
            joinColumns = @JoinColumn(name = "cart_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id")
    )

    private Set<ProductEntity> products = new LinkedHashSet<>();

    public CartEntity(){};

    public CartEntity(Set<ProductEntity> products){
        this.products = products;
    }

    public void addProduct(ProductEntity product) {
        this.products.add(product);
        product.getCarts().add(this); // Maintain the link on both sides
    }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public UserEntity getUser() { return user; }

    public void setUser(UserEntity user) { this.user = user; }

    public Set<ProductEntity> getProducts() { return products; }

    public void setProducts(Set<ProductEntity> products) { this.products = products; }
}