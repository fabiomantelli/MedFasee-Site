/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// }

// module.exports = nextConfig

module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://150.162.19.214:6152/:path*', // The :path parameter is used here so will not be automatically passed in the query
      },
    ]
  },
}