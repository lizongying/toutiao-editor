import {defineConfig} from 'vite'
import {createHtmlPlugin} from "vite-plugin-html"
import {dirname, resolve} from 'path'
import {fileURLToPath} from 'url'


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
    plugins: [
        createHtmlPlugin({
            minify: true
        })
    ],
    publicDir: 'public',
    base: './',
    build: {
        rollupOptions: {
            input: {
                index: resolve(__dirname, 'index.html'),
                popup: resolve(__dirname, 'popup.html'),
                content: resolve(__dirname, 'src/content.js'),
            },
            output: {
                dir: 'docs',
                entryFileNames: 'static/[name].js',
            }
        }
    }
})