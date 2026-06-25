<template>
    <div class="leaf">
        <label>子组件</label>

      <div class="middle">
          <span>树木数量: {{ props.treesCount }}（父组件值）</span>
          <span>种子数量: {{ seed }}</span>
      </div>

      <div>
          <button @click="resetResetTreesCount">重置树数量（父方法）</button>
          <button @click="handleAddSeed">掉了1颗种子，过了一年</button>
          <button @click="seed++">点击掉落种子</button>

          <span>叶子数量: {{ props.leaves }}</span>
          <button @click="emit('update:leaves', props.leaves + 1)">点击叶子生长</button>
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import data from '../../../../../backend-V3/ruoyi-ui/src/views/system/dict/data.vue';

const seed = ref(1);

// ---  接收父组件传递的值 (Props) ---
const props = defineProps({
  treesCount: Number,
  leaves: Number
});

// --- 定义事件 (Emits) ---
const emit = defineEmits([
  'update:treesCount',
  'update:leaves',
  'resetResetLeafCount',
  'resetResetTreesCount'
]);

const updateTreesCount = (seed) => {
  alert(`子组件：有 ${seed} 棵树了`);
};

const resetResetTreesCount = () => {
  emit('resetResetTreesCount');
  // console.log('子组件请求父组件将树木数量重置为0');
};

const resetResetLeafCount = () => {
  emit('resetResetLeafCount');
  // console.log('子组件请求父组件将叶子数量重置为0');
};


/**
 * 暴露给父组件的方法
 */
defineExpose({
  updateTreesCount,
  resetResetTreesCount,
  resetResetLeafCount
});

const handleAddSeed = () => {
  const newValue = props.treesCount + 1;
  emit('update:treesCount', newValue);
};

</script>

<style scoped>
/* 样式 */
.middle {
  margin-top: 20px;
}
</style>>