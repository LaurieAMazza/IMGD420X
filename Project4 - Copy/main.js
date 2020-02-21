const glslify = require( 'glslify' )
const toy     = require( 'gl-toy' )
const fbo     = require( 'gl-fbo' )
const createShader = require('gl-shader')

const frag = glslify( './frag.glsl' ), vert = glslify('./vert.glsl')

function init(gl){
    const w = gl.drawingBufferWidth
    const h = gl.drawingBufferHeight
}

let count = 0
toy( frag, (gl, shader) => {
    // this function runs once per frame


    //shader.bind()

    shader.uniforms.resolution = [ gl.drawingBufferWidth, gl.drawingBufferHeight ]
    shader.uniforms.state = state[ 0 ].color[0].bind()
    shader.uniforms.time = count++
})