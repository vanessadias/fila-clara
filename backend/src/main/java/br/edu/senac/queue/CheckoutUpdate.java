package br.edu.senac.queue;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record CheckoutUpdate(Boolean open, @Min(0) @Max(1000) Integer people, @Min(0) @Max(100000) Integer products) {
}
