<template>
    <div class="container">
    <el-col :span="4" class="navi">
        <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
            <el-submenu index="1">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>我的笔记本</span>
                </template>
                <el-menu-item-group>
            
                    <el-menu-item index="1-1"
                                    v-for = "eachBookCollection of bookCollection"
                                    :key = eachBookCollection.id
                                    @click="clickBookCollection(eachBookCollection.name)"
                    >{{eachBookCollection.name}}</el-menu-item>
                </el-menu-item-group>

            </el-submenu>
            <el-menu-item index="2" @click="addBookCollection">
                <i class="el-icon-menu"></i>
                <span slot="title" >添加笔记本</span>
            </el-menu-item>
            <el-menu-item index="3" @click="addBook">
                <i class="el-icon-document"></i>
                <span slot="title">添加笔记</span>
            </el-menu-item>
            <el-menu-item index="4"  @click="submitBook">
                <i class="el-icon-setting"></i>
                <span slot="title">提交笔记</span>
            </el-menu-item>
        </el-menu>
    </el-col>

    <div class = "book">
      <div
        class="block"
        v-for="each_book of bookList"
        :key="each_book.id"
        @click="clickBook(each_book.id, each_book.content)"
      >
        <div class="title">
            {{each_book.content.substring(0,15)}}
        </div>
          <div class="content">
            {{each_book.content.substring(0,40)}}
          </div>

      </div>
    </div>

     <!-- <el-dialog
      title="提示"
      :visible.sync="submitEditdialogVisible"
      width="30%">
      <span>{{isEditSucc}}</span>
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="submitEditdialogVisible = false">确 定</el-button>
  </span>
    </el-dialog> -->
     <!-- <el-button :plain="true" @click="open">{{isEditSucc}}</el-button> -->



    <el-dialog
      title="提示"
      :visible.sync="addBookCollectionDialog"
      width="30%">
      <div class="bijiben">请输入笔记本名称</div><span><el-input v-model="inputBookCollection" placeholder="请输入内容"></el-input></span>
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="addBookCollectionSubmit">确 定</el-button>
  </span>
    </el-dialog>


    <el-dialog
      title="提示"
      :visible.sync="addBookDialog"
      width="30%">
      <span>还没有选中笔记本，无法添加笔记！</span>
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="addBookDialog = false">确 定</el-button>
  </span>
    </el-dialog>


  </div>
</template>

<script>
import axios from 'axios'
import Bus from "@/components/Bus.vue"
    export default {
        name: '',
        data () {
            return {
              bookCollection: [],
              bookList: [],
              editContent: "",
              editBookId: -1,
              isEditSucc: "还没有选中笔记！",
              submitEditdialogVisible: false,
              currentBookCollection: null,
              inputBookCollection: "",
              addBookCollectionDialog: false,
              addBookDialog: false
            }
        },
        mounted () {
            //点击提交按钮之后，在这里接收一下editor传过来的数据
            Bus.$on("getBookData", (data) => {
                this.editContent = data;
                //接收到通知了，这里需要真正进行提交笔记！
                this.submitBookDo();
            });
            window.addEventListener('scroll', this.handleScroll); // 弄一个监听事件 监听滚动
            document.addEventListener('keydown',this.handleEvent); //监听键盘事件！

        },
        methods: {
            handleEvent(event) {
              if (event.keyCode == 13 && event.ctrlKey) {
                console.log("hello enter");
                this.submitBook();
              }

            },
            handleScroll() {
               var scrollTop = window.pageYOffset || 
                  document.documentElement.scrollTop || 
                  document.body.scrollTop; //获取滑动了多少px
                  // document.querySelector('.navi').style.marginTop = scrollTop + "px";
                  var height = document.querySelector('.navi').offsetHeight; //获取当前导航框的高度
                  var flag = 1; //表示初始没动过！
                  if (scrollTop > height - 100 && flag == 1) {
                    //说明看不见导航框了！
                    //要修改margin-top！
                    document.querySelector('.navi').style.marginTop = scrollTop + "px";
                    flag = 0;//表示移动过了
                  } 
                  if (flag == 0 && scrollTop < height) {
                    // console.log("haha");
                    document.querySelector('.navi').style.marginTop = 5 + "px";
                    flag = 1;
                  }
                
            },
            handleOpen(index, indexPath) {
//                console.log(index)
                if (index == 1) {
                    this.getAllBookCollectionOfOne()
                }
            },
            handleClose(index, indexPath) {
            //    console.log(index)
              this.currentBookCollection = null
              this.editBookId = -1
              this.bookCollection = []
              this.editContent = ""
            },
            // 得到所有笔记本
            getAllBookCollectionOfOne(){
                axios.get('/api/book/getAllBookCollection', {
                    params: {

                    }
                }).then(this.handleGetBookCollectionSucc)
            },
            //
            handleGetBookCollectionSucc (res) {
//                console.log(res)
                res = res.data
                if (res.ret == 'success') {
                    // console.log(res);
                    this.bookCollection = res.arrays
                }
                else {
                    //说明没成功 然后输出失败的原因 cause 显示到登陆界面上就好了
                    // console.log(res.message)
                    this.errorMessage = res.message
                }

            },
            //点击一个笔记本 返回所有笔记
          clickBookCollection(eachBookCollectionName){
//            console.log(eachBookCollectionName)
            this.currentBookCollection = eachBookCollectionName;
            axios.get("/api/book/getBook", {
              params:{
                book_collection_name: eachBookCollectionName
              }
            }).then(this.handleGetBookSucc)
          },
          handleGetBookSucc(res) {
            res = res.data
//            console.log(res)
            this.bookList = res.arrays
          },


          //点击一个笔记，得到笔记的内容
          clickBook(book_id, book_content) {
            // console.log(book_id)
            this.editContent = book_content
            this.editBookId = book_id
            let book_data = {
                editContent: book_content, 
                editBookId: book_id
            }
            Bus.$emit("clickBook", book_data) // 使用中间组件Bus 传输数据到editor组件！
          
          },
          addBookCollection() {
            this.addBookCollectionDialog = true
          },

          submitBook() {
            if (this.editBookId != -1)
            {
//               证明已经选中了笔记 所以提交 ,这里只是发一个通知，获取到编辑区域的数据
              Bus.$emit("informEditor");
              //真正提交是下面那个Do函数。
            }
          },
          submitBookDo() {
            //真正发请求，提交笔记数据。
            axios.get("/api/book/submitBook", {
                params: {
                  editContent: this.editContent,
                  editBookId: this.editBookId
                }
            }).then(this.handleSubmitBookSucc)
          },
          handleSubmitBookSucc(res){
            res = res.data
//            console.log(res)
            this.isEditSucc = res.message
          //  this.submitEditdialogVisible = true
            // this.$message(this.isEditSucc);
            this.$message({
              message: this.isEditSucc, 
              type: "success", 
              duration: 1000,
            })

            this.clickBookCollection(this.currentBookCollection)
          },
          addBookCollectionSubmit() {
            if (this.inputBookCollection != null) {
              axios.get("/api/book/addBookCollection", {
                params: {
                  submitBookCollectionName: this.inputBookCollection
                }
              }).then(this.handleAddBookCollectionSucc)
            }
          },
          handleAddBookCollectionSucc(res){
            res = res.data;
            this.addBookCollectionDialog = false
            this.getAllBookCollectionOfOne()
          },
          //新建一个笔记
          addBook() {
            if (this.currentBookCollection!=null){
              axios.get("/api/book/addBook", {
                params: {
                  currentBookCollectionName: this.currentBookCollection,
                  bookContent: "新笔记"
                }
              }).then(this.handleAddBookSucc)
            }
            else {
              this.addBookDialog = true
            }
          },
          handleAddBookSucc(res) {
            this.clickBookCollection(this.currentBookCollection)
          },
        },
        

    }
</script>

<style scoped>
  
    .navi {
      /* border: 1px solid red; */
      /* position: fixed; */
      /* top: 10px; //开始处于距离顶部300px的位置，之后随着滚动条滚动top值改变，然后在top==100时停止 */
      /* box-sizing: border-box;
      z-index: 2; */
      margin-top: 5px;
    }
    .book {
    margin-left: 20px;
    width: 500px;
    border-right: 1px  solid grey;
    float: left;
  }
  .title {
    font-size: 20px;
    margin-bottom: 5px;
    margin-top: 6px;
  }
  .content {
    font-size: 15px;
    color: #8c939d;
  }
  .block {
    /* margin-top: 15px; */
    border-bottom: 1px solid grey;
    /* border: 1px solid red; */
    height: 80px;
  }
  .edit {
    width: 730px;
    height:300px;

    float: right;
    margin-right: 1px;
    font-size: 25px;
  }
  .submitBtn {
    float: right;
    margin-top: 600px;
  }
  .bijiben {
    margin-bottom: 10px;
  }
  .block:hover {
    background-color: #eaeaea;
  }
</style>