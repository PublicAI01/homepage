#!/usr/bin/env python3
"""Only the skipped items a person has not already been told about.

An unresolved judgement call was rewritten and mailed every morning until
someone acted on it — the "✱ in domain rankings" question went out on
2026-09-11 and again on 09-13, the same question in entirely different
words. Repetition does not make a decision arrive sooner; it teaches the
reader to stop opening the mail.

Identity is a slug the fix session writes on each item, `[skip:some-name]`,
and is told to reuse for the same underlying issue — because the wording
changes daily and the issue does not. An item with no slug falls back to
fuzzy text matching, which catches a re-run of the same sentences but not a
rewrite.

    new-skips.py <store.json> [--remind-after 14] [--open]

`--open` prints the currently open items instead, one `slug<TAB>title` per
line, for feeding back into the next run's prompt.
"""

import difflib
import json
import re
import sys
from datetime import date, timedelta

SAME = 0.88
REMIND_AFTER_DAYS = 14
KEEP_DAYS = 60
STARTS_ITEM = re.compile(r"^(\*\*|\d+[.、)]\s|[一二三四五六七八九十]+、|\[skip:)")
SLUG = re.compile(r"\[skip:([a-z0-9][a-z0-9-]{0,60})\]\s*")


def items(block):
    out, current = [], []
    for para in re.split(r"\n\s*\n", block.strip()):
        para = para.strip()
        if not para or para.startswith("【"):
            continue
        if STARTS_ITEM.match(para) and current:
            out.append("\n\n".join(current))
            current = []
        current.append(para)
    if current:
        out.append("\n\n".join(current))
    return out


def title(text):
    first = text.strip().split("\n")[0]
    return SLUG.sub("", first).strip().strip("*").strip()[:80]


def key(text):
    return re.sub(r"[\s\W_]+", "", SLUG.sub("", text).lower())


def load(path):
    try:
        with open(path) as f:
            return json.load(f)
    except (OSError, ValueError):
        return []


def main():
    if len(sys.argv) < 2:
        sys.exit("usage: new-skips.py <store.json> [--remind-after DAYS] [--open]")
    store_path = sys.argv[1]
    store = load(store_path)
    today = date.today()
    keep_from = (today - timedelta(days=KEEP_DAYS)).isoformat()
    store = [s for s in store if s.get("last_told", "") >= keep_from]

    if "--open" in sys.argv:
        for s in store:
            print(f"{s.get('slug') or '-'}\t{s.get('title', '')}")
        return

    remind = REMIND_AFTER_DAYS
    if "--remind-after" in sys.argv:
        remind = int(sys.argv[sys.argv.index("--remind-after") + 1])
    cutoff = (today - timedelta(days=remind)).isoformat()

    found = items(sys.stdin.read())
    if not found:
        return

    previous = list(store)
    fresh = []
    for item in found:
        m = SLUG.search(item)
        slug = m.group(1) if m else None
        k = key(item)
        seen = None
        for s in previous:
            if slug and s.get("slug") == slug:
                seen = s
                break
            if not slug and not s.get("slug"):
                if difflib.SequenceMatcher(None, k, s["key"]).ratio() >= SAME:
                    seen = s
                    break
        body = SLUG.sub("", item).replace("****", "").strip()
        if seen is None:
            store.append(
                {
                    "slug": slug,
                    "key": k,
                    "title": title(item),
                    "first_told": today.isoformat(),
                    "last_told": today.isoformat(),
                }
            )
            fresh.append(body)
        elif seen["last_told"] < cutoff:
            seen["last_told"] = today.isoformat()
            fresh.append(
                f"{body}\n\n(这条从 {seen['first_told']} 起就在等你,隔了 {remind} 天再提一次。)"
            )
        # Otherwise: open, and said recently. Saying it again changes nothing
        # and costs the reader a mail.

    try:
        with open(store_path, "w") as f:
            json.dump(store, f, ensure_ascii=False, indent=1)
    except OSError as e:
        print(f"(注意:跳过项记录写不进 {store_path}:{e})", file=sys.stderr)

    if fresh:
        print("【跳过项·大白话总结】\n")
        print("\n\n".join(fresh))


main()
