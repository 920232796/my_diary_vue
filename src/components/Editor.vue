<template>
  <div class="editor1">
      <mavon-editor defaultOpen="edit" ref="md" v-model="editContent"
       @imgAdd="$imgAdd" 
       @imgDel="$imgDel"
       @change="editChange"></mavon-editor>
  </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import axios from 'axios'
import Bus from "@/components/Bus.vue"

export default {
  name: 'editor',
  data () {
      return {
        editContent: "",
        editBookId: "",
      }
  } ,
  props: {
    
  },
  mounted () {
      Bus.$on("clickBook", (book_data) => {
          this.editContent = book_data.editContent;
          this.editBookId = book_data.editBookId;
      });
        //得到通知，证明点击提交按钮了！
      Bus.$on("informEditor", () => {
        //   console.log("inform !!")
          Bus.$emit("getBookData", this.editContent);
      })
  },

  methods: {
      editChange(value, render) {
        //监听到编辑区域发生了改变，所以应该提交内容！！ 这样就不用手动提交了！
        // console.log("hello change");
        // console.log(value);
        //发信号给导航区域，自动给点击提交！
        // Bus.$emit("getBookData", value); //把自动提交关了把！！ 提交太多次了。
      },
      $imgAdd(pos, $file){
            // 第一步.将图片上传到服务器.
            var formdata = new FormData();
            formdata.append('image', $file);
            axios.post("/api/book/imageUpload", formdata)
              .then(res=>{
              console.log(res);
              this.$refs.md.$img2Url(pos, res.data.url);
            })
          },
          $imgDel(){

          }
  }
}
</script>

<style scoped>

</style>
