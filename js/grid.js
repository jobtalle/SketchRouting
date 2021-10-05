export class Grid {
    static CELL_RADIUS = 16;
    static CELL_HEIGHT = Math.sqrt(3) * Grid.CELL_RADIUS * 2;

    constructor(width, height) {
        this.width = Math.ceil((width + Grid.CELL_RADIUS) / Grid.CELL_RADIUS);
        this.height = Math.ceil((height + Grid.CELL_RADIUS) / Grid.CELL_HEIGHT);
    }

    draw(context) {
        for (let y = 0; y < this.height; ++y) for (let x = 0; x < this.width; ++x) {
            context.beginPath();
            context.arc(
                x * Grid.CELL_RADIUS,
                (y + (x & 1) * .5) * Grid.CELL_HEIGHT,
                Grid.CELL_RADIUS,
                0,
                Math.PI * 2);
            context.stroke();
        }
    }
}