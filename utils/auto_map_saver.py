# skrypt pod polskego windows'a

import ctypes, sys
from doctest import script_from_examples
import pywinauto
import glob
from time import sleep

# path to editor app
EDITOR_PATH = r"C:\\Users\macia\Desktop\homm\H3Unleashed.exe"

# directory with maps (.h3m)
MAPS_DIR = "H:\Heroes of Might and Magic III Complete\Maps"

# list of paths to all maps
files = glob.glob(f"{MAPS_DIR}\*.h3m")


def is_admin():
    try:
        return ctypes.windll.shell32.IsUserAnAdmin()
    except:
        return False
    
# this script needs to be run as admin
if not is_admin():
    ctypes.windll.shell32.ShellExecuteW(None, "runas", sys.executable, " ".join(sys.argv), None, 1)
else:     
    app = pywinauto.Application(backend="uia").start(EDITOR_PATH)
    main_window = app.window(best_match="Heroes of Might and Magic® III Map Editor", control_type="Window", found_index=0)
    
    for file in files:
        main_window.child_window(title="Standard", control_type="ToolBar").Button22.click()      
        
        # jeśli jesteśmy w folderze z mapami to apka się zawiesza idk
        up_button = main_window.child_window(title="Do góry o jeden poziom", control_type="Button")
        up_button.click()
            
        file_dlg = main_window.child_window(title="Open", control_type="Window", found_index=0)
        file_dlg.child_window(auto_id="1152", control_type="Edit").set_edit_text(file)
        file_dlg.child_window(auto_id="1", control_type="Button").click()
        
        menu_bar = main_window.child_window(best_match="Aplikacja", auto_id="MenuBar", control_type="MenuBar", found_index=0)
        unleashed_dlg = menu_bar.child_window(best_match="Unleashed", control_type="MenuItem")
        unleashed_dlg.click_input()
        
        dlg = unleashed_dlg.child_window(title="Unleashed", control_type="Window").child_window(title="Unleashed", control_type="Menu")
        screenshot = dlg.child_window(best_match="Take Map Screenshot", auto_id="42001", control_type="MenuItem", found_index=0)
        screenshot.click_input()

        main_window.child_window(best_match="Unleashed mapeditor", found_index=0).OK.click()
