package com.juanroy.lab6.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.juanroy.lab6.pojos.SaleableItem;
import jakarta.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "products")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "product_type", discriminatorType = DiscriminatorType.STRING)
public abstract class ProductEntity implements Serializable, SaleableItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id", nullable = false)
    private Long id;

    private String name;

    @JsonIgnore
    @ManyToMany(mappedBy = "products")
    private Set<CartEntity> carts = new HashSet<>();

    public ProductEntity() {}

    public ProductEntity(String n) { this.name = n; }

    public Set<CartEntity> getCarts() { return carts; }

    public void setCarts(Set<CartEntity> carts) { this.carts = carts; }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "ProductEntity{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProductEntity that)) return false;
        // Use only identifier for equality to avoid expensive/recursive collection comparisons
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        // Use identifier only
        return Objects.hashCode(id);
    }
}