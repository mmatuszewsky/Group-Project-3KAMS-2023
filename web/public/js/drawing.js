//consts
const canvas = document.getElementById("map");
const ctx = canvas.getContext("2d");
const TILE_SIZE = 4;

const colors = {
    sea: '#085193',
    grass: '#004300',
    forest: '#003101',
    dirt: '#513a08'
}

// global state
const GRID = [];
let isHeld = false;
let lastMousePos = null;
let currentColor = colors.grass;
let brushSize = 4;

const createGrid = () => {
    for(let y = 0; y < 128; y++) {
        for(let x = 0; x < 128; x++) {
            const tile = {
                x: x * TILE_SIZE,
                y: y * TILE_SIZE
            };
            GRID.push(tile);
        }
    }
}

const drawGrid = color => {
    if(!color) {
        color = colors.sea;
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
    const x = Math.abs(Math.floor(pos.x / TILE_SIZE));
    const y = Math.abs(Math.floor(pos.y / TILE_SIZE));
    const tilePosInArray = y * 128 + x;
    return GRID[tilePosInArray];
}

const drawOnClick = e => {
    const pos = getMousePos(e);
    const tile = getTileBasedOnMousePos(pos);
    ctx.fillStyle = currentColor;
    ctx.fillRect(tile.x, tile.y, TILE_SIZE, TILE_SIZE);
}

const drawLine = (x0, y0, x1, y1) => {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = (x0 < x1) ? 1 : -1;
    const sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;
    
    while(true) {
        const tile = getTileBasedOnMousePos({x:x0, y:y0});
        ctx.fillStyle = currentColor;
        ctx.fillRect(tile.x, tile.y, brushSize, brushSize);
    
        if ((x0 === x1) && (y0 === y1)) break;
        let e2 = 2*err;
        if (e2 > -dy) { err -= dy; x0  += sx; }
        if (e2 < dx) { err += dx; y0  += sy; }
    }
}

const draw = e => {
    const pos = getMousePos(e);
    const startTile = getTileBasedOnMousePos(lastMousePos);
    const endTile = getTileBasedOnMousePos(pos);
    if(startTile && endTile) {
        drawLine(startTile.x, startTile.y, endTile.x, endTile.y);
    }
}

canvas.addEventListener('mousedown', e => {
    isHeld = true;
    lastMousePos = getMousePos(e);
    drawOnClick(e);
});

canvas.addEventListener('mousemove', e => {
    if(isHeld) {
        draw(e);
        lastMousePos = getMousePos(e);
    }
})

canvas.addEventListener('mouseup', e => {
    isHeld = false;
    lastMousePos = null;
});

canvas.addEventListener('mouseout', e => {
    isHeld = false;
    lastMousePos = null;
});

const updateColor = color => {
    currentColor = color;
}

const updateBrushSize = size => {
    brushSize = size;
}

const initDrawing = color => {
    createGrid();
    drawGrid(colors.sea);
    updateColor(color);
}

export { initDrawing, updateColor, drawGrid, updateBrushSize, colors }