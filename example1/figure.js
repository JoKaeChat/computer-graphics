"use strict";

let canvas;
let gl;
let program;

let projectionMatrix;
let modelViewMatrix;

let instanceMatrix;

let modelViewMatrixLoc;

let vertices = [

    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];

// 몸통 (위가 깎인 피라미드)
let vertices2 = [

    vec4( -1, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.25, 1.0 ),
    vec4( 0.5,  0.5,  0.25, 1.0 ),
    vec4( 1, -0.5,  0.5, 1.0 ),
    vec4( -1, -0.5,  -0.5, 1.0 ),
    vec4( -0.5,  0.5,  -0.25, 1.0 ),
    vec4( 0.5,  0.5,  -0.25, 1.0 ),
    vec4( 1, -0.5,  -0.5, 1.0 ),
   
];

const HEAD_THROTLE = 15;
const ARM_THROTLE = 20;
const WHEEL_THROTLE = 15;

let torsoId = 0;
let headId  = 1;
let head1Id = 1;
let head2Id = 13;
let head3Id = 18;
let leftEarId = 2;
let rightEarId = 3;
let leftUpperArmId = 4;
let rightUpperArmId = 5;
let leftUpperArmId2 = 20;
let rightUpperArmId2 = 19;
let carId = 6;
let leftFrontWheelId = 7;
let leftBackWheelId = 8;
let rightFrontWheelId = 9;
let rightBackWheelId = 10;
let leftFrontWheelId2 = 14;
let leftBackWheelId2 = 15;
let rightFrontWheelId2 = 16;
let rightBackWheelId2 = 17;
let leftHandId = 11;
let rightHandId = 12;


let torsoHeight = 6.0;
let torsoWidth = 2.0;
let upperArmHeight = 3.0;
let upperArmWidth  = 1.0;
let carWidth = 10.0;
let carHeight = 4.0;
let carZ = 10.0;
let wheelWidth = 2.0;
let wheelHeight = 2.0;
let headHeight = 3.5;
let headWidth = 6.0;
let earWidth = 2.0;
let earHeight = 2.0;
let handWidth = 2.0;
let handHeight = 1.0;

let numNodes = 19;
let angle = 0;

let theta = [-180, 0, 0, 0, 70, 70,
                0, 0,0,0,0, 
                0,0,0,0,0,
                0,0,0,0,0,
                0,0,0,0,0,
                0,0,0,0,0];

let numVertices = 24;

let stack = [];

let figure = [];



for( let i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);

let vBuffer;
let modelViewLoc;
let colorLoc;

let pointsArray = [];

//-------------------------------------------

function scale4(a, b, c) {
   let result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

//--------------------------------------------


function createNode(transform, render, sibling, child){
    let node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}


function initNodes(Id) {

    let m = mat4();

    switch(Id) {

    case torsoId:


    m = rotate(theta[torsoId], 0, 1, 0 );

    figure[torsoId] = createNode( m, torso, null, headId );
    break;

    case headId:
    case head1Id:
    case head2Id:
    case head3Id:


    m = translate(0.0, torsoHeight+0.5*headHeight, 0.0);
	m = mult(m, rotate(theta[head1Id], 1, 0, 0));
	m = mult(m, rotate(theta[head2Id], 0, 1, 0));
    m = mult(m, rotate(theta[head3Id], 0, 0, 1));
    m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
    figure[headId] = createNode( m, head, leftUpperArmId, leftEarId);
    break;

    case leftEarId:
    
    m = translate(-headWidth/2, 0.7,0.0);
    m = mult(m, rotate([leftEarId], 1, 1, 0));
    figure[leftEarId] = createNode(m, leftEar, rightEarId, null);
    break;

    case rightEarId:
    
    m = translate(headWidth/2, 0.7 ,0.0);
    m = mult(m, rotate([rightEarId], 1, 1, 0));
    figure[rightEarId] = createNode(m, rightEar, null, null);
    break;

    case leftUpperArmId:
    case leftUpperArmId2:

    m = translate(-(torsoWidth), 0.6*torsoHeight, -2.0);
	m = mult(m, rotate(theta[leftUpperArmId], 1, 0, 0));
    m = mult(m, rotate(theta[leftUpperArmId2], 0, 1, 0));
    figure[leftUpperArmId] = createNode( m, leftUpperArm, rightUpperArmId, leftHandId );
    break;


    case rightUpperArmId:
    case rightUpperArmId2:

    m = translate(torsoWidth, 0.6*torsoHeight, -2.0);
	m = mult(m, rotate(theta[rightUpperArmId], 1, 0, 0));
    m = mult(m, rotate(theta[rightUpperArmId2], 0, 1, 0));
    figure[rightUpperArmId] = createNode( m, rightUpperArm, carId, rightHandId );
    break;

    case leftHandId:

    m = translate(0.0, -handHeight, 0.0);
	m = mult(m, rotate(theta[leftHandId], 1, 0, 0));
    figure[leftHandId] = createNode( m, leftHand, rightHandId, null );
    break;

    case rightHandId:

    m = translate(0.0, -handHeight, 0.0);
	m = mult(m, rotate(theta[rightHandId], 1, 0, 0));
    figure[rightHandId] = createNode( m, rightHand, null, null );
    break;


   case carId:
        
   m = translate(0,  -torsoHeight*0.3, 0);
   m = mult(m, rotate(theta[carId], 1,0,0));
   figure[carId] = createNode( m, car, null, leftFrontWheelId);
   break;

   case leftFrontWheelId:
   case leftFrontWheelId2 : 

   m = translate(-(carWidth/2), 0.0 , -wheelWidth*1.5);
   m = mult(m, rotate(theta[leftFrontWheelId], 1, 0, 0));
   m = mult(m, rotate(theta[leftFrontWheelId2], 0, 1, 0));
   figure[leftFrontWheelId] = createNode(m, leftFrontWheel, rightFrontWheelId, leftBackWheelId);
   break;

    case leftBackWheelId:
    case leftBackWheelId2 :

   m = translate(0.0 , 0.0 ,  carZ*0.6 );
   m = mult(m, rotate(theta[leftBackWheelId], 1, 0, 0));
   m = mult(m, rotate(theta[leftBackWheelId2], 0, 1, 0));
   figure[leftBackWheelId] = createNode(m, leftBackWheel, null, null);
   break;

    case rightFrontWheelId:
    case rightFrontWheelId2 :

   m = translate(carWidth/2, 0.0,-wheelWidth*1.5);
   m = mult(m, rotate(theta[rightFrontWheelId], 1, 0, 0));
   m = mult(m, rotate(theta[rightFrontWheelId2], 0, 1, 0));
   figure[rightFrontWheelId] = createNode(m, rightFrontWheel, null, rightBackWheelId);
   break;

   case rightBackWheelId:
   case rightBackWheelId2 :

   m = translate(0.0, 0.0,  carZ*0.6 );
   m = mult(m, rotate(theta[rightBackWheelId], 1, 0, 0));
   m = mult(m, rotate(theta[rightBackWheelId2], 0, 1, 0));
   figure[rightBackWheelId] = createNode(m, rightBackWheel, null, null);
   break;
   }
}

function traverse(Id) {

   if(Id == null) return;
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child);
    modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling);
}

function torso() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*torsoHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( torsoWidth, torsoHeight, torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4f(colorLoc,1/256,119/256,204/256, 1.0); // blue
    for(let i =6; i<12; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function head() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(let i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftEar(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * earHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(earWidth, earHeight, earWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(let i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightEar(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * earHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(earWidth, earHeight, earWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(let i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}


function leftUpperArm() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(let i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4f(colorLoc,1/256,119/256,204/256, 1.0); // blue
    for(let i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftHand(){
    instanceMatrix = mult(modelViewMatrix , translate(0.0,0.5*handHeight,0.0));
    instanceMatrix = mult(instanceMatrix, scale4(handWidth,handHeight, handWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4f(colorLoc, 160/256,161/256,157/256,1.0); // gray
    for(let i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightHand(){
    instanceMatrix = mult(modelViewMatrix , translate(0.0,0.5*handHeight,0.0));
    instanceMatrix = mult(instanceMatrix, scale4(handWidth,handHeight, handWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4f(colorLoc, 160/256,161/256,157/256,1.0);// gray
    for(let i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function car(){
    instanceMatrix = mult(modelViewMatrix , translate(0.0,0.5*carHeight,0.0));
    instanceMatrix = mult(instanceMatrix, scale4(carWidth,carHeight, carZ) );
    gl.uniformMatrix4fv(modelViewMatrixLoc,false, flatten(instanceMatrix));
    gl.uniform4f(colorLoc,204/256,2/256,2/256, 1.0); // red
    for(let i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftFrontWheel(){
    instanceMatrix = mult(modelViewMatrix , translate(0.0,0.0,0.0));
    instanceMatrix = mult(instanceMatrix, scale4(wheelWidth,wheelHeight,wheelHeight ) );
    gl.uniformMatrix4fv(modelViewMatrixLoc,false, flatten(instanceMatrix));
    gl.uniform4f(colorLoc,0/256,0/256,0/256, 1.0); // black
    for(let i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftBackWheel(){
    instanceMatrix = mult(modelViewMatrix , translate(0.0,0.0,0.0));
    instanceMatrix = mult(instanceMatrix, scale4(wheelWidth,wheelHeight,wheelHeight ) );
    gl.uniformMatrix4fv(modelViewMatrixLoc,false, flatten(instanceMatrix));
    gl.uniform4f(colorLoc,255/256,212/256,0/256, 1.0); // yellow
    for(let i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightFrontWheel(){
    instanceMatrix = mult(modelViewMatrix , translate(0.0,0.0,0.0));
    instanceMatrix = mult(instanceMatrix, scale4(wheelWidth,wheelHeight,wheelHeight ) );
    gl.uniformMatrix4fv(modelViewMatrixLoc,false, flatten(instanceMatrix));
    gl.uniform4f(colorLoc,0/256,0/256,0/256, 1.0); // green
    for(let i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightBackWheel(){
    instanceMatrix = mult(modelViewMatrix , translate(0.0,0.0,0.0));
    instanceMatrix = mult(instanceMatrix, scale4(wheelWidth,wheelHeight,wheelHeight ) );
    gl.uniformMatrix4fv(modelViewMatrixLoc,false, flatten(instanceMatrix));
    gl.uniform4f(colorLoc,255/256,212/256,0/256, 1.0); // yellow 
    for(let i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function quad(a, b, c, d) {
     pointsArray.push(vertices[a]);
     pointsArray.push(vertices[b]);
     pointsArray.push(vertices[c]);
     pointsArray.push(vertices[d]);
}


function cube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

function quad2(a, b, c, d) {
    pointsArray.push(vertices2[a]);
    pointsArray.push(vertices2[b]);
    pointsArray.push(vertices2[c]);
    pointsArray.push(vertices2[d]);
}

function trapezoid()
{
   quad2( 1, 0, 3, 2 );
   quad2( 2, 3, 7, 6 );
   quad2( 3, 0, 4, 7 );
   quad2( 6, 5, 1, 2 );
   quad2( 4, 5, 6, 7 );
   quad2( 5, 4, 0, 1 );
}


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader");

    gl.useProgram( program);

    instanceMatrix = mat4();

    projectionMatrix = ortho(-10.0,10.0,-10.0, 10.0,-10.0,10.0);
    modelViewMatrix = mat4();


    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix) );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    colorLoc = gl.getUniformLocation(program,"uColor");

    cube();
    trapezoid();

    vBuffer = gl.createBuffer();
    gl.enable(gl.DEPTH_TEST);

    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    let vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

        document.getElementById("slider0").onchange = function(event) {
        theta[torsoId ] = event.target.value;
        initNodes(torsoId);
    };
        document.getElementById("slider1").onchange = function(event) {
        theta[head3Id] = event.target.value;
        initNodes(head3Id);
    };

    document.getElementById("slider2").onchange = function(event) {
         theta[leftUpperArmId] = event.target.value;
         initNodes(leftUpperArmId);
    };


        document.getElementById("slider4").onchange = function(event) {
        theta[rightUpperArmId] = event.target.value;
        initNodes(rightUpperArmId);
    };
 
    document.getElementById("slider10").onchange = function(event) {
         theta[head2Id] = event.target.value;
         initNodes(head2Id);
    };

    document.addEventListener("keydown",(e) => {
        if(e.key == 'ArrowRight'){
            if(theta[head3Id]  >= -HEAD_THROTLE){
                theta[head3Id] -= 1;
                theta[leftUpperArmId2] -= 2;
                theta[rightUpperArmId2] -= 2;
                
                initNodes(head3Id);
                initNodes(rightUpperArmId2);
                initNodes(leftUpperArmId2);
                
            }
        }

        else if(e.key == 'ArrowLeft'){
            if(theta[head3Id]  <= HEAD_THROTLE){
                theta[head3Id] += 1;
                theta[leftUpperArmId2] += 2;
                theta[rightUpperArmId2] += 2;
                
                initNodes(head3Id);
                initNodes(leftUpperArmId2);
                initNodes(rightUpperArmId2);
            } 
        }
    });

    document.addEventListener("keyup",(e)=>{
        if(e.key == 'ArrowRight' || e.key == 'ArrowLeft'){
            theta[head3Id] = 0;
            theta[leftUpperArmId2] = 0;
            theta[rightUpperArmId2] = 0;

            initNodes(head3Id);
            initNodes(leftUpperArmId2);
            initNodes(rightUpperArmId2);
        }
       
    });

    for(let i=0; i<numNodes; i++) initNodes(i);

    render();
}


let render = function() {

        gl.clear( gl.COLOR_BUFFER_BIT );
        traverse(torsoId);
        requestAnimFrame(render);
}
