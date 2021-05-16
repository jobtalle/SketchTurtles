export class Turtle {
    /**
     * Construct a turtle
     * @param {HTMLCanvasElement} shield The turtle shield
     */
    constructor(shield) {
        this.shield = shield;
    }

    /**
     * Update the state
     */
    update() {

    }

    /**
     * Draw a frame
     * @param {CanvasRenderingContext2D} context The rendering context to draw to
     * @param {number} time The frame time in the range [0, 1]
     */
    frame(context, time) {
        context.drawImage(this.shield, 0, 0);
    }
}