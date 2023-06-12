#!/usr/bin/env python3

# this script will directly use the version.md from Lychee to determine the current version
import shutil
import urllib.request
import markdown
from git import Repo
from markdown.extensions.toc import TocExtension
from utils.tools import read, save, bcolors


def numberify_version(v):
    v = v.split('.')
    if len(v[1]) < 2:
        v[1] = '0' + v[1]
    if len(v[2]) < 2:
        v[2] = '0' + v[2]
    return "".join(v)


def generate_base():
    version_file_url = "https://raw.githubusercontent.com/LycheeOrg/Lychee/master/version.md"
    version = urllib.request.urlopen(version_file_url).read().decode("utf-8")
    version = version.strip()

    print(f'{bcolors.YELLOW}version number: {bcolors.NORMAL} {version}\n')

    head = read('template/head.tpl')
    index = read('template/index.tpl')
    support = read('template/support.tpl')
    footer = read('template/footer.tpl')
    update = read('template/update.tpl')

    index_full = head % (version, version)
    index_full += index
    index_full += footer

    support_full = head % (version, version)
    support_full += support
    support_full += footer

    update_full = update % numberify_version(version)

    save("build/index.html", index_full)
    print(f'{bcolors.GREEN}index{bcolors.NORMAL} generated.')

    save("build/support.html", support_full)
    print(f'{bcolors.GREEN}support{bcolors.NORMAL} generated.')

    save("build/update.json", update_full)
    print(f'{bcolors.GREEN}update{bcolors.NORMAL} generated.')

    print("")


md = markdown.Markdown(extensions=['extra', TocExtension(
    baselevel=1, toc_depth=3, anchorlink=True), 'md_in_html'])
md2 = markdown.Markdown(extensions=['extra', TocExtension(
    baselevel=1, toc_depth=4, anchorlink=True), 'md_in_html'])

frame = read('template/doc-frame.html')

pages_title = {}

pages_title['org'] = 'Lychee & LycheeOrg'
pages_title['releases'] = 'Release Notes'

pages_title['installation'] = 'Installation'
pages_title['configuration'] = 'Configuration'
pages_title['docker'] = 'Docker'
pages_title['update'] = 'Update'
pages_title['upgrade'] = 'Upgrade from v3'

pages_title['settings'] = 'Settings'
pages_title['keyboard'] = 'Keyboard Shortcuts'
pages_title['advanced-setups'] = 'Advanced Setups'
pages_title['external_tracking'] = "External tracking with Matomo, Google Analytics & Co"

pages_title['faq_general'] = 'General'
pages_title['faq_installation'] = 'Installation, migration, upgrade, update'
pages_title['faq_troubleshooting'] = 'Troubleshooting'

pages_title['contributions'] = 'Contribution Guide'
pages_title['api'] = 'API Documentation'
pages_title['architecture'] = 'Lychee logic overview'
pages_title['structure'] = 'Directory Structure'
pages_title['frontend'] = 'Front-end'
pages_title['livewire'] = 'Livewire Front-end (alpha)'

structure = [['Prologue',
              ['org', 'releases']]]
structure += [['Getting Started',
               ['installation', 'configuration', 'docker', 'update', 'upgrade']]]
structure += [['Advanced Topics',
               ['settings', 'keyboard', 'advanced-setups', 'external_tracking']]]
structure += [['Frequently Asked Question',
               ['faq_general', 'faq_installation', 'faq_troubleshooting']]]
structure += [['Contributing',
               ['contributions', 'api', 'architecture', 'structure', 'frontend', 'livewire']]]


def gen_github_link(page):
    html = '<blockquote><p>{tip} Caught a mistake or want to contribute to the documentation?&nbsp;'
    html += f'<a href="https://github.com/LycheeOrg/LycheeOrg.github.io/tree/master/docs/{page}.md">Edit this page on Github!</a></p></blockquote>'
    return html


def gen_sidebar(page):
    html = ''
    for section in structure:
        html += "<li class='sub--on'>\n"
        html += f"<h2>{section[0]}</h2>\n"
        html += "<ul>\n"
        for pages_name in section[1]:
            active = ''
            if pages_name == page:
                active = " class='active'"
            html += f"<li{active}><a href='{pages_name}.html'>{pages_title[pages_name]}</a></li>\n"
        html += "</ul>\n"

    return html


def generate_doc():
    for page_name in pages_title:
        page_title = pages_title[page_name]
        text = read(f'docs/{page_name}.md')
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
        save(f'build/docs/{page_name}.html', html)
        print(f'{bcolors.GREEN} {page_name}{bcolors.NORMAL} generated.')

    shutil.copy('build/docs/installation.html', 'build/docs/index.html')


def check():
    repo = Repo.init('.')
    if repo.is_dirty():  # check the dirty state
        for item in repo.index.diff(None):
            print(f'{bcolors.RED} {item.a_path}  changed.{bcolors.NORMAL}')
        print("")
        print(f'{bcolors.RED}Please commit them. {bcolors.NORMAL}')
        return True
    else:
        print(f'{bcolors.GREEN}No changes detected.{bcolors.NORMAL}')
        return False


def test_main():
    generate_base()
    generate_doc()
    assert (not check())


def main():
    generate_base()
    generate_doc()
    check()


if __name__ == '__main__':
    main()
