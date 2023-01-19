from os import listdir
import tensorflow as tf
import os
import random
from keras.models import load_model
from keras_preprocessing.image import img_to_array
from keras_preprocessing.image import load_img
from numpy import expand_dims, load, vstack, savez_compressed, asarray
from matplotlib import pyplot
from numpy.random import randint
import tensorflowjs as tfjs


IMG_LIMIT = 100
IMG_SIZE = 256


def load_images(path, nr_images, size=(IMG_SIZE, IMG_SIZE*2)):
    src_list, tar_list = list(), list()
    # enumerate filenames in directory, assume all are images
    for count, filename in enumerate(listdir(path)):
        if count >= nr_images:
            break
        src, tar = load_single_image(os.path.join(path, filename))
        src_list.append(src)
        tar_list.append(tar)
    return [asarray(src_list), asarray(tar_list)]


def load_single_image(image_file):
    image = tf.io.read_file(image_file)
    image = tf.io.decode_jpeg(image)

    w = tf.shape(image)[1]
    w = w // 2
    input_image = image[:, w:, :]
    real_image = image[:, :w, :]

    input_image = tf.cast(input_image, tf.float32)
    real_image = tf.cast(real_image, tf.float32)

    return input_image, real_image


def load_image(filename, size=(IMG_SIZE, IMG_SIZE)):
    pixels = load_img(filename, target_size=size)
    pixels = img_to_array(pixels)
    pixels = (pixels - 127.5) / 127.5
    pixels = expand_dims(pixels, 0)
    return pixels


def load_real_samples(filename):
    # load compressed arrays
    data = load(filename)
    # unpack arrays
    X1, X2 = data['arr_0'], data['arr_1']
    # scale from [0,255] to [-1,1]
    X1 = (X1 - 127.5) / 127.5
    X2 = (X2 - 127.5) / 127.5
    return [X1, X2]


# plot source, generated and target images
def plot_images(src_img, gen_img, tar_img):
    images = vstack((src_img, gen_img, tar_img))
    # scale from [-1,1] to [0,1]
    images = (images + 1) / 2.0
    titles = ['Source', 'Generated', 'Expected']
    # plot images row by row
    for i in range(len(images)):
        # define subplot
        pyplot.subplot(1, 3, 1 + i)
        # turn off axis
        pyplot.axis('off')
        # plot raw pixel data
        pyplot.imshow(images[i])
        # show title
        pyplot.title(titles[i])
    pyplot.show()


def generate_random_img(model, dir):
    rand_img = random.choice(os.listdir(dir))
    print(dir + rand_img)
    src_image, tar_image = load_single_image(dir + rand_img)

    src_image = (src_image - 127.5) / 127.5
    src_image = expand_dims(src_image, 0)

    tar_image = (tar_image - 127.5) / 127.5
    tar_image = expand_dims(tar_image, 0)
    print(src_image.shape, tar_image.shape)
    gen_image = model.predict(src_image)
    plot_images(src_image, gen_image, tar_image)


DIR = 'D:/dataset_top_256_r/dataset_top_256_r/test/'
model = load_model('./models/model_2000img_50epoch.h5')

for _ in range(3):
    generate_random_img(model, DIR)

