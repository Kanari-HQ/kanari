var config = {
    local: {
        mode: 'local',
        dbUrl: 'tcp://localhost:5432/kanari_development',
        port: 3000
    },
    staging: {
        mode: 'staging',
        port: 4000
    },
    production: {
        mode: 'production',
        port: 5000
    }
}
module.exports = function(mode) {
    return config[mode || process.argv[2] || 'local'] || config.local;
}