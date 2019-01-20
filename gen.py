#!/usr/bin/env python3

import os.path

# just safety
# idealy if your directory structure is as :
# <path>/LycheeOrg.github.io
# <path>/Lychee
# this script will directly use the version.md from Lychee to determine the current version
version = '3.2.10'

def numberify_version(v):
    v = v.split('.')
    if len(v[1]) < 2:
        v[1] = '0'+v[1]
    if len(v[2]) < 2:
        v[2] = '0'+v[2]
    return "".join(v)

def main():

    if os.path.isfile('../Lychee/version.md'):
        with open('../Lychee/version.md', 'r', encoding="utf-8") as file:
            version = file.read()
            version = version.strip()

    with open('template/head.tpl', 'r', encoding="utf-8") as file:
        head = file.read()
    with open('template/index.tpl', 'r', encoding="utf-8") as file:
        index = file.read()
    with open('template/support.tpl', 'r', encoding="utf-8") as file:
        support = file.read()
    with open('template/footer.tpl', 'r', encoding="utf-8") as file:
        footer = file.read()

    with open('template/update.tpl', 'r', encoding="utf-8") as file:
        update = file.read()

    index_full = head % version
    index_full += index % version
    index_full += footer

    support_full = head % version
    support_full += support % version
    support_full += footer

    with open("index.html", 'w', encoding="utf-8") as out:
    	out.write(index_full)
    	print("\tdone : index.html")

    with open("support.html", 'w', encoding="utf-8") as out:
    	out.write(support_full)
    	print("\tdone : support.html")

    with open("update.json", 'w', encoding="utf-8") as out:
        out.write(update % numberify_version(version))
        print("\tdone : update.json")

main()
