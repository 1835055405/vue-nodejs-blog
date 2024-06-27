<template>
  <div class="modify">
    <!-- 修改文章或者发布新文章 -->
    <div class="head">
      <span>发布新文章</span>
    </div>
    <!-- 文章区域 -->
    <div class="content">
      <div class="title">
        <span>文章标题：</span>
        <input type="text" v-model="passage.title" name="title" />
      </div>

      <div class="time">
        <span>发表时间：</span>
        <input type="date" v-model="passage.time" />
      </div>

      <div class="type">
        <span>文章类型：</span>
        <select id="typeSelect" v-model="passage.category">
          <option disabled value="">请选择</option>
          <option value="技术文章">技术文章</option>
          <option value="音乐文章">音乐文章</option>
          <option value="感悟文章">感悟文章</option>
        </select>
        <span>文章标签：</span>
        <input type="text" v-model="passage.tags" />
      </div>
      <div class="summary">
        <p>文章简介：</p>
        <!-- <ueditor  ref="ue1" :id="ue1" :config="config1" :content="passage.summary" v-model="passage.summary"></ueditor> -->
        <quill-editor
          class="ql-editor"
          v-model="passage.summary"
          ref="ue1"
          :options="editorOption"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @change="onEditorChange($event)"
        >
        </quill-editor>
      </div>

      <div class="passageContext">
        <p>文章内容：</p>
        <!-- <ueditor ref="ue2" :id="ue2" :config="config2" :content="passage.content" v-model="passage.content"></ueditor> -->
        <quill-editor
          class="ql-editor"
          v-model="passage.content"
          ref="ue2"
          :options="editorOption"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @change="onEditorChange($event)"
        >
        </quill-editor>
      </div>
      <p class="save">
        <button class="saveBtn" @click="savePassage">保存并发布</button>
      </p>
    </div>
  </div>
</template>

<script>
import ueditor from "../admin/components/ueditor";
import api from "@/fetch/api";
import util from "@/util/util";
import { quillEditor } from "vue-quill-editor";
export default {
  name: "uploadArticle",
  props: ["id", "type"],
  components: {
    ueditor
  },
  data() {
    return {
      ue1: "ue1",
      ue2: "ue2",
      config1: {
        initialFrameWidth: null,
        initialFrameHeight: 1300
      },
      config2: {
        initialFrameWidth: null,
        initialFrameHeight: 1500
      },
      passage: {
        title: "",
        time: util.getCurrentDate(), //从util文件夹引入的公共方法获取当前时间
        category: this.type,
        tags: "",
        state: "发表",
        summary: "",
        content: ""
      },
      content: `<p>这是 vue-quill-editor 的内容！</p>`, //双向数据绑定数据
      // 富文本编辑器配置
      editorOption: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
            ["blockquote", "code-block"], // 引用  代码块
            [{ header: 1 }, { header: 2 }], // 1、2 级标题
            [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
            [{ script: "sub" }, { script: "super" }], // 上标/下标
            [{ indent: "-1" }, { indent: "+1" }], // 缩进
            [{ direction: "rtl" }], // 文本方向
            [{ size: ["12px", false, "16px", "18px", "20px", "30px"] }], // 字体大小
            [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
            [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
            [
              {
                font: [
                  false,
                  "SimSun",
                  "SimHei",
                  "Microsoft-YaHei",
                  "KaiTi",
                  "FangSong",
                  "Arial"
                ]
              }
            ], // 字体种类
            [{ align: [] }], // 对齐方式
            ["clean"], // 清除文本格式
            ["link", "image", "video"] // 链接、图片、视频
          ]
        },
        placeholder: "请输入正文"
      }
    };
  },
  mounted() {
    //如果传入了id,说明是修改文章。没有id，是新文章
    if (this.id) {
      this.getOneArticle();
    } else {
      this.newArticle();
    }
  },
  methods: {
    // 失去焦点事件
    onEditorBlur(quill) {
      console.log("editor blur!", quill);
    },
    // 获得焦点事件
    onEditorFocus(quill) {
      console.log("editor focus!", quill);
    },
    // 准备富文本编辑器
    onEditorReady(quill) {
      console.log("editor ready!", quill);
    },
    // 内容改变事件
    onEditorChange({ quill, html, text }) {
      console.log("editor change!", quill, html, text);
      this.content = html;
    },

    //获取文章原本内容
    getOneArticle() {
      api.oneArticleBack(this.id).then(
        res => {
          switch (res.code) {
            case "200":
              console.log(res.data[0]);
              this.passage = res.data[0];
              //再拿到数据之后再进行ueditor的初始化操作，否则会出错
              break;
            case "400":
              console.log("请求数据错误！");
              break;
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    newArticle() {},
    savePassage() {
      let r = confirm("确定要发布吗？");
      if (r == true) {
        //获取ueditor中的内容插入文章中
        //防止输入中文逗号，把中文逗号都转化为英文逗号
        let reg = /，/g;
        let tags = this.passage.tags;
        if (tags) {
          this.passage.tags = this.passage.tags.replace(reg, ",");
        }
        if (this.passage.title === "") {
          alert("标题不能为空！");
        } else if (this.passage.tags === "") {
          alert("标签不能为空！");
        } else if (this.passage.category === "") {
          alert("类别不能为空！");
        } else if (this.passage.content === "") {
          alert("内容不能为空！");
        } else {
          api.saveArticleBack(this.id, this.passage).then(
            res => {
              switch (res.code) {
                case "200":
                  alert("保存成功！");
                  this.$router.go(-1);
                  break;
                case "400":
                  alert("服务器开小差了，保存失败！");
                  break;
              }
            },
            err => {
              console.log(err);
            }
          );
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.modify {
  width: 100%;
  .head {
    height: 80px;
    line-height: 80px;
    background: white;
    padding: 0 20px;
    font-size: 25px;
    box-sizing: border-box;
    border-left: 10px solid #353d47;
  }
  .content {
    margin-top: 30px;
    padding: 30px;
    width: 100%;
    min-height: 700px;
    box-sizing: border-box;
    background: white;
    input {
      border: 1px solid #ccc;
      border-radius: 4px;
      margin-left: 5px;
      padding: 6px 12px;
    }
    .title {
      display: flex;
      margin-bottom: 20px;
      input {
        flex: 1;
      }
    }
    .time {
      margin-bottom: 20px;
    }
    .type {
      margin-bottom: 20px;
      #typeSelect {
        width: 200px;
        padding: 6px 0;
        margin: 0 5px;
        text-align: center;
        text-align-last: center;
      }
    }
    .state {
      margin-bottom: 20px;
      input {
        width: 0;
        height: 0;
      }
      label:before {
        height: 30px;
        width: 50px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        display: inline-block;
        background: transparent;
        border: 1px solid #ccc;
        cursor: pointer;
        border-radius: 4px;
      }
      input:checked + label:before {
        background: #5bc0de;
        color: white;
      }
      label:nth-child(3):before {
        content: "发表";
      }
      label:nth-child(5):before {
        content: "草稿";
      }
    }
    .summary {
      margin-bottom: 20px;
      textarea {
        width: 100%;
        height: 200px;
        border-radius: 5px;
        margin: 10px 0;
        padding: 5px 10px;
        box-sizing: border-box;
        font-size: 18px;
        outline: none;
      }
    }
    .passageContent {
      margin-bottom: 20px;
      textarea {
        width: 100%;
        min-height: 300px;
      }
    }
    .save {
      margin: 20px 0;
      text-align: right;
      .saveBtn {
        width: 80px;
        height: 30px;
        background: #5cb85c;
        color: white;
        border: 1px solid #4cae4c;
        border-radius: 4px;
        cursor: pointer;
      }
    }
  }
}
</style>
