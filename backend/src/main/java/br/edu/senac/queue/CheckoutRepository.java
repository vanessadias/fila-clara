package br.edu.senac.queue;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CheckoutRepository extends JpaRepository<Checkout, Long> {
    List<Checkout> findAllByOrderByNumberAsc();
}
