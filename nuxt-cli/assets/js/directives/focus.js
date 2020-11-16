// 自动获取焦点指令
export default {
  // 被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
  inserted(el) {
    el.focus()
  }
}
