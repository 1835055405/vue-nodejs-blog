<template>
  <div class="allArticle">
    <div class="head">
      <p>好友列表</p>
      <p @click="toFriendRequest()">
        好友申请
      </p>
    </div>

    <div class="article">
      <div class="content">
        <hr />
        <div class="see" v-for="one in friendList">
          <div class="person">
            <img :src="one.imgsrc" />
            <span>{{ one.name }}</span>
          </div>
        </div>
        <div class="notice" v-if="friendList.length < 1">
          <span class="iconfont icon-meiyoudingdan-01"></span>暂时还没有任何朋友
        </div>
        <hr />
      </div>
    </div>
  </div>
</template>

<script>
import util from "@/util/util";
import api from "@/fetch/api";
import { drawer } from "element-ui";
export default {
  name: "friend",
  data() {
    return {
      lazyLoad: "",
      drawer: false,
      direction: "rtl",
      friendList: [],
      friendRequest: []
    };
  },
  mounted() {
    this.lazyLoad = util.throttle(this.handleLoad, 200, 300);
    // //添加懒加载滚动监听
    window.addEventListener("scroll", this.lazyLoad);
    this.getFriendship();
  },
  beforeDestroy() {
    //移除懒加载监听
    window.removeEventListener("scroll", this.lazyLoad);
  },
  methods: {
    findTag(tag) {
      this.$router.push({ name: "searchTag", params: { tagStr: tag } });
    },
    handleLoad() {
      let list = document
        .getElementsByClassName("rightContent")[0]
        .getElementsByTagName("img");
      for (let i = 0, len = list.length; i < len; i++) {
        if (this.isInsight(list[i])) {
          list[i].src = this.friendList[i].imgsrc;
        }
      }
      console.log(list);
    },
    isInsight(el) {
      let bound = el.getBoundingClientRect();
      let clientHeight = window.innerHeight;
      //只考虑向下滚动加载，当离视窗底部还有100距离时，就进行资源的加载
      return bound.top <= clientHeight + 100;
    },
    getFriendship() {
      let id = JSON.parse(sessionStorage.getItem("userInfo")).id;
      api.getFriendship(id).then(
        res => {
          this.friendList = res.data;
          switch (res.code) {
            case "200":
              break;
            case "400":
              console.log("获取信息错误！");
              break;
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    toFriendRequest() {
      this.$router.push("friendRequest");
    }
  },
  watch: {
    //监听passages的值是否发生了变化，发生了变化则执行懒加载函数
    passages: function() {
      console.log("change");
      this.$nextTick(() => {
        this.handleLoad();
        this.getFriendship();
      });
    }
  }
};
</script>

<style scoped lang="less">
.allArticle {
  padding: 20px;
  /*padding: 20px 20px 15px;
	box-sizing: border-box;*/
  .head {
    height: 100px;
    padding: 5px 20px;
    background: white;
    border-left: 10px solid #353d47;
    display: flex;
    justify-content: space-between;
    p:first-child {
      margin-top: 8px;
      font-size: 30px;
      font-weight: bold;
    }
    p:last-child {
      margin-top: 15px;
      font-size: 16px;
    }
  }
  /*文章样式*/
  .article {
    margin: 20px 0;
    padding: 20px 20px 15px;
    box-sizing: border-box;
    background: white;
    .title:hover a {
      margin-left: 15px;
      color: orange;
    }
    .content {
      margin: 20px 0 0;
      display: flex;
      flex-direction: column;
      p {
        margin-bottom: 30px;
      }
      a {
        color: orange;
        text-decoration: none;
      }
      hr {
        margin: 15px 0;
      }
      /deep/ img {
        max-width: 100%;
      }
      .see {
        border: 1px solid rgba(0, 0, 0, 0.2);
        padding: 10px;
        margin-bottom: 50px;
        .person {
          display: flex;
          align-items: center;
          img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
          }
          span:nth-child(2) {
            flex: 1;
            margin-left: 30px;
            text-align: left;
            font-size: 20px;
          }
        }
      }
      .notice {
        text-align: center;
      }
    }
  }
}
@media screen and (max-width: 900px) {
  .allArticle {
    padding: 20px 0;
    .article .title {
      display: block;
    }
    .article .content {
      display: flex;
    }
  }
}
</style>
