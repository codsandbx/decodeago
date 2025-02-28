const FILE_PATH = process.env.FILE_PATH || './temp'; // 运行文件夹，节点文件存放目录
const projectPageURL = process.env.URL || '';        // 项目域名，开启自动访问保活
const intervalInseconds = process.env.TIME || 120;   // 自动访问间隔时间（120秒）
const UUID = process.env.UUID || '02039208-7f6c-4375-7aea-501cc5fce2ee';
const NEZHA_SERVER = process.env.NEZHA_SERVER || ''; // 哪吒探针服务器
const NEZHA_PORT = process.env.NEZHA_PORT || '5555';
const NEZHA_KEY = process.env.NEZHA_KEY || '';
const ARGO_DOMAIN = process.env.ARGO_DOMAIN || 'decodeeoce.ttccf.ggff.net';
const ARGO_AUTH = process.env.ARGO_AUTH || '{"AccountTag":"7da1fc016ae3e32b37a5a3b33cde621b","TunnelSecret":"mDxkUMNDHl4NmlVluUYse69zeYIXWAlV370W/l+bUfA=","TunnelID":"967db3bc-822c-4f16-87b8-c0e4ea22d270","Endpoint":""}';
const CFIP = process.env.CFIP || 'government.se';
const CFPORT = process.env.CFPORT || 443;
const NAME = process.env.NAME || 'Codbox';
const ARGO_PORT = process.env.ARGO_PORT || 8080;
const PORT = process.env.SERVER_PORT || process.env.PORT || 3000;

const express = require('express');
const app = express();
const axios = require('axios');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const { execSync } = require('child_process');

// 初始化目录
if (!fs.existsSync(FILE_PATH)) {
    fs.mkdirSync(FILE_PATH);
    console.log(FILE_PATH + ' is created');
} else {
    console.log(FILE_PATH + ' already exists');
}

// 清理旧文件
const pathsToDelete = ['web', 'bot', 'npm', 'sub.txt', 'boot.log'];
function cleanupOldFiles() {
    pathsToDelete.forEach(file => {
        const filePath = path.join(FILE_PATH, file);
        fs.unlink(filePath, err => {
            if (err) console.error('Error deleting ' + filePath);
            else console.log(filePath + ' deleted');
        });
    });
}
cleanupOldFiles();

// 主页路由
app.get('/', function(req, res) {
    res.send('Hello world!');
});

// Xray 配置
const config = {
    "log": {
        "access": "/dev/null",
        "error": "/dev/null",
        "loglevel": "none"
    },
    "inbounds": [
        {
            "port": ARGO_PORT,
            "protocol": "vless",
            "settings": {
                "clients": [{ "id": UUID, "flow": "xtls-rprx-vision" }],
                "decryption": "none",
                "fallbacks": [
                    { "dest": 3001 },
                    { "path": "/vless", "dest": 3002 },
                    { "path": "/vmess", "dest": 3003 },
                    { "path": "/trojan", "dest": 3004 }
                ]
            },
            "streamSettings": { "network": "tcp" }
        },
        {
            "port": 3001,
            "listen": "127.0.0.1",
            "protocol": "vless",
            "settings": {
                "clients": [{ "id": UUID }],
                "decryption": "none"
            },
            "streamSettings": { "network": "ws", "security": "none" }
        },
        {
            "port": 3002,
            "listen": "127.0.0.1",
            "protocol": "vless",
            "settings": {
                "clients": [{ "id": UUID, "level": 0 }],
                "decryption": "none"
            },
            "streamSettings": {
                "network": "ws",
                "security": "none",
                "wsSettings": { "path": "/vless" }
            },
            "sniffing": { "enabled": true, "destOverride": ["http", "tls", "quic"], "metadataOnly": false }
        },
        {
            "port": 3003,
            "listen": "127.0.0.1",
            "protocol": "vmess",
            "settings": { "clients": [{ "id": UUID, "alterId": 0 }] },
            "streamSettings": { "network": "ws", "wsSettings": { "path": "/vmess" } },
            "sniffing": { "enabled": true, "destOverride": ["http", "tls", "quic"], "metadataOnly": false }
        },
        {
            "port": 3004,
            "listen": "127.0.0.1",
            "protocol": "trojan",
            "settings": { "clients": [{ "password": UUID }] },
            "streamSettings": { "network": "ws", "security": "none", "wsSettings": { "path": "/trojan" } },
            "sniffing": { "enabled": true, "destOverride": ["http", "tls", "quic"], "metadataOnly": false }
        }
    ],
    "dns": { "servers": ["https+local://8.8.8.8/dns-query"] },
    "outbounds": [
        { "protocol": "freedom" },
        {
            "tag": "WARP",
            "protocol": "wireguard",
            "settings": {
                "secretKey": "YFYOAdbw1bKTHlNNi+aEjBM3BO7unuFC5rOkMRAz9XY=",
                "address": ["172.16.0.2/32", "2606:4700:110:8a36:df92:102a:9602:fa18/128"],
                "peers": [{
                    "publicKey": "bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=",
                    "allowedIPs": ["0.0.0.0/0", "::/0"],
                    "endpoint": "162.159.193.10:2408"
                }],
                "reserved": [78, 135, 76],
                "mtu": 1280
            }
        }
    ],
    "routing": {
        "domainStrategy": "AsIs",
        "rules": [
            { "type": "field", "domain": ["domain:openai.com", "domain:ai.com"], "outboundTag": "WARP" }
        ]
    }
};
fs.writeFileSync(path.join(FILE_PATH, 'config.json'), JSON.stringify(config, null, 2));

// 获取系统架构
function getSystemArchitecture() {
    const arch = os.arch();
    return (arch === 'arm' || arch === 'arm64' || arch === 'aarch64') ? 'arm' : 'amd';
}

// 下载文件
function downloadFile(fileName, fileUrl, callback) {
    const filePath = path.join(FILE_PATH, fileName);
    const writer = fs.createWriteStream(filePath);
    axios({
        method: 'get',
        url: fileUrl,
        responseType: 'stream'
    }).then(response => {
        response.data.pipe(writer);
        writer.on('finish', () => {
            writer.close();
            console.log('Download ' + fileName + ' successfully');
            callback(null, fileName);
        });
        writer.on('error', err => {
            fs.unlink(filePath, () => {});
            const errorMsg = 'Download ' + fileName + ' failed: ' + err.message;
            console.error(errorMsg);
            callback(errorMsg);
        });
    }).catch(err => {
        const errorMsg = 'Download ' + fileName + ' failed: ' + err.message;
        console.error(errorMsg);
        callback(errorMsg);
    });
}

// 下载并运行文件
async function downloadFilesAndRun() {
    const arch = getSystemArchitecture();
    const files = getFilesForArchitecture(arch);
    if (files.length === 0) {
        console.log('Can\'t find a file for the current architecture');
        return;
    }
    const downloadPromises = files.map(file => {
        return new Promise((resolve, reject) => {
            downloadFile(file.fileName, file.fileUrl, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    });
    try {
        await Promise.all(downloadPromises);
    } catch (err) {
        console.error('Error downloading files: ', err);
        return;
    }

    // 设置文件权限
    function setPermissions(files) {
        const mode = 0o777;
        files.forEach(file => {
            const filePath = path.join(FILE_PATH, file);
            fs.chmod(filePath, mode, err => {
                if (err) console.error('Empowerment failed for ' + filePath + ': ' + err);
                else console.log('Empowerment success for ' + filePath + ': ' + mode.toString(8));
            });
        });
    }
    const filesToChmod = ['./npm', './web', './bot'];
    setPermissions(filesToChmod);

    // 运行哪吒探针
    let nezhaTls = '';
    if (NEZHA_SERVER && NEZHA_PORT && NEZHA_KEY) {
        const tlsPorts = ['443', '8443', '2096', '2087', '2083', '2053'];
        nezhaTls = tlsPorts.includes(NEZHA_PORT) ? '--tls' : '';
        const nezhaCmd = `nohup ${FILE_PATH}/npm ${NEZHA_SERVER}:${NEZHA_PORT} -p ${NEZHA_KEY} ${nezhaTls} >/dev/null 2>&1 &`;
        try {
            await exec(nezhaCmd);
            console.log('npm is running');
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (err) {
            console.error('npm running error: ' + err);
        }
    } else {
        console.log('NEZHA variable is empty, skip running');
    }

    // 运行 Xray
    const xrayCmd = `nohup ${FILE_PATH}/web -c ${FILE_PATH}/config.json >/dev/null 2>&1 &`;
    try {
        await exec(xrayCmd);
        console.log('web is running');
        await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
        console.error('web running error: ' + err);
    }

    // 运行 Argo
    if (fs.existsSync(path.join(FILE_PATH, 'bot'))) {
        let argoCmd;
        if (ARGO_AUTH.match(/^[A-Z0-9a-z=]{120,250}$/)) {
            argoCmd = `tunnel --edge-ip-version auto --no-autoupdate --protocol http2 run --token ${ARGO_AUTH}`;
        } else if (ARGO_AUTH.match(/TunnelSecret/)) {
            argoCmd = `tunnel --edge-ip-version auto --config ${FILE_PATH}/tunnel.yml`;
        } else {
            argoCmd = `tunnel --edge-ip-version auto --no-autoupdate --protocol http2 --logfile ${FILE_PATH}/boot.log --loglevel info --url http://localhost:${ARGO_PORT}`;
        }
        try {
            await exec(`nohup ${FILE_PATH}/bot ${argoCmd} >/dev/null 2>&1 &`);
            console.log('bot is running.');
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (err) {
            console.error('Error executing command: ' + err);
        }
    }
    await new Promise(resolve => setTimeout(resolve, 5000));
}

// 获取架构对应的文件
function getFilesForArchitecture(arch) {
    if (arch === 'arm') {
        return [
            { fileName: 'npm', fileUrl: 'https://github.com/eooce/test/releases/download/ARM/swith' },
            { fileName: 'web', fileUrl: 'https://github.com/eooce/test/releases/download/arm64/bot13' },
            { fileName: 'bot', fileUrl: 'https://github.com/eooce/test/releases/download/ARM/web' }
        ];
    } else if (arch === 'amd') {
        return [
            { fileName: 'npm', fileUrl: 'https://github.com/eooce/test/raw/main/amd64' },
            { fileName: 'web', fileUrl: 'https://github.com/eooce/test/raw/main/web' },
            { fileName: 'bot', fileUrl: 'https://github.com/eooce/test/raw/main/server' }
        ];
    }
    return [];
}

// 配置 Argo 隧道
function argoType() {
    if (!ARGO_AUTH || !ARGO_DOMAIN) {
        console.log('ARGO_DOMAIN or ARGO_AUTH variable is empty, use quick tunnels');
        return;
    }
    if (ARGO_AUTH.includes('TunnelSecret')) {
        fs.writeFileSync(path.join(FILE_PATH, 'tunnel.json'), ARGO_AUTH);
        const tunnelConfig = `
tunnel: ${ARGO_AUTH.split('"')[11]}
credentials-file: ${path.join(FILE_PATH, 'tunnel.json')}
protocol: http2
ingress:
  - hostname: ${ARGO_DOMAIN}
    service: http://localhost:${ARGO_PORT}
    originRequest:
      noTLSVerify: true
  - service: http_status:404
`;
        fs.writeFileSync(path.join(FILE_PATH, 'tunnel.yml'), tunnelConfig);
    } else {
        console.log('ARGO_AUTH mismatch TunnelSecret, use token connect to tunnel');
    }
}
argoType();

// 提取域名并生成订阅
async function extractDomains() {
    let argoDomain;
    if (ARGO_AUTH && ARGO_DOMAIN) {
        argoDomain = ARGO_DOMAIN;
        console.log('ARGO_DOMAIN:', argoDomain);
        await generateSubscription(argoDomain);
    } else {
        try {
            const bootLog = fs.readFileSync(path.join(FILE_PATH, 'boot.log'), 'utf-8');
            const lines = bootLog.split('\n');
            const domains = [];
            lines.forEach(line => {
                const match = line.match(/https?:\/\/([^ ]*trycloudflare\.com)\/?/);
                if (match) domains.push(match[1]);
            });
            if (domains.length > 0) {
                argoDomain = domains[0];
                console.log('ArgoDomain:', argoDomain);
                await generateSubscription(argoDomain);
            } else {
                console.log('ArgoDomain not found, re-running bot to obtain ArgoDomain');
                fs.unlinkSync(path.join(FILE_PATH, 'boot.log'));
                await new Promise(resolve => setTimeout(resolve, 2000));
                const botCmd = `tunnel --edge-ip-version auto --no-autoupdate --protocol http2 --logfile ${FILE_PATH}/boot.log --loglevel info --url http://localhost:${ARGO_PORT}`;
                try {
                    await exec(`nohup ${path.join(FILE_PATH, 'bot')} ${botCmd} >/dev/null 2>&1 &`);
                    console.log('bot is running.');
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    await extractDomains();
                } catch (err) {
                    console.error('Error executing command: ' + err);
                }
            }
        } catch (err) {
            console.error('Error reading boot.log:', err);
        }
    }

    async function generateSubscription(domain) {
        const meta = execSync('curl -s https://speed.cloudflare.com/meta | awk -F\\" \'{print $26"-"$18}\' | sed -e \'s/ /_/g\'', { encoding: 'utf-8' });
        const location = meta.trim();
        const subscription = `
vmess://${Buffer.from(JSON.stringify({ v: '2', ps: `${NAME}-${location}`, add: CFIP, port: CFPORT, id: UUID, aid: '0', scy: 'none', net: 'ws', type: 'none', host: domain, path: '/vmess?ed=2048', tls: 'tls', sni: domain, alpn: '' })).toString('base64')}
trojan://${UUID}@${CFIP}:${CFPORT}?encryption=none&security=tls&sni=${domain}&type=ws&host=${domain}&path=%2Ftrojan%3Fed%3D2048#${NAME}-${location}
`;
        console.log(Buffer.from(subscription).toString('base64'));
        const subPath = path.join(FILE_PATH, 'sub.txt');
        fs.writeFileSync(subPath, Buffer.from(subscription).toString('base64'));
        console.log(FILE_PATH + '/sub.txt saved successfully');

        app.get('/sub', (req, res) => {
            const subContent = Buffer.from(subscription).toString('base64');
            res.set('Content-Type', 'text/plain; charset=utf-8');
            res.send(subContent);
        });
    }
}

// 文件路径常量
const npmPath = path.join(FILE_PATH, 'npm');
const webPath = path.join(FILE_PATH, 'web');
const botPath = path.join(FILE_PATH, 'bot');
const bootLogPath = path.join(FILE_PATH, 'boot.log');
const configPath = path.join(FILE_PATH, 'config.json');

// 清理文件
function cleanFiles() {
    setTimeout(() => {
        exec(`rm -rf ${bootLogPath} ${configPath} ${npmPath} ${webPath} ${botPath}`, (err, stdout, stderr) => {
            if (err) {
                console.error('Error while deleting files: ' + err);
                return;
            }
            console.clear();
            console.log('App is running');
            console.log('Thank you for using this script, enjoy!');
        });
    }, 60000);
}
cleanFiles();

// 定期访问保活
let hasLoggedEmptyMessage = false;
async function visitProjectPage() {
    try {
        if (!projectPageURL || !intervalInseconds) {
            if (!hasLoggedEmptyMessage) {
                console.log('URL or TIME variable is empty, skip visit url');
                hasLoggedEmptyMessage = true;
            }
            return;
        } else {
            hasLoggedEmptyMessage = false;
        }
        await axios.get(projectPageURL);
        console.log('Page visited successfully');
        console.clear();
    } catch (err) {
        console.error('Error visiting project page:', err.message);
    }
}
setInterval(visitProjectPage, intervalInseconds * 1000);

// 启动服务
async function startServer() {
    await downloadFilesAndRun();
    await extractDomains();
    visitProjectPage();
}

startServer();
app.listen(PORT, () => console.log('Http server is running on port:' + PORT + '!'));
