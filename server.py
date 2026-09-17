import http.server
import urllib.request
import urllib.parse
import json
import sys

PORT = 5174
UPSTREAM_BASE = "https://heramb.icu"

class MoodEProxyHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, x-operator-secret, X-Chat-Mode')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        if self.path.startswith('/api/'):
            target_url = UPSTREAM_BASE + self.path
            try:
                req = urllib.request.Request(target_url)
                with urllib.request.urlopen(req, timeout=10) as resp:
                    data = resp.read()
                    self.send_response(resp.status)
                    self.send_header('Content-Type', resp.headers.get('Content-Type', 'application/json'))
                    self.end_headers()
                    self.wfile.write(data)
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
            return
        super().do_GET()

    def do_POST(self):
        if self.path.startswith('/api/'):
            target_url = UPSTREAM_BASE + self.path
            content_length = int(self.headers.get('Content-Length', 0))
            post_body = self.rfile.read(content_length) if content_length > 0 else None
            
            headers = {'Content-Type': self.headers.get('Content-Type', 'application/json')}
            if 'x-operator-secret' in self.headers:
                headers['x-operator-secret'] = self.headers['x-operator-secret']

            try:
                req = urllib.request.Request(target_url, data=post_body, headers=headers, method='POST')
                with urllib.request.urlopen(req, timeout=15) as resp:
                    data = resp.read()
                    self.send_response(resp.status)
                    self.send_header('Content-Type', resp.headers.get('Content-Type', 'text/plain; charset=utf-8'))
                    if 'X-Chat-Mode' in resp.headers:
                        self.send_header('X-Chat-Mode', resp.headers['X-Chat-Mode'])
                    self.end_headers()
                    self.wfile.write(data)
            except urllib.error.HTTPError as e:
                err_data = e.read()
                self.send_response(e.code)
                self.send_header('Content-Type', e.headers.get('Content-Type', 'application/json'))
                self.end_headers()
                self.wfile.write(err_data)
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
            return
        super().do_POST()

if __name__ == '__main__':
    server = http.server.ThreadingHTTPServer(('0.0.0.0', PORT), MoodEProxyHandler)
    print(f"Serving MoodE OS with proxy at http://localhost:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
