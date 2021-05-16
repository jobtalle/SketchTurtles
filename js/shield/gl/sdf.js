export class SDF {
    /**
     * Construct a signed distance field
     * @param {WebGLRenderingContext} gl A WebGL rendering context
     * @param {number} width The SDF width
     * @param {number} height The SDF height
     */
    constructor(gl, width, height) {
        this.gl = gl;
        this.width = width;
        this.height = height;
        this.front = 0;
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
     * Get the texture
     * @returns {WebGLTexture} The SDF texture
     */
    get texture() {
        return this.textures[this.front];
    }

    /**
     * Seed the SDF with points
     * @param {Vector[]} points The points to seed the SDF with
     */
    seed(points) {
        const initial = new Uint8Array(this.width * this.height << 2);

        for (let y = 0; y < this.height; ++y) for (let x = 0; x < this.width; ++x)
            initial[(x + y * this.width << 2) + 3] = 255;

        for (const point of points) {
            const x = Math.round(point.x);
            const y = Math.round(point.y);
            const index = x + y * this.width << 2;

            initial[index] = initial[index + 1] = initial[index + 2] = 255;
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
    }
}