import {Shader} from "./gl/shader.js";

export class ShaderShield extends Shader {
    static VERTEX = `#version 100
        attribute vec2 position;
        
        varying vec2 iUv;
        
        void main() {
            iUv = position * .5 + .5;
            
            gl_Position = vec4(position, .0, 1.);
        }
        `;

    static FRAGMENT = `#version 100
        varying mediump vec2 iUv;
        
        void main() {
            gl_FragColor = vec4(iUv, .0, 1.);
        }
        `;

    /**
     * Construct the shield shader
     * @param {WebGLRenderingContext} gl A WebGL rendering context
     */
    constructor(gl) {
        super(gl, ShaderShield.VERTEX, ShaderShield.FRAGMENT);

        this.aPosition = this.attributeLocation("position");
    }

    /**
     * Use this shader
     */
    use() {
        super.use();

        this.gl.enableVertexAttribArray(this.aPosition);
        this.gl.vertexAttribPointer(this.aPosition, 2, this.gl.FLOAT, false, 8, 0);
    }
}