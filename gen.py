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
            print('\tfound version.md, ignoring default.')
            version = file.read()
            version = version.strip()

    print('\tversion number: ' + version+'\n')

    with open('index.html', 'r', encoding="utf-8") as file:
        old_index = file.read()
    with open('support.html', 'r', encoding="utf-8") as file:
        old_support = file.read()
    with open('update.json', 'r', encoding="utf-8") as file:
        old_update = file.read()

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

    update_full = update % numberify_version(version)
    with open("index.html", 'w', encoding="utf-8") as out:
    	out.write(index_full)
    	print("\tregenerated index.html")

    with open("support.html", 'w', encoding="utf-8") as out:
    	out.write(support_full)
    	print("\tregenerated support.html")

    with open("update.json", 'w', encoding="utf-8") as out:
        out.write(update_full)
        print("\tregenerated update.json")

    print("")
    changes = False
    if index_full != old_index:
        print("\tNo changes in index.html")
        changes = True
    if support_full != old_support:
        print("\tNo changes in support.html")
        changes = True
    if update_full != old_update:
        print("\tNo changes in update.json")
        changes = True

    if changes:
        print("")
        print("[index/support/update] changed. Please commit them.")
    else:
        print("\tNo changes detected.")


main()
