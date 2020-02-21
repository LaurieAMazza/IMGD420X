const glslify = require( 'glslify' )
const toy     = require( 'gl-toy' )
const fbo     = require( 'gl-fbo' )
const createShader = require('gl-shader')
const getPixels = require('gl-texture2d-pixels')

const frag = glslify( './frag.glsl' ), vert = glslify( './vert.glsl' ), draw = glslify('./draw.glsl')


let initialized = false, height, width, cellH, cellW, sim = null

const state = []

const direction = ["up", "down", "left", "right"]

let action = 1, ant = [], nextDir = []

//Set color of current cell based on the current color and then set the direction to move in
function setDirection(dir, isWhite){
    if(isWhite){
        switch (dir) {
            case "up":
                break;
            case "down":
                break;
            case "left":
                break;
            case "right":
                break;
        }
    }else{
        switch (dir) {
            case "up":
                break;
            case "down":
                break;
            case "left":
                break;
            case "right":
                break;
        }
    }

}

//gives the new position of the ant
function nextPosition(dir){
    switch(dir){
        case "up":
            console.log("moving up")
            //check color of next cell
            nextY = ant[Math.floor(ant.length/2)][1] += cellH
            next = getPixels(state[0].color[0])[ant[Math.floor(ant.length/2)][0]]

            for(i = 0; i < ant.length; i++){
                ant[i][1] += cellH
                poke(ant[i][0], ant[i][1], 255, state[0].color[0])
                //console.log(toy.canvas.getContext('2d').getImageData(ant[i][0], ant[i][1], 1, 1).data)
            }

            break;
    }

}

//move the ant
function moveAnt(){
    switch (action) {
        case 0:
            break;
        case 1:
            nextPosition("up")
            break;
    }
}

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
        for( i = 0; i < w; i++ ) {
            for( j = 0; j < h; j++ ) {
                if( ((Math.ceil(size/2)/size) > i/w && i/w > (Math.floor(size/2)/size)) && ((Math.ceil(size/2)/size) > j/h && j/h > (Math.floor(size/2)/size))) {
                    ant.push([i,j])
                    poke( i, j, 255, tex )
                }
            }
        }
}

//
function int(gl, size){
    //create the grid
    height = gl.drawingBufferHeight
    width = gl.drawingBufferWidth

    state[0] = fbo( gl, [width,height] )
    state[1] = fbo( gl, [width,height] )


    cellH = height/size
    cellW = width/size

    intAnt(height, width, size, state[0].color[0])

    sim = createShader(gl, vert, frag)

    initialized = true
    console.log(getPixels(state[0].color[0]))
}

let current = 0
function tick(gl){
    const preState = state[current]
    const curState = state[current ^= 1]

    moveAnt()

    curState.bind()
    sim.bind()

    sim.uniforms.resolution = [ gl.drawingBufferWidth, gl.drawingBufferHeight ]
    sim.uniforms.state = preState.color[0].bind()

    //sim.attribute.a_position.location = 0
}

let count = 0
toy( draw, (gl, shader) => {
    // this function runs once per frame
    if(!initialized){
        int(gl, 25)
    }
    tick(gl)

    shader.bind()

    // restore default framebuffer binding after overriding in tick
    gl.bindFramebuffer( gl.FRAMEBUFFER, null )

    shader.uniforms.resolution = [ gl.drawingBufferWidth, gl.drawingBufferHeight ]
    shader.uniforms.uSampler = state[ 0 ].color[0].bind()
    shader.uniforms.time = count++
})