#!/usr/bin/env python3
"""
Build script for Ace — assembles the source parts in src/ into a single
self-contained ace.html.  This is a DEVELOPMENT convenience only: the shipped
ace.html needs no build step and no server to run (just double-click it).

Order matters: data constants must load before the engine, engine before UI.
Run:  python3 build.py
"""
import os, subprocess, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC  = os.path.join(ROOT, "src")

# JS parts, concatenated in this exact order inside one <script> tag.
# Files that don't exist yet are skipped (incremental development).
JS_PARTS = [
    "20-data-skills.js",
    "21-data-questions-math.js",
    "22-data-questions-rw.js",
    "23-data-lessons.js",
    "24-data-strategies.js",
    "25-data-vocab.js",
    "30-engine.js",
    "31-engine-extra.js",
    "40-ui-core.js",
    "41-ui-home.js",
    "42-ui-practice.js",
    "43-ui-learn.js",
    "44-ui-vocab.js",
    "45-ui-test.js",
    "46-ui-strategies.js",
    "47-ui-analytics.js",
    "48-ui-settings.js",
    "49-ui-assistant.js",
    "51-ui-accounts.js",
    "50-boot.js",
]

def read(name):
    p = os.path.join(SRC, name)
    if not os.path.exists(p):
        return ""  # part may not exist yet during incremental development
    with open(p, "r", encoding="utf-8") as f:
        return f.read()

def main():
    head  = read("00-head.html")
    styles = read("10-styles.css")
    shell = read("05-shell.html")

    # Generated question batches (src/gen/*.js) load right after the seed banks.
    gen_dir = os.path.join(SRC, "gen")
    gen_files = sorted(f for f in os.listdir(gen_dir)) if os.path.isdir(gen_dir) else []
    parts_order = []
    for p in JS_PARTS:
        parts_order.append(read(p))
        if p == "22-data-questions-rw.js":
            for g in gen_files:
                if g.endswith(".js"):
                    with open(os.path.join(gen_dir, g), encoding="utf-8") as f:
                        parts_order.append("/* gen: %s */\n%s" % (g, f.read()))

    # Concatenate JS and syntax-check it before embedding.
    js = "'use strict';\n" + "\n".join(parts_order)
    js_path = os.path.join(ROOT, ".app.bundle.js")
    with open(js_path, "w", encoding="utf-8") as f:
        f.write(js)
    check = subprocess.run(["node", "--check", js_path], capture_output=True, text=True)
    if check.returncode != 0:
        sys.stderr.write("JS SYNTAX ERROR:\n" + check.stderr + "\n")
        sys.exit(1)

    readme = read("99-readme.txt")

    parts = []
    parts.append("<!doctype html>")
    parts.append("<!--\n" + readme + "\n-->")
    parts.append("<html lang=\"en\">")
    parts.append("<head>")
    parts.append(head)
    parts.append("<style>")
    parts.append(styles)
    parts.append("</style>")
    parts.append("</head>")
    parts.append("<body>")
    parts.append(shell)
    parts.append("<script>")
    parts.append(js)
    parts.append("</script>")
    parts.append("</body>")
    parts.append("</html>")

    out = "\n".join(parts) + "\n"
    with open(os.path.join(ROOT, "ace.html"), "w", encoding="utf-8") as f:
        f.write(out)

    os.remove(js_path)
    size = len(out.encode("utf-8"))
    print(f"Built ace.html  ({size:,} bytes, {out.count(chr(10)):,} lines)")

if __name__ == "__main__":
    main()
