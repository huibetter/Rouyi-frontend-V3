<template>
  <div style="padding: 20px; border: 2px solid #42b883; border-radius: 8px;">
    <h2>👨‍👦 父组件</h2>
    <p style="color: red;">【父组件自己的钱】：{{ fatherMoney }} 元</p>

    <!-- 1. 父组件调用子组件的方法（通过 ref） -->
    <button @click="handleCallChildMethod" style="margin-right: 10px;">
      🔧 点击调用子组件的【睡觉】方法
    </button>
    <button @click="handleResetChildMoney">
      🔧 点击重置子组件的钱为 0
    </button>

    <hr style="margin: 20px 0;" />

    <!--
      2. 父传值给子 (通过 props)
      3. 子传值给父 (通过 @update:money 监听)
    -->
    <ChildComponent
      ref="childRef"
      :family-name="familyName"
      :money="fatherMoney"
      @update:money="handleMoneyUpdate"
      @call-father-method="handleChildCallFather"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

// --- 引入子组件 ---
import ChildComponent from './child.vue';
// 如果你要复制到单个文件测试，请把下面的子组件代码拆分成 ChildComponent.vue，
// 或者直接在本文件内定义（但 Vue 单文件要求一个文件只能有一个 <script setup>，这里演示拆分思维）

// --- 父组件自己的数据 ---
const fatherMoney = ref(1000);
const familyName = ref('王');

// --- 获取子组件的引用 (用于调用子组件方法) ---
const childRef = ref(null);

// --- 场景1: 父组件调用子组件的方法 ---
const handleCallChildMethod = () => {
  // 通过 childRef.value 调用子组件暴露出来的方法
  childRef.value?.goToSleep('晚上10点');
};

const handleResetChildMoney = () => {
  childRef.value?.resetMoney();
};

// --- 场景2: 子组件触发更新，父组件接收值 (子传父) ---
const handleMoneyUpdate = (newMoney) => {
  fatherMoney.value = newMoney;
  console.log('父组件收到了子组件修改后的钱:', newMoney);
};

// --- 场景4: 子组件调用父组件的方法（实际是通过emit让父执行自己的方法）---
const handleChildCallFather = () => {
  alert('父组件的方法被调用了！父组件说：孩子真乖！');
};
</script>