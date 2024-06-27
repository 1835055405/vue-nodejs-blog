<template>
  <!--父子组件传值传值把数据传过去的，文章会自动全部显示-->
  <all-article :passages="passages" :type="type"></all-article>
</template>

<script>
import allArticle from "../../components/allArticle";
import api from "@/fetch/api";
export default {
  name: "tech",
  components: {
    allArticle
  },
  data() {
    return {
      passages: [],
      type: {
        title: "技术文章",
        describe: "这是技术文章的简介"
      }
    };
  },
  mounted() {
    api.categoryArticleFront(this.type.title).then(
      res => {
        switch (res.code) {
          case "200":
            console.log("获取文章成功！");
            this.passages = res.data;
            this.parseTags();
            break;
          case "400":
            console.log("服务器开小差了！");
            break;
        }
      },
      err => {
        console.log(err);
      }
    );
  },
  methods: {
    parseTags() {
      let reg = /<img src/g;
      this.passages.forEach(element => {
        element.tags = element.tags.split(",");
        element.summary = element.summary.replace(reg, `<img data-src`);
      });
    }
  }
};
</script>

<style scoped lang="less"></style>
