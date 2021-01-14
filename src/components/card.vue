<template>
  <el-card class="card">
    <div slot="header" class="title">
      <span class="title-text">{{ title }}</span>
    </div>
    <slot />
  </el-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '标题'
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  width: 1280px;
  margin: 24px auto 0;
  div.title {
    text-align: left;
  }
  .title-text {
      color: rgba(41, 48, 64, 1);
      font-size: 16px;
      font-weight: 600;
  }
}
</style>
