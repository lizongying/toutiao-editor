import {defineConfig} from 'vite'
import {viteStaticCopy} from 'vite-plugin-static-copy'

export default defineConfig({
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: 'src/assets/*',
                    dest: ''
                }
            ]
        })
    ],
    build: {
        rollupOptions: {
            input: {
                content: 'src/content.js',
            },
            output: {
                dir: 'dist',
                entryFileNames: '[name].js'
            }
        }
    }
})