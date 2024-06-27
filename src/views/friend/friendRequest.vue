<template>
  <div class="allArticle">
    <div class="head">
      <p>好友申请</p>
      <p></p>
    </div>

    <div class="article">
      <div class="content">
        <hr />
        <div class="see" v-for="one in friendRequest">
          <div class="person">
            <img :src="one.imgsrc" />
            <span>{{ one.name }}</span>
          </div>
          <div class="btn">
            <span @click="changeFriendRelation('accept', one.id)">接受</span>
            <span @click="changeFriendRelation('refuse', one.id)">拒绝</span>
          </div>
        </div>
        <div class="notice" v-if="friendRequest.length < 1">
          <span class="iconfont icon-meiyoudingdan-01"></span>暂时还没有好友请求
        </div>
        <hr />
      </div>
    </div>
  </div>
</template>

<script>
import util from "@/util/util";
import api from "@/fetch/api";
export default {
  name: "friend",
  data() {
    return {
      lazyLoad: "",
      drawer: false,
      direction: "rtl",
      friendRequest: []
    };
  },
  mounted() {
    this.lazyLoad = util.throttle(this.handleLoad, 200, 300);
    // //添加懒加载滚动监听
    window.addEventListener("scroll", this.lazyLoad);
    this.getFriendRequest();
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
          list[i].src = list[i].getAttribute("data-src");
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
    getFriendRequest() {
      this.drawer = true;
      let id = JSON.parse(sessionStorage.getItem("userInfo")).id;
      api.getFriendRequest(id).then(
        res => {
          this.friendRequest = res.data;
          console.log(this.friendRequest);
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
    changeFriendRelation(stste, friendId) {
      console.log(friendId);
      let id = JSON.parse(sessionStorage.getItem("userInfo")).id;
      if (stste === "accept") {
        api.changeFriendRelationAccept(friendId, id).then(
          res => {
            let a = res.data;
            console.log(a);
            switch (res.code) {
              case "200":
                alert("好友请求处理成功！");
                window.location.reload();
                break;
              case "400":
                alert("未知错误！");
                console.log("获取信息错误！");
                break;
            }
          },
          err => {
            console.log(err);
          }
        );
      } else {
        api.changeFriendRelationRefuse(friendId, id).then(
          res => {
            let a = res.data;
            console.log(a);
            window.location.reload();
            switch (res.code) {
              case "200":
                alert("好友请求处理成功！");
                window.location.reload();
                break;
              case "400":
                alert("未知错误！");
                console.log("获取信息错误！");
                break;
            }
          },
          err => {
            console.log(err);
          }
        );
      }
    }
  },
  watch: {
    //监听passages的值是否发生了变化，发生了变化则执行懒加载函数
    passages: function() {
      console.log("change");
      this.$nextTick(() => {
        this.handleLoad();
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
      display: flex;
      flex-direction: column;
      margin: 20px 0 0;
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
        display: flex;
        justify-content: space-between;
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
          span:last-child {
            flex: 1;
            text-align: right;
            margin-right: 20px;
          }
        }
        .btn {
          display: flex;
          align-items: center;
          span:first-child {
            box-sizing: border-box;
            padding: 5px 10px;
            color: rgba(28, 243, 93, 0.9);
            border: 1px solid rgba(28, 243, 93, 0.9);
            border-radius: 6px;
            margin: 0 10px;
          }
          span:last-child {
            box-sizing: border-box;
            padding: 5px 10px;
            color: rgba(243, 28, 28, 0.9);
            border: 1px solid rgba(243, 28, 28, 0.9);
            border-radius: 6px;
            margin: 0 10px;
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
