//consts
const canvas = document.querySelector('#map');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const generatedMap = document.querySelector('#generated-map');
const TILE_SIZE = 2;
const MAP_SIZE = 256;
const MODES = {
    aboveground: 'aboveground',
    underground: 'underground'
};

const colors = {
    water: '#085294',
    dirt: '#523908',
    sand: '#dece8c',
    grass: '#004200',
    snow: '#b5c6c6',
    swamp: '#4a846b',
    rough: '#847331',
    lava: '#4a4a4a',
    rock: '#000000',
    neutral: '#848484',
    red: '#ff0000',
    blue: '#3152ff',
    tan: '#9c7352',
    green: '#429429',
    orange: '#ff8400',
    purple: '#8c29a5',
    teal: '#089ca5',
    pink: '#c67b8c'
}

const obstacleColors = {
    water: '#00296b',
    dirt: '#392908',
    sand: '#a59c6b',
    grass: '#003100',
    snow: '#8c9c9c',
    swamp: '#215a42',
    rough: '#635221',
    lava: '#292929',
    rock: '#000000'
}

// global state
const GRID = [];
let isHeld = false;
let lastMousePos = null;
let currentColor = colors.grass;
let obstacleColor = obstacleColors.grass;
let isDrawingObstacle = false;
let brushSize = 32;
let currentMode = MODES.aboveground;

const minmax = value => {
    value = (value < 0) ? 0 : value;
    value = (value > MAP_SIZE - 1) ? MAP_SIZE - 1 : value;
    return value;
}

const createGrid = () => {
    for (let y = 0; y < MAP_SIZE; y++) {
        for (let x = 0; x < MAP_SIZE; x++) {
            const tile = {
                x: x * TILE_SIZE,
                y: y * TILE_SIZE
            };
            GRID.push(tile);
        }
    }
}

const drawGrid = color => {
    if (!color) {
        color = colors.water;
    }

    GRID.forEach(tile => {
        ctx.fillStyle = color;
        ctx.fillRect(tile.x, tile.y, TILE_SIZE, TILE_SIZE);
    })
}

const getMousePos = e => {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

const getTileBasedOnMousePos = pos => {
    const x = minmax(Math.floor(pos.x / TILE_SIZE));
    const y = minmax(Math.floor(pos.y / TILE_SIZE));
    const tilePosInArray = y * MAP_SIZE + x;
    return GRID[tilePosInArray];
}

const drawRect = tile => {
    ctx.fillStyle = (isDrawingObstacle) ? obstacleColor : currentColor;
    ctx.fillRect(tile.x - brushSize / 2, tile.y - brushSize / 2, brushSize, brushSize);
}

const drawOnClick = e => {
    const pos = getMousePos(e);
    const tile = getTileBasedOnMousePos(pos);
    drawRect(tile);
}

const drawLine = (x0, y0, x1, y1) => {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = (x0 < x1) ? 1 : -1;
    const sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    while (true) {
        const tile = getTileBasedOnMousePos({ x: x0, y: y0 });
        drawRect(tile);

        if ((x0 === x1) && (y0 === y1)) break;
        let e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x0 += sx; }
        if (e2 < dx) { err += dx; y0 += sy; }
    }
}

const draw = e => {
    if (!lastMousePos) {
        lastMousePos = getMousePos(e);
        return;
    }
    const pos = getMousePos(e);
    const startTile = getTileBasedOnMousePos(lastMousePos);
    const endTile = getTileBasedOnMousePos(pos);
    if (startTile && endTile) {
        drawLine(startTile.x, startTile.y, endTile.x, endTile.y);
    }
}

canvas.addEventListener("contextmenu", e => {
    e.preventDefault();
});

canvas.addEventListener('mousedown', e => {
    isHeld = true;
    if (e.button === 2) {
        isDrawingObstacle = true;
    } else {
        isDrawingObstacle = false;
    }
    lastMousePos = getMousePos(e);
    drawOnClick(e);
});

canvas.addEventListener('mousemove', e => {
    if (isHeld) {
        draw(e);
        lastMousePos = getMousePos(e);
    }
})

let send = true;
canvas.addEventListener('mouseup', e => {
    if (send) {
        setTimeout(()=>{
            sendImage();
            send = true;
        }, 1000);
    }

    send = false;
});

window.addEventListener('mouseup', e => {
    isHeld = false;
    lastMousePos = null;
});

canvas.addEventListener('mouseout', e => {
    // isHeld = false;
    lastMousePos = null;
});

const sendImage = async () => {
    const response = await fetch(`http://localhost:3000/generate/${currentMode}`, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({file: canvas.toDataURL('image/jpeg')})
    });

    if (response.ok) {
        const data = await response.blob();
        renderImage(data);
    } else {
        console.log(response);
    }
}

const renderImage = img => {
    const imageUrl = URL.createObjectURL(img);
    generatedMap.classList.remove('d-none');
    generatedMap.src = imageUrl;
}

const updateColor = color => {
    currentColor = colors[color];
    obstacleColor = (obstacleColors[color] !== null) ? obstacleColors[color] : colors[color];
}

const updateBrushSize = size => {
    brushSize = size;
}

const initDrawing = color => {
    createGrid();
    drawGrid(colors.water);
    updateColor(color);
}

const changeMode = () => {
    if (currentMode !== MODES.underground) {
        const headers1 = document.querySelectorAll('h1');
        const headers5 = document.querySelectorAll('h5');
        const spans = document.querySelectorAll('span');
        headers1.forEach(element => {
            element.classList.add('text-white');
        });
        
        headers5.forEach(element => {
            element.classList.add('text-white');
        });

        spans.forEach(element => {
            element.classList.add('text-white');
        });

        drawGrid(colors.rock);
        currentMode = MODES.underground;
    } else {
        const headers1 = document.querySelectorAll('h1');
        const headers5 = document.querySelectorAll('h5');
        const spans = document.querySelectorAll('span');
        headers1.forEach(element => {
            element.classList.remove('text-white');
        });
        
        headers5.forEach(element => {
            element.classList.remove('text-white');
        });

        spans.forEach(element => {
            element.classList.remove('text-white');
        });

        drawGrid(colors.sea);
        currentMode = MODES.aboveground;
    }
    return currentMode;
}

const getFillColor = () => {
    return currentMode === MODES.aboveground ? colors.sea : colors.rock;
}

export { initDrawing, updateColor, drawGrid, updateBrushSize, colors, changeMode, getFillColor }