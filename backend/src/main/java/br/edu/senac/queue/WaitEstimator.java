package br.edu.senac.queue;

public final class WaitEstimator {
    private WaitEstimator() {
    }

    public static long seconds(int people, int products) {
        if (people < 0 || products < 0)
            throw new IllegalArgumentException("Quantidades não podem ser negativas");
        return 30L * people + 10L * products;
    }
}
