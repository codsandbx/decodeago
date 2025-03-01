const FILE_PATH = process.env.FILE_PATH || './temp';
const UUID = process.env.UUID || 'd99c7d7f-3ea9-dea6-0258-1306243cc02a';
const ARGO_DOMAIN = process.env.ARGO_DOMAIN || '';
const ARGO_AUTH = process.env.ARGO_AUTH || '';
const CFIP = process.env.CFIP || 'time.is';
const CFPORT = process.env.CFPORT || 443;
const NAME = process.env.NAME || 'ArG';
const XRAY_PORT = process.env.XRAY_PORT || 3000;
const HTTP_PORT = process.env.HTTP_PORT || 7680;

const fs = require('fs');
const path = require('path');
const os = require('os');
const express = require('express');
const axios = require('axios');
const { spawn, execSync } = require('child_process');

const app = express();

if (!fs.existsSync(FILE_PATH)) {
    fs.mkdirSync(FILE_PATH, { recursive: true });
    console.log(`${FILE_PATH} is created`);
} else {
    console.log(`${FILE_PATH} already exists`);
}

function cleanupOldFiles() {
    const files = ['boot.log', 'sub.txt', 'config.json', 'tunnel.json', 'tunnel.yml'];
    files.forEach(file => {
        const filePath = path.join(FILE_PATH, file);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`${filePath} deleted`);
        }
    });
}
cleanupOldFiles();

function argoConfigure() {
    if (!ARGO_AUTH || !ARGO_DOMAIN) {
        console.log('\x1b[32mARGO_DOMAIN or ARGO_AUTH variable is empty, use quick tunnels\x1b[0m');
        return false;
    }
    if (ARGO_AUTH.includes('TunnelSecret')) {
        fs.writeFileSync(path.join(FILE_PATH, 'tunnel.json'), ARGO_AUTH);
        const tunnelId = ARGO_AUTH.split('"')[11];
        const tunnelConfig = `
tunnel: ${tunnelId}
credentials-file: ${path.join(FILE_PATH, 'tunnel.json')}
protocol: http2
ingress:
  - hostname: ${ARGO_DOMAIN}
    service: http://localhost:${XRAY_PORT}
    originRequest:
      noTLSVerify: true
  - service: http_status:404
`;
        fs.writeFileSync(path.join(FILE_PATH, 'tunnel.yml'), tunnelConfig);
    }
    return true;
}
const isFixedTunnel = argoConfigure();

function generateConfig() {
    const config = {
        "log": { "access": "/dev/null", "error": "/dev/null", "loglevel": "none" },
        "inbounds": [
            { 
                "port": XRAY_PORT, 
                "protocol": "vless", 
                "settings": { 
                    "clients": [{ "id": UUID, "flow": "xtls-rprx-vision" }], 
                    "decryption": "none", 
                    "fallbacks": [
                        { "dest": HTTP_PORT },
                        { "path": "/vless", "dest": 3001 },
                        { "path": "/vmess", "dest": 3002 },
                        { "path": "/trojan", "dest": 3003 }
                    ] 
                }, 
                "streamSettings": { "network": "tcp" } 
            },
            { 
                "port": 3001, 
                "listen": "127.0.0.1", 
                "protocol": "vless", 
                "settings": { "clients": [{ "id": UUID, "level": 0 }], "decryption": "none" }, 
                "streamSettings": { "network": "ws", "security": "none", "wsSettings": { "path": "/vless" } },
                "sniffing": { "enabled": true, "destOverride": ["http", "tls", "quic"], "metadataOnly": false }
            },
            { 
                "port": 3002, 
                "listen": "127.0.0.1", 
                "protocol": "vmess", 
                "settings": { "clients": [{ "id": UUID, "alterId": 0 }] }, 
                "streamSettings": { "network": "ws", "wsSettings": { "path": "/vmess" } },
                "sniffing": { "enabled": true, "destOverride": ["http", "tls", "quic"], "metadataOnly": false }
            },
            { 
                "port": 3003, 
                "listen": "127.0.0.1", 
                "protocol": "trojan", 
                "settings": { "clients": [{ "password": UUID }] }, 
                "streamSettings": { "network": "ws", "security": "none", "wsSettings": { "path": "/trojan" } },
                "sniffing": { "enabled": true, "destOverride": ["http", "tls", "quic"], "metadataOnly": false }
            }
        ],
        "outbounds": [
            { "protocol": "freedom" },
            { "tag": "WARP", "protocol": "wireguard", "settings": { "secretKey": "eKGIW4fe8QSg3v7uUFA7fkhSpJFSZhNzXyd9V6OQLm4=", "address": ["172.16.0.2/32", "2606:4700:110:8cd5:e6f7:ffe9:68b9:1f29/128"], "peers": [{ "publicKey": "bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=", "allowedIPs": ["0.0.0.0/0", "::/0"], "endpoint": "engage.cloudflareclient.com:2408" }], "mtu": 1280 } }
        ],
        "dns": { "servers": ["https+local://8.8.8.8/dns-query"] },
        "routing": { "domainStrategy": "AsIs", "rules": [{ "type": "field", "domain": ["domain:openai.com", "domain:ai.com"], "outboundTag": "WARP" }] }
    };
    fs.writeFileSync(path.join(FILE_PATH, 'config.json'), JSON.stringify(config, null, 2));
}
generateConfig();

async function downloadFiles() {
    const arch = os.arch();
    const files = arch === 'arm' || arch === 'arm64' || arch === 'aarch64' ? [
        { url: 'https://github.com/patricleeat/test/releases/download/arm64/bot13', name: 'bot' },
        { url: 'https://github.com/patricleeat/test/releases/download/ARM/web', name: 'web' }
    ] : [
        { url: 'https://github.com/patricleeat/test/releases/download/amd64/bot13', name: 'bot' },
        { url: 'https://github.com/patricleeat/test/releases/download/123/web', name: 'web' }
    ];

    for (const file of files) {
        const filePath = path.join(FILE_PATH, file.name);
        if (fs.existsSync(filePath)) {
            console.log(`\x1b[32m${filePath} already exists, skipping download\x1b[0m`);
        } else {
            const response = await axios({ method: 'get', url: file.url, responseType: 'stream' });
            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);
            await new Promise(resolve => writer.on('finish', resolve));
            console.log(`\x1b[32mDownloading ${filePath}\x1b[0m`);
        }
        fs.chmodSync(filePath, 0o755);
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
}

function runServices() {
    const web = spawn(`${FILE_PATH}/web`, ['-c', `${FILE_PATH}/config.json`], { detached: true, stdio: 'ignore' });
    web.unref();
    console.log('\x1b[32mweb is running\x1b[0m');

    // 修正 botArgs，将全局选项放在 tunnel 后，run 前
    let botArgs;
    if (isFixedTunnel) {
        if (ARGO_AUTH.includes('TunnelSecret')) {
            botArgs = ['tunnel', '--edge-ip-version', 'auto', '--no-autoupdate', '--protocol', 'http2', '--config', `${FILE_PATH}/tunnel.yml`, 'run'];
        } else {
            botArgs = ['tunnel', '--edge-ip-version', 'auto', '--no-autoupdate', '--protocol', 'http2', '--token', ARGO_AUTH, 'run'];
        }
    } else {
        botArgs = ['tunnel', '--edge-ip-version', 'auto', '--no-autoupdate', '--protocol', 'http2', '--url', `http://localhost:${XRAY_PORT}`, '--logfile', `${FILE_PATH}/boot.log`, '--loglevel', 'info'];
    }
    const bot = spawn(`${FILE_PATH}/bot`, botArgs, { detached: true, stdio: ['ignore', 'pipe', 'pipe'] });
    bot.stdout.on('data', data => console.log(`bot stdout: ${data}`));
    bot.stderr.on('data', data => console.error(`bot stderr: ${data}`));
    bot.on('error', err => console.error(`bot error: ${err}`));
    bot.unref();
    console.log('\x1b[32mbot is running\x1b[0m');

    app.listen(HTTP_PORT, '127.0.0.1', () => console.log(`Http server is running on port: ${HTTP_PORT}`));
}

function getArgoDomain() {
    if (isFixedTunnel) return ARGO_DOMAIN;
    if (fs.existsSync(path.join(FILE_PATH, 'boot.log'))) {
        const bootLog = fs.readFileSync(path.join(FILE_PATH, 'boot.log'), 'utf-8');
        const match = bootLog.match(/https:\/\/[a-zA-Z0-9+\.-]+\.trycloudflare\.com/);
        return match ? match[0].replace('https://', '') : '';
    }
    return '';
}

async function generateLinks() {
    await new Promise(resolve => setTimeout(resolve, 15000));
    const argoDomain = getArgoDomain();
    console.log(`\x1b[32mArgoDomain: \x1b[35m${argoDomain}\x1b[0m`);

    let isp;
    try {
        isp = execSync('curl -s https://speed.cloudflare.com/meta | awk -F\\" \'{print $26"-"$18}\' | sed -e \'s/ /_/g\'', { encoding: 'utf-8' }).trim();
    } catch {
        isp = 'unknown';
    }

    const vmess = JSON.stringify({ "v": "2", "ps": `${NAME}-${isp}`, "add": CFIP, "port": CFPORT, "id": UUID, "aid": "0", "scy": "none", "net": "ws", "type": "none", "host": argoDomain, "path": "/vmess", "tls": "tls", "sni": argoDomain, "alpn": "" });
    const list = `
vless://${UUID}@${CFIP}:${CFPORT}?encryption=none&security=tls&sni=${argoDomain}&type=ws&host=${argoDomain}&path=%2Fvless%3Fed%3D2048#${NAME}-${isp}
vmess://${Buffer.from(vmess).toString('base64')}
trojan://${UUID}@${CFIP}:${CFPORT}?security=tls&sni=${argoDomain}&type=ws&host=${argoDomain}&path=%2Ftrojan%3Fed%3D2048#${NAME}-${isp}
`;
    fs.writeFileSync(path.join(FILE_PATH, 'list.txt'), list);
    fs.writeFileSync(path.join(FILE_PATH, 'sub.txt'), Buffer.from(list).toString('base64'));
    console.log(fs.readFileSync(path.join(FILE_PATH, 'sub.txt'), 'utf-8'));
    console.log(`\x1b[32m${FILE_PATH}/sub.txt saved successfully\x1b[0m`);
}

app.get('/', (req, res) => {
    res.send('Hello World!');
});

async function main() {
    await downloadFiles();
    runServices();
    await generateLinks();
    console.log('\x1b[96mRunning done!\x1b[0m');
    console.log('\x1b[96mThank you for using this script, enjoy!\x1b[0m');
    await new Promise(resolve => setTimeout(resolve, 12000));
    console.clear();
}

main().catch(err => console.error('Startup failed:', err));
