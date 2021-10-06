export class Random {
    constructor(seed = Math.floor(Math.random() * Random.MODULUS)) {
        this.n = seed;
    }

    get float() {
        this.n = (Random.MULTIPLIER * this.n + Random.INCREMENT) % Random.MODULUS;

        return this.n / Random.MODULUS;
    }
}

Random.MULTIPLIER = 69069;
Random.MODULUS = Math.pow(2, 32);
Random.INCREMENT = 1;