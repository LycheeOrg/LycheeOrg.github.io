#!/usr/bin/python3

import markdown
from utils.tools import read, save, bcolors
from os import listdir
from markdown.extensions.toc import TocExtension
import shutil

md = markdown.Markdown(extensions=['extra', TocExtension(
    baselevel=1, toc_depth=3, anchorlink=True), 'md_in_html'])
md2 = markdown.Markdown(extensions=['extra', TocExtension(
    baselevel=1, toc_depth=4, anchorlink=True), 'md_in_html'])

frame = read('template/frame.html')

pages_title = {}
pages_title['installation'] = 'Installation'
pages_title['configuration'] = 'Configuration'
pages_title['structure'] = 'Directory Structure'
pages_title['contributions'] = 'Contribution Guide'
pages_title['releases'] = 'Release Notes'
pages_title['api'] = 'API Documentation'
pages_title['settings'] = 'Settings'
pages_title['keyboard'] = 'Keyboard Shortcuts'
pages_title['upgrade'] = 'Upgrade from v3'

#    <li class = "sub--on" >
#         <h2 > Prologue < /h2 >
#         <ul >
#             <li {li-active-releases} > <a href = "releases.html" > Release Notes < /a > </li >
#             <li {li-active-upgrade} > <a href = "upgrade.html" > Upgrade from v3 < /a > </li >
#             <li {li-active-contributions} > <a href = "contributions.html" > Contribution Guide < /a > </li >
#             <li {li-active-api} > <a href = "api.html" > API Documentation < /a > </li >
#         </ul >
#     </li >
#    <li class = "sub--on" >
#         <h2 > Getting Started < /h2 >
#         <ul >
#             <li {li-active-installation} > <a href = "installation.html" > Installation < /a > </li >
#             <li {li-active-configuration} > <a href = "configuration.html" > Configuration < /a > </li >
#             <li {li-active-structure} > <a href = "structure.html" > Directory Structure < /a > </li >
#         </ul >
#     </li >
#    <li class = "sub--on" >
#         <h2 >  < /h2 >
#         <ul >
#             <li > <a href = "settings.html" > Settings < /a > </li >
#             <li > <a href = "keyboard.html" > Keyboard Shortcuts < /a > </li >
#         </ul >
#     </li >

structure = [['Prologue',
              ['releases', 'upgrade', 'contributions', 'api']]]
structure += [['Getting Started',
               ['installation', 'configuration', 'structure']]]
structure += [['Digging Deeper',
               ['settings', 'keyboard']]]


def gen_sidebar(page):

    html = ''
    for section in structure:
        html += "<li class='sub--on'>\n"
        html += "<h2>{}</h2>\n".format(section[0])
        html += "<ul>\n"
        for pages_name in section[1]:
            active = ''
            if pages_name == page:
                active = " class='active'"
            html += "<li{active}><a href='{page}.html'>{title}</a></li>\n".format(
                active=active, page=pages_name, title=pages_title[pages_name])
        html += "</ul>\n"

    return html


for page_name in pages_title:
    page_title = pages_title[page_name]
    text = read('md/' + page_name + '.md')
    if page_name == 'settings':
        html = md2.convert(text)
        toc = md2.toc[17:-7]
    else:
        html = md.convert(text)
        toc = md.toc[17:-7]
    aside = gen_sidebar(page_name)
    # print(aside)

    html = frame.format(content=html, title=page_title, toc=toc, aside=aside)
    save(page_name + '.html', html)
    print(bcolors.GREEN + page_name + bcolors.NORMAL + " generated.")

shutil.copy('installation.html', 'index.html')
