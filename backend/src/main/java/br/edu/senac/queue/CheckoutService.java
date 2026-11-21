package br.edu.senac.queue;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;

@Service
public class CheckoutService {
    private final CheckoutRepository repository;

    public CheckoutService(CheckoutRepository repository) {
        this.repository = repository;
    }

    public record View(Long id, int number, boolean open, int people, int products, Long waitSeconds,
            Instant updatedAt) {
    }

    public record Board(List<View> checkouts, Long recommendedId, Instant fetchedAt) {
    }

    @Transactional(readOnly = true)
    public Board board() {
        var views = repository.findAllByOrderByNumberAsc().stream().map(this::view).toList();
        var best = views.stream().filter(View::open)
                .min(Comparator.comparingLong((View v) -> v.waitSeconds()).thenComparingInt(View::number));
        return new Board(views, best.map(View::id).orElse(null), Instant.now());
    }

    @Transactional
    public View update(long id, CheckoutUpdate request) {
        if (request.open() == null && request.people() == null && request.products() == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe ao menos um campo");
        var c = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Caixa não encontrado"));
        int people = request.people() == null ? c.getPeople() : request.people();
        int products = request.products() == null ? c.getProducts() : request.products();
        if (people == 0 && products > 0)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Produtos exigem ao menos uma pessoa na fila");
        c.update(request.open(), request.people(), request.products());
        return view(c);
    }

    private View view(Checkout c) {
        return new View(c.getId(), c.getNumber(), c.isOpen(), c.getPeople(), c.getProducts(),
                c.isOpen() ? WaitEstimator.seconds(c.getPeople(), c.getProducts()) : null, c.getUpdatedAt());
    }
}
