from PIL import Image
from itertools import product
import os
import sys

DIR_IN = r"D:\data"
DIR_OUT = r"D:\dataset_merged"

MAPS_DIR_OUT = r"D:\dataset\maps"
MINIMAPS_DIR_OUT = r"D:\dataset\minimaps"

WINDOW_SIZE = 512
SMALLEST_MAP_SIZE = 1152  # smallest map size in pixels, used for scaling the minimap


def crop(dir_in, filename, window_size, img, idx):
    name, ext = os.path.splitext(filename)
    w, h = img.size
    if "[minimap]" not in name:
        if name.find('map') != -1:
            name_mini = name[:name.find("map")] + "mini" + name[name.find("map"):]
            img_mini = Image.open(os.path.join(dir_in, name_mini + ext))
            img_mini = img_mini.resize((w, h), Image.Resampling.NEAREST)
            crop(dir_in, name_mini + ext, WINDOW_SIZE, img_mini, idx)
    grid = product(range(0, h - h % window_size, window_size), range(0, w - window_size, window_size))
    counter = 0
    for i, j in grid:
        counter += 1
        box = (j, i, j + window_size, i + window_size)
        if not os.path.exists(MAPS_DIR_OUT):
            os.mkdir(MAPS_DIR_OUT)
        if not os.path.exists(MINIMAPS_DIR_OUT):
            os.mkdir(MINIMAPS_DIR_OUT)
        out = ""
        if "[minimap]" in name:
            out = os.path.join(MINIMAPS_DIR_OUT, f'{idx}_{counter}_[minimap].jpg')
        else:
            out = os.path.join(MAPS_DIR_OUT, f'{idx}_{counter}.jpg')
        img.crop(box).save(out)


idx = 0
for filename in os.listdir(DIR_IN):
    path = os.path.join(DIR_IN, filename)
    if not os.path.isdir(path):
        if "[minimap]" not in filename and filename.endswith(".bmp"):
            # print(f"{filename} : {idx}")
            crop(DIR_IN, filename, WINDOW_SIZE, Image.open(os.path.join(DIR_IN, filename)), idx)
            idx += 1

# merge images into one, and check if there are full black
idx = 0
if not os.path.exists(DIR_OUT):
    os.mkdir(DIR_OUT)

for filename in os.listdir(MAPS_DIR_OUT):
    try:
        real_img = Image.open(os.path.join(MAPS_DIR_OUT, filename))

        name, ext = os.path.splitext(filename)
        name = f"{MINIMAPS_DIR_OUT}\{name}_[minimap]{ext}"
        input_img = Image.open(name)

        new_image = Image.new('RGB', (2 * WINDOW_SIZE, WINDOW_SIZE), (0, 0, 0))
        new_image.paste(real_img, (0, 0))
        new_image.paste(input_img, (WINDOW_SIZE, 0))

        # check if image is NOT full black
        if not (sum(new_image.convert("L").getextrema()) in (0, 2)):
            new_image.save(f"{DIR_OUT}\{idx}.jpg", "JPEG")
            idx += 1
    except:
        pass