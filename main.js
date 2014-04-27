var context, zx, zy, h = window.innerHeight, w = window.innerWidth, len = h > w ? w : h;
var poly3d = [], poly2d = [], center2d = {x: w/2, y: h/2};
var yscale = len/1.10;
var dsin = Math.sin(Math.PI/100), dcos = Math.cos(Math.PI/100);
function main() {
	var div = document.createElement('canvas');
	div.height = h;
	div.width = w;
	document.body.innerHTML = '';
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
	document.onmouseup = mouseUp;	
	context.strokeStyle = '#ffa';
	context.fillStyle = '#ff5';
	for(var i = 0; i < 200; i++)addpt();
	printPoly();
	setInterval(auto, 40);
}
function touchStart(e){
	var t = e.touches[0];
	document.ontouchmove = touchMove;
	zx = t.clientX;
	zy = t.clientY;
	return false;
}
function touchMove(e){
	var t = e.touches[0];
	var x = t.clientX;
	var y = t.clientY;
	move(x - zx, y - zy);
	printPoly();
	zx = x;
	zy = y;
	return false;
}
function touchEnd(e){
	document.ontouchmove = null;
	return false;
}
function keyPress(e){
	var dir = e.which;
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
	zx = e.clientX;
	zy = e.clientY;
	document.onmousemove = mouseMove;
	return false;
}
function mouseMove(e){
	var x = e.clientX;
	var y = e.clientY;
	move(x - zx, y - zy);
	printPoly();
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
	full3dto2d();
	var l = poly3d.length;
	var t = Math.ceil(l/100);
	context.clearRect(0, 0, w, h);
	context.beginPath();
	for(var i = 0; i < l - 1; i++)
		for(var j = i + 1; j < l; j += t){
			context.moveTo(poly2d[i].x, poly2d[i].y);
			context.lineTo(poly2d[j].x, poly2d[j].y);
		}
	context.closePath();
	context.stroke();
}
function transform3dto2d(x, y, z){
	y += len;
	return {x: x/y * yscale + center2d.x, y: z/y * yscale + center2d.y};
}
function full3dto2d(){
	var l = poly3d.length;
	for(var i = 0; i < l; i++)
		poly2d[i] = transform3dto2d(poly3d[i].x, poly3d[i].y, poly3d[i].z);
}
function test(){
	for(var a in CanvasRenderingContext2D){
		document.write(a.toString());
	}
}

function downClick(){
	var l = poly3d.length;
	var d = {y: 0, z: 0};
	for(var i = 0; i < l; i++){
		d = rotateyz(poly3d[i].y, poly3d[i].z, -1);
		poly3d[i].y = d.y;
		poly3d[i].z = d.z;
	}
}
function leftClick(){
	var l = poly3d.length;
	var d = {x: 0, y: 0};
	for(var i = 0; i < l; i++){
		d = rotatexy(poly3d[i].x, poly3d[i].y, -1);
		poly3d[i].x = d.x;
		poly3d[i].y = d.y;
	}
}
function upClick(){
	var l = poly3d.length;
	var d = {y: 0, z: 0};
	for(var i = 0; i < l; i++){
		d = rotateyz(poly3d[i].y, poly3d[i].z, 1);
		poly3d[i].y = d.y;
		poly3d[i].z = d.z;
	}
}
function rightClick(){
	var l = poly3d.length;
	var d = {x: 0, y: 0};
	for(var i = 0; i < l; i++){
		d = rotatexy(poly3d[i].x, poly3d[i].y, 1);
		poly3d[i].x = d.x;
		poly3d[i].y = d.y;
	}
}
function rotatexy(x, y, dir){
	return rotate(x, y, dir);
}
function rotateyz(y, z, dir){
	var t = rotate(y, z, dir);
	return {y: t.x, z: t.y};
}
function move(dx, dy){
	dx /= 2;
	dy /= 2;
	var dir = {
		x: dx / Math.abs(dx), 
		y: dy / Math.abs(dy)
	};
	if(dir.x == 1) 
		for(var i = dx; i > 0; i--) rightClick();
	else
		for(var i = -dx; i > 0; i--) leftClick();
	if(dir.y == 1)
		for(var i = dy; i > 0; i--) downClick();
	else
		for(var i = -dy; i > 0; i--) upClick();
}
function rotate(x, y, dir){
	var y1 = y*dcos + dir*x*dsin;
	var x1 = x*dcos - dir*y*dsin;
	return {x: x1, y: y1};
}
function addpt(){
	var l = poly3d.length;
	var a = Math.random()*2*Math.PI;
	var r = len/2;
	var q = Math.random()*2*Math.PI;
	poly3d[l] = {};
	poly3d[l].x = Math.cos(a)*Math.sin(q)*r;
	poly3d[l].y = Math.sin(a)*Math.sin(q)*r;
	poly3d[l].z = Math.cos(q)*r;
}
function auto(){
	leftClick();
	printPoly();
}