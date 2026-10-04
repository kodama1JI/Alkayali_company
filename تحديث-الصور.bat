@echo off
cd /d "%~dp0"
py -3 sync_gallery.py --watch
pause
