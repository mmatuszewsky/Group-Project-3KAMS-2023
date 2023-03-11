import { initDrawing, updateColor, drawGrid, updateBrushSize, colors, changeMode, getFillColor } from './drawing.js';

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
        const color = Array.from(picker.classList).filter(className => className !== 'pick-color')[0];
        updateColor(color);
        selectColor(picker);
    })
})

const clear = document.querySelector('#clear');
clear.addEventListener('click', () => {
    drawGrid(getFillColor());
})

const changeModeElement = document.querySelector('#changeMode');
changeModeElement.addEventListener('click', () => {
    const mode = changeMode();
    document.querySelector('main').style.backgroundImage = `url('img/${mode}.jpg')`;
});

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

window.onload = () => {
    initDrawing("grass");
    selectBrush(brushLarge);
    selectColor(document.querySelector('.grass'));
}