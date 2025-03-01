<template>
  <div class="oneArticle">
    <div class="article">
      <div class="title">
        <h1>{{ passage.title }}</h1>
        <div class="time">
          <span class="iconfont icon-shijian"></span>
          <span>{{ passage.time }}</span>
        </div>
      </div>
      <div class="content" ref="content">
        <p v-html="passage.content"></p>
        <hr />
        <div class="bottom">
          <span class="iconfont icon-tag1"></span>
          <div
            class="tag"
            v-for="tag in passage.tags"
            @click="findTag(tag)"
            v-if="tag"
          >
            <span>{{ tag }}</span>
          </div>
          <div class="share">
            <span
              class="iconfont icon-zanzhuanhuan0101"
              title="该功能待开发，别使劲点了！"
            ></span>
          </div>
        </div>
      </div>
    </div>

    <div class="nav">
      <div class="pre" v-show="pre">
        <span @click="goPrePsg">上一篇文章</span>
      </div>
      <div class="next" v-show="next">
        <span @click="goNextPsg">下一篇文章</span>
      </div>
    </div>

    <div class="comment">
      <!--写评论-->
      <div class="write" v-if="name">
        <p>发表评论</p>
        <p class="nickName">
          <span class="nn_left"
            ><img class="nn_l_img" :src="imgSrc" alt=""
          /></span>
          <span class="nn_right">{{ name }}</span>
        </p>
        <p>评论内容</p>
        <textarea placeholder="评论" v-model="content"></textarea>
        <div class="finish">
          <button @click="makeComment(articleId)">发表评论</button>
        </div>
      </div>

      <p>评论区</p>
      <hr />

      <!--看评论-->
      <div class="see" v-for="(one, index) in comments" :key="index">
        <div class="person">
          <div id="popup" class="popup" v-show="popupIndex === index">
            <div class="popup-content">
              <p @click="addButton(one.userId)">添加好友</p>
              <p @click="hidePopup()">取消</p>
            </div>
          </div>
          <img
            :src="one.imgSrc"
            ref="triggerArea"
            class="trigger"
            @click="showPopup(index)"
          />
          <span>{{ one.name }}</span>
          <span>{{ one.time }}</span>
        </div>
        <div class="personComment">
          <span>{{ one.content }}</span>
        </div>
      </div>
      <div class="notice" v-if="comments.length < 1">
        <span class="iconfont icon-meiyoudingdan-01"></span>暂时还没有任何评论
      </div>
    </div>
  </div>
</template>
<script>
import api from "../fetch/api.js";
import util from "@/util/util";
export default {
  name: "oneArticle",
  props: ["articleId"],
  inject: ["reload"],
  data() {
    return {
      passage: [],
      name: "",
      imgSrc: "",
      content: "",
      comments: [],
      pre: "",
      next: "",
      lazyLoad: "",
      popupIndex: null // To keep track of which popup is visible
    };
  },
  created() {
    //获取文章操作
    this.getOneArticle();
    this.getComments();
    //由于移除事件监听必须指定函数名，因此需要用一个变量来进行中转
    this.lazyLoad = util.throttle(this.handleLoad, 200, 300);
  },
  mounted() {
    //添加懒加载滚动监听
    window.addEventListener("scroll", this.lazyLoad);
    this.testPreNext();
    this.getUserInfo();
  },
  beforeDestroy() {
    //移除懒加载监听
    window.removeEventListener("scroll", this.lazyLoad);
  },
  methods: {
    getUserInfo() {
      if (sessionStorage.getItem("userInfo")) {
        this.name = JSON.parse(sessionStorage.getItem("userInfo")).name;
        this.imgSrc = JSON.parse(sessionStorage.getItem("userInfo")).imgSrc;
      }
    },
    findTag(tag) {
      this.$router.push({ name: "searchTag", params: { tagStr: tag } });
    },
    getOneArticle() {
      api.oneArticleFront(this.articleId).then(
        res => {
          switch (res.code) {
            case "200":
              console.log(res.data);
              this.passage = res.data;
              //将标签分割
              this.passage.tags = this.passage.tags.split(",");

              //created钩子函数中接收到后台返回的文章内容，把所有src替换为data-src。
              let reg = /<img src/g;
              this.passage.content = this.passage.content.replace(
                reg,
                `<img data-src`
              );
              //懒加载初始化，放在这个回调函数这里
              this.$nextTick(() => {
                this.handleLoad();
              });
              break;
            case "400":
              console.log("服务器炸了");
              break;
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    //懒加载的主体函数handleLoad
    handleLoad() {
      let list = this.$refs.content.getElementsByTagName("img");
      for (let i = 0, len = list.length; i < len; i++) {
        if (this.isInsight(list[i])) {
          list[i].src = list[i].getAttribute("data-src");
        }
      }
    },
    isInsight(el) {
      let bound = el.getBoundingClientRect();
      let clientHeight = window.innerHeight;
      //只考虑向下滚动加载
      return bound.top <= clientHeight + 100;
    },
    findTag(tag) {
      this.$router.push({ name: "searchTag", params: { tagStr: tag } });
    },
    //检查上一条或者下一条记录是否存在
    testPreNext() {
      api.prePsgFront(this.articleId).then(
        res => {
          switch (res.code) {
            case "200":
              this.pre = res.data.id;
              break;
            case "204":
              console.log("没有上一条了！");
              this.pre = false;
              break;
            case "400":
              console.log("服务器炸了");
              break;
          }
        },
        err => {
          console.log(err);
        }
      );

      api.nextPsgFront(this.articleId).then(
        res => {
          switch (res.code) {
            case "200":
              this.next = res.data.id;
              break;
            //无内容
            case "204":
              console.log("没有下一条了！");
              this.next = false;
              break;
            case "400":
              console.log("服务器炸了");
              break;
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    goPrePsg() {
      this.$router.push({ name: "articles", params: { articleId: this.pre } });
      this.reload();
    },
    goNextPsg() {
      this.$router.push({ name: "articles", params: { articleId: this.next } });
      this.reload();
    },
    getComments() {
      api.getCommentsFront(this.articleId).then(
        res => {
          switch (res.code) {
            case "200":
              this.comments = res.data;
              this.popupsVisible = Array(this.comments.length).fill(false); // 初始化与comments长度相同的数组，并填充为false
              console.log(this.comments, "comment");
              break;
            case "400":
              console.log("服务器炸了");
              break;
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    makeComment() {
      let imgSrc = JSON.parse(sessionStorage.getItem("userInfo")).imgSrc;
      let userId = JSON.parse(sessionStorage.getItem("userInfo")).id;
      if (this.content === "") {
        alert("请输入评论！");
      } else {
        api
          .makeComment(this.articleId, this.name, this.content, imgSrc, userId)
          .then(
            res => {
              switch (res.code) {
                case "200":
                  console.log(res.data);
                  alert("评论成功！");
                  this.reload();
                  break;
                case "400":
                  alert("服务器炸了");
                  break;
              }
            },
            err => {
              console.log(err);
            }
          );
      }
    },
    showPopup(index) {
      this.popupIndex = index;
    },
    hidePopup() {
      this.popupIndex = null;
    },
    addButton(receiverId) {
      console.log(receiverId);
      let userInfo = sessionStorage.getItem("userInfo");
      if (userInfo) {
        let senderId = JSON.parse(userInfo).id || "";
        if (senderId === receiverId) {
          alert("不能添加自己为好友！");
        } else {
          console.log(receiverId, senderId);
          api
            .addFriendRequest(receiverId, senderId)
            .then(res => {
              console.log(res);
              if (res.code === "205") {
                alert(res.message);
              } else if (res.code === "200") {
                alert(res.message);
              }
              this.hidePopup();
            })
            .catch(err => {
              console.log(err);
              this.hidePopup();
            });
        }
      } else {
        alert("您还没有登录，请登录！");
      }
    }
  }
};
</script>

<style scoped lang="less">
.oneArticle {
  img {
    max-width: 100%;
  }
  padding: 20px;
  /*文章区*/
  .article {
    padding: 20px;
    box-sizing: border-box;
    background: white;
    .title {
      display: flex;
      border-bottom: 1px solid;
      min-height: 50px;
      line-height: 50px;

      h1 {
        flex: 5;
        font-size: 1.3rem;
      }
      .time {
        flex: 1;
        text-align: center;
        vertical-align: middle;
        span {
          vertical-align: middle;
        }
      }
    }
    .content {
      margin: 20px 0 10px;
      p {
        margin-bottom: 20px;
      }
      a {
        color: orange;
        text-decoration: none;
      }
      .bottom {
        position: relative;
        margin-top: 20px;
        img {
          text-align: center;
        }
        .iconfont {
          font-size: 18px;
          vertical-align: middle;
          margin-right: 15px;
        }
        .tag {
          min-width: 30px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          background: #5bc0de;
          display: inline-block;
          vertical-align: middle;
          margin: 0 10px;
          position: relative;
          border-radius: 0 2px 2px 0;
          color: white;
          padding: 0 5px;
          font-size: 13px;
          cursor: pointer;
        }
        .tag::after {
          width: 0;
          height: 0;
          content: "";
          position: absolute;
          left: -20px;
          border-right: 10px solid #5bc0de;
          border-left: 10px solid transparent;
          border-top: 10px solid transparent;
          border-bottom: 10px solid transparent;
        }
        .share {
          display: inline-block;
          position: absolute;
          right: 10px;
          cursor: pointer;
        }
      }
    }
    // 由于样式scoped了，我们又用的是less，所以对v-html里面的内容设置样式时,要用深度作用选择器 >>>。less里面 /deep/等同于其他的>>>
    /deep/ img {
      max-width: 100%;
    }
  }

  /*上一篇文章,下一篇文章导航区*/
  .nav {
    display: flex;
    margin: 20px;
    .pre,
    .next {
      flex: 1;
      padding: 0 15px;
      text-decoration: none;
      span {
        cursor: pointer;
      }
      span:hover {
        color: orange;
      }
    }
    .next {
      text-align: right;
    }
  }

  /*评论区*/
  .comment {
    margin: 30px 0 50px;
    background: white;
    padding: 30px 20px;
    box-sizing: border-box;
    min-height: 500px;
    position: relative;
    .write {
      margin-bottom: 30px;
      p {
        margin: 10px 0;
        font-size: 18px;
      }
      .nickName {
        display: flex;
        width: 25%;
        justify-content: space-between;
        align-items: center;
        font-size: 20px;
        .nn_left {
          .nn_l_img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
          }
        }
      }
      input {
        width: 100%;
        padding: 8px 8px;
        box-sizing: border-box;
        border: 1px solid #cccccc;
        border-radius: 5px;
      }
      textarea {
        width: 100%;
        height: 200px;
        display: inline-block;
        border-radius: 5px;
        resize: none;
        overflow: hidden;
        font-size: 18px;
        padding: 5px;
        box-sizing: border-box;
        border: 1px solid #cccccc;
      }
      .finish {
        margin-top: 10px;
        text-align: right;
      }
      .finish button {
        height: 35px;
        line-height: 35px;
        padding: 0 10px;
        font-size: 15px;
        box-sizing: border-box;
        background: forestgreen;
        outline: none;
        border: 1px solid;
        border-radius: 5px;
        color: white;
        display: flex;
        flex-direction: column-reverse;
        display: inline-block;
        cursor: pointer;
      }
    }
    .see {
      border: 1px solid rgba(0, 0, 0, 0.2);
      padding: 10px;
      margin-bottom: 50px;
      .person {
        display: flex;
        align-items: center;
        .popup {
          display: flex;
          justify-content: center;
          align-items: center;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1000;
        }

        .popup-content {
          background-color: white;
          padding: 10px;
          border: 1px solid #ccc;
          position: relative;
          max-width: 200px;
        }

        .trigger {
          padding: 10px;
          background-color: #f0f0f0;
          margin-bottom: 10px;
          cursor: pointer;
        }
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
      .personComment {
        margin: 30px 5px;
        padding: 0 15px;
        box-sizing: border-box;
      }
    }
    .notice {
      min-height: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        font-size: 25px;
        margin-right: 20px;
      }
    }
    hr {
      margin-bottom: 20px;
    }
  }
}
@media screen and (max-width: 900px) {
  .oneArticle {
    padding: 0;
    .article .title {
      display: block;
      .time {
        text-align: left;
      }
    }
  }
}
</style>
