import paramiko, sys, io
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect("84.32.190.31", username="root", password="12345aB.", timeout=15)

def run(cmd):
    _, stdout, stderr = client.exec_command(cmd, get_pty=True)
    out = stdout.read().decode("utf-8", errors="replace")
    print(out)

print("=== UFW STATUS ===")
run("ufw status verbose")

print("=== IPTABLES ===")
run("iptables -L INPUT -n --line-numbers 2>/dev/null | head -30")

print("=== OPEN PORTS (ss) ===")
run("ss -tlnp")

print("=== PM2 STATUS ===")
run("pm2 list")

print("=== NGINX STATUS ===")
run("systemctl is-active nginx")

client.close()
