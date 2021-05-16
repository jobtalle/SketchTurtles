import {ShaderDistanceField} from "./shaderDistanceField.js";

export class DistanceField {
    /**
     * Construct a signed distance field
     * @param {WebGLRenderingContext} gl A WebGL rendering context
     * @param {Quad} quad A quad
     * @param {number} width The SDF width
     * @param {number} height The SDF height
     */
    constructor(gl, quad, width, height) {
        this.gl = gl;
        this.quad = quad;
        this.width = width;
        this.height = height;
        this.range = Math.max(width, height);
        this.front = 0;
        this.shader = new ShaderDistanceField(gl);
        this.textures = [
            gl.createTexture(),
            gl.createTexture()];
        this.frameBuffers = [
            gl.createFramebuffer(),
            gl.createFramebuffer()];

        for (let front = 0; front < 2; ++front) {
            gl.bindTexture(gl.TEXTURE_2D, this.textures[front]);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

            gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffers[front]);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.textures[front], 0);
        }
    }

    /**
     * Flip the buffers
     */
    flip() {
        this.front = 1 - this.front;
    }

    /**
     * Get the texture
     * @returns {WebGLTexture} The SDF texture
     */
    get texture() {
        return this.textures[this.front];
    }

    /**
     * Get the framebuffer
     * @returns {WebGLFramebuffer} The SDF framebuffer
     */
    get frameBuffer() {
        return this.frameBuffers[this.front];
    }

    /**
     * Seed the SDF with points
     * @param {Vector[]} points The points to seed the SDF with
     */
    seed(points) {
        const initial = new Uint8Array(this.width * this.height << 2);

        for (const point of points) {
            const x = Math.round(point.x);
            const y = Math.round(point.y);
            const index = x + y * this.width << 2;

            initial[index] = Math.round(0xFF * x / this.width);
            initial[index + 1] = Math.round(0xFF * y / this.height);

            initial[index + 3] = 255;
        }

        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texImage2D(
            this.gl.TEXTURE_2D,
            0,
            this.gl.RGBA,
            this.width,
            this.height,
            0,
            this.gl.RGBA,
            this.gl.UNSIGNED_BYTE,
            initial);

        this.shader.use(this.width, this.height);

        for (let step = 0; step < this.range; ++step) {
            this.flip();

            this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[1 - this.front]);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);
            this.gl.viewport(0, 0, this.width, this.height);

            this.quad.draw();
        }
    }
}