var context, zx, zy, color, 
	h = window.innerHeight, 
	w = window.innerWidth;
var len = h > w ? w : h;
var grid = [];
var field = [];
var dsin = Math.sin(Math.PI/100), dcos = Math.cos(Math.PI/100);
var poly = [];
var center2d = {x: w/2, y: h/2};
var visualcenter = {x: len/2, y: len/2, z: len/2};
var yscale = len/1;
var visualcenter2d = {x: -0.5*yscale, y: -0.5*yscale};
		
	//try{}catch(e){document.write(e);}
function main() {
	var div = document.createElement('canvas');
	div.height = h;
	div.width = w;
	document.body.appendChild(div);
	document.body.style.background = '#000';
	div.style.position = 'absolute';
	div.style.top = '0';
	div.style.left = '0';
	context = div.getContext('2d');
	document.ontouchstart = touchStart;
	document.ontouchend = touchEnd;
	document.onkeydown = keyPress;
	document.onmousedown = mouseDown;
	//document.onmousemove = mouseMove;
	document.onmouseup = mouseUp;	
	context.strokeStyle = '#ffa';
	context.fillStyle = '#ff5';
	for(var i = 0; i < 10000; i++)addpt();
	printPoly();
	setInterval(auto, 40);
}
function touchStart(e){
	var t = e.touches[0];
	zx = t.clientX;
	zy = t.clientY;
	return false;
}
function touchEnd(e){
	var t = e.touches[0];
	var dir = getDirection(t.clientX - zx, t.clientY - zy);
	doAction(dir);
	return false;
}
function keyPress(e){
	var dir = e.which;
	//document.write(dir);
	switch(dir){
		case 39:case 76:case 68:case 100: dir = 1; break; // Right
		case 38:case 75:case 87:case 119: dir = 2; break; // Up
    	case 37:case 72:case 65:case 97: dir = 3; break; // Left
    	case 40:case 74:case 83:case 115: dir = 4; break; // Down
		default: return true;
	}
	doAction(dir);
	return false;
}
function mouseDown(e){
	document.onmousemove = mouseMove;
	zx = e.clientX;
	zy = e.clientY;
	return false;
}
function mouseMove(e){
	var x = e.clientX;
	var y = e.clientY;
	var dir = {x: 0, y: 0};
	dir.x = x - zx;
	dir.x /= Math.abs(dir.x);
	dir.y = y - zy;
	dir.y /= Math.abs(dir.y);
	for(var t = 0; t <= 100; t++){
		
	}
	
	
	zx = x;
	zy = y;
	return false;
}
function mouseUp(e){
	document.onmousemove = null;
	return false;
}
function getDirection(dx, dy){
	var l, r, u, d;
	if(dx < 0) l = 1;
	else r = 1;
	if(dy < 0) u = 1;
	else d = 1;
	dx *= l ? -1 : 1;
	dy *= u ? -1 : 1;
	if(dx == dy) return 0;
	if(dx > dy) {u = d = 0;}
	else {l = r = 0;}
	return r ? 1 : u ? 2 : l ? 3 : 4; // r u l d
}
function doAction(act){
	switch(act){
		case 1: rightClick(); break;
		case 2: upClick(); break;
		case 3: leftClick(); break;
		case 4: downClick();
	}
	printPoly();
}
function printPoly() {
	var l = poly.length;
	var d = {};
	context.clearRect(0, 0, w, h);
	context.beginPath();
	d.x = poly[0].x - visualcenter.x;
	d.y = poly[0].y - visualcenter.y;
	d.z = poly[0].z - visualcenter.z;
	d = transform3dto2d(d.x, d.y, d.z);
	d.x += center2d.x + visualcenter2d.x;
	d.y += center2d.y + visualcenter2d.y;
	context.moveTo(d.x, d.y);
	for(var i = 1; i < l; i++){
		d.x = poly[i].x - visualcenter.x;
		d.y = poly[i].y - visualcenter.y;
		d.z = poly[i].z - visualcenter.z;
		d = transform3dto2d(d.x, d.y, d.z);
		d.x += center2d.x + visualcenter2d.x;
		d.y += center2d.y + visualcenter2d.y;
		context.lineTo(d.x, d.y);
	}
	context.closePath();
	context.stroke();
	//context.fill();
}
function transform3dto2d(x, y, z){
	y += len;
	return {x: x/y * yscale, y: z/y * yscale};
}
function test(){
	for(var a in CanvasRenderingContext2D){
		document.write(a.toString());
	}
}

function downClick(){
}
function leftClick(){
	var l = poly.length;
	var d = {x: 0, y: 0};
	for(var i = 0; i < l; i++){
		d.x = poly[i].x - center2d.x;
		d.y = poly[i].y - center2d.y;
		d = rotatem(d.x, d.y);
		poly[i].x = d.x + center2d.x;
		poly[i].y = d.y + center2d.y;
	}
}
function upClick(){
}
function rightClick(){
	var l = poly.length;
	var d = {x: 0, y: 0};
	for(var i = 0; i < l; i++){
		d.x = poly[i].x - center2d.x;
		d.y = poly[i].y - center2d.y;
		d = rotatep(d.x, d.y);
		poly[i].x = d.x + center2d.x;
		poly[i].y = d.y + center2d.y;
	}
}
function rotatep(x, y){
	var r = Math.sqrt(x*x+y*y);
	var sina = y/r;
	var cosa = x/r;
	var sinad = sina*dcos+cosa*dsin;
	var cosad = cosa*dcos-sina*dsin;
	return {x: r*cosad, y: r*sinad};
}
function rotatem(x, y){
	var r = Math.sqrt(x*x+y*y);
	var sina = y/r;
	var cosa = x/r;
	var sinad = sina*dcos-cosa*dsin;
	var cosad = cosa*dcos+sina*dsin;
	return {x: r*cosad, y: r*sinad};
}
function addpt(){
	var l = poly.length;
	var a = Math.random()*2*Math.PI;
	var r = len/2;
	var q = Math.random()*2*Math.PI;
	poly[l] = {};
	poly[l].x = Math.cos(a)*Math.sin(q)*r+visualcenter.x;
	poly[l].y = Math.sin(a)*Math.sin(q)*r+visualcenter.y;
	poly[l].z = Math.cos(q)*r+visualcenter.z;
}
function auto(){
	leftClick();
	printPoly();
}