#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Jackpot Brothers - Cherry Servers deployment script
"""

import paramiko
import sys
import os

# Force UTF-8 output on Windows
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

HOST = "84.32.190.31"
PORT = 22
USER = "root"
PASS = "12345aB."

def run(client, cmd, timeout=120, show=True):
    print(f"\n\033[36m$ {cmd}\033[0m")
    stdin, stdout, stderr = client.exec_command(cmd, timeout=timeout, get_pty=True)
    output = ""
    while True:
        line = stdout.readline()
        if not line:
            break
        output += line
        if show:
            print(line, end="")
    err = stderr.read().decode("utf-8", errors="replace").strip()
    if err and show:
        print(f"\033[33m{err}\033[0m")
    exit_code = stdout.channel.recv_exit_status()
    return output, exit_code

def main():
    print("═══════════════════════════════════════")
    print("  Jackpot Brothers — Server Deployment ")
    print("═══════════════════════════════════════")

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    print(f"\n🔌 Connecting to {HOST}...")
    try:
        client.connect(HOST, port=PORT, username=USER, password=PASS, timeout=15)
        print("✅ Connected!\n")
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        sys.exit(1)

    # ── 1. System info ──
    print("\n─── System Info ───────────────────────")
    run(client, "uname -a && cat /etc/os-release | grep PRETTY_NAME")

    # ── 2. Update & install dependencies ──
    print("\n─── Installing System Packages ─────────")
    run(client, "apt-get update -y -q", timeout=180)
    run(client, "apt-get install -y -q git curl nginx build-essential", timeout=300)

    # ── 3. Node.js 20 via NodeSource ──
    print("\n─── Installing Node.js 20 ──────────────")
    out, _ = run(client, "node --version 2>/dev/null || echo 'not installed'", show=False)
    if "v20" in out or "v22" in out or "v18" in out:
        print(f"✅ Node already installed: {out.strip()}")
    else:
        run(client, "curl -fsSL https://deb.nodesource.com/setup_20.x | bash -", timeout=120)
        run(client, "apt-get install -y nodejs", timeout=120)
    run(client, "node --version && npm --version")

    # ── 4. PM2 ──
    print("\n─── Installing PM2 ─────────────────────")
    out, _ = run(client, "pm2 --version 2>/dev/null || echo 'not installed'", show=False)
    if "not installed" in out:
        run(client, "npm install -g pm2", timeout=120)
    else:
        print(f"✅ PM2 already installed: {out.strip()}")

    # ── 5. Clone / pull repo ──
    print("\n─── Deploying Code ─────────────────────")
    out, _ = run(client, "test -d /var/www/fbet/.git && echo EXISTS || echo MISSING", show=False)
    if "EXISTS" in out:
        print("📦 Repo exists — pulling latest...")
        run(client, "cd /var/www/fbet && git pull origin main", timeout=60)
    else:
        print("📦 Cloning repo...")
        run(client, "mkdir -p /var/www && cd /var/www && git clone https://github.com/Mshshsh/fbet.git", timeout=120)

    # ── 6. Server dependencies + env ──
    print("\n─── Setting Up Backend ─────────────────")
    run(client, "cd /var/www/fbet/server && npm install --production", timeout=300)

    # Create .env if not exists
    env_content = """NODE_ENV=production
PORT=5000
JWT_SECRET=jackpot_brothers_super_secret_jwt_key_2024_xK9mP3
CORS_ORIGIN=http://84.32.190.31
"""
    run(client, f"test -f /var/www/fbet/server/.env || echo '{env_content}' > /var/www/fbet/server/.env")
    run(client, "cat /var/www/fbet/server/.env")

    # Run seed (non-destructive — findOrCreate)
    print("\n─── Seeding Database ───────────────────")
    run(client, "cd /var/www/fbet/server && node src/seed.js", timeout=60)

    # ── 7. Start/restart server with PM2 ──
    print("\n─── Starting Backend with PM2 ──────────")
    run(client, "pm2 delete fbet-server 2>/dev/null || true")
    run(client, "cd /var/www/fbet/server && pm2 start src/server.js --name fbet-server")
    run(client, "pm2 save")
    run(client, "pm2 startup systemd -u root --hp /root 2>/dev/null || true", timeout=30)
    run(client, "pm2 list")

    # ── 8. Build client ──
    print("\n─── Building Client (React) ────────────")
    run(client, "cd /var/www/fbet/client && npm install", timeout=300)
    run(client, f"cd /var/www/fbet/client && REACT_APP_API_URL=http://84.32.190.31/api REACT_APP_SOCKET_URL=http://84.32.190.31 npm run build", timeout=300)

    # ── 9. Build admin ──
    print("\n─── Building Admin (React) ─────────────")
    run(client, "cd /var/www/fbet/admin && npm install", timeout=300)
    run(client, f"cd /var/www/fbet/admin && REACT_APP_API_URL=http://84.32.190.31 npm run build", timeout=300)

    # ── 10. Nginx config ──
    print("\n─── Configuring Nginx ──────────────────")
    nginx_conf = r"""server {
    listen 80;
    server_name 84.32.190.31;

    # Client app (React)
    root /var/www/fbet/client/build;
    index index.html;

    # API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Socket.io proxy
    location /socket.io/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Uploads (static files from server)
    location /uploads/ {
        proxy_pass http://127.0.0.1:5000;
    }

    # React Router — serve index.html for all client routes
    location / {
        try_files $uri $uri/ /index.html;
    }
}

server {
    listen 3001;
    server_name 84.32.190.31;

    # Admin panel
    root /var/www/fbet/admin/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
"""
    # Write nginx config
    sftp = client.open_sftp()
    with sftp.file("/etc/nginx/sites-available/fbet", "w") as f:
        f.write(nginx_conf)
    sftp.close()

    run(client, "ln -sf /etc/nginx/sites-available/fbet /etc/nginx/sites-enabled/fbet")
    run(client, "rm -f /etc/nginx/sites-enabled/default")
    run(client, "nginx -t")
    run(client, "systemctl restart nginx")
    run(client, "systemctl enable nginx")

    # ── 11. Firewall ──
    print("\n─── Configuring Firewall ───────────────")
    run(client, "ufw allow 22/tcp 2>/dev/null || true")
    run(client, "ufw allow 80/tcp 2>/dev/null || true")
    run(client, "ufw allow 3001/tcp 2>/dev/null || true")

    # ── 12. Final check ──
    print("\n─── Health Check ───────────────────────")
    run(client, "pm2 list")
    run(client, "systemctl status nginx --no-pager -l | head -15")
    run(client, "curl -s http://127.0.0.1:5000/health || curl -s http://127.0.0.1:5000/api/health || echo 'Server starting...'")

    client.close()

    print("\n" + "═" * 43)
    print("  ✅ DEPLOYMENT COMPLETE!")
    print("═" * 43)
    print(f"\n  🌐 Frontend : http://84.32.190.31")
    print(f"  🔧 Admin    : http://84.32.190.31:3001")
    print(f"  🔌 API      : http://84.32.190.31/api")
    print(f"\n  Admin giriş:")
    print(f"    E-posta : admin@jackpotbrothers.com")
    print(f"    Şifre   : admin123")
    print("═" * 43 + "\n")

if __name__ == "__main__":
    main()
