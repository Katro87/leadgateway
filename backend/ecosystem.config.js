module.exports = {
  apps: [{
    name: 'leadgateway-api',
    script: 'server.js',
    instances: 1,
    exec_mode: 'fork',
    max_restarts: 5,
    min_uptime: '30s',
    max_memory_restart: '300M',
    restart_delay: 5000,
    exp_backoff_restart_delay: 1000,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    error_file: '/root/.pm2/logs/leadgateway-api-error.log',
    out_file: '/root/.pm2/logs/leadgateway-api-out.log',
    merge_logs: true,
    env: {
      NODE_ENV: 'production',
    },
    kill_timeout: 5000,
    listen_timeout: 10000,
  }]
};