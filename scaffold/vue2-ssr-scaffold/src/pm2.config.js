module.exports = {
  apps: {
    // Runtime configs
    name: 'vue-ssr-pm2',
    script: 'NODE_ENV=production node server.js',
    port: 18001,
    // Instances
    instances: 2,
    exec_mode: 'cluster',
    // Watch files & auto restart
    watch: true,
    max_memory_restart: '500M',
    autorestart: true,
    restart_delay: 10 * 1000,
    max_restarts: 20
  },
  deploy: {}
}