let cursor = null;

export function InitializeCursor() {
  // This element will be moved across the screen by hand movements.
  cursor = document.createElement('div');
  cursor.style.width = '20px';
  cursor.style.height = '20px';
  cursor.style.backgroundColor = 'blue';
  cursor.style.position = 'fixed';
  cursor.style.top = '100px';
  cursor.style.left = '100px';
  document.body.appendChild(cursor);
}

export function SetCursorVisibility(visible) {
  if (!visible) {
    cursor.style.display = 'none';
  } else {
    cursor.style.display = 'block';
  }
}

export function SetCursorColor(color) {
  cursor.style.backgroundColor = color;
}

export function SetCursorPosition(left, top) {
  cursor.style.top = `${window.innerHeight * top}px`;
  cursor.style.left = `${window.innerWidth * left}px`;
}

export function SimulateClick() {
  // do not repeat clicks
  if (cursor.style.backgroundColor !== 'green') {
    const cursorProperties = cursor.getBoundingClientRect();
    const elements = document.elementsFromPoint(
      cursorProperties.x,
      cursorProperties.y,
    );
    elements[1].click(); // click second element at this pos. 1st is the block itself.
  }
}
