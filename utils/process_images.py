from PIL import Image
from itertools import product
import shutil
import os

DIR_IN = r"D:\tests"
DIR_OUT = r"D:\tests\cropped"
NUMBER_OF_PATCHES = 4
IMG_SIZE = 512

def crop(dir_in, filename, d, idx):
    name, ext = os.path.splitext(filename)
    
    if "[minimap]" not in name:
        if name.find('map') != -1:
            name_mini = name[:name.find("map")] + "mini" + name[name.find("map"):]
            crop(dir_in, name_mini + ext, d, idx)
            
    img = Image.open(os.path.join(dir_in, filename))
    w, h = img.size
    d = round(w/d)
    grid = product(range(0, h-h%d, d), range(0, w-w%d, d))
    counter = 0
    
    for i, j in grid:
        counter = counter + 1
        box = (j, i, j+d, i+d)
        
        if not os.path.exists(DIR_OUT + "\maps"):
            os.mkdir(DIR_OUT + "\maps")
        if not os.path.exists(DIR_OUT + "\minimaps"):
            os.mkdir(DIR_OUT + "\minimaps")
        
        out = ""
        if "[minimap]" in name:
            out = os.path.join(DIR_OUT, f'minimaps\{idx}_{counter}_[minimap].jpg')
        else:
            out = os.path.join(DIR_OUT, f'maps\{idx}_{counter}.jpg')
            
        img.crop(box).resize((IMG_SIZE, IMG_SIZE)).save(out)

idx = 0
for filename in os.listdir(DIR_IN):
    path = os.path.join(DIR_IN, filename)
    if not os.path.isdir(path):
        if "[minimap]" not in filename:
            crop(DIR_IN, filename, NUMBER_OF_PATCHES, idx)
            idx += 1
