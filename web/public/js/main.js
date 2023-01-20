import { initDrawing, updateColor, drawGrid, updateBrushSize, colors } from './drawing.js';

window.onload = () => {
    initDrawing(colors.grass);
}

const selected = 'selected';

const selectColor = colorPicker => {
    colorPickers.forEach(picker => picker.classList.remove(selected));
    colorPicker.classList.add(selected);
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

const brush4 = document.querySelector('#brush4');
brush4.addEventListener('click', () => {
    updateBrushSize(4);
})

const brush8 = document.querySelector('#brush8');
brush8.addEventListener('click', () => {
    updateBrushSize(8);
})

const brush16 = document.querySelector('#brush16');
brush16.addEventListener('click', () => {
    updateBrushSize(16);
})