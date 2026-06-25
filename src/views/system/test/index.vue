<template>
  <!-- <Father-component/> -->

  <div class="trees">
    <label>父组件</label>
    <div class="start">
    <span>树数量 {{ treesCount }}</span>

    <button @click="leavesUpdate">显示种子生长情况（调用子组件方法）</button>
    <button @click="resetResetLeafCount">冬眠叶子调光了(重置,子组件)</button>
    <span>子组件传来的叶子数量: {{ leaves }}</span>
    </div>
    <LeafComponent
      ref="leafRef"
      :leaves="leaves"
      :treesCount="treesCount"
      @update:treesCount="handleTreesUpdate"
      @update:leaves="handleLeavesUpdate"
      @resetResetTreesCount="handleTreesReset"
      @resetResetLeafCount="resetResetLeafCount"
    />

  </div>
</template>

<script setup name="Test">
import { ref } from 'vue'
import FatherComponent from './father.vue'
import LeafComponent from './leaf.vue';

const treesCount = ref(5);
const leaves = ref(100);

const leafRef = ref(null);

const handleLeavesUpdate = (newVal) => {
  leaves.value = newVal;
  // console.log('父组件收到更新:', newVal);
};
const handleTreesUpdate = (newVal) => {
  treesCount.value = newVal;
  // console.log('父组件收到更新:', newVal);
};

const handleTreesReset = () => {
  treesCount.value = 0;
  console.log('父组件收到重置请求');
};

const resetResetLeafCount = () => {
  leaves.value = 0;
  console.log('父组件收到重置请求');
};

const leavesUpdate = () => {
  leafRef.value?.updateTreesCount(treesCount.value);
};

</script>

<style scoped>
.start {
  margin-top: 20px;
}
</style>
