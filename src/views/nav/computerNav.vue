<template>
  <!--电脑屏幕导航条-->
  <div class="sideBar">
    <div class="wrap">
      <div class="myImg">
        <div class="user">
          <div v-if="isShow">
            <img :src="myInfo.imgsrc" alt="" />
            <h1>{{ myInfo.name }}</h1>
            <p>{{ myInfo.breif }}</p>
          </div>
          <div v-else>
            <router-link to="/userLogin"><p>请登录</p></router-link>
          </div>
        </div>
      </div>
      <ul>
        <router-link v-for="(one, index) in nav" :key="index" :to="one.url">
          <li
            @click="changeSelect(index)"
            :class="{ active: index == selectItem }"
          >
            <span class="iconfont category" :class="one.icon"></span
            >{{ one.name }}
          </li>
        </router-link>
      </ul>
      <nav-search></nav-search>
    </div>
  </div>
</template>

<script>
import navSearch from "./components/navSearch";

export default {
  name: "computerNav",
  props: ["myInfo"],
  components: {
    navSearch
  },
  data() {
    return {
      isActive: false,
      isShow: 0,
      selectItem: 0,
      nav: [
        { name: "首页", url: "/index", icon: "icon-index" },
        { name: "技术", url: "/tech", icon: "icon-h5" },
        { name: "音乐", url: "/music", icon: "icon-yinyuered" },
        { name: "感悟", url: "/sense", icon: "icon-dushu" },
        { name: "归档", url: "/file", icon: "icon-shijianzhou" },
        { name: "应用", url: "/myApp", icon: "icon-yingyong" },
        { name: "发布", url: "/uploadArticle" },
        { name: "好友", url: "/friend" },
        { name: "设置", url: "/setting" }
      ]
    };
  },
  mounted() {
    let select = this.$store.getters.getSelect;
    this.selectItem = select ? select : 0;
    this.judgeUser();
  },
  methods: {
    //更改导航栏状态
    changeSelect(index) {
      this.selectItem = index;
      this.$store.commit("saveSelect", this.selectItem);
    },
    judgeUser() {
      let user = sessionStorage.getItem("userInfo") || "";
      if (user) {
        this.isShow = 1;
        let logOut = { name: "退出登录", url: "/userLogOut" };
        this.nav.push(logOut);
      } else {
        this.nav.splice(-3, 3);
      }
      if (this.myInfo.imgsrc === "") {
        this.myInfo.imgsrc = "/static/img/default-avatar-1716521282680.png";
      }
    }
  }
};
</script>

<style scoped lang="less">
.sideBar {
  display: flex;
  flex-direction: column;
  width: 350px;
  min-height: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  text-align: center;
  background: #353d47;
  margin: auto 0px;
  padding: 10px 0;
  box-sizing: border-box;
  overflow: auto;
  .wrap {
    margin: auto 0;
    .myImg {
      img {
        width: 150px;
        height: 150px;
        border-radius: 50%;
      }
      h1 {
        margin-top: 10px;
        font-size: 30px;
        color: white;
      }
      p {
        margin: 10px 0;
        color: white;
        font-size: 18px;
      }
    }
    .search {
      width: 200px;
      height: 25px;
      margin: 20px auto;
      background: white;
      text-align: left;
      border-radius: 10px;
      input {
        width: 150px;
        margin-left: 10px;
        border: none;
        outline: none;
      }
      .iconfont {
        margin-left: 13px;
        vertical-align: middle;
        font-size: 18px;
        cursor: pointer;
      }
      a {
        text-decoration: none;
      }
    }
    ul {
      margin-top: 15px;
      .category {
        font-size: 20px;
      }
      a {
        margin-top: 20px;
        text-decoration: none;
        outline: none;
        color: white;
      }
      li {
        font-size: 20px;
        color: white;
        line-height: 45px;
        span {
          font-size: 35px;
          margin: 10px;
        }
      }
      li:after {
        content: "";
        width: 0px;
        height: 45px;
        background: white;
        position: absolute;
        z-index: -1;
        left: 0;
        transition: all 0.3s linear;
      }
      a:hover li::after {
        width: 100%;
        background: #409eff;
      }
      .active {
        background: #409eff;
      }
      .contact {
        margin-top: 30px;
      }
      .contact span {
        background: transparent;
      }
      // github和博客园图标渐变
      .contact span:hover {
        // 文字颜色设置为透明
        color: transparent;
        //利用linear-gradient实现背景的静态渐变
        background-image: linear-gradient(
          to right,
          #3498db 25%,
          #f47920 50%,
          #3498db 75%,
          #f47920 100%
        );
        //基本新版本浏览器都兼容background-clip:text,表示只在文字内容处显示背景
        -webkit-background-clip: text;
        background-size: 300%;
        animation: flash 1s infinite linear;
      }
    }
  }
}

@keyframes flash {
  0% {
    /*background-position 左上角是 0 0，右边为正，下边为正*/
    background-position: 0 0;
  }
  100% {
    background-position: 100% 0;
  }
}

@media screen and (max-width: 900px) {
  .sideBar {
    display: none;
  }
}
</style>
