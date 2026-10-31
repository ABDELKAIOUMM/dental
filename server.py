#!/usr/bin/env python3
"""Celestia CMS local publish bridge: static server + POST /api/publish (package دال local tier)."""
import http.server, socketserver, json, os, hashlib

ROOT = os.path.dirname(os.path.abspath(__file__))
KEY = os.path.join(os.path.dirname(ROOT), ".cms-key")  # outside the zipped project


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def _send(self, code, obj):
        b = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(b)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(b)

    def do_GET(self):
        if self.path.split("?")[0] == "/api/health":
            self._send(200, {"ok": True, "publish": True})
            return
        super().do_GET()

    def do_POST(self):
        if self.path.split("?")[0] != "/api/publish":
            self._send(404, {"ok": False})
            return
        try:
            n = int(self.headers.get("Content-Length") or 0)
            data = json.loads(self.rfile.read(n))
        except Exception:
            self._send(400, {"ok": False, "error": "bad json"})
            return
        content, key = data.get("content"), data.get("key") or ""
        if not isinstance(content, dict) or content.get("v", 0) < 3:
            self._send(400, {"ok": False, "error": "bad content"})
            return
        h = hashlib.sha256(key.encode()).hexdigest()
        if os.path.exists(KEY):
            if open(KEY).read().strip() != h:
                self._send(403, {"ok": False, "error": "forbidden"})
                return
        else:
            open(KEY, "w").write(h)  # trust-on-first-use (dev tier)
        tmp = os.path.join(ROOT, "content.json.tmp")
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(content, f, ensure_ascii=False, indent=1)
        os.replace(tmp, os.path.join(ROOT, "content.json"))
        self._send(200, {"ok": True})

    def log_message(self, *a):
        pass


socketserver.ThreadingTCPServer.allow_reuse_address = True
with socketserver.ThreadingTCPServer(("0.0.0.0", 8000), Handler) as httpd:
    httpd.serve_forever()
