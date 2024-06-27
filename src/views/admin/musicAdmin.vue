<template>
  <all-article :passages="passages" :type="type"></all-article>
</template>

<script>
import allArticle from "./components/allArticle";
import api from "@/fetch/api";
export default {
  name: "musicAdmin",
  components: {
    allArticle
  },
  data() {
    return {
      type: "音乐文章",
      passages: []
    };
  },
  created() {
    this.getMusicArticle();
  },
  methods: {
    getMusicArticle() {
      let category = encodeURIComponent(this.type);
      api.categoryArticleBack(category).then(
        res => {
          switch (res.code) {
            case "200":
              res.data.forEach(element => {
                if (element.tags != null) {
                  element.tags = element.tags.split(",");
                }
              });
              this.passages = res.data;
              break;
            case "400":
              console.log("获取数据错误！");
              break;
          }
          console.log(res);
        },
        err => {
          console.log(err);
        }
      );
    }
  }
};
</script>

<style scoped lang="less"></style>
