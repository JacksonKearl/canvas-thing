// https://www.html5rocks.com/en/tutorials/canvas/hidpi/
const setupCanvas = (canvas) => {
  // Get the device pixel ratio, falling back to 1.
  var dpr = window.devicePixelRatio || 1;
  // Get the size of the canvas in CSS pixels.
  var rect = canvas.getBoundingClientRect();
  // Give the canvas pixel dimensions of their CSS
  // size * the device pixel ratio.
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  var ctx = canvas.getContext('2d');
  // Scale all drawing operations by the dpr, so you
  // don't have to worry about the difference.
  ctx.scale(dpr, dpr);
  return ctx;
}
/** @type {HTMLCanvasElement} */
var canvas = document.getElementById('plot')
var ctx = setupCanvas(canvas)

var urlParams = new URL(window.location).searchParams
const start = parseInt(urlParams.get('start') ?? 'FFFF00', 16)
const end = parseInt(urlParams.get('end') ?? '0000FF', 16)
const randByChannel = urlParams.get('byChannel')
console.log(randByChannel === 'true')
const weightedRand = (weight) => Math.random() < weight ? 0 : 1
const render = () => {
  var ctx = setupCanvas(canvas)
  var imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height)
  var imgdatalen = imgdata.data.length

  for (var i = 0; i < imgdatalen / 4; i++) {  //iterate over every pixel in the canvas
    const percWidth = ((i) % canvas.width) / canvas.width
    if (randByChannel === 'true') {
      imgdata.data[4 * i + 0] = ((weightedRand(percWidth) ? start : end) & 0xFF0000) >> 16
      imgdata.data[4 * i + 1] = ((weightedRand(percWidth) ? start : end) & 0x00FF00) >> 8
      imgdata.data[4 * i + 2] = ((weightedRand(percWidth) ? start : end) & 0x0000FF) >> 0
    } else {
      const rand = weightedRand(percWidth)
      imgdata.data[4 * i + 0] = ((rand ? start : end) & 0xFF0000) >> 16
      imgdata.data[4 * i + 1] = ((rand ? start : end) & 0x00FF00) >> 8
      imgdata.data[4 * i + 2] = ((rand ? start : end) & 0x0000FF) >> 0
    }

    imgdata.data[4 * i + 3] = 255
  }
  ctx.putImageData(imgdata, 0, 0)
}
render()
window.addEventListener("resize", render)