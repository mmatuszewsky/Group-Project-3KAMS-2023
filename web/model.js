const tf = require('@tensorflow/tfjs-node');
let model = null;

const loadModel = async () => {
    model = await tf.loadLayersModel('file://../docs/model/model.json');
}

const generate = async image => {
    const input = preprocess(image);
    const tensor = await model.predict(input);
    const postImage = postprocess(tensor);
    const finalImage = tf.node.encodeJpeg(postImage);
    tf.dispose();
    return finalImage;
}

const preprocess = image => {
    return tf.tidy(() => {
        let tensor = tf.node.decodeImage(image).toFloat();
        const resizedImage = tensor.resizeBilinear([256, 256]);
        const offset = tf.scalar(127.5);
        const normalized = resizedImage.div(offset).sub(tf.scalar(1.0));
        const batched = normalized.expandDims(0);
        return batched;
    })
}

const postprocess = tensor => {
    return tensor.squeeze()
        .mul(0.5)
        .add(0.5)
        .mul(255)
        .resizeBilinear([512, 512]); 
}

module.exports = {
    loadModel,
    generate
}