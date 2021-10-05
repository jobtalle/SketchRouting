export class Random {
    static MULTIPLIER = 69069;
    static MODULUS = Math.pow(2, 32);
    static INCREMENT = 1;

    constructor(seed = Math.floor(Math.random() * Random.MODULUS)) {
        this.n = seed;
    }

    get float() {
        this.n = (Random.MULTIPLIER * this.n + Random.INCREMENT) % Random.MODULUS;

        return this.n / Random.MODULUS;
    }
}