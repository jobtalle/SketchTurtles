import {ShaderShield} from "./shaderShield.js";
import {Quad} from "./gl/quad.js";
import {DistanceField} from "./gl/distanceField.js";
import {Vector} from "../vector.js";

export class ShieldMaker {
    static MAX_WIDTH = 300;
    static MAX_HEIGHT = 300;

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
     * Make a shield
     * @returns {HTMLCanvasElement} A shield
     */
    makeShield() {
        const shield = document.createElement("canvas");

        shield.width = ShieldMaker.MAX_WIDTH;
        shield.height = ShieldMaker.MAX_HEIGHT;

        const points = [];

        for (let i = 0; i < 18; ++i)
            points.push(new Vector(Math.random() * shield.width, Math.random() * shield.height));

        this.sdf.seed(points);

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.viewport(0, 0, ShieldMaker.MAX_WIDTH, ShieldMaker.MAX_HEIGHT);

        this.shaderShield.use(this.sdf);
        this.quad.draw();

        shield.getContext("2d").drawImage(this.canvas, 0, 0);

        return shield;
    }
}