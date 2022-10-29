from PIL import Image
from itertools import product
import os
import sys

DIR_IN = r"D:\data"
DIR_OUT = r"D:\dataset_merged"

MAPS_DIR_OUT = r"D:\dataset\maps"
MINIMAPS_DIR_OUT = r"D:\dataset\minimaps"

NUMBER_OF_PATCHES = 5
IMG_SIZE = 512

# TODO: multithreading for fun 

def crop(dir_in, filename, d, idx):
    name, ext = os.path.splitext(filename)
    
    if "[minimap]" not in name:
        if name.find('[map]') != -1:
            # we wcześniejszym, jeśli mapa miała w nazwie map to się sypało
            name_mini = name[:name.find("[map]")+1] + "mini" + name[name.find("[map]")+1:]
            crop(dir_in, name_mini + ext, d, idx)
            
    img = Image.open(os.path.join(dir_in, filename))
    w, h = img.size
    d = round(w/d)
    grid = product(range(0, h-h%d, d), range(0, w-w%d, d))
    counter = 0
    
    for i, j in grid:
        counter = counter + 1
        box = (j, i, j+d, i+d)
        
        if not os.path.exists(MAPS_DIR_OUT):
            os.mkdir(MAPS_DIR_OUT)
        if not os.path.exists(MINIMAPS_DIR_OUT):
            os.mkdir(MINIMAPS_DIR_OUT)
        
        out = ""
        if "[minimap]" in name:
            out = os.path.join(MINIMAPS_DIR_OUT, f'\{idx}_{counter}_[minimap].jpg')
        else:
            out = os.path.join(MAPS_DIR_OUT, f'maps\{idx}_{counter}.jpg')
            
        img.crop(box).resize((IMG_SIZE, IMG_SIZE)).save(out)

idx = 0
for filename in os.listdir(DIR_IN):
    path = os.path.join(DIR_IN, filename)
    if not os.path.isdir(path):
        if "[minimap]" not in filename and filename.endswith(".bmp"):
            # print(f"{filename} : {idx}")
            crop(DIR_IN, filename, NUMBER_OF_PATCHES, idx)
            idx += 1


# merge images into one, and check if there are full black
idx = 0
if not os.path.exists(DIR_OUT):
    os.mkdir(DIR_OUT)

for filename in os.listdir(MAPS_DIR_OUT):
    try:
        real_img = Image.open(os.path.join(MAPS_DIR_OUT, filename))
        real_img.resize((IMG_SIZE, IMG_SIZE))
        
        name, ext = os.path.splitext(filename)
        name = f"{MINIMAPS_DIR_OUT}\{name}_[minimap]{ext}"
        input_img = Image.open(name)
        input_img.resize((IMG_SIZE, IMG_SIZE))
        
        new_image = Image.new('RGB',(2*IMG_SIZE, IMG_SIZE), (0,0,0))
        new_image.paste(real_img,(0,0))
        new_image.paste(input_img,(IMG_SIZE, 0))
        
        # check if image is NOT full black
        if not (sum(new_image.convert("L").getextrema()) in (0, 2)):
            new_image.save(f"{DIR_OUT}\{idx}.jpg", "JPEG")
            idx += 1
    except:
        pass