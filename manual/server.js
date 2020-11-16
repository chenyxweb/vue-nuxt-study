const Vue = require('vue')
const server = require('express')()
const fs = require('fs')
// 同步读取模板文件
const template = fs.readFileSync('./index.html', 'utf-8')
const renderer = require('vue-server-renderer').createRenderer({ template })

const context = {
  title: 'vue ssr',
  metas: `
      <meta name="keyword" content="vue,ssr">
      <meta name="description" content="vue srr demo">
  `,
}

// 监听请求
server.get('*', (req, res) => {
  // 创建vue实例
  const app = new Vue({
    data: {
      url: req.url,
    },
    template: `<div>您访问的url是: {{url}} </div>`,
  })

  // 拿到vue实例渲染出来的html string , 响应给前端
  renderer.renderToString(app, context, (err, html) => {
    console.log(html)
    if (err) {
      console.log(err)
      res.status(500).end('Internal Server Error')
      return
    }
    res.end(html)
  })
})

// 监听端口
server.listen(8000, () => console.log('服务已启动在8000端口!!!'))
