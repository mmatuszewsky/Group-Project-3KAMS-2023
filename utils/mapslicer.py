from PIL import Image
from itertools import product
import shutil
import os

DIR_IN = r"C:\Users\micha\Downloads\asdas\Screenshots"
DIR_OUT = r"\cropped"
NUMBER_OF_PATCHES = 6 # 6, 12, 18- squared number of patches created

def crop(dir_in, dir_out, filename, d):
    name, ext = os.path.splitext(filename)
    if "[minimap]" not in name:
        dir_out = dir_out + "\\" + name
        if os.path.exists(dir_out):
            shutil.rmtree(dir_out)
        os.mkdir(dir_out)
        if name.find('map') != -1:
            name_mini = name[:name.find("map")] + "mini" + name[name.find("map"):]
            crop(dir_in, dir_out, name_mini + ext, d)
    img = Image.open(os.path.join(dir_in, filename))
    w, h = img.size
    d = round(w/d)
    grid = product(range(0, h-h%d, d), range(0, w-w%d, d))
    for i, j in grid:
        box = (j, i, j+d, i+d)
        out = os.path.join(dir_out, f'{name}_{i}_{j}_{ext}')
        img.crop(box).save(out)


for filename in os.listdir(DIR_IN):
    path = os.path.join(DIR_IN, filename)
    if not os.path.isdir(path):
        if "[minimap]" not in filename:
            crop(DIR_IN, DIR_IN + DIR_OUT, filename, NUMBER_OF_PATCHES)
