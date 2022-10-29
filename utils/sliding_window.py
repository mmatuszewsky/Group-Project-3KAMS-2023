from PIL import Image
from itertools import product
import shutil
import os

DIR_IN = r"C:\Users\micha\Downloads\asdas\Screenshots"
DIR_OUT = r"C:\Users\micha\Downloads\asdas\Screenshots\cropped"
WINDOW_SIZE = 512
SMALLEST_MAP_SIZE = 1152  # smallest map size in pixels, used for scaling the minimap


def crop(dir_in, filename,window_size, img, idx):
    name, ext = os.path.splitext(filename)
    w, h = img.size
    if "[minimap]" not in name:
        if name.find('map') != -1:
            name_mini = name[:name.find("map")] + "mini" + name[name.find("map"):]
            img_mini = Image.open(os.path.join(dir_in, name_mini+ext))
            img_mini = img_mini.resize((w, h), Image.NEAREST)
            crop(dir_in, name_mini + ext, WINDOW_SIZE, img_mini, idx)
    grid = product(range(0, h-h%window_size, window_size), range(0, w-window_size, window_size))
    counter = 0
    for i, j in grid:
        counter += 1
        box = (j, i, j + window_size, i + window_size)
        if not os.path.exists(DIR_OUT + "\maps"):
            os.mkdir(DIR_OUT + "\maps")
        if not os.path.exists(DIR_OUT + "\minimaps"):
            os.mkdir(DIR_OUT + "\minimaps")
        out = ""
        if "[minimap]" in name:
            out = os.path.join(DIR_OUT, f'minimaps\{idx}_{counter}_[minimap].jpg')
        else:
            out = os.path.join(DIR_OUT, f'maps\{idx}_{counter}.jpg')
        img.crop(box).save(out)

idx = 0
for filename in os.listdir(DIR_IN):
    path = os.path.join(DIR_IN, filename)
    if not os.path.isdir(path):
        if "[minimap]" not in filename:
            crop(DIR_IN, filename, WINDOW_SIZE, Image.open(os.path.join(DIR_IN, filename)), idx)
            idx += 1