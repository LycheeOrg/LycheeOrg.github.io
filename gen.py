#!/usr/bin/env python3

# this script will directly use the version.md from Lychee to determine the current version
import urllib.request
import pytest


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

    print('version number: ' + version+'\n')

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

    return index_full, support_full, update_full

    with open("index.html", 'w', encoding="utf-8") as out:
        out.write(index_full)
        print("regenerated index.html")

    with open("support.html", 'w', encoding="utf-8") as out:
        out.write(support_full)
        print("regenerated support.html")

    with open("update.json", 'w', encoding="utf-8") as out:
        out.write(update_full)
        print("regenerated update.json")

    print("")
    changes = False
    if index_full != old_index:
        print("No changes in index.html")
        changes = True
    if support_full != old_support:
        print("No changes in support.html")
        changes = True
    if update_full != old_update:
        print("No changes in update.json")
        changes = True

    if changes:
        print("")
        print("[index/support/update] changed. Please commit them.")
    else:
        print("\tNo changes detected.")


def check(index_full, support_full, update_full):
    with open('index.html', 'r', encoding="utf-8") as file:
        old_index = file.read()
    with open('support.html', 'r', encoding="utf-8") as file:
        old_support = file.read()
    with open('update.json', 'r', encoding="utf-8") as file:
        old_update = file.read()

    changes = False
    if index_full != old_index:
        changes = True
    if support_full != old_support:
        changes = True
    if update_full != old_update:
        changes = True

    return changes


def test_main():
    index_full, support_full, update_full = generate()

    assert(not check(index_full, support_full, update_full))


def main():

    with open('index.html', 'r', encoding="utf-8") as file:
        old_index = file.read()
    with open('support.html', 'r', encoding="utf-8") as file:
        old_support = file.read()
    with open('update.json', 'r', encoding="utf-8") as file:
        old_update = file.read()

    index_full, support_full, update_full = generate()
    changes = check(index_full, support_full, update_full)

    with open("index.html", 'w', encoding="utf-8") as out:
        out.write(index_full)
        print("regenerated index.html")

    with open("support.html", 'w', encoding="utf-8") as out:
        out.write(support_full)
        print("regenerated support.html")

    with open("update.json", 'w', encoding="utf-8") as out:
        out.write(update_full)
        print("regenerated update.json")

    print("")
    if changes:
        print("[index/support/update] changed. Please commit them.")
    else:
        print("No changes detected.")


if __name__ == '__main__':
    main()
