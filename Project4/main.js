const glslify = require( 'glslify' )
const toy     = require( 'gl-toy' )
const fbo     = require( 'gl-fbo' )
const createShader = require('gl-shader')

const shader = glslify( './frag.glsl' )

let initialized = false, height, width, cellH, cellW

const state = []

//Set color of current cell based on the current color and then set the direction to move in
function setDirection(curDir, isWhite){}

//gives the new position of the ant
function nextPosition(pos, dir){}

//move the ant


//
function poke( x, y, value, texture ) {
    const gl = texture.gl
    texture.bind()

    gl.texSubImage2D(
        gl.TEXTURE_2D, 0,
        x, y, 1, 1,
        gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([ value,value,value, 255 ])
    )
}

//Place ant


//int grid set up
function intAnt(h, w, size, tex) {
    //set ant at mid; need to get mid of size
    //for(l = 0; l < size; l++){
    console.log(h,w)
        for( i = 0; i < w; i++ ) {
            for( j = 0; j < h; j++ ) {
                if( ((Math.ceil(size/2)/size) > i/w && i/w > (Math.floor(size/2)/size)) && ((Math.ceil(size/2)/size) > j/h && j/h > (Math.floor(size/2)/size))) {
                  //if((i/w)==(size/2)/size && (j/h)==(size/2)/size){
                    console.log(i,j)
                    poke( i, j, 255, tex )
                }
            }
        }
    //}
}

//
function int(gl, size){
    //create the grid
    height = gl.drawingBufferHeight
    width = gl.drawingBufferWidth

    state[0] = fbo( gl, [width,height] )

    cellH = height/size
    cellW = width/size

    intAnt(height, width, size, state[0].color[0])
    initialized = true
}

let count = 0
toy( shader, (gl, shader) => {
    // this function runs once per frame
    if(!initialized){
        int(gl, 25)
    }

    //shader.bind()

    shader.uniforms.resolution = [ gl.drawingBufferWidth, gl.drawingBufferHeight ]
    shader.uniforms.state = state[ 0 ].color[0].bind()
    shader.uniforms.time = count++
})