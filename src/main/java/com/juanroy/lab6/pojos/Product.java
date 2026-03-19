package com.juanroy.lab6.pojos;

import java.io.Serializable;
import java.util.Set;

// Marked abstract because it implements SaleableItem but doesn't implement getPrice()
// (Price is defined in children: Ticket and Publication)
public abstract class Product implements SaleableItem, Serializable {
    private Long productId;

    private Set<Cart> carts;

    public Set<Cart> getCarts() {
        return carts;
    }

    public void setCarts(Set<Cart> carts) {
        this.carts = carts;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }
}
