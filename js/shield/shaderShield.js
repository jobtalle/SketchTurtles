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
        uniform mediump vec3 seed;
    
        varying mediump vec2 iUv;
        
        mediump float random(mediump vec3 x) {
            return fract(sin(x.x + x.y * 57.0 + x.z * 113.0) * 43758.5453);
        }

        mediump float interpolate(mediump float a, mediump float b, mediump float c, mediump float d, mediump float x) {
            mediump float p = (d - c) - (a - b);
            
            return x * (x * (x * p + ((a - b) - p)) + (c - a)) + b;
        }
        
        mediump float sampleX(mediump vec3 at) {
            mediump float floored = floor(at.x);
            
            return interpolate(
                random(vec3(floored - 1.0, at.yz)),
                random(vec3(floored, at.yz)),
                random(vec3(floored + 1.0, at.yz)),
                random(vec3(floored + 2.0, at.yz)),
                fract(at.x)) * 0.5 + 0.25;
        }
        
        mediump float sampleY(mediump vec3 at) {
            mediump float floored = floor(at.y);
            
            return interpolate(
                sampleX(vec3(at.x, floored - 1.0, at.z)),
                sampleX(vec3(at.x, floored, at.z)),
                sampleX(vec3(at.x, floored + 1.0, at.z)),
                sampleX(vec3(at.x, floored + 2.0, at.z)),
                fract(at.y));
        }
        
        mediump float cubicNoise(mediump vec3 at) {
            mediump float floored = floor(at.z);
            
            return interpolate(
                sampleY(vec3(at.xy, floored - 1.0)),
                sampleY(vec3(at.xy, floored)),
                sampleY(vec3(at.xy, floored + 1.0)),
                sampleY(vec3(at.xy, floored + 2.0)),
                fract(at.z));
        }
        
        void main() {
            mediump vec2 position = (texture2D(sdf, iUv).xy - iUv) * size;
            
            if (position.x < 0.)
                position.x = -position.x;
            
            if (position.y < 0.)
                position.y = -position.y;
                
            lowp vec4 low = vec4(0.4, 0.9, 0.5, 1.0);
            lowp vec4 high = vec4(0.4, 0.2, 0.5, 1.0);
            
            lowp float noise = cubicNoise(vec3(position * .1, 0.) + seed);
            
            if (noise < 0.5 && noise > 0.3)
                gl_FragColor = low;
            else
                gl_FragColor = high;
        
            mediump float dist = length((texture2D(sdf, iUv).xy - iUv) * size) / 70.;

            gl_FragColor.rgb *= 1. - .6 * dist;
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
        this.uSeed = this.uniformLocation("seed");
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
        this.gl.uniform3f(this.uSeed, Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 20 - 10);
    }
}