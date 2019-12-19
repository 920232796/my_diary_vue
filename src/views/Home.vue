<template>
  <div class="home">
   <LeftNavi/>
   <Editor class="my_editor"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import LeftNavi from "@/components/LeftNavi.vue"
import Editor from "@/components/Editor.vue"
export default {
  name: 'home',
  components: {
    LeftNavi,
    Editor,
  }
}
</script>

<style scoped>
    .my_editor {
      width: 960px;
      /* border: 1px solid red; */

      margin-left: 700px;
    }
</style>
