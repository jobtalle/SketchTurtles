import {Shader} from "./shader.js";

export class ShaderDistanceField extends Shader {
    static VERTEX = `#version 100
        attribute vec2 position;
        
        void main() {
            gl_Position = vec4(position, .0, 1.);
        }
        `;

    static FRAGMENT = `#version 100
        uniform sampler2D source;
        uniform mediump vec2 size;
        
        void main() {
            lowp float bestDistance = length(size);
            lowp vec4 bestSample = vec4(0.0);
            
            for (int y = -1; y < 2; ++y) {
                for (int x = -1; x < 2; ++x) {
                    lowp vec4 pixel = texture2D(source, (gl_FragCoord.xy + vec2(x, y)) / size);
                    lowp float distance = length(pixel.xy * size - gl_FragCoord.xy);

                    if (pixel.a != 0. && distance < bestDistance) {
                        bestDistance = distance;
                        bestSample = pixel;
                    }
                }
            }
            
            gl_FragColor = bestSample;
        }
        `;

    /**
     * Construct the SDF shader
     * @param {WebGLRenderingContext} gl A WebGL rendering context
     */
    constructor(gl) {
        super(gl, ShaderDistanceField.VERTEX, ShaderDistanceField.FRAGMENT);

        this.aPosition = this.attributeLocation("position");
        this.uSize = this.uniformLocation("size");
    }

    /**
     * Use this shader
     * @param {number} width The SDF width
     * @param {number} height The SDF height
     */
    use(width, height) {
        super.use();

        this.gl.enableVertexAttribArray(this.aPosition);
        this.gl.vertexAttribPointer(this.aPosition, 2, this.gl.FLOAT, false, 8, 0);
        this.gl.uniform2f(this.uSize, width, height);
    }
}