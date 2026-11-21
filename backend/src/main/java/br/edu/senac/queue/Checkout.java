package br.edu.senac.queue;

import java.time.Instant;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "checkouts")
public class Checkout {
    @Id
    private Long id;
    @Column(nullable = false, unique = true)
    private int number;
    @Column(nullable = false)
    private boolean open;
    @Column(nullable = false)
    private int people;
    @Column(nullable = false)
    private int products;
    @Column(nullable = false)
    private Instant updatedAt;

    protected Checkout() {
    }

    public Checkout(Long id, int number, boolean open, int people, int products) {
        this.id = id;
        this.number = number;
        update(open, people, products);
    }

    public Long getId() {
        return id;
    }

    public int getNumber() {
        return number;
    }

    public boolean isOpen() {
        return open;
    }

    public int getPeople() {
        return people;
    }

    public int getProducts() {
        return products;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void update(Boolean open, Integer people, Integer products) {
        if (open != null)
            this.open = open;
        if (people != null)
            this.people = people;
        if (products != null)
            this.products = products;
        updatedAt = Instant.now();
    }
}
