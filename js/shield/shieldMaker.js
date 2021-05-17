import {ShaderShield} from "./shaderShield.js";
import {Quad} from "./gl/quad.js";
import {DistanceField} from "./gl/distanceField.js";
import {Vector} from "../vector.js";

export class ShieldMaker {
    static MAX_WIDTH = 800;
    static MAX_HEIGHT = 600;

    /**
     * Construct a shield maker
     */
    constructor() {
        this.canvas = document.createElement("canvas");
        this.canvas.width = ShieldMaker.MAX_WIDTH;
        this.canvas.height = ShieldMaker.MAX_HEIGHT;
        this.gl = this.canvas.getContext("webgl", {preserveDrawingBuffer: true});

        this.quad = new Quad(this.gl);
        this.sdf = new DistanceField(this.gl, this.quad, ShieldMaker.MAX_WIDTH, ShieldMaker.MAX_HEIGHT);
        this.shaderShield = new ShaderShield(this.gl);
    }

    /**
     * Make centroids
     * @param {number} width The shield width
     * @param {number} height The shield height
     * @param {number} radius The centroid radius
     * @returns {Vector[]} The centroids
     */
    makeCentroids(width, height, radius) {
        const cells = [];
        const cellWidth = radius * 2;
        const cellHeight = Math.sqrt(3) * radius;

        vertical: for (let y = 0;; ++y) {
            for (let x = 0;; ++x) {
                const xCell = x * cellWidth * .75;
                const yCell = (y + (x & 1) * .5) * cellHeight;

                if (xCell > width)
                    break;

                if (yCell > height)
                    break vertical;

                const offset = 0;

                cells.push(new Vector(
                    xCell + (Math.random() * 2 - 1) * offset,
                    yCell + (Math.random() * 2 - 1) * offset));
            }
        }

        return cells;
    }

    /**
     * Make a shield
     * @returns {HTMLCanvasElement} A shield
     */
    makeShield() {
        const shield = document.createElement("canvas");

        shield.width = ShieldMaker.MAX_WIDTH;
        shield.height = ShieldMaker.MAX_HEIGHT;

        this.sdf.seed(this.makeCentroids(shield.width, shield.height, 48));

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.viewport(0, 0, ShieldMaker.MAX_WIDTH, ShieldMaker.MAX_HEIGHT);

        this.shaderShield.use(this.sdf);
        this.quad.draw();

        shield.getContext("2d").drawImage(this.canvas, 0, 0);

        return shield;
    }
}