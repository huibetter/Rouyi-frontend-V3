# 2026-06-22 修复子组件 leaves prop 问题

## 1. 问题概述
子组件 leaf.vue 中 leaves 没有正常被父组件调用显示，存在以下问题：
- 子组件没有接收父组件传递的 leaves prop
- 子组件定义了内部的 leaves ref，导致与父组件状态分离
- 在模板中错误地使用了 leaves.value（ref 在模板中不需要 .value）
- 父组件模板中使用了未定义的 childLeaves 变量
- 子组件重置按钮直接调用 emit 而不是调用内部函数
- 子组件 resetResetTreesCount 函数 emit 的事件与父组件监听的事件不匹配
- 父组件事件处理函数名拼写错误
- 缺少叶子重置功能
- 缺少父子组件关系说明

## 2. 变更详情
### 2.1 leaf.vue 组件修复
- 在 defineProps 中添加了 leaves: Number 定义
- 移除了内部定义的 const leaves = ref(100)
- 将模板中的 {{ leaves }} 改为 {{ props.leaves }}
- 将点击事件中的 leaves.value + 1 改为 props.leaves + 1
- 将重置按钮从 @click="emit('resetResetTreesCount')" 改为 @click="resetResetTreesCount"
- 将 resetResetTreesCount 函数内部从 emit('update:treesCount', 0) 改为 emit('resetResetTreesCount')
- 添加了 resetResetLeafCount 函数，用于 emit('resetResetLeafCount') 事件
- 在模板中添加了"重置叶子数量"按钮
- 在 defineExpose 中暴露了 resetResetLeafCount 函数

涉及文件：
- [leaf.vue](file:///d:/Work/project/RouYi/frontend-V3/src/views/system/test/leaf.vue#L1-L75)

### 2.2 index.vue 父组件修复
- 将模板中的 {{ childLeaves }} 改为 {{ leaves }}，使用已定义的 leaves 变量
- 将 @resetResetTreesCount="handleTreeReset" 改为 @resetResetTreesCount="handleTreesReset"（修正拼写错误）
- 添加了 @resetResetLeafCount="resetResetLeafCount" 事件监听
- 第10行按钮已正确调用 resetResetLeafCount 函数
- 在第25-83行添加了详细的父子组件关系说明文档

涉及文件：
- [index.vue](file:///d:/Work/project/RouYi/frontend-V3/src/views/system/test/index.vue#L11)
- [index.vue](file:///d:/Work/project/RouYi/frontend-V3/src/views/system/test/index.vue#L19)
- [index.vue](file:///d:/Work/project/RouYi/frontend-V3/src/views/system/test/index.vue#L20)
- [index.vue](file:///d:/Work/project/RouYi/frontend-V3/src/views/system/test/index.vue#L25-83)

## 3. 原理说明
### 3.1 子组件事件机制
- 子组件通过 defineEmits 定义可以触发的事件
- 子组件内部通过 emit('eventName', payload) 触发事件
- 父组件通过 @eventName="handler" 监听事件

### 3.2 事件传递流程
#### 重置树数量：
1. 用户点击子组件"重置树数量"按钮
2. 触发子组件的 resetResetTreesCount 函数
3. 子组件 emit('resetResetTreesCount') 事件
4. 父组件通过 @resetResetTreesCount="handleTreesReset" 监听到事件
5. 父组件执行 handleTreesReset 函数，将 treesCount 设为 0

#### 重置叶子数量：
1. 用户点击父组件"冬眠叶子调光了"按钮
2. 直接调用父组件的 resetResetLeafCount 函数，将 leaves 设为 0
或
1. 用户点击子组件"重置叶子数量"按钮
2. 触发子组件的 resetResetLeafCount 函数
3. 子组件 emit('resetResetLeafCount') 事件
4. 父组件通过 @resetResetLeafCount="resetResetLeafCount" 监听到事件
5. 父组件执行 resetResetLeafCount 函数，将 leaves 设为 0

### 3.3 两种更新方式对比
- update:treesCount / update:leaves 事件：用于正常更新（+1）
- resetResetTreesCount / resetResetLeafCount 事件：用于重置（设为0）

## 4. 验证结果
- 代码语法正确，无错误
- 子组件现在正确接收并显示父组件传递的 leaves 值
- 父组件正确显示子组件传来的叶子数量
- 点击按钮可以正常更新父组件的 leaves 状态
- 重置树数量功能现在可以正常工作
- 重置叶子数量功能现在可以正常工作（父组件和子组件都可以触发）
- 添加了详细的父子组件关系说明文档，清晰展示了值、方法和通信方式

## 5. 后续建议
- 考虑使用 v-model:leaves 语法简化父组件代码
- 可以添加 TypeScript 类型定义以提高代码健壮性
- 建议统一命名规范，避免重复的 resetReset 前缀
