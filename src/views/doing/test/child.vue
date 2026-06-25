<template>
  <div style="padding: 10px; background: #f0f9f0; border-radius: 8px; border: 1px solid #ccc;">
    <h3>🧒 子组件</h3>
    <p><strong>姓氏（来自父组件Props）：</strong>{{ props.familyName }}</p>
    <p><strong>手里的钱（来自父组件Props）：</strong>{{ props.money }} 元</p>

    <!-- 3. 子组件调用父组件的方法 (通过 emit) -->
    <button @click="emit('callFatherMethod')" style="margin-right: 10px;">
      📞 呼叫父组件（子调父方法）
    </button>

    <!-- 2. 子组件传值给父组件 (通过 emit) -->
    <button @click="handleAddMoney">
      💰 赚了100块，通知父组件更新
    </button>

    <hr />
    <p style="color: blue;">【子组件内部私有状态】：{{ internalCount }} 次</p>
    <button @click="internalCount++">子组件自己点着玩（不影响父）</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// --- 1. 接收父组件传递的值 (Props) ---
const props = defineProps({
  familyName: String,
  money: Number
});

// --- 2. 定义要触发的事件 (Emits) ---
const emit = defineEmits([
  'update:money',        // 用于修改父组件的钱
  'callFatherMethod'     // 用于通知父组件执行方法
]);

// --- 子组件自己的内部数据 (父组件无法直接访问) ---
    const internalCount = ref(0);

// --- 3. 子组件内部方法 (准备暴露给父组件调用) ---
const goToSleep = (time) => {
  alert(`子组件说：好的，我 ${time} 就去睡觉 ZZZ...`);
};

const resetMoney = () => {
  // 子组件通过 emit 通知父组件把值改成 0
  emit('update:money', 0);
  console.log('子组件请求父组件将钱重置为0');
};

// --- 4. 暴露方法给父组件 (父组件通过 ref 调用) ---
defineExpose({
  goToSleep,
  resetMoney
});

// --- 子组件自己的业务：赚钱并通知父组件更新数据 ---
const handleAddMoney = () => {
  const newValue = props.money + 100;
  emit('update:money', newValue);
};
</script>