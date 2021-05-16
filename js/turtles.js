import {ShieldMaker} from "./shield/shieldMaker.js";
import {Turtle} from "./turtle.js";

export class Turtles {
    /**
     * Construct the turtles simulation
     * @param {HTMLCanvasElement} canvas The canvas to render to
     */
    constructor(canvas) {
        this.shieldMaker = new ShieldMaker();
        this.width = canvas.width;
        this.height = canvas.height;
        this.context = canvas.getContext("2d");
        this.turtles = [];

        this.turtles.push(new Turtle(this.shieldMaker.makeShield()));
    }

    /**
     * Update the state
     */
    update() {
        for (const turtle of this.turtles)
            turtle.update();
    }

    /**
     * Draw a frame
     * @param {number} time The frame time in the range [0, 1]
     */
    frame(time) {
        this.context.clearRect(0, 0, this.width, this.height);

        for (const turtle of this.turtles)
            turtle.frame(this.context, time);
    }

    /**
     * Resize
     * @param {number} width The width
     * @param {number} height The height
     */
    resize(width, height) {
        this.width = width;
        this.height = height;
    }
}