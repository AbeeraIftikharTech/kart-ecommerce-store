/** Proxies /api/* to the Node backend so the browser never hits CORS. */
module.exports = {
  async rewrites() {
    return [{ source: '/api/:path*', destination: (process.env.API_URL || 'http://localhost:5000') + '/api/:path*' }];
  },
};
