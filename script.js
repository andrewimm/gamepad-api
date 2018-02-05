(function() {
const gamepadState = [];
const vizEmpty = document.getElementById('viz-empty');
const vizTable = document.getElementById('viz-table');
const vizTableRows = [];

function attachGamepad(gamepad) {
  for (let i = 0; i < gamepadState.length; i++) {
    if (gamepadState[i].index === gamepad.index) {
      return;
    }
  }
  const row = createGamepadViz(gamepad);
  gamepadState.push({
    row: row,
    id: gamepad.id,
    index: gamepad.index,
  });
  vizTable.appendChild(row);
  vizEmpty.style.display = 'none';
  vizTable.style.display = 'block';
}
function updateGamepads() {
  const gamepads = navigator.getGamepads();
  for (let i = 0; i < gamepadState.length; i++) {
    const gamepad = gamepads[gamepadState[i].index];
    if (!gamepad) {
      continue;
    }
    const row = gamepadState[i].row;
    const buttons = row._buttons;
    const axes = row._axes;
    for (let j = 0; j < gamepad.buttons.length; j++) {
      let className = 'gamepad-viz-button';
      if (gamepad.buttons[j].touched) {
        className += ' touched';
      }
      if (gamepad.buttons[j].pressed) {
        className += ' pressed';
      }
      buttons[j].className = className;
    }
    for (let j = 0; j < gamepad.axes.length; j++) {
      const value = gamepad.axes[j];
      const prev = value >= 0 ? '50%' : ((value + 1) * 50) + '%';
      axes[j].style.marginLeft = prev;
      axes[j].style.width = (Math.abs(value) * 50) + '%';
    }
  }
  setTimeout(updateGamepads, 100);
}
function detachGamepad(gamepad) {
  for (let i = 0; i < gamepadState.length; i++) {
    if (gamepadState[i].index === gamepad.index) {
      const row = gamepadState[i].row;
      row.parentNode.removeChild(row);
      gamepadState.splice(i, 1);
      break;
    }
  }
  if (gamepadState.length === 0) {
    vizEmpty.style.display = 'block';
    vizTable.style.display = 'none';
  }
}
function createGamepadViz(gamepad) {
  const viz = document.createElement('div');
  viz.className = 'gamepad-viz';
  const idRow = document.createElement('div');
  idRow.className = 'gamepad-viz-row';
  const idLabel = document.createElement('div');
  idLabel.appendChild(document.createTextNode('id'));
  idLabel.className = 'gamepad-viz-label';
  const idValue = document.createElement('div');
  idValue.appendChild(document.createTextNode(gamepad.id));
  idValue.className = 'gamepad-viz-value';
  idRow.appendChild(idLabel);
  idRow.appendChild(idValue);
  viz.appendChild(idRow);

  if (gamepad.mapping) {
    const mappingRow = document.createElement('div');
    mappingRow.className = 'gamepad-viz-row';
    const mappingLabel = document.createElement('div');
    mappingLabel.appendChild(document.createTextNode('mapping'));
    mappingLabel.className = 'gamepad-viz-label';
    const mappingValue = document.createElement('div');
    mappingValue.appendChild(document.createTextNode(gamepad.mapping));
    mappingValue.className = 'gamepad-viz-value';
    mappingRow.appendChild(mappingLabel);
    mappingRow.appendChild(mappingValue);
    viz.appendChild(mappingRow);
  }

  const buttonRow = document.createElement('div');
  buttonRow.className = 'gamepad-viz-row';
  const buttonLabel = document.createElement('div');
  buttonLabel.appendChild(document.createTextNode('buttons'));
  buttonLabel.className = 'gamepad-viz-label';
  const buttonValue = document.createElement('div');
  const buttons = [];
  for (let i = 0; i < gamepad.buttons.length; i++) {
    const button = document.createElement('span');
    button.className = 'gamepad-viz-button';
    button.appendChild(document.createTextNode(String(i)));
    buttonValue.appendChild(button);
    buttons[i] = button;
  }
  buttonValue.className = 'gamepad-viz-value';
  buttonRow.appendChild(buttonLabel);
  buttonRow.appendChild(buttonValue);
  viz.appendChild(buttonRow);
  viz._buttons = buttons;

  const axesRow = document.createElement('div');
  axesRow.className = 'gamepad-viz-row';
  const axesLabel = document.createElement('div');
  axesLabel.appendChild(document.createTextNode('axes'));
  axesLabel.className = 'gamepad-viz-label';
  const axes = [];
  const axesValue = document.createElement('div');
  for (let i = 0; i < gamepad.axes.length; i++) {
    const axis = document.createElement('div');
    axis.className = 'gamepad-viz-axis';
    const axisInner = document.createElement('div');
    axis.appendChild(axisInner);
    axesValue.appendChild(axis);
    axes.push(axisInner);
  }
  axesValue.className = 'gamepad-viz-value';
  axesRow.appendChild(axesLabel);
  axesRow.appendChild(axesValue);
  viz.appendChild(axesRow);
  viz._axes = axes;
  
  return viz;
}

window.addEventListener('gamepadconnected', (e) => {
  attachGamepad(e.gamepad);
});
window.addEventListener('gamepaddisconnected', (e) => {
  detachGamepad(e.gamepad);
});
const initialGamepads = navigator.getGamepads();
for (let i = 0; i < initialGamepads.length; i++) {
  if (initialGamepads[i]) {
    attachGamepad(initialGamepads[i]);
  }
}
updateGamepads();

})();