# vue-markdown-next
Using unifined as the base, the next-generation vue-markdown renderer supports Worker and optimal math formula rendering performance.
## 技术选型
    -remark
    -unifined
    -comlink
    // 以下为中间层插件形式, 因为是基于unifined为基座的(组件给参数，extends: gfm | mathjax | code高亮)
    // 用户如果使用hook.就自行进行plugin拓展
    -remark-math
    -rehype-mathjaxh/chtml"
    -remark-gfm

    HAST(Worker / 核心parser)
        ↓
    业务层
    JSX runtime → Vue VNode
## 架构
### 工程化
    打包工具: tsup
    案例使用: vite
    测试工具: vitest
    文档工具: vitePress
### 样式
    markdown样式主题可选择支持自定义css主题
    内置默认两套主题
    @yourlib/theme-default
    @yourlib/theme-github
    (需要一套规范的类名规范)
### 性能优化
    支持 Worker / WorkerPoll 处理
    支持默认套壳，开箱使用, 虚拟滚动(包含Worker)
    
    支持使用Hook用户自行处理mdast节点。
