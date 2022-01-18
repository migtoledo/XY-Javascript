// Screen dimensions
const WIDTH = 256
const HEIGHT = 256

// Create the panel1 canvas and context
var panel1 = document.createElement('canvas');
var ctx1 = panel1.getContext('2d');
panel1.height = HEIGHT;
panel1.width = WIDTH;
//ctx1.globalAlpha = 0.5;
document.body.appendChild(panel1);

// Create the back buffer panel2 and context
var panel2 = document.createElement('canvas');
var ctx2 = panel1.getContext('2d');
//ctx2.globalAlpha = 0.5;
panel2.height = HEIGHT;
panel2.width = WIDTH;

var Transparency = 0.9;

function setAlpha(ctx, alpha) {
    ctx.globalAlpha = alpha;
}

var LEFT = WIDTH / 100;
var TOP = HEIGHT / 100;

var OXX = WIDTH / 2;
var OYY = HEIGHT / 2;
// XY scale pixels/unit
var exy = 250;
var ex = exy;
var ey = exy;
/// From math space -> screenbuffer space
function xx(x) {
    return (OXX + x * ex);
}
function yy(y) {
    return (OYY - y * ey);
}
/// From screenbuffer space -> math space
function __x(xx) {
    return (xx - OXX) / ex;
}
function __y(yy) {
    return (OYY - yy) / ey;
}

var x0 = 0;
var y0 = 0;

var nloop = 0;
var t = 0;
var dt = 10;
var dts = dt / 1000;
var ts = 0;

function update_ts() {
    ts = t / 1000;
    return ts;
}

function _ts() {
    return update_ts();
}

function drawT(ctx, xx, yy) {
    ctx.font = "16px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText("n: " + nloop + " t: " + _ts() + " s ", xx, yy);
}

var xxtext = 0;
var yytext = 0;
var text = 0;
var ntext = 0;
function drawnums(ctx) {
    ctx.globalAlpha = Transparency;
    ntext++;
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";

    if (ntext == 1) {
        xxtext = LEFT;
        yytext = TOP + 20;
    }

    xxtext += 4;

    if (xxtext > WIDTH - LEFT - 40) {
        xxtext = LEFT;
        yytext += 10;
    }

    if (yytext > HEIGHT - TOP - 20) yytext = TOP + 20;

    //text = " " + Math.sin(ntext) + Math.random(1) + " ";

    text = "  " + String.fromCodePoint(0x2B50) + "  " + ntext + "  " + String.fromCodePoint(0x2B50) + "  ";

    ctx.fillText(text, xxtext, yytext);
}

/// MOUSE FUNCTIONS

var XXMouse = 0;
var YYMouse = 0;
var XMouse = 0;
var YMouse = 0;

// Get the position of the mouse relative to the canvas
function getMousePos(canvasDom, mouseEvent) {
    var rect = canvasDom.getBoundingClientRect();
    return {
        xx: mouseEvent.clientX - rect.left,
        yy: mouseEvent.clientY - rect.top
    };
}
function getmouseXXYY(event) {
    return getMousePos(panel1, event);
}
panel1.addEventListener('mousemove', e => {
    var pos = getmouseXXYY(e);

    XXMouse = pos.xx;
    YYMouse = pos.yy;

    XMouse = __x(pos.xx);
    YMouse = __y(pos.yy);
});

function showMouseScreenXY(ctx, xx, yy) {
    ctx.font = "16px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText("XX: " + XXMouse + " YY: " + YYMouse, xx, yy);
}

function showMouseMathXY(ctx, xx, yy) {
    ctx.font = "16px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText("X: " + XMouse + " Y: " + YMouse, xx, yy);
}

function render(ctx) {
    // Set the transparency
    setAlpha(ctx, Transparency);
    ctx.globalAlpha = Transparency;
    // clear the canvas buffer
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.globalAlpha = Transparency;
    // Draw on the canvas buffer
    drawnums(ctx);
    drawT(ctx, 0, TOP + 10);
    showMouseScreenXY(ctx, 0, TOP + 40);
    showMouseMathXY(ctx, 0, TOP + 60);
}

function loop() {
    nloop++;
    t += dt;
    if (nloop == 1) t = 0;
    // render into back buffer
    render(ctx2);
    // flip buffers
    ctx1.globalAlpha = Transparency;
    ctx1.drawImage(panel2, 0, 0);

    //loop();
    setTimeout(loop, dt);
}

function resetloops() {
    nloop = 0;
    t = 0;
    ts = 0;
}

function start() {
    loop();
}

start();