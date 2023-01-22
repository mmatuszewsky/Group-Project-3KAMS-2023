const ocanvas = document.createElement('canvas');
ocanvas.width = 256;
ocanvas.height = 256;
const octx = ocanvas.getContext('2d', { willReadFrequently: true });

let model = null;

const loadModel = async () => {
    //load the model 
    model = await tf.loadModel('../../docs/model/model.json')
    
    //status
    document.getElementById('status').innerHTML = 'Model Loaded';
}

const predict = (imgData) => {
    //get the prediction
    const test = preprocess(imgData);
    // console.log(test);
    const gImg = model.predict(test);
    console.log(gImg);

    //draw on canvas 
    const gCanvas = document.querySelector('#generated-map');
    const postImg = postprocess(gCanvas, gImg);
    tf.toPixels(postImg, gCanvas);
}

const preprocess = (imgData) => {
    return tf.tidy(() => {
        //convert to a tensor 
        const tensor = tf.fromPixels(imgData).toFloat();
        //resize 
        const resized = tf.image.resizeBilinear(tensor, [256, 256])
                
        //normalize 
        const offset = tf.scalar(127.5);
        const normalized = resized.div(offset).sub(tf.scalar(1.0));

        //We add a dimension to get a batch shape 
        const batched = normalized.expandDims(0);
        console.log(batched);
        return batched;
    })
}

const postprocess = (canvas, tensor) => {
    const w = canvas.width;
    const h = canvas.height;
    return tf.tidy(() => {
        //normalization factor  
        const scale = tf.scalar(1);
        console.log(w, h, scale);

        //unnormalize and sqeeze 
        const squeezed = tensor.squeeze().mul(scale).add(scale)
        console.log(squeezed);
        //resize to canvas size 
        let resized = tf.image.resizeBilinear(squeezed, [w, h])
        return resized;
    })
}

const getImageData = canvas => {
    return canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    // octx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, ocanvas.width, ocanvas.height);
    // return octx.getImageData(0, 0, ocanvas.width, ocanvas.height);
}

// const updateImage = (canvas, ctx) => {
//     // ctx.drawImage(ocanvas, 0, 0, ocanvas.width, ocanvas.height, 0, 0, canvas.width, canvas.height);
//     ctx.drawImage(ocanvas, 0, 0, ocanvas.width, ocanvas.height, 0, 0, ocanvas.width, ocanvas.height);
// }

export { loadModel, predict, getImageData }