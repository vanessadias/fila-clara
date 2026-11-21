package br.edu.senac.queue;

import jakarta.validation.Valid;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/caixas")
@ConditionalOnProperty(name = "app.simulation-enabled", havingValue = "true")
public class SimulationController {
    private final CheckoutService service;

    public SimulationController(CheckoutService service) {
        this.service = service;
    }

    @PatchMapping("/{id}")
    public CheckoutService.View update(@PathVariable long id, @Valid @RequestBody CheckoutUpdate request) {
        return service.update(id, request);
    }
}
