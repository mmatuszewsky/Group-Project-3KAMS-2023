import { initDrawing, updateColor, drawGrid, updateBrushSize, colors } from './drawing.js';

window.onload = () => {
    initDrawing(colors.grass);
}

const selected = 'selected';

const selectColor = colorPicker => {
    colorPickers.forEach(picker => picker.classList.remove(selected));
    colorPicker.classList.add(selected);
}

const selectBrush = selectedBrush => {
    document.querySelectorAll('.brush').forEach(brush => brush.classList.remove(selected));
    selectedBrush.classList.add(selected);
}

const colorPickers = document.querySelectorAll(".pick-color");
colorPickers.forEach(picker => {
    picker.addEventListener('click', () => {
        updateColor(getComputedStyle(picker).backgroundColor);
        selectColor(picker);
    })
})

const clear = document.querySelector('#clear');
clear.addEventListener('click', () => {
    drawGrid(colors.sea);
})

const brushSmall = document.querySelector('#brushSmall');
brushSmall.addEventListener('click', () => {
    updateBrushSize(2);
    selectBrush(brushSmall);
})

const brushMedium = document.querySelector('#brushMedium');
brushMedium.addEventListener('click', () => {
    updateBrushSize(8);
    selectBrush(brushMedium);
})

const brushLarge = document.querySelector('#brushLarge');
brushLarge.addEventListener('click', () => {
    updateBrushSize(32);
    selectBrush(brushLarge);
})