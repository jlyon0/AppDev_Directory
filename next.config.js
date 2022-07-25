/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    apiUrl: "https://docker-dev.butler.edu:3002",
    minioUrl: "https://localhost:9002/directory",
    GitHub_ID: "5da26551d316f537418f",
    GitHub_Secret: "3cb0140b1353b45e1538d40707ee08f08cb00ca8",
    Auth0_ID: "IAOzCl5ue1nJyiCntfCy7Q7kCCUWTh0S",
    Auth0_Secret: "6mc_47qqqw5vBNWsS5SoihcidsVzAhXYQpMtW0UsudsH5pJb1cr_xRcxj94yPvpF",
    Auth0_Issuer: "https://dev--n9m46x1.us.auth0.com"
  },
  
    
}

module.exports = (phase, { defaultConfig }) => {
  return {
    ...nextConfig,

    webpack: (config) => {
      config.resolve = {
        ...config.resolve,
        fallback: {
          "fs": false,
          "path": false,
          "os": false,
        }
      }
      return config
    },
  }
}
// module.exports = nextConfig
