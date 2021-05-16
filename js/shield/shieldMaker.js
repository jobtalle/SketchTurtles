import {ShaderShield} from "./shaderShield.js";
import {Quad} from "./gl/quad.js";

export class ShieldMaker {
    static MAX_WIDTH = 200;
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

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.viewport(0, 0, ShieldMaker.MAX_WIDTH, ShieldMaker.MAX_HEIGHT);

        this.shaderShield.use();
        this.quad.draw();

        shield.getContext("2d").drawImage(this.canvas, 0, 0);

        return shield;
    }
}