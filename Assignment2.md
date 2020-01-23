### Laurie Mazza

### Assignment 2
For this project, I wanted to convey a feeling of progress by having the animation get more complex as it goes. In order to achieve this, I explored changing the complexity of the animation through functions controlling colors and patterns. I found using the sine and cosine functions on time to control features such as oscillating to produce and interesting effect which lead me to using it to control multiple effects. When looking at pieces of art for inspiration, pieces such as  Broadway Boogie Woogie by Piet Mondrian inspired me to play with grid patterns. Using grid patterns helped to keep things slightly organized as the animation progressed. I explored the various functions to create organized patterns and then I explored the combination between them and controlling them with the time. Because I wanted specific control over how parts of the animation progressed, I decided to have part of it controlled live by uncommenting certain lines.

<iframe width="560" height="315" src="https://www.youtube.com/embed/evTrB_bSeTQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

```
vec2 rotate2D( vec2 _st, float _angle){
    _st -= 0.5;
    _st =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}

vec2 tile(vec2 _st, float _zoom, bool off, float speed){
    _st *= _zoom;
    
    if(off){
        _st.x += step(1., mod(_st.y,2.0)) * sin(time * speed);
    }
    return fract(_st);
}

float box(vec2 _st, vec2 _size, float _smoothEdges){
    _size = vec2(0.5)-_size*0.5;
    vec2 aa = vec2(_smoothEdges*0.5);
    vec2 uv = smoothstep(_size,_size+aa,_st);
    uv *= smoothstep(_size,_size+aa,vec2(1.0)-_st);
    return uv.x*uv.y;
}

vec2 truchetPattern(in vec2 _st, in float _index){
    _index = fract(((_index-0.5)*2.0));
    if (_index > 0.75) {
        _st = vec2(1.0) - _st;
    } else if (_index > 0.5) {
        _st = vec2(1.0-_st.x,_st.y);
    } else if (_index > 0.25) {
        _st = 1.0-vec2(1.0-_st.x,_st.y);
    }
    return _st;
}

vec2 skew (vec2 st) {
    vec2 r = vec2(0.0);
    r.x = 1.1547*st.x;
    r.y = st.y+0.5*r.x;
    return r;
}

vec3 simplexGrid (vec2 st) {
    vec3 xyz = vec3(0.0);
    vec2 p = fract(skew(st));
    
    if (p.x > p.y) {
        xyz.xy = 1.0-vec2(p.x,p.y-p.x);
        xyz.z = p.y;
    } else {
        xyz.yz = 1.0-vec2(p.x-p.y,p.y);
        xyz.x = p.x;
    }
    return fract(xyz);
}
 
void main () {
    
    vec2 st = gl_FragCoord.xy/resolution;
    
    vec3 color = vec3(1.0);
    
    float p = abs(sin(time))/2.;
    float h = p *step(0.0, st.x) + p * step(0.25, st.x) + p *step(0.5, st.x) + p * step(0.75, st.x);
    
    float i = floor(h);
    float f = fract(h);
    float u = f * f * (3.0 - 2.0 * f );
    
    if(sin(time)+cos(time) < .5){
        color.r = h * color.r ;//* mix(rand(i), rand(f + 1.0), u);
        color.g = h * color.g ;//* mix(rand(f), rand(i), u);
        color.b = h * color.b ;//* u;    
    }
    
    st = tile(st, 4., false, 0.5); //(sin(time)+cos(time))
    
    //st = rotate2D(st, PI * sin( time));
    
    vec2 ipos = floor(st);
    vec2 fpos = fract(st);
    
    vec2 tile = truchetPattern(fpos, rand( ipos ));
    
    if(cos(time) > -.1){
        //color = vec3(smoothstep(tile.x-0.3,tile.x,tile.y) - smoothstep(tile.x,tile.x+0.3,tile.y)) * (1.-f);
        //color.rg = fract(skew(st))/3.;
        //color = simplexGrid(st);
    }
    
    //color.rb = fract(skew(st));
    
    vec3 color2 = vec3(1.0);
    //color2 = vec3(sin(st * 4. + time),1.0);
    
    float r = color2.r * color.r;
    float g = color2.g * color.g;
    float b = color2.b * color.b;
    
    //color = vec3(box(st, vec2(0.7), 0.01) * r, box(st, vec2(0.7), 0.01) * g, box(st, vec2(0.7), 0.01) * b);
    
    //gl_FragColor = vec4(color, 1.0);
}
```
### Feedback
When showing this assignment to people outside of the class, I was given some interesting feedback that could be grouped together under the category of chaos. One friend of mine described it as "trippy" and said they enjoyed the interesting development of colors. Having someone describe it as wild did not match my expectations as I thought using grid type patterns would keep the animation on the organized side but I can understand this view as there is a large amount to process at the end with all of the movement and colors changing. While I was told by one friend that they felt the animation developed over time, they did not feel as if there was progress as the transition from organization to chaos gave an opposite feeling. This was interesting to me as I had not thought about it that way and wonder if having the same animation but in reverse would better convey a feeling of progress. 