function distance(a, b) {
    return Math.pow(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2), 0.5);
    // return Math.pow(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2), 0.45);
}
// const textColor = "#fff";
const textColor = "#333";
// const colors = ['#6f9db1', '#FFF143', '#ffc107', '#F00056'];
// const colors = ['#ffc107', '#F00056',"#a1317f"];  //d970a5
const colors = ["#e42a66","#ffc107","#7ea25d"] //#eeaf61//#7a98d6
// const colors = ['#ffc107',"#F26A44","#EC1B4B"];
// const colors_leaf = ['#56a6bb','#85B1B1','#95a95e']; //, '#85B1B1' #56a6bb,'#95a95e' #9bb34c
const colors_leaf = ['#ffc107','#7ea25d'];
const color = chroma
    .scale(colors)
    .nodata('#000')
const color_leaf = chroma
    .scale(colors_leaf)
    .nodata('#000')
const regionorder = [
    "America North",
    // "America Latin and Caribbean",
    "Central America",
    "Caribbean",
    "South America",
    "Europe South",
    "Europe West",
    "Europe North",
    "Europe East",
    "Western Africa",
    "Africa North",
    // "Africa Sub-Sahara",
    "Middle Africa",
    "Southern Africa",
    "Eastern Africa",
    "Asia West",
    "Asia Central",
    "Asia South",
    "Asia East",
    "Asia South-East",
    "Australia and New Zealand",
    "Micronesia",
    "Melanesia",
    "Polynesia",
]

function Scrubber(values, {
  format = value => value,
  initial = 0,
  delay = null,
  autoplay = true,
  loop = true,
  loopDelay = null,
  alternate = false
} = {}) {
  values = Array.from(values);

  const form = document.createElement('form');
  form.style.font = '12px var(--Poppins)';
  form.style.fontVariantNumeric = 'tabular-nums';
  form.style.display = 'flex';
  form.style.height = '33px';
  form.style.alignItems = 'center';

  const button = document.createElement('button');
  button.name = 'b';
  button.id = 'btn-year';
  button.type = 'button';
  button.style.marginRight = '0.4em';
  button.style.width = '5em';
  button.style.fontSize = '14px';
  
  form.appendChild(button);

  const label = document.createElement('label');
  label.style.display = 'flex';
  label.style.alignItems = 'center';

  const input = document.createElement('input');
  input.name = 'i';
  input.type = 'range';
  input.min = 0;
  input.max = values.length - 1;
  input.value = initial;
  input.step = 1;
  input.style.width = '100px';
  label.appendChild(input);

  const output = document.createElement('output');
  output.name = 'o';
  output.style.marginLeft = '0.4em';
  label.appendChild(output);
  form.appendChild(label);

  let frame = null;
  let timer = null;
  let interval = null;
  let direction = 1;
  function start() {
    form.b.textContent = "Pause";
    if (delay === null) frame = requestAnimationFrame(tick);
    else interval = setInterval(tick, delay);
  }
  function stop() {
    form.b.textContent = "Play";
    if (frame !== null) cancelAnimationFrame(frame), frame = null;
    if (timer !== null) clearTimeout(timer), timer = null;
    if (interval !== null) clearInterval(interval), interval = null;
  }
  function running() {
    return frame !== null || timer !== null || interval !== null;
  }
  function tick() {
    if (form.i.valueAsNumber === (direction > 0 ? values.length - 1 : direction < 0 ? 0 : NaN)) {
      if (!loop) return stop();
      if (alternate) direction = -direction;
      if (loopDelay !== null) {
        if (frame !== null) cancelAnimationFrame(frame), frame = null;
        if (interval !== null) clearInterval(interval), interval = null;
        timer = setTimeout(() => (step(), start()), loopDelay);
        return;
      }
    }
    if (delay === null) frame = requestAnimationFrame(tick);
    step();
  }
  function step() {
    form.i.valueAsNumber = (form.i.valueAsNumber + direction + values.length) % values.length;
    form.i.dispatchEvent(new CustomEvent("input", {bubbles: true}));
  }
  form.i.oninput = event => {
    if (event && event.isTrusted && running()) stop();
    form.value = values[form.i.valueAsNumber];
    form.o.value = format(form.value, form.i.valueAsNumber, values);
  };
  form.b.onclick = () => {
    if (running()) return stop();
    direction = alternate && form.i.valueAsNumber === values.length - 1 ? -1 : 1;
    form.i.valueAsNumber = (form.i.valueAsNumber + direction) % values.length;
    form.i.dispatchEvent(new CustomEvent("input", {bubbles: true}));
    start();
  };
  form.i.oninput();
  if (autoplay) start();
  else stop();
  form.addEventListener('dispose', () => {
    stop();
  });
  form.dispatchEvent(new CustomEvent('dispose'));
  return form;
}


function highlightNode(dom, selectedNode) {
  const selectedNodeId = selectedNode.data.id;
  dom.selectAll(".node").each(function (d) {
    // console.log(d.data)
    const node = d3.select(this);
    if (d.data.id === selectedNodeId) {
      node.classed("selected", true);
    } else {
      node.classed("faded", true);
    }
  });

  dom.selectAll(".branch").each(function (d) {
    const branch = d3.select(this);
    if (d.data.id === selectedNode.parent.data.id) {
      branch.classed("selected", true);
    } else {
      branch.classed("faded", true);
    }
  });
  dom.selectAll(".trunks").each( function (d){
    const trunk = d3.select(this);
    trunk.classed("faded", true);
  })
  dom.selectAll(".roots").each( function (d){
    const root = d3.select(this);
    root.classed("faded", true);
  })
}

function highlightNodeById(dom, nodeId) {
  // dom.selectAll('.tree-legend').remove();
  // dom.selectAll('.treeroot-legend').remove();
  const selectedNode = dom.select(`.leaf-${nodeId}`);
  if (selectedNode.empty()) {
    alert("Country not found.")
  } else {
    highlightNode(dom, selectedNode.datum()); 
  }
}

const dur = 700;
const wait_dur = 22;