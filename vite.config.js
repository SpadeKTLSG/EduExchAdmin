import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import {createSvgIconsPlugin} from 'vite-plugin-svg-icons'
import viteCompression from 'vite-plugin-compression'
import fs from 'fs'


export default defineConfig(() => {

  //解决element-plus按需引入样式问题, 以免页面疯狂重新加载
  const optimizeDepsElementPlusIncludes = ['element-plus/es', '@vuemap/vue-amap/es']
  fs.readdirSync('node_modules/element-plus/es/components').map((dirname) => {
    fs.access(`node_modules/element-plus/es/components/${dirname}/style/css.mjs`, (err) => {
      if (!err) {
        optimizeDepsElementPlusIncludes.push(`element-plus/es/components/${dirname}/style/css`)
      }
    })
  })

  //? SK Change :
  return {
    optimizeDeps: {
      include: optimizeDepsElementPlusIncludes
    }, plugins: [vue(), createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')], symbolId: 'icon-[dir]-[name]'
    }), // 自动引入内容
      AutoImport({
        imports: ['vue', 'vue-router'],
        dirs: ['src/utils/**'],
        resolvers: [ElementPlusResolver()],
        dts: 'imports.d.ts',
        eslintrc: {
          enabled: false
        }
      }), // 自动引入组件
      Components({
        dirs: ['src/components'], resolvers: [ElementPlusResolver()], dts: 'components.d.ts'
      }), // eslint
      /*  eslintPlugin({
            include: ['src/!**!/!*.js', 'src/!**!/!*.vue', 'src/!*.js', 'src/!*.vue']
        }),*/
      // 对大于 1k 的文件进行压缩
      viteCompression({
        threshold: 1000,
      })], server: {
      host: true, port: 9527, open: true
    }, resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), 'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
      }
    }, build: {
      base: './', rollupOptions: {
        // 静态资源分类打包
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js', entryFileNames: 'static/js/[name]-[hash].js', assetFileNames: 'static/[ext]/[name]-[hash].[ext]', // 静态资源分拆打包
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.toString().indexOf('.pnpm/') !== -1) {
                return id.toString().split('.pnpm/')[1].split('/')[0].toString()
              } else if (id.toString().indexOf('node_modules/') !== -1) {
                return id.toString().split('node_modules/')[1].split('/')[0].toString()
              }
            }
          }
        }
      }, sourcemap: false, target: 'es2015', reportCompressedSize: false
    }
  }
})
