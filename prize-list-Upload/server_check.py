#!/usr/bin/env python3
import http.server
import socketserver
import os
import mimetypes
from urllib.parse import urlparse

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers for cross-origin requests
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        
        # Ensure proper MIME types
        if self.path.endswith('.js'):
            self.send_header('Content-Type', 'application/javascript; charset=utf-8')
        elif self.path.endswith('.css'):
            self.send_header('Content-Type', 'text/css; charset=utf-8')
        elif self.path.endswith('.html'):
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            
        super().end_headers()
    
    def log_message(self, format, *args):
        # Enhanced logging
        print(f"[{self.address_string()}] {format % args}")
        
        # Log file details for JS/CSS requests
        if self.path.endswith(('.js', '.css', '.html')):
            file_path = self.path.lstrip('/')
            if os.path.exists(file_path):
                file_size = os.path.getsize(file_path)
                print(f"  📁 File: {file_path} ({file_size} bytes)")
                
                # Check encoding
                try:
                    with open(file_path, 'rb') as f:
                        first_bytes = f.read(10)
                    
                    if first_bytes.startswith(b'\xff\xfe'):
                        print(f"  ⚠️  UTF-16 LE BOM detected in {file_path}")
                    elif first_bytes.startswith(b'\xef\xbb\xbf'):
                        print(f"  ⚠️  UTF-8 BOM detected in {file_path}")
                    else:
                        print(f"  ✅ No BOM detected in {file_path}")
                        
                except Exception as e:
                    print(f"  ❌ Error checking {file_path}: {e}")
            else:
                print(f"  ❌ File not found: {file_path}")

def run_server(port=8000):
    print(f"🚀 Starting enhanced HTTP server on port {port}")
    print(f"📂 Serving directory: {os.getcwd()}")
    print(f"🌐 Access at: http://localhost:{port}")
    print("=" * 50)
    
    with socketserver.TCPServer(("", port), CustomHTTPRequestHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped")

if __name__ == "__main__":
    # Check if files exist
    files_to_check = ['index.html', 'script.js', 'styles.css']
    print("📋 File Status Check:")
    for file in files_to_check:
        if os.path.exists(file):
            size = os.path.getsize(file)
            print(f"  ✅ {file} ({size} bytes)")
        else:
            print(f"  ❌ {file} (missing)")
    print()
    
    run_server()
