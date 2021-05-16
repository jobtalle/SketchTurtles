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
        uniform sampler2D sdf;
        uniform mediump vec2 size;
    
        varying mediump vec2 iUv;
        
        void main() {
            mediump float dist = length((texture2D(sdf, iUv).xy - iUv) * size) / 50.;
            
            gl_FragColor = vec4(vec3(dist), 1.0);
        }
        `;

    /**
     * Construct the shield shader
     * @param {WebGLRenderingContext} gl A WebGL rendering context
     */
    constructor(gl) {
        super(gl, ShaderShield.VERTEX, ShaderShield.FRAGMENT);

        this.aPosition = this.attributeLocation("position");
        this.uSize = this.uniformLocation("size");
    }

    /**
     * Use this shader
     * @param {DistanceField} sdf The SDF for this shield
     */
    use(sdf) {
        super.use();

        this.gl.bindTexture(this.gl.TEXTURE_2D, sdf.texture);

        this.gl.enableVertexAttribArray(this.aPosition);
        this.gl.vertexAttribPointer(this.aPosition, 2, this.gl.FLOAT, false, 8, 0);
        this.gl.uniform2f(this.uSize, sdf.width, sdf.height);
    }
}