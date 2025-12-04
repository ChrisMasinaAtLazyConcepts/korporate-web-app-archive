export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://koporate-api-973519769657.europe-west1.run.app',
        changeOrigin: true,
        secure: false,
      }
    }
  }
}