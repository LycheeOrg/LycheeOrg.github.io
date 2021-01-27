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
pages_title['faq'] = 'Frequently Asked Question'
pages_title['settings'] = 'Settings'
pages_title['keyboard'] = 'Keyboard Shortcuts'
pages_title['upgrade'] = 'Upgrade from v3'
pages_title['docker'] = 'Docker'
pages_title['read-more'] = 'Lychee logic overview'
pages_title['update'] = 'Update'
pages_title['node'] = 'Front-end'
pages_title['org'] = 'Lychee & LycheeOrg'
pages_title['distributions'] = 'Distributions Examples'

structure = [['Prologue',
              ['org', 'releases', 'upgrade', 'contributions', 'api', 'faq']]]
structure += [['Getting Started',
               ['installation', 'configuration', 'docker', 'update']]]
structure += [['Digging Deeper',
               ['settings', 'keyboard', 'read-more', 'structure', 'node', 'distributions']]]

def gen_github_link(page):
    html = '<blockquote><p>{tip} Caught a mistake or want to contribute to the documentation?&nbsp;'
    html += '<a href="https://github.com/LycheeOrg/LycheeOrg.github.io/tree/master/docs/md/' + page + '.md">Edit this page on Github!</a></p></blockquote>'
    return html

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
    html += gen_github_link(page_name)

    html = frame.format(content=html, title=page_title, toc=toc, aside=aside)
    save(page_name + '.html', html)
    print(bcolors.GREEN + page_name + bcolors.NORMAL + " generated.")

shutil.copy('installation.html', 'index.html')
