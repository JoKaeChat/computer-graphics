"use strict";

let canvas;
let gl;
let program;

let projectionMatrix;
let modelViewMatrix;
let backViewMatrix;

let instanceMatrix;
let modelViewMatrixLoc;

let vPosition;

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

let planeVertices = [
    vec4(-1000.0, -3.1,  -1000.0, 1.0),
    vec4(-1000.0, -3.1,  1000.0 , 1.0),
    vec4(1000.0 , -3.1,  1000.0 , 1.0),
    vec4(1000.0, -3.1,  -1000.0, 1.0),
];

var trackVertices = [
    vec4(-4, -3.0, -500, 1.0),
    vec4(11, -3.0, -500, 1.0),
    vec4(-4, -3.0, -470, 1.0),
    vec4(11, -3.0, -470, 1.0),
    vec4(-7, -3.0, -455, 1.0),
    vec4(8, -3.0, -455, 1.0),
    vec4(-7, -3.0, -435, 1.0),
    vec4(8, -3.0, -435, 1.0),
    vec4(-10, -3.0, -420, 1.0),
    vec4(5, -3.0, -420, 1.0),
    vec4(-10, -3.0, -410, 1.0),
    vec4(5, -3.0, -410, 1.0),
    vec4(-7, -3.0, -395, 1.0),
    vec4(8, -3.0, -395, 1.0),
    vec4(-7, -3.0, -385, 1.0),
    vec4(8, -3.0, -385, 1.0),
    vec4(-10, -3.0, -370, 1.0),
    vec4(5, -3.0, -370, 1.0),
    vec4(-7, -3.0, -355, 1.0),
    vec4(8, -3.0, -355, 1.0),
    vec4(-7, -3.0, -340, 1.0),
    vec4(8, -3.0, -340, 1.0),
    vec4(-4, -3.0, -325, 1.0),
    vec4(11, -3.0, -325, 1.0),
    vec4(-4, -3.0, -300, 1.0),
    vec4(11, -3.0, -300, 1.0),

    vec4(-4, -3.0, -300, 1.0),
    vec4(11, -3.0, -300, 1.0),
    vec4(-4, -3.0, -270, 1.0),
    vec4(11, -3.0, -270, 1.0),
    vec4(-7, -3.0, -255, 1.0),
    vec4(8, -3.0, -255, 1.0),
    vec4(-7, -3.0, -235, 1.0),
    vec4(8, -3.0, -235, 1.0),
    vec4(-10, -3.0, -220, 1.0),
    vec4(5, -3.0, -220, 1.0),
    vec4(-10, -3.0, -210, 1.0),
    vec4(5, -3.0, -210, 1.0),
    vec4(-7, -3.0, -195, 1.0),
    vec4(8, -3.0, -195, 1.0),
    vec4(-7, -3.0, -185, 1.0),
    vec4(8, -3.0, -185, 1.0),
    vec4(-10, -3.0, -170, 1.0),
    vec4(5, -3.0, -170, 1.0),
    vec4(-7, -3.0, -155, 1.0),
    vec4(8, -3.0, -155, 1.0),
    vec4(-7, -3.0, -140, 1.0),
    vec4(8, -3.0, -140, 1.0),
    vec4(-4, -3.0, -125, 1.0),
    vec4(11, -3.0, -125, 1.0),
    vec4(-4, -3.0, -100, 1.0),
    vec4(11, -3.0, -100, 1.0),
    
    vec4(-4, -3.0, -100, 1.0),
    vec4(11, -3.0, -100, 1.0),
    vec4(-4, -3.0, -70, 1.0),
    vec4(11, -3.0, -70, 1.0),
    vec4(-7, -3.0, -55, 1.0),
    vec4(8, -3.0, -55, 1.0),
    vec4(-7, -3.0, -35, 1.0),
    vec4(8, -3.0, -35, 1.0),
    vec4(-10, -3.0, -20, 1.0),
    vec4(5, -3.0, -20, 1.0),
    vec4(-10, -3.0, -10, 1.0),
    vec4(5, -3.0, -10, 1.0),
    vec4(-7, -3.0, 5, 1.0),
    vec4(8, -3.0, 5, 1.0),
    vec4(-7, -3.0, 15, 1.0),
    vec4(8, -3.0, 15, 1.0),
    vec4(-10, -3.0, 30, 1.0),
    vec4(5, -3.0, 30, 1.0),
    vec4(-7, -3.0, 45, 1.0),
    vec4(8, -3.0, 45, 1.0),
    vec4(-7, -3.0, 60, 1.0),
    vec4(8, -3.0, 60, 1.0),
    vec4(-4, -3.0, 75, 1.0),
    vec4(11, -3.0, 75, 1.0),
    vec4(-4, -3.0, 100, 1.0),
    vec4(11, -3.0, 100, 1.0),
    
    vec4(-4, -3.0, 100, 1.0),
    vec4(11, -3.0, 100, 1.0),
    vec4(-4, -3.0, 130, 1.0),
    vec4(11, -3.0, 130, 1.0),
    vec4(-7, -3.0, 145, 1.0),
    vec4(8, -3.0, 145, 1.0),
    vec4(-7, -3.0, 165, 1.0),
    vec4(8, -3.0, 165, 1.0),
    vec4(-10, -3.0, 180, 1.0),
    vec4(5, -3.0, 180, 1.0),
    vec4(-10, -3.0, 190, 1.0),
    vec4(5, -3.0, 190, 1.0),
    vec4(-7, -3.0, 205, 1.0),
    vec4(7, -3.0, 205, 1.0),
    vec4(-7, -3.0, 215, 1.0),
    vec4(7, -3.0, 215, 1.0),
    vec4(-10, -3.0, 230, 1.0),
    vec4(5, -3.0, 230, 1.0),
    vec4(-7, -3.0, 245, 1.0),
    vec4(8, -3.0, 245, 1.0),
    vec4(-7, -3.0, 260, 1.0),
    vec4(8, -3.0, 260, 1.0),
    vec4(-4, -3.0, 275, 1.0),
    vec4(11, -3.0, 275, 1.0),
    vec4(-4, -3.0, 300, 1.0),
    vec4(11, -3.0, 300, 1.0),

    vec4(-4, -3.0, 300, 1.0),
    vec4(11, -3.0, 300, 1.0),
    vec4(-4, -3.0, 330, 1.0),
    vec4(11, -3.0, 330, 1.0),
    vec4(-7, -3.0, 345, 1.0),
    vec4(8, -3.0, 345, 1.0),
    vec4(-7, -3.0, 365, 1.0),
    vec4(8, -3.0, 365, 1.0),
    vec4(-10, -3.0, 380, 1.0),
    vec4(5, -3.0, 380, 1.0),
    vec4(-10, -3.0, 390, 1.0),
    vec4(5, -3.0, 390, 1.0),
    vec4(-7, -3.0, 405, 1.0),
    vec4(7, -3.0, 405, 1.0),
    vec4(-7, -3.0, 415, 1.0),
    vec4(7, -3.0, 415, 1.0),
    vec4(-10, -3.0, 430, 1.0),
    vec4(5, -3.0, 430, 1.0),
    vec4(-7, -3.0, 445, 1.0),
    vec4(8, -3.0, 445, 1.0),
    vec4(-7, -3.0, 460, 1.0),
    vec4(8, -3.0, 460, 1.0),
    vec4(-4, -3.0, 475, 1.0),
    vec4(11, -3.0, 475, 1.0),
    vec4(-4, -3.0, 500, 1.0),
    vec4(11, -3.0, 500, 1.0),
];



const HEAD_THROTLE = 15;


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

let numNodes = 22;
let angle = 0;

let torsoRotate = -180;

let theta = [torsoRotate, 0, 0, 0, 70, 70,
                0, 0,0,0,0, 
                0,0,0,0,0,
                0,0,0,0,0,
                0,0,0,0,0,
                0,0,0,0,0];

let numVertices = 24;


let stack = [];
let figure = [];
let normalsArray = [];

let eye=[0,2.0,40];
let up = [0,1,0];
let at = [0,0,0];

let fovy = 45;
let aspect ;
let near = 0.1;
let far = 1000.0;

let lightPosition = vec4(-0.0, -0.0, 20.0, 0.0 ); 
let lightAmbient = vec4(0.5, 0.5, 0.5, 0.5 ); 
let lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
let lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 ); 
let materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
let materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0); 
let materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
let materialShininess = 100.0;

let moveX = 0.0;
let moveY = 0.0;
let moveZ = 0.0;

let trackMove = 0.0;

let space = true;

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


// 캐릭터 모델링 초기 설정 
function initNodes(Id) {

    let m = mat4();

    switch(Id) {

    case torsoId:
    
    m = translate(moveX, 0.0, moveZ);
    
    m = mult(m,rotate(theta[torsoId], 0, 1, 0 ));

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
   figure[leftFrontWheelId] = createNode(m, leftFrontWheel, leftBackWheelId, null);
   break;

    case leftBackWheelId:
    case leftBackWheelId2 :

   m = translate(-(carWidth/2), 0.0 ,  carZ*0.3 );
   m = mult(m, rotate(theta[leftBackWheelId], 1, 0, 0));
   figure[leftBackWheelId] = createNode(m, leftBackWheel, rightFrontWheelId, null);
   break;

    case rightFrontWheelId:
    case rightFrontWheelId2 :

   m = translate(carWidth/2, 0.0,-wheelWidth*1.5);
   m = mult(m, rotate(theta[rightFrontWheelId], 1, 0, 0));
   m = mult(m, rotate(theta[rightFrontWheelId2], 0, 1, 0));
   figure[rightFrontWheelId] = createNode(m, rightFrontWheel, rightBackWheelId, null);
   break;

   case rightBackWheelId:
   case rightBackWheelId2 :

   m = translate(carWidth/2, 0.0,  carZ*0.3 );
   m = mult(m, rotate(theta[rightBackWheelId], 1, 0, 0));
   m = mult(m, rotate(theta[rightBackWheelId2], 0, 1, 0));
   figure[rightBackWheelId] = createNode(m, rightBackWheel, null, null);
   break;
   }
}

// 트리 탐색
function traverse(Id) {

   if(Id == null) return;
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child);
    modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling);
}

// 캐릭터 모델링 초기 설정 
function torso() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*torsoHeight , 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( torsoWidth, torsoHeight, torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4f(colorLoc,1/256,119/256,204/256, 1.0); // blue
    for(let i =6; i<12; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

//-- 캐릭터 모델링 초기 설정 --------------------------------//
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
    gl.uniform4f(colorLoc,0/256,0/256,0/256, 1.0); // yellow
    for(let i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightFrontWheel(){
    instanceMatrix = mult(modelViewMatrix , translate(0.0,0.0,0.0));
    instanceMatrix = mult(instanceMatrix, scale4(wheelWidth,wheelHeight,wheelHeight ) );
    gl.uniformMatrix4fv(modelViewMatrixLoc,false, flatten(instanceMatrix));
    gl.uniform4f(colorLoc,0/256,0/256,0/256, 1.0); // black
    for(let i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightBackWheel(){
    instanceMatrix = mult(modelViewMatrix , translate(0.0,0.0,0.0));
    instanceMatrix = mult(instanceMatrix, scale4(wheelWidth,wheelHeight,wheelHeight ) );
    gl.uniformMatrix4fv(modelViewMatrixLoc,false, flatten(instanceMatrix));
    gl.uniform4f(colorLoc,0/256,0/256,0/256, 1.0); 
    for(let i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}


//-------------- 법선 벡터랑 vertices 추가 --------------------//
function quad(a, b, c, d) {
    let t1 = subtract(vertices[b], vertices[a]);
    let t2 = subtract(vertices[c], vertices[b]);
    let normal = cross(t1, t2);

    pointsArray.push(vertices[a]);
    pointsArray.push(vertices[b]);
    pointsArray.push(vertices[c]);
    pointsArray.push(vertices[d]);

    normalsArray.push(normal);
    normalsArray.push(normal);
    normalsArray.push(normal);
    normalsArray.push(normal);
    normalsArray.push(normal);
    normalsArray.push(normal);
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
    let t1 = subtract(vertices[b], vertices[a]);
    let t2 = subtract(vertices[c], vertices[b]);
    let normal = cross(t1, t2);

    pointsArray.push(vertices2[a]);
    pointsArray.push(vertices2[b]);
    pointsArray.push(vertices2[c]);
    pointsArray.push(vertices2[d]);

    normalsArray.push(normal);
    normalsArray.push(normal);
    normalsArray.push(normal);
    normalsArray.push(normal);
    normalsArray.push(normal);
    normalsArray.push(normal);
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

function plane(){
    let t1 = subtract(planeVertices[0], planeVertices[1]);
    let t2 = subtract(planeVertices[3], planeVertices[0]);
    let normal = cross(t1, t2);

    pointsArray.push(planeVertices[0]);
    pointsArray.push(planeVertices[1]);
    pointsArray.push(planeVertices[2]);
    pointsArray.push(planeVertices[0]);
    pointsArray.push(planeVertices[2]);
    pointsArray.push(planeVertices[3]);

    normalsArray.push(normal);
    normalsArray.push(normal);
    normalsArray.push(normal);
    normalsArray.push(normal);
    normalsArray.push(normal);
    normalsArray.push(normal);
}

function quad3(a, b, c, d) {
    let t1 = subtract(trackVertices[b], trackVertices[a]);
    let t2 = subtract(trackVertices[c], trackVertices[b]);
    let normal = cross(t1, t2);

    pointsArray.push(trackVertices[a]);
    pointsArray.push(trackVertices[b]);
    pointsArray.push(trackVertices[c]);
    pointsArray.push(trackVertices[b]);
    pointsArray.push(trackVertices[c]);
    pointsArray.push(trackVertices[d]);

    normalsArray.push(normal);
    normalsArray.push(normal);
    normalsArray.push(normal);
    normalsArray.push(normal);
    normalsArray.push(normal);
    normalsArray.push(normal);
}

function track(){
    for(var i=0; i<trackVertices.length-2; i+=2){
        quad3(i, i+1, i+2, i+3);
    }
}


// ------------------- 렌더링 ------------------//
window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    program = initShaders( gl, "vertex-shader", "fragment-shader");
  
    gl.useProgram( program);

    instanceMatrix = mat4();

    aspect = canvas.width / canvas.height;
    projectionMatrix = perspective(fovy,aspect,near,far);
    modelViewMatrix = lookAt(eye,at,up);
    backViewMatrix = modelViewMatrix;

    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix) );
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    colorLoc = gl.getUniformLocation(program,"uColor");

    let ambientProduct = mult(lightAmbient, materialAmbient);
    let diffuseProduct = mult(lightDiffuse, materialDiffuse);
    let specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniform4fv(gl.getUniformLocation(program,"ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program,"diffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program,"specularProduct"), flatten(specularProduct));
    gl.uniform4fv(gl.getUniformLocation(program,"lightPosition"), flatten(lightPosition));
    gl.uniform1f(gl.getUniformLocation(program, "shininess"),materialShininess);
   
    cube();
    trapezoid();
    plane();
    track();

    vBuffer = gl.createBuffer();
    gl.enable(gl.DEPTH_TEST);

    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    let nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,flatten(normalsArray), gl.STATIC_DRAW);

    const vNormal = gl.getAttribLocation(program, 'vNormal');
    gl.vertexAttribPointer(vNormal,3,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(vNormal);


    document.getElementById("xSlider").onchange = function(event) {
        eye[0] = event.target.value;

        modelViewMatrix = lookAt(eye,at,up);
        backViewMatrix = modelViewMatrix;

    };

    document.getElementById("ySlider").onchange = function(event) {
        eye[1] = event.target.value;

        modelViewMatrix = lookAt(eye,at,up);
        backViewMatrix = modelViewMatrix;

    };

    document.getElementById("zSlider").onchange = function(event) {
        eye[2] = event.target.value;
        modelViewMatrix = lookAt(eye,at,up);
        backViewMatrix = modelViewMatrix;

    };

    const ceremonyButton = document.getElementById("ceremonyButton");

    ceremonyButton.addEventListener('click', function() {
        // 2초 동안 반복 실행
        let intervalId = setInterval(ceremony, 1000 / 60); // 60fps로 애니메이션 실행

        // 2초 후에 애니메이션 중지
        setTimeout(() => {
            clearInterval(intervalId);
        }, 5800);
    });

    let upKeyPressed = false;
    let rightKeyPressed = false;
    let downKeyPressed = false;
    let leftKeyPressed = false;

    let space = true;


    document.addEventListener("keydown", (e) => {

        if (e.key == 'ArrowUp') {
            upKeyPressed = true;
        }

        if(e.key == 'ArrowRight'){
            rightKeyPressed = true;
            
        }

        if(e.key == 'ArrowLeft'){
            leftKeyPressed = true;
        }

        if(e.key == 'ArrowDown'){
            downKeyPressed = true;
        }

        if (e.code === 'Space') {

                if (theta[head3Id] >= -HEAD_THROTLE && space == true) {
                    theta[head3Id] -= 1;
                    theta[leftUpperArmId2] += 2;
                    theta[rightUpperArmId2] += 2;
    
                    initNodes(head3Id);
                    initNodes(rightUpperArmId2);
                    initNodes(leftUpperArmId2);
                    if (theta[head3Id] <= -HEAD_THROTLE){
                        space = false;
                    }     
                }
                else if (theta[head3Id] <= HEAD_THROTLE && space == false) {
                    theta[head3Id] += 1;
                    theta[leftUpperArmId2] -= 2;
                    theta[rightUpperArmId2] -= 2;
                    initNodes(head3Id);
                    initNodes(leftUpperArmId2);
                    initNodes(rightUpperArmId2); 
                    if (theta[head3Id] >= HEAD_THROTLE){
                        space = true;
                    }
                }

        }

        //오른쪽 키만
        if(!upKeyPressed && rightKeyPressed && !leftKeyPressed && !downKeyPressed){
            if (theta[head3Id] >= -HEAD_THROTLE) {
                theta[head3Id] -= 1;
                theta[leftUpperArmId2] -= 2;
                theta[rightUpperArmId2] -= 2;
                theta[leftFrontWheelId2] -= 2;
                theta[rightFrontWheelId2] -= 2;
                theta[leftBackWheelId2] -= 2;
                theta[rightBackWheelId2] -= 2;

                torsoRotate -= 5;
                theta[torsoId] = torsoRotate;
                
                initNodes(head3Id);
                initNodes(rightUpperArmId2);
                initNodes(leftUpperArmId2);
                initNodes(leftFrontWheelId2);
                initNodes(rightFrontWheelId2);  
                initNodes(leftBackWheelId2);
                initNodes(rightBackWheelId2);  
                initNodes(torsoId); 
            }
        }

         //왼쪽 키만
         if(!upKeyPressed && !rightKeyPressed && leftKeyPressed && !downKeyPressed){
            if (theta[head3Id] <= HEAD_THROTLE) {
                theta[head3Id] += 1;
                theta[leftUpperArmId2] += 2;
                theta[rightUpperArmId2] += 2;
                theta[leftFrontWheelId2] += 2;
                theta[rightFrontWheelId2] += 2;
                theta[leftBackWheelId2] += 2;
                theta[rightBackWheelId2] += 2;

                torsoRotate += 5;
                theta[torsoId] = torsoRotate;
               

                initNodes(head3Id);
                initNodes(leftUpperArmId2);
                initNodes(rightUpperArmId2);
                initNodes(leftFrontWheelId2);
                initNodes(rightFrontWheelId2);
                initNodes(leftBackWheelId2);
                initNodes(rightBackWheelId2);  
                initNodes(torsoId);
            }
        }

        // 앞키만
        if(upKeyPressed && !rightKeyPressed && !leftKeyPressed){
            theta[rightFrontWheelId] -= 10;
            theta[leftFrontWheelId] -= 10;
            theta[leftBackWheelId] -= 10;
            theta[rightBackWheelId] -= 10;
            initNodes(leftFrontWheelId);
            initNodes(rightFrontWheelId);
            initNodes(leftBackWheelId);
            initNodes(rightBackWheelId);

            moveX -= Math.sin((Math.PI * theta[torsoId])/180) ;
            moveZ -= Math.cos((Math.PI * theta[torsoId])/180) ;

            
            initNodes(torsoId);
        }

        // 앞키 + 오른쪽 키
        if(upKeyPressed && rightKeyPressed){
            theta[rightFrontWheelId] -= 10;
            theta[leftFrontWheelId] -= 10;
            theta[leftBackWheelId] -= 10;
            theta[rightBackWheelId] -= 10;
            initNodes(leftFrontWheelId);
            initNodes(rightFrontWheelId);
            initNodes(leftBackWheelId);
            initNodes(rightBackWheelId);
           
            if (theta[head3Id] >= -HEAD_THROTLE) {
                theta[head3Id] -= 1;
                theta[leftUpperArmId2] -= 2;
                theta[rightUpperArmId2] -= 2;
                theta[leftFrontWheelId2] -= 2;
                theta[rightFrontWheelId2] -= 2;
                theta[leftBackWheelId2] -= 2;
                theta[rightBackWheelId2] -= 2;

                initNodes(head3Id);
                initNodes(rightUpperArmId2);
                initNodes(leftUpperArmId2);
                initNodes(leftFrontWheelId2);
                initNodes(rightFrontWheelId2);  
                initNodes(leftBackWheelId2);
                initNodes(rightBackWheelId2); 
            }
            torsoRotate -= 3;
            theta[torsoId] = torsoRotate;
            moveX -= Math.sin((Math.PI * theta[torsoId])/180) ;
            moveZ -= Math.cos((Math.PI * theta[torsoId])/180) ;

            initNodes(torsoId);
        }

        // 앞키 + 왼쪽키
        if(upKeyPressed && leftKeyPressed){
            theta[rightFrontWheelId] -= 10;
            theta[leftFrontWheelId] -= 10;
            theta[leftBackWheelId] -= 10;
            theta[rightBackWheelId] -= 10;
            initNodes(leftFrontWheelId);
            initNodes(rightFrontWheelId);
            initNodes(leftBackWheelId);
            initNodes(rightBackWheelId);
      

            if (theta[head3Id] <= HEAD_THROTLE) {
                theta[head3Id] += 1;
                theta[leftUpperArmId2] += 2;
                theta[rightUpperArmId2] += 2;
                theta[leftFrontWheelId2] += 2;
                theta[rightFrontWheelId2] += 2;
                theta[leftBackWheelId2] += 2;
                theta[rightBackWheelId2] += 2;
                initNodes(head3Id);
                initNodes(leftUpperArmId2);
                initNodes(rightUpperArmId2);
                initNodes(leftFrontWheelId2);
                initNodes(rightFrontWheelId2);
                initNodes(leftBackWheelId2);
                initNodes(rightBackWheelId2);  
            }

            torsoRotate += 3;
            theta[torsoId] = torsoRotate;
            
            moveX -= Math.sin((Math.PI * theta[torsoId])/180) ;
            moveZ -= Math.cos((Math.PI * theta[torsoId])/180) ;

            initNodes(torsoId);
        }


        // 후진 뒷키만
        if(downKeyPressed && !rightKeyPressed && !leftKeyPressed){
            theta[rightFrontWheelId] += 10;
            theta[leftFrontWheelId] += 10;
            theta[leftBackWheelId] += 10;
            theta[rightBackWheelId] += 10;
            if(theta[head2Id] <= 110){
                theta[head2Id] +=7; 
            }

            initNodes(head2Id);
            initNodes(leftFrontWheelId);
            initNodes(rightFrontWheelId);
            initNodes(leftBackWheelId);
            initNodes(rightBackWheelId);

            moveX += Math.sin((Math.PI * theta[torsoId])/180) ;
            moveZ += Math.cos((Math.PI * theta[torsoId])/180) ;

            initNodes(torsoId);
        }

        //뒷키 + 오른쪽키
        if(downKeyPressed && rightKeyPressed){
            theta[rightFrontWheelId] += 10;
            theta[leftFrontWheelId] += 10;
            theta[leftBackWheelId] += 10;
            theta[rightBackWheelId] += 10;
            if(theta[head2Id] <= 110){
                theta[head2Id] +=7; 
            }
            initNodes(head2Id);
            initNodes(leftFrontWheelId);
            initNodes(rightFrontWheelId);
            initNodes(leftBackWheelId);
            initNodes(rightBackWheelId);

            if (theta[head3Id] >= -HEAD_THROTLE) {
                theta[head3Id] -= 1;
                theta[leftUpperArmId2] -= 2;
                theta[rightUpperArmId2] -= 2;
                theta[leftFrontWheelId2] -= 2;
                theta[rightFrontWheelId2] -= 2;
                theta[rightBackWheelId2] -= 2;
            
                initNodes(head3Id);
                initNodes(rightUpperArmId2);
                initNodes(leftUpperArmId2);
                initNodes(leftFrontWheelId2);
                initNodes(rightFrontWheelId2);     
                initNodes(rightBackWheelId2);
            }
            torsoRotate += 3;
            theta[torsoId] = torsoRotate;
            moveX += Math.sin((Math.PI * theta[torsoId])/180) ;
            moveZ += Math.cos((Math.PI * theta[torsoId])/180) ;

            initNodes(torsoId);
        }

        if(downKeyPressed && leftKeyPressed){
            theta[rightFrontWheelId] += 10;
            theta[leftFrontWheelId] += 10;
            theta[leftBackWheelId] += 10;
            theta[rightBackWheelId] += 10;
            if(theta[head2Id] >= -110){
                theta[head2Id] -=7; 
            }

            initNodes(head2Id);
            initNodes(leftFrontWheelId);
            initNodes(rightFrontWheelId);
            initNodes(leftBackWheelId);
            initNodes(rightBackWheelId);

            if (theta[head3Id] <= HEAD_THROTLE) {
                theta[head3Id] += 1;
                theta[leftUpperArmId2] += 2;
                theta[rightUpperArmId2] += 2;
                theta[leftFrontWheelId2] += 2;
                theta[rightFrontWheelId2] += 2;
                theta[rightBackWheelId2] += 2;
                initNodes(head3Id);
                initNodes(leftUpperArmId2);
                initNodes(rightUpperArmId2);
                initNodes(leftFrontWheelId2);
                initNodes(rightFrontWheelId2);
                initNodes(rightBackWheelId2);

            }
            torsoRotate -= 3;
            theta[torsoId] = torsoRotate;
            moveX += Math.sin((Math.PI * theta[torsoId])/180) ;
            moveZ += Math.cos((Math.PI * theta[torsoId])/180) ;

            initNodes(torsoId);
        }
    });
    
    document.addEventListener("keyup", (e) => {
        if (e.key == 'ArrowUp') {
            upKeyPressed = false;
        }

        if(e.key == 'ArrowRight'){
            rightKeyPressed = false;
        }

        if(e.key == 'ArrowLeft'){
            leftKeyPressed = false;
        }

        if(e.key == 'ArrowDown'){
            downKeyPressed = false;
            theta[head2Id] = 0;
            initNodes(head2Id);
        }

        if (e.key == 'ArrowRight' || e.key == 'ArrowLeft') {
            theta[head3Id] = 0;
            theta[leftUpperArmId2] = 0;
            theta[rightUpperArmId2] = 0;
            theta[leftUpperArmId2] = 0;
            theta[leftFrontWheelId2] = 0;
            theta[rightFrontWheelId2] = 0;
            theta[leftBackWheelId2] = 0;
            theta[rightBackWheelId2] = 0;

            theta[torsoRotate] =torsoRotate;
            initNodes(torsoRotate);
            initNodes(head3Id);
            initNodes(leftUpperArmId2);
            initNodes(rightUpperArmId2);
            initNodes(leftFrontWheelId2);
            initNodes(rightFrontWheelId2);
            initNodes(leftBackWheelId2);
            initNodes(rightBackWheelId2);
          
        }
    });
    
    for(let i=0; i<numNodes; i++) initNodes(i);

    render();
}

function ceremony() {
    if (theta[head3Id] >= -HEAD_THROTLE && space == true) {
        theta[head3Id] -= 1;
        theta[leftUpperArmId2] += 2;
        theta[rightUpperArmId2] += 2;

        initNodes(head3Id);
        initNodes(rightUpperArmId2);
        initNodes(leftUpperArmId2);

        if (theta[head3Id] <= -HEAD_THROTLE) {
            space = false;
        }
    } else if (theta[head3Id] <= HEAD_THROTLE && space == false) {
        theta[head3Id] += 1;
        theta[leftUpperArmId2] -= 2;
        theta[rightUpperArmId2] -= 2;

        initNodes(head3Id);
        initNodes(leftUpperArmId2);
        initNodes(rightUpperArmId2);

        if (theta[head3Id] >= HEAD_THROTLE) {
            space = true;
        }
    }
}


let render = function() {

    gl.clear( gl.COLOR_BUFFER_BIT );

    trackMove -= 0.01;
    let trackMoveMatrix = translate(0, 0, trackMove);
    backViewMatrix = mult(backViewMatrix, trackMoveMatrix)
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(backViewMatrix));
    trackMove = 0;

    // color setting
    gl.uniform4f(colorLoc,255/256 ,243/256 ,79/256, 0.2);
    // draw
    gl.drawArrays(gl.TRIANGLES,48,6);

    gl.uniform4f(colorLoc, 153/256, 56/256, 0.0, 1); !
    gl.drawArrays(gl.TRIANGLES, 54, 6*12*5); 

    let translateMatrix = translate(0.0,0.0,0.0);
    modelViewMatrix = mult(modelViewMatrix, translateMatrix); 
    gl.uniformMatrix4fv(modelViewMatrixLoc,false,flatten(modelViewMatrix));

    traverse(torsoId);


    requestAnimFrame(render);
}