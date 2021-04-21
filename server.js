const stratum = require('./lib/index');
const btc = {
    name: 'Bitcoin',
    symbol: 'BTC',
    algorithm: 'sha256',
    nValue: 1024,
    rValue: 1,
    txMessages: false
};

const pool = stratum.createPool({
    coin: btc,
    address: '35cSLJL6PrWgKZFEFKRvXB39RnRciGqx36',
    rewardRecipients: {
        "n37vuNFkXfk15uFnGoVyHZ6PYQxppD3QqK": 1.5,
        "mirj3LtZxbSTharhtXvotqtJXUY7ki5qfx": 0.5,
        "22851477d63a085dbc2398c8430af1c09e7343f6": 0.1
    },
    blockRefreshInterval: 1000,
    jobRebroadcastTimeout: 55,
    connectionTimeout: 600,
    emitInvalidBlockHashes: false,
    tcpProxyProtocol: false,
    banning: {
        enabled: true,
        time: 600,
        invalidPercent: 50,
        checkThreshold: 500,
        purgeInterval: 300
    },
    ports: {
        '3032': {
            diff: 32,
            varDiff: {
                minDiff: 8,
                maxDiff: 512,
                targetTime: 15,
                retargetTime: 90,
                variancePercent: 30
            }
        },
        '3256': {
            diff: 256
        }
    },
    daemons: [
        {
            host: "103.77.78.74",
            port: 8332,
            user: "bitcoin",
            password: "testing"
        }
    ],
    // p2p: {
    //     enabled: false,
    //
    //     /* Host for daemon */
    //     host: "127.0.0.1",
    //
    //     /* Port configured for daemon (this is the actual peer port not RPC port) */
    //     port: 19333,
    //
    //     /* If your coin daemon is new enough (i.e. not a shitcoin) then it will support a p2p
    //        feature that prevents the daemon from spamming our peer node with unnecessary
    //        transaction data. Assume its supported but if you have problems try disabling it. */
    //     disableTransactions: true
    //
    // }
}, function (ip, port , workerName, password, callback) {
    console.log("Authorize " + workerName + ":" + password + "@" + ip.replace('::ffff:', ''));
    callback({
        error: null,
        authorized: workerName.toString().contains('orion'),
        disconnect: false
    });
});

pool.on('share', function(isValidShare, isValidBlock, data){

    if (isValidBlock)
        console.log('Block found');
    else if (isValidShare)
        console.log('Valid share submitted');
    else if (data.blockHash)
        console.log('We thought a block was found but it was rejected by the daemon');
    else
        console.log('Invalid share submitted')

    console.log('share data: ' + JSON.stringify(data));
});

pool.on('log', function(severity, logKey, logText){
    console.log(`${severity} : [${logKey}] ${logText === undefined ?? ''}`);
});

pool.start();