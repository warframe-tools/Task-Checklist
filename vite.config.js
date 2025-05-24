// vite.config.js
import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html' 
import fs from 'node:fs' 
import path from 'node:path' 

export default defineConfig({
  root: 'sources',
  base: '/Task-Checklist/',

  plugins: [
    createHtmlPlugin({
      minify: true, // Minify the HTML in production
      inject: {
        data: {
          // Read the content of critical.css and wrap it in <style> tags
          // This ensures it's truly inline in the built HTML
          criticalCss: `<style type="text/css">\n${fs.readFileSync(path.resolve(__dirname, 'sources/css/critical.css'), 'utf-8')}\n</style>`
        },
      },
    }),
  ],

  build: {
    outDir: '../pages', // Output to 'pages' at the project root
    emptyOutDir: true,
  },
})
