import React, { Component, Fragment } from 'react';
import './App.css';
const ace = window.ace || undefined;
const Sk = window.Sk || undefined;
const download = document.getElementById('download')
const upload = document.getElementById('upload')
const uploadInput = document.getElementById('uploadInput')
const undo = document.getElementById('undo')
const redo = document.getElementById('redo')
const clear = document.getElementById('clear')
const run = document.getElementById('run')
const output = document.getElementById('output')
const canvas = document.getElementById('canvas')
const axisCanvas = document.getElementById('axisCanvas')
var editor = ace.edit("editor");
editor.setValue(
`import turtle
t = turtle.Turtle()
for c in ['#5899d0', '#d695d0', '#ff8b49', '#7eb984']:
    t.color(c)
    t.forward(100)
    t.left(90)
print('Python Web Editing!')`);
editor.setOptions({
  theme: 'ace/theme/tomorrow_night_eighties',
  mode: 'ace/mode/python',
  wrap: true,
  fontSize: 16,
})

class App extends Component {
  constructor(props) {
    super(props)
    this.imageData = null;
    this.bindEvent()
    this.drawAxis(axisCanvas, 400, 400)
  }
  download() {
    let content = editor.getValue()
    let fileName = 'python'
    let downLink = document.createElement('a');
    let blob = new Blob([content]);
    let url = URL.createObjectURL(blob, {type: 'text/x-python'});
    downLink.download = `${fileName}.py`;
    downLink.href = url;
    downLink.click();
    URL.revokeObjectURL(url);
  }
  upload(file, cb) {
    let content,reader = new FileReader();
    reader.onload = function(evt) {
      content = evt.target.result;
      cb && cb(content);
    };
    reader.readAsText(file);
  }
  runIt() {
    let value = editor.getValue()
    output.innerHTML = '';
    canvas.innerHTML = '';
    Sk.configure({ output: outf, read: builtinRead, python3: true });
    if (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})) {
      Sk.TurtleGraphics = {
        'target': 'canvas',
      }
    }
    let PyPromise = Sk.misceval.asyncToPromise(function () {
      return Sk.importMainWithBody("<stdin>", false, value, true);
    });
    PyPromise.then(function (mod) {
      // console.log('mod', mod)
    }, function (err) {
      let errArray = err.args.v;
      errArray.forEach(function (err, index) {
        output.innerHTML += `Error - ${index} : ${err.v || err}`
      })
      // console.log('err', err)
    })
    function outf(text) {
      output.innerHTML = output.innerHTML + text;
    }
    function builtinRead(x) {
      if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined){
        throw "File not found: '" + x + "'";
      }
      return Sk.builtinFiles["files"][x];
    }
  }
  getImageData(canvas) {
    const AXISCTX = canvas.getContext('2d');
    this.imageData = AXISCTX.getImageData(0, 0, canvas.width, canvas.height);
  }
  putImageData(canvas) {
    const AXISCTX = canvas.getContext('2d');
    this.imageData && AXISCTX.putImageData(this.imageData, 0, 0);
  }
  drawAxis(canvas, width, height) {
    canvas.width = width;
    canvas.height = height;
    const AXISCTX = canvas.getContext('2d');
    drawXYAxis(AXISCTX, width, height);
    drawGrid(AXISCTX, width, height);
    this.getImageData(canvas);
    function drawXYAxis(AXISCTX, width, height) {
      AXISCTX.beginPath();
      AXISCTX.strokeStyle = '#2d2d2d';
      AXISCTX.lineWidth = 2;
      AXISCTX.moveTo(0, height / 2);
      AXISCTX.lineTo(width, height / 2);
      AXISCTX.moveTo(width / 2, 0);
      AXISCTX.lineTo(width / 2, height);
      AXISCTX.stroke();
    }
    function drawGrid(AXISCTX, width, height) {
      AXISCTX.beginPath();
      AXISCTX.lineWidth = 1;
      AXISCTX.strokeStyle = '#dddede';
      AXISCTX.fillStyle = '#1e4863';
      AXISCTX.font = '12px Calibri';
      AXISCTX.textAlign = 'center';
      AXISCTX.textBaseline = 'middle';
      for (let i = 0, current = 0; current < width; i++) {
        let halfWidth = width / 2;
        let halfHeight = height / 2;
        current = halfWidth + 10 * i;
        if (Number.isInteger(i / 10) && i != 0) {
          AXISCTX.fillText(`${current - halfWidth}`, current, halfHeight);
          AXISCTX.fillText(`-${current - halfWidth}`, halfWidth - 10 * i, halfHeight);
        }
        AXISCTX.moveTo(current, 0);
        AXISCTX.lineTo(current, height);
        AXISCTX.moveTo(halfWidth - 10 * i, 0);
        AXISCTX.lineTo(halfWidth - 10 * i, height);
      }
      for (let i = 0, current = 0; current < height; i++) {
        let halfWidth = height / 2;
        current = halfWidth + 10 * i;
        if (Number.isInteger(i / 10) && i != 0) {
          AXISCTX.fillText(`-${current - halfWidth}`, halfWidth, current);
          AXISCTX.fillText(`${current - halfWidth}`, halfWidth, halfWidth - 10 * i);
        }
        AXISCTX.moveTo(0, current);
        AXISCTX.lineTo(width, current);
        AXISCTX.moveTo(0, halfWidth - 10 * i);
        AXISCTX.lineTo(width, halfWidth - 10 * i);
      }
      AXISCTX.stroke();
    }
    function clear(AXISCTX, width, height) {
      AXISCTX.clearRect(0, 0, width, height);
    }
  }
  drawCoords(canvas, coords) {
    const AXISCTX = canvas.getContext('2d');
    AXISCTX.fillStyle = '#1e4863';
    AXISCTX.font = '15px Calibri';
    AXISCTX.textAlign = 'center';
    AXISCTX.textBaseline = 'middle';
    this.putImageData(canvas);
    AXISCTX.fillText(
      `(${coords.x - canvas.width / 2}, ${canvas.height / 2 - coords.y})`,
      coords.x,
      coords.y
    );
  }
  bindEvent() {
    const self = this;
    download.onclick = function () {
      self.download()
      // console.log('download')
    }
    upload.onclick = function() {
      uploadInput.click();
      // console.log('upload')
    }
    undo.onclick = function () {
      editor.undo()
      // console.log('undo')
    }
    redo.onclick = function () {
      editor.redo()
      // console.log('redo')
    }
    clear.onclick = function () {
      editor.setValue('')
      // console.log('clear')
    }
    run.onclick = function () {
      self.runIt()
      // console.log('run')
    }
    uploadInput.oninput = function(e) {
      let file = e.target.files[0];
      self.upload(file, content => {
        editor.setValue(content)
        // console.log('content', content)
      })
      // console.log('oninput', e)
    }
    axisCanvas.onmousemove = function(e) {
      const params = {
        x: e.offsetX,
        y: e.offsetY
      }
      self.drawCoords(axisCanvas, params)
    }
    axisCanvas.onmouseout = function() {
      self.putImageData(axisCanvas);
    }
  }
  render() {
    return (
      <Fragment>
      </Fragment>
    )
  }
}

export default App;
