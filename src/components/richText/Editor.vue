<template>
  <div>
    <div ref="editor" style="text-align:left" />
  </div>
</template>

<script>
import E from 'wangeditor'

export default {
  name: 'Editor',
  props: {
    contents: {
      type: String,
      default: ''
    }
  },
  watch: {
    contents(val) {
      this.editor.txt.html(val)
    }
  },
  beforeUpdate() {
    console.log('berf')
  },
  updated() {
    console.log('updata')
  },
  mounted() {
    const editor = new E(this.$refs.editor)
    editor.customConfig.onchange = (html) => {
      this.$emit('updataValue', html)
    }
    editor.create()
    editor.txt.html(this.contents)
    this.editor = editor
  }
}
</script>

<style scoped>
</style>
