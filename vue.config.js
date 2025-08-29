module.exports = {
  "devServer": {
    "open": true,
    "disableHostCheck": true,

    "proxy": {
      '/isc_sso': {//4A登录
        target: 'https://10.150.2.1:9122/isc_sso',
        changeOrigin: true,
        pathRewrite: {
          '^/isc_sso': ''
        },
        headers: {//
          Host: '10.150.2.1:9122',
          Origin: 'https://10.150.2.1:9122/',
          Referer: 'https://10.150.2.1:9122/isc_sso/login'
        }
      },
  
      '/YX': {//营销系统整合
        target: 'http://10.150.23.1:8010',
        changeOrigin: true,
        pathRewrite: {
          '^/YX': ''
        },
        headers: {//营销设置referer
          Host: '10.150.23.1:8010',
          Origin: 'http://10.150.23.1:8010',
          Referer: 'http://10.150.23.1:8010'
        }
      },
  
      '/PMS': {//营销系统整合
        target: 'http://10.150.23.1:8010/PMS',
        changeOrigin: true,
        pathRewrite: {
          '^/PMS': ''
        },
        headers: {//营销设置referer
          Host: '10.150.23.1:8010',
          Origin: 'http://10.150.23.1:8010',
          Referer: 'http://10.150.23.1:8010/PMS/index.jsp'
        }
      },
  
  
      '/YDLWFB': {//营销系统整合
        target: 'http://10.150.23.1:8010/YDLWFB',
        changeOrigin: true,
        pathRewrite: {
          '^/YDLWFB': ''
        },
        headers: {//营销设置referer
          Host: '10.150.23.1:8010',
          Origin: 'http://10.150.23.1:8010',
          Referer: 'http://10.150.23.1:8010/YDLWFB'
        }
      },
      '/JFZX': {//营销系统整合
        target: 'http://10.150.23.1:8010/JFZX',
        changeOrigin: true,
        pathRewrite: {
          '^/JFZX': ''
        },
        headers: {//营销设置referer
          Host: '10.150.23.1:8010',
          Origin: 'http://10.150.23.1:8010',
          Referer: 'http://10.150.23.1:8010/PMS/index.jsp'
        }
      },
      '/YKZX': {//营销系统整合
        target: 'http://10.150.23.1:8010/YKZX',
        changeOrigin: true,
        pathRewrite: {
          '^/YKZX': ''
        },
        headers: {//营销设置referer
          Host: '10.150.23.1:8010',
          Origin: 'http://10.150.23.1:8010',
          Referer: 'http://10.150.23.1:8010/PMS/index.jsp'
        }
      },
      '/ZWZX': {//营销系统整合
        target: 'http://10.150.23.1:8010/ZWZX',
        changeOrigin: true,
        pathRewrite: {
          '^/ZWZX': ''
        },
        headers: {//营销设置referer
          Host: '10.150.23.1:8010',
          Origin: 'http://10.150.23.1:8010',
          Referer: 'http://10.150.23.1:8010/PMS/index.jsp'
        }
      },
      '/GGZX': {//营销系统整合
        target: 'http://10.150.23.1:8010/GGZX',
        changeOrigin: true,
        pathRewrite: {
          '^/GGZX': ''
        },
        headers: {//营销设置referer
          Host: '10.150.23.1:8010',
          Origin: 'http://10.150.23.1:8010',
          Referer: 'http://10.150.23.1:8010/PMS/index.jsp'
        }
      },
  
  
      



    },


  },
  css: { extract: false },
  transpileDependencies: [
    'vuetify'
  ],

  runtimeCompiler: true,
  productionSourceMap: false
}
