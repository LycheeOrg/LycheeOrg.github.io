#!/usr/bin/env python3

# this script will directly use the version.md from Lychee to determine the current version
from docs.utils.tools import read, save, bcolors
import urllib.request
import pytest
import os
from git import Repo


def numberify_version(v):
    v = v.split('.')
    if len(v[1]) < 2:
        v[1] = '0'+v[1]
    if len(v[2]) < 2:
        v[2] = '0'+v[2]
    return "".join(v)


def generate():
    version = urllib.request.urlopen(
        "https://raw.githubusercontent.com/LycheeOrg/Lychee/master/version.md").read().decode("utf-8")
    version = version.strip()

    print(bcolors.YELLOW + 'version number: '  + bcolors.NORMAL + version+'\n')

    head = read('template/head.tpl')
    index = read('template/index.tpl')
    support = read('template/support.tpl')
    footer = read('template/footer.tpl')

    update = read('template/update.tpl')

    index_full = head % version
    index_full += index % version
    index_full += footer

    support_full = head % version
    support_full += support % version
    support_full += footer

    update_full = update % numberify_version(version)

    save("index.html", index_full)
    print(bcolors.GREEN + 'index' + bcolors.NORMAL + " generated.")
    save("support.html", support_full)
    print(bcolors.GREEN + 'support' + bcolors.NORMAL + " generated.")
    save("update.json", update_full)
    print(bcolors.GREEN + 'update' + bcolors.NORMAL + " generated.")
    print("")

def check():
    repo = Repo.init('.')
    if repo.is_dirty():  # check the dirty state
        print(bcolors.RED + "[index/support/update] changed. Please commit them." + bcolors.NORMAL)
        return True
    else:
        print(bcolors.GREEN + "\tNo changes detected." + bcolors.NORMAL)
        return False
    


def test_main():
    generate()
    assert(not check())


def main():
    generate()
    check()

if __name__ == '__main__':
    main()
