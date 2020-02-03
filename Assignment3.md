### Laurie Mazza

### Assignment 3
For this project, my original goal was to recreate one effect I achieved when using the Vidot along with combining it with part of another effect I achieved using the Vidot. The main effect I was trying to recreate shown in the first video below has lines scrolling up the screen and changing color and shape to the music (the music cannot be heard has there was no audio output. I believe the song was One More Time). Shown in the second video is another effect I was able to create with the Vidot. My idea for this project was to take the bouncing effect from this and combine it with the first effect and video input. While working towards this goal I started to create interesting color waves on top of the video input. I enjoyed the way the colors would blend together when moving so I decided to explore this effect more. Having time and noise both impact the wave movement created an interesting flow. The video underneath still seemed boring with this effect so I wanted to give it a blur to make it more interesting. I decide to have the blur impacted by not only the tangent of the time but also the y-direction be controlled by the audio input. This along with inversion creates an interesting shake effect at certain points of some songs.

### Vidot Videos and Pictures
<iframe width="560" height="315" src="https://www.youtube.com/embed/olD0a2LnAvc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<iframe width="560" height="315" src="https://www.youtube.com/embed/evTrB_bSeTQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### Shader Video
<iframe width="560" height="315" src="https://www.youtube.com/embed/IMKyM8-nSSM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### Code
```
<!doctype html>
<html lang='en'>
<head>
    <style>body{ margin:0 }</style>
</head>
<body>
<canvas id='gl'></canvas>
</body>
<!-- vertex shader, as simple as possible -->
<script id='vertex' type='x-shader/x-vertex'>
    attribute vec2 a_position;

    void main() {
      gl_Position = vec4( a_position, 0., 1. );
    }
  </script>

<!-- fragment shader -->
<script id='fragment' type='x-shader/x-fragment'>
    #ifdef GL_ES
    precision mediump float;
    #endif
    
    uniform mediump float time;
    uniform mediump float buf;
    //uniform mediump vec3 buf;
    uniform mediump vec2 resolution;
    uniform sampler2D uSampler;

    // 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation
    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
     u = smoothstep(0.,1.,f);
    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

    vec4 blur5(sampler2D image, vec2 uv, vec2 res, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(2.3333333333333333) * (direction/tan(time));
  color += texture2D(image, uv) * 0.29411764705882354;
  color += texture2D(image, uv + (off1 / res)) * 0.35294117647058826;
  color += texture2D(image, uv - (off1 / res)) * 0.35294117647058826;
  return color;
}
    
    void main() {
        //sine oscillator
        float frequency = 10., bias = .5, gain = .5;
        float color = bias + sin( time * frequency ) * gain;

        vec2 pos = gl_FragCoord.xy / resolution;

        vec4 blur = blur5( uSampler, pos, resolution, vec2(2.,buf) );

        pos.y = pos.y - buf/100.;
        pos.x = pos.x + buf/1000.;

        //noise
        float n = noise(pos);

        //sections with "audio" control
        float y = step(mod(buf/100.,.25), pos.y/(buf/n)) - step(mod(buf/100.,-0.5), -pos.y/n) + step(mod(time/100.,0.6), pos.y/(pos.x/n)) - step(mod(time/100.,-0.9), -pos.y/n);
        float x = step(0.5, pos.x);

        //rbg
        float r = blur.r * y;
        float g = blur.g * cos(gl_FragCoord.x / resolution.x);
        float b = blur.b * (x/2.);

        //inversion
        if(cos(time) + (buf/1000.) < 1.){
            r = 1. - r;
            g = 1. - g;
            b = 1. - b;
        }

      gl_FragColor = vec4(
        r * color,
        g * color,
        b * color,
        1.0
      );
    }
  </script>


<script type='text/javascript'>
    // "global" variables
    let gl, uTime, video, textureLoaded = false, Mic, Buffer

    window.onload = function() {
        const canvas = document.getElementById( 'gl' )
        gl = canvas.getContext( 'webgl' )
        canvas.width = 1024//window.innerWidth
        canvas.height = 1024//window.innerHeight

        // define drawing area of canvas. bottom corner, width / height
        gl.viewport( 0,0,gl.drawingBufferWidth, gl.drawingBufferHeight )

        // create a buffer object to store vertices
        const buffer = gl.createBuffer()

        // point buffer at graphic context's ARRAY_BUFFER
        gl.bindBuffer( gl.ARRAY_BUFFER, buffer )

        const triangles = new Float32Array([
            -1, -1,
            1,  -1,
            -1, 1,
            -1, 1,
            1, -1,
            1, 1
        ])

        // initialize memory for buffer and populate it. Give
        // open gl hint contents will not change dynamically.
        gl.bufferData( gl.ARRAY_BUFFER, triangles, gl.STATIC_DRAW )

        // create vertex shader
        let shaderScript = document.getElementById('vertex')
        let shaderSource = shaderScript.text
        const vertexShader = gl.createShader( gl.VERTEX_SHADER )
        gl.shaderSource( vertexShader, shaderSource );
        gl.compileShader( vertexShader )

        // create fragment shader
        shaderScript = document.getElementById('fragment')
        shaderSource = shaderScript.text
        const fragmentShader = gl.createShader( gl.FRAGMENT_SHADER )
        gl.shaderSource( fragmentShader, shaderSource );
        gl.compileShader( fragmentShader )

        // create shader program
        const program = gl.createProgram()
        gl.attachShader( program, vertexShader )
        gl.attachShader( program, fragmentShader )
        gl.linkProgram( program )
        gl.useProgram( program )

        /* ALL ATTRIBUTE/UNIFORM INITIALIZATION MUST COME AFTER
        CREATING/LINKING/USING THE SHADER PROGAM */

        // find a pointer to the uniform "time" in our fragment shader
        uTime = gl.getUniformLocation( program, 'time' )
        const uRes = gl.getUniformLocation( program, 'resolution' )
        gl.uniform2f( uRes, gl.drawingBufferWidth, gl.drawingBufferHeight )

        // get position attribute location in shader
        const position = gl.getAttribLocation( program, 'a_position' )
        // enable the attribute
        gl.enableVertexAttribArray( position )
        // this will point to the vertices in the last bound array buffer.
        // In this example, we only use one array buffer, where we're storing
        // our vertices
        gl.vertexAttribPointer( position, 2, gl.FLOAT, false, 0,0 )



        getVideo()
        Mic = new Microphone()
        render()
    }

    function getVideo() {
        video = document.createElement( 'video' )

        navigator.mediaDevices.getUserMedia({
            video:true
        }).then( stream => {
            video.srcObject = stream
            video.play()
            makeTexture()
        })

        return video
    }

    //adapted from https://docs.sumerian.amazonaws.com/articles/webaudio-1/
    //and https://hackernoon.com/creative-coding-using-the-microphone-to-make-sound-reactive-art-part1-164fd3d972f3
    'use strict';
    class Microphone {
        constructor(sampleRate = 44100, bufferLength = 4096) {
            this._sampleRate = sampleRate;
            // Shorter buffer length results in a more responsive visualization
            this._bufferLength = bufferLength;

            this._bufferSource = null;
            this._streamSource = null;
            this._scriptNode = null;

            this._realtimeBuffer = [];
            this._audioBuffer = [];
            this._audioBufferSize = 0;
            this._analyser = null;
            this._spectrum = null;

            this._setup(this._bufferLength);
        };

        _validateSettings() {
            if (!Number.isInteger(this._sampleRate) || this._sampleRate < 22050 || this._sampleRate > 96000) {
                throw "Please input an integer samplerate value between 22050 to 96000";
            }

            this._validateBufferLength();
        }

        _validateBufferLength() {
            const acceptedBufferLength = [256, 512, 1024, 2048, 4096, 8192, 16384]
            if (!acceptedBufferLength.includes(this._bufferLength)) {
                throw "Please ensure that the buffer length is one of the following values: " + acceptedBufferLength;
            }
        }

        _setup(bufferLength) {
            this._validateSettings();

            // Get microphone access
            if (navigator.mediaDevices) {
                navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
                    this._audioContext = new AudioContext();
                    this._analyser = this._audioContext.createAnalyser();
                    this._analyser.smoothingTimeConstant = 0.2;
                    this._analyser.fftSize = 1024;
                    this._streamSource = this._audioContext.createMediaStreamSource(stream);

                    this._scriptNode = this._audioContext.createScriptProcessor(bufferLength, 1, 1);
                    this._bufferSource = this._audioContext.createBufferSource();

                    this._streamSource.connect(this._scriptNode);
                    this._bufferSource.connect(this._audioContext.destination);
                    this._streamSource.connect(this._analyser)
                    this._analyser.connect(this._scriptNode)
                    this._scriptNode.connect(this._audioContext.destination)
                }).catch ((e) => {
                    throw "Microphone: " + e.name + ". " + e.message;
                })
            } else {
                throw "MediaDevices are not supported in this browser";
            }
        }

        processAudio() {
            // Whenever onaudioprocess event is dispatched it creates a buffer array with the length bufferLength
            var rms = 0.0

                this._spectrum = new Uint8Array(this._analyser.frequencyBinCount)
                this._analyser.getByteFrequencyData(this._spectrum);

                //console.log(this._analyser)
                for (var i = 0; i < this._analyser.frequencyBinCount; i++) {
                    rms += this._spectrum[i] * this._spectrum[i];
                }
                rms /= this._spectrum.length;
                console.log(rms)
                rms = Math.sqrt(rms);
                return rms;

                // Create an array of buffer array until the user finishes recording
                this._audioBuffer.push(this._realtimeBuffer);
                this._audioBufferSize += this._bufferLength;

            return rms;
        }

        _setBuffer() {
            return new Promise((resolve, reject) => {
                // New AudioBufferSourceNode needs to be created after each call to start()
                this._bufferSource = this._audioContext.createBufferSource();
                this._bufferSource.connect(this._audioContext.destination);

                let mergedBuffer = this._mergeBuffers(this._audioBuffer, this._audioBufferSize);
                let arrayBuffer = this._audioContext.createBuffer(1, mergedBuffer.length, this._sampleRate);
                let buffer = arrayBuffer.getChannelData(0);

                for (let i = 0, len = mergedBuffer.length; i < len; i++) {
                    buffer[i] = mergedBuffer[i];
                }

                this._bufferSource.buffer = arrayBuffer;

                resolve(this._bufferSource);
            })
        }

        _mergeBuffers(bufferArray, bufferSize) {
            // Not merging buffers because there is less than 2 buffers from onaudioprocess event and hence no need to merge
            if (bufferSize < 2) return;

            let result = new Float32Array(bufferSize);

            for (let i = 0, len = bufferArray.length, offset = 0; i < len; i++) {
                result.set(bufferArray[i], offset);
                offset += bufferArray[i].length;
            }
            return result;
        }
    }

    function makeTexture() {
        // create an OpenGL texture object
        var texture = gl.createTexture()

        // this tells OpenGL which texture object to use for subsequent operations
        gl.bindTexture( gl.TEXTURE_2D, texture )

        // since canvas draws from the top and shaders draw from the bottom, we
        // have to flip our canvas when using it as a shader.
        gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true )

        // how to map when texture element is more than one pixel
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR )
        // how to map when texture element is less than one pixel
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR )

        // you must have these properties defined for the video texture to
        // work correctly
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE )
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE )

        // let our render loop know when the texture is ready
        textureLoaded = true
    }

    // keep track of time via incremental frame counter
    let time = 0
    let buf = 0.0
    function render() {
        // schedules render to be called the next time the video card requests
        // a frame of video
        window.requestAnimationFrame( render )

        // check to see if video is playing and the texture has been created
        if( textureLoaded === true ) {
            // send texture data to GPU
            gl.texImage2D(
                gl.TEXTURE_2D,    // target: you will always want gl.TEXTURE_2D
                0,                // level of detail: 0 is the base
                gl.RGBA, gl.RGBA, // color formats
                gl.UNSIGNED_BYTE, // type: the type of texture data; 0-255
                video             // pixel source: could also be video or image
            )

            // draw triangles using the array buffer from index 0 to 6 (6 is count)
            gl.drawArrays( gl.TRIANGLES, 0, 6 )
        }

        buf = Mic.processAudio()
        console.log(buf)
        gl.uniform1f(Buffer, buf)

        // update time on CPU and GPU
        time++
        gl.uniform1f( uTime, time )
    }
</script>

</html>


```
### Feedback
A major point of feedback that I received is that it is a lot to take in at the start. This leads me to believe that I might have tried to have too much happen all at once. One thing that I would go back and change is adjusting things so that there is finer controls and setting limits so that not has many things overlap at once. Another point of feedback is that it would be more interesting if something was happening in the video. One positive point was that the blur being controlled by audio input seemed to fit well with the electronic music I was using.

### Updated Code
```
<!doctype html>
<html lang='en'>
<head>
    <style>body{ margin:0 }</style>
</head>
<body>
<canvas id='gl'></canvas>
</body>
<!-- vertex shader, as simple as possible -->
<script id='vertex' type='x-shader/x-vertex'>
    attribute vec2 a_position;

    void main() {
      gl_Position = vec4( a_position, 0., 1. );
    }
  </script>

<!-- fragment shader -->
<script id='fragment' type='x-shader/x-fragment'>
    #ifdef GL_ES
    precision mediump float;
    #endif
    
    uniform mediump float time;
    uniform mediump float buf;
    uniform mediump float frequency;
    uniform mediump vec2 resolution;
    uniform sampler2D uSampler;
    uniform bool rInvert;
    uniform bool gInvert;
    uniform bool bInvert;

    // 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation
    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
     u = smoothstep(0.,1.,f);
    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

    vec4 blur5(sampler2D image, vec2 uv, vec2 res, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(2.3333333333333333) * (direction/tan(time));
  color += texture2D(image, uv) * 0.29411764705882354;
  color += texture2D(image, uv + (off1 / res)) * 0.35294117647058826;
  color += texture2D(image, uv - (off1 / res)) * 0.35294117647058826;
  return color;
}
    
    void main() {
        //sine oscillator
        float bias = .5, gain = .5;
        float color = bias + sin( time * frequency ) * gain;

        vec2 pos = gl_FragCoord.xy / resolution;

        vec4 blur = blur5( uSampler, pos, resolution, vec2(2.,buf) );

        pos.y = pos.y - buf/100.;
        pos.x = pos.x + buf/1000.;

        //noise
        float n = noise(pos);

        //sections with "audio" control
        float y = step(mod(buf/100.,.25), pos.y/(buf/n)) - step(mod(buf/100.,-0.5), -pos.y/n) + step(mod(time/100.,0.6), pos.y/(pos.x/n)) - step(mod(time/100.,-0.9), -pos.y/n);
        float x = step(0.5, pos.x);

        //rbg
        float r = blur.r * y;
        float g = blur.g * cos(gl_FragCoord.x / resolution.x);//* mod( time/100., 1. );
        float b = blur.b * (x/2.);// * mod( time/100., 1. );

        //inversion
        if(rInvert){
            r = 1. - r;
        }

        if(gInvert){
            g = 1. - g;
        }

        if(bInvert){
            b = 1. - b;
        }

      gl_FragColor = vec4(
        r * color,
        g * color,
        b * color,
        1.0
      );
    }
  </script>

<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.2/dat.gui.js"></script>
<script type='text/javascript'>

    let gl, uTime, video, textureLoaded = false, Mic, Buffer, uFrequency, guivar, urInvert, ugInvert, ubInvert

    var guiVars = function(){
        this.frequency = 10.;
        this.rInvert = false;
        this.gInvert = false;
        this.bInvert = false;
    }

    window.onload = function() {
        const canvas = document.getElementById( 'gl' )
        gl = canvas.getContext( 'webgl' )
        canvas.width = 1024//window.innerWidth
        canvas.height = 1024//window.innerHeight

        // define drawing area of canvas. bottom corner, width / height
        gl.viewport( 0,0,gl.drawingBufferWidth, gl.drawingBufferHeight )

        // create a buffer object to store vertices
        const buffer = gl.createBuffer()

        // point buffer at graphic context's ARRAY_BUFFER
        gl.bindBuffer( gl.ARRAY_BUFFER, buffer )

        const triangles = new Float32Array([
            -1, -1,
            1,  -1,
            -1, 1,
            -1, 1,
            1, -1,
            1, 1
        ])

        // initialize memory for buffer and populate it. Give
        // open gl hint contents will not change dynamically.
        gl.bufferData( gl.ARRAY_BUFFER, triangles, gl.STATIC_DRAW )

        // create vertex shader
        let shaderScript = document.getElementById('vertex')
        let shaderSource = shaderScript.text
        const vertexShader = gl.createShader( gl.VERTEX_SHADER )
        gl.shaderSource( vertexShader, shaderSource );
        gl.compileShader( vertexShader )

        // create fragment shader
        shaderScript = document.getElementById('fragment')
        shaderSource = shaderScript.text
        const fragmentShader = gl.createShader( gl.FRAGMENT_SHADER )
        gl.shaderSource( fragmentShader, shaderSource );
        gl.compileShader( fragmentShader )

        // create shader program
        const program = gl.createProgram()
        gl.attachShader( program, vertexShader )
        gl.attachShader( program, fragmentShader )
        gl.linkProgram( program )
        gl.useProgram( program )

        /* ALL ATTRIBUTE/UNIFORM INITIALIZATION MUST COME AFTER
        CREATING/LINKING/USING THE SHADER PROGAM */

        // find a pointer to the uniform "time" in our fragment shader
        uTime = gl.getUniformLocation( program, 'time' )
        const uRes = gl.getUniformLocation( program, 'resolution' )
        gl.uniform2f( uRes, gl.drawingBufferWidth, gl.drawingBufferHeight )

        // get position attribute location in shader
        const position = gl.getAttribLocation( program, 'a_position' )
        // enable the attribute
        gl.enableVertexAttribArray( position )
        // this will point to the vertices in the last bound array buffer.
        // In this example, we only use one array buffer, where we're storing
        // our vertices
        gl.vertexAttribPointer( position, 2, gl.FLOAT, false, 0,0 )

        uFrequency = gl.getUniformLocation(program, 'frequency')
        urInvert = gl.getUniformLocation(program, 'rInvert')
        ugInvert = gl.getUniformLocation(program, 'gInvert')
        ubInvert = gl.getUniformLocation(program, 'bInvert')

        guivar = new guiVars();
        var gui = new dat.GUI();
        gui.add(guivar, 'frequency', 0, 20)
        gui.add(guivar, 'rInvert')
        gui.add(guivar, 'gInvert')
        gui.add(guivar, 'bInvert')


        getVideo()
        Mic = new Microphone()
        render()
    }

    function getVideo() {
        video = document.createElement( 'video' )

        navigator.mediaDevices.getUserMedia({
            video:true
        }).then( stream => {
            video.srcObject = stream
            video.play()
            makeTexture()
        })

        return video
    }

    //adapted from https://docs.sumerian.amazonaws.com/articles/webaudio-1/
    //and https://hackernoon.com/creative-coding-using-the-microphone-to-make-sound-reactive-art-part1-164fd3d972f3
    'use strict';
    class Microphone {
        constructor(sampleRate = 44100, bufferLength = 4096) {
            this._sampleRate = sampleRate;
            // Shorter buffer length results in a more responsive visualization
            this._bufferLength = bufferLength;

            this._bufferSource = null;
            this._streamSource = null;
            this._scriptNode = null;

            this._realtimeBuffer = [];
            this._audioBuffer = [];
            this._audioBufferSize = 0;
            this._analyser = null;
            this._spectrum = null;

            this._setup(this._bufferLength);
        };

        _validateSettings() {
            if (!Number.isInteger(this._sampleRate) || this._sampleRate < 22050 || this._sampleRate > 96000) {
                throw "Please input an integer samplerate value between 22050 to 96000";
            }

            this._validateBufferLength();
        }

        _validateBufferLength() {
            const acceptedBufferLength = [256, 512, 1024, 2048, 4096, 8192, 16384]
            if (!acceptedBufferLength.includes(this._bufferLength)) {
                throw "Please ensure that the buffer length is one of the following values: " + acceptedBufferLength;
            }
        }

        _setup(bufferLength) {
            this._validateSettings();

            // Get microphone access
            if (navigator.mediaDevices) {
                navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
                    this._audioContext = new AudioContext();
                    this._analyser = this._audioContext.createAnalyser();
                    this._analyser.smoothingTimeConstant = 0.2;
                    this._analyser.fftSize = 1024;
                    this._streamSource = this._audioContext.createMediaStreamSource(stream);

                    this._scriptNode = this._audioContext.createScriptProcessor(bufferLength, 1, 1);
                    this._bufferSource = this._audioContext.createBufferSource();

                    this._streamSource.connect(this._scriptNode);
                    this._bufferSource.connect(this._audioContext.destination);
                    this._streamSource.connect(this._analyser)
                    this._analyser.connect(this._scriptNode)
                    this._scriptNode.connect(this._audioContext.destination)
                }).catch ((e) => {
                    throw "Microphone: " + e.name + ". " + e.message;
                })
            } else {
                throw "MediaDevices are not supported in this browser";
            }
        }

        processAudio() {
            // Whenever onaudioprocess event is dispatched it creates a buffer array with the length bufferLength
            var rms = 0.0

                this._spectrum = new Uint8Array(this._analyser.frequencyBinCount)
                this._analyser.getByteFrequencyData(this._spectrum);

                //console.log(this._analyser)
                for (var i = 0; i < this._analyser.frequencyBinCount; i++) {
                    rms += this._spectrum[i] * this._spectrum[i];
                }
                rms /= this._spectrum.length;
                console.log(rms)
                rms = Math.sqrt(rms);
                return rms;

                // Create an array of buffer array until the user finishes recording
                this._audioBuffer.push(this._realtimeBuffer);
                this._audioBufferSize += this._bufferLength;

            return rms;
        }

        _setBuffer() {
            return new Promise((resolve, reject) => {
                // New AudioBufferSourceNode needs to be created after each call to start()
                this._bufferSource = this._audioContext.createBufferSource();
                this._bufferSource.connect(this._audioContext.destination);

                let mergedBuffer = this._mergeBuffers(this._audioBuffer, this._audioBufferSize);
                let arrayBuffer = this._audioContext.createBuffer(1, mergedBuffer.length, this._sampleRate);
                let buffer = arrayBuffer.getChannelData(0);

                for (let i = 0, len = mergedBuffer.length; i < len; i++) {
                    buffer[i] = mergedBuffer[i];
                }

                this._bufferSource.buffer = arrayBuffer;

                resolve(this._bufferSource);
            })
        }

        _mergeBuffers(bufferArray, bufferSize) {
            // Not merging buffers because there is less than 2 buffers from onaudioprocess event and hence no need to merge
            if (bufferSize < 2) return;

            let result = new Float32Array(bufferSize);

            for (let i = 0, len = bufferArray.length, offset = 0; i < len; i++) {
                result.set(bufferArray[i], offset);
                offset += bufferArray[i].length;
            }
            return result;
        }
    }

    function makeTexture() {
        // create an OpenGL texture object
        var texture = gl.createTexture()

        // this tells OpenGL which texture object to use for subsequent operations
        gl.bindTexture( gl.TEXTURE_2D, texture )

        // since canvas draws from the top and shaders draw from the bottom, we
        // have to flip our canvas when using it as a shader.
        gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true )

        // how to map when texture element is more than one pixel
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR )
        // how to map when texture element is less than one pixel
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR )

        // you must have these properties defined for the video texture to
        // work correctly
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE )
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE )

        // let our render loop know when the texture is ready
        textureLoaded = true
    }

    // keep track of time via incremental frame counter
    let time = 0
    let buf = 0.0
    function render() {
        // schedules render to be called the next time the video card requests
        // a frame of video
        window.requestAnimationFrame( render )

        // check to see if video is playing and the texture has been created
        if( textureLoaded === true ) {
            // send texture data to GPU
            gl.texImage2D(
                gl.TEXTURE_2D,    // target: you will always want gl.TEXTURE_2D
                0,                // level of detail: 0 is the base
                gl.RGBA, gl.RGBA, // color formats
                gl.UNSIGNED_BYTE, // type: the type of texture data; 0-255
                video             // pixel source: could also be video or image
            )

            // draw triangles using the array buffer from index 0 to 6 (6 is count)
            gl.drawArrays( gl.TRIANGLES, 0, 6 )
        }

        gl.uniform1f(uFrequency, guivar.frequency)
        gl.uniform1i(urInvert, guivar.rInvert)
        gl.uniform1f(ugInvert, guivar.gInvert)
        gl.uniform1f(ubInvert, guivar.bInvert)

        buf = Mic.processAudio()
        console.log(buf)
        gl.uniform1f(Buffer, buf)

        // update time on CPU and GPU
        time++
        gl.uniform1f( uTime, time )
    }
</script>

</html>
```