const glslify = require( 'glslify' )
const toy     = require( 'gl-toy' )

const shader = glslify( './frag.glsl' )

let count = 0
toy( shader, (gl, shader) => {
    // this function runs once per frame
    shader.uniforms.resolution = [ gl.drawingBufferWidth, gl.drawingBufferHeight ]
    shader.uniforms.time = count++
})