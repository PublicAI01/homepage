"""
Refuse a diff that carries a credential out of this machine.

    git diff | python3 scripts/bugscan/leak-check.py

The realistic leak is not chance. The unattended fix session runs with full
tool access inside the repository; the way a secret reaches a public commit
is a model inlining a config value because doing so made a bug go away. So
the first and strongest check is literal: every value in this machine's own
credential files is compared against the added lines. Nothing about that can
be reasoned around, and it names the variable, never the value.

Pattern checks follow for credentials that never touched those files. They
are deliberately noisy in the safe direction — a false positive voids a batch
and mails a person, which costs a day; a false negative is public forever.
"""

import os
import pathlib
import re
import sys

# Values shorter than this are words, not secrets, and match everything.
MIN_SECRET_LEN = 12

CREDENTIAL_FILES = [
    pathlib.Path.home() / ".config/publicai/bugscan.env",
    pathlib.Path.cwd() / ".env.local",
    pathlib.Path.cwd() / ".env",
]

# Settings that live beside the secrets but are not secrets. A recipient
# address or a PATH turning up in a diff is not a leak, and treating it as
# one trains everybody to wave this check through.
NOT_SECRET_NAME = re.compile(r"(?i)_(PATH|TO|FROM|HOST|REGION|URL|LABEL|PORT|USER(NAME)?)$")

# name=value, and the `: "${name=value}"` form the bugscan config uses.
ASSIGN = re.compile(r'^\s*(?::\s*")?\$?\{?([A-Za-z_][A-Za-z0-9_]*)[:]?=([^}"\n]*)')

PATTERNS = [
    ("OpenAI 式 key", re.compile(r"\bsk-[A-Za-z0-9_-]{20,}")),
    ("Resend key", re.compile(r"\bre_[A-Za-z0-9_]{20,}")),
    ("GitHub token", re.compile(r"\b(gh[pousr]_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{50,})")),
    ("AWS access key", re.compile(r"\bAKIA[0-9A-Z]{16}\b")),
    ("Google API key", re.compile(r"\bAIza[0-9A-Za-z_-]{35}\b")),
    ("Slack token", re.compile(r"\bxox[baprs]-[A-Za-z0-9-]{10,}")),
    ("私钥文件头", re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----")),
    ("Anthropic key", re.compile(r"\bsk-ant-[A-Za-z0-9_-]{20,}")),
]

SECRETISH = re.compile(
    r"(?i)\b\w*(secret|token|passwd|password|api[_-]?key|private[_-]?key|credential)\w*"
    r"\s*[:=]\s*[\"'`]([A-Za-z0-9_/+=.-]{16,})[\"'`]"
)

# Obvious stand-ins. A placeholder in a test is not a leak, and treating it as
# one teaches everyone to ignore this check.
PLACEHOLDER = re.compile(
    r"(?i)^(x+|y+|z+|a+|0+|1+|\.+|-+|_+)$|"
    r"(?i)(example|placeholder|dummy|fake|sample|redacted|changeme|your[_-]?|test[_-]?key|xxxx)"
)


def known_secrets() -> dict[str, str]:
    """Every credential this machine holds, as {variable name: value}."""
    found: dict[str, str] = {}
    for path in CREDENTIAL_FILES:
        try:
            text = path.read_text()
        except OSError:
            continue
        for line in text.splitlines():
            m = ASSIGN.match(line)
            if not m:
                continue
            name, value = m.group(1), m.group(2).strip().strip("\"'")
            if (
                len(value) >= MIN_SECRET_LEN
                and not PLACEHOLDER.search(value)
                and not NOT_SECRET_NAME.search(name)
            ):
                found[name] = value
    return found


def check(diff: str) -> list[str]:
    added = "\n".join(
        line[1:]
        for line in diff.splitlines()
        if line.startswith("+") and not line.startswith("+++")
    )
    problems: list[str] = []

    for name, value in known_secrets().items():
        if value in added:
            problems.append(f"这份 diff 里出现了本机 {name} 的**真实值**")

    for label, pattern in PATTERNS:
        if pattern.search(added):
            problems.append(f"这份 diff 里有一个像 {label} 的字符串")

    for m in SECRETISH.finditer(added):
        if not PLACEHOLDER.search(m.group(2)):
            problems.append(
                f"这份 diff 把一个长字面量赋给了名字里带 {m.group(1)} 的变量"
            )

    return sorted(set(problems))


if __name__ == "__main__":
    source = sys.argv[1] if len(sys.argv) > 1 else None
    text = pathlib.Path(source).read_text(errors="replace") if source else sys.stdin.read()
    problems = check(text)
    if problems:
        print("leak-check: 这批改动不能推到公开仓库 ——", file=sys.stderr)
        for p in problems:
            print(f"  · {p}", file=sys.stderr)
        sys.exit(1)
    print("leak-check: 过")
