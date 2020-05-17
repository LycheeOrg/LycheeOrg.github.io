#!/usr/bin/python3

import markdown
from utils.tools import read, save, bcolors
from os import listdir
from markdown.extensions.toc import TocExtension
import shutil

md = markdown.Markdown(extensions=['extra', TocExtension(baselevel=1, toc_depth=3, anchorlink=True), 'md_in_html'])

frame = read('template/frame.html')

pages = {}

pages['Installation'] = 'installation' 
pages['Configuration'] = 'configuration' 
pages['Directory Structure'] = 'structure'
pages['Contribution Guide'] = 'contributions'
pages['Release Notes'] = 'releases'
pages['API Documentation'] = 'api'


for page_title in pages:
    page_name = pages[page_title]
    text = read('md/' + page_name + '.md')
    html = md.convert(text)
    toc = md.toc[17:-7]
    html = frame.format(content=html, title=page_title, toc=toc)
    save(page_name + '.html', html)
    print(bcolors.GREEN + page_name + bcolors.NORMAL + " generated.")

shutil.copy('installation.html', 'index.html')
