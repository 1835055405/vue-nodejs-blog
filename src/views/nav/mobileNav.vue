<template>
  <div class="mobileNav">
    <div v-if="isShow">
      <img :src="myInfo.imgsrc" alt="" />
      <h1>{{ myInfo.name }}</h1>
      <p>{{ myInfo.breif }}</p>
    </div>
    <div v-else>
      <router-link to="/userLogin"><p>请登录</p></router-link>
    </div>
    <a href="https://github.com/" target="_blank"
      ><span class="iconfont icon-github"></span
    ></a>
    <a href="http://www.cnblogs.com/" target="_blank"
      ><span class="iconfont icon-bokeyuan "></span
    ></a>
    <nav-search></nav-search>

    <div class="triger" :class="[scrollOver == true ? 'scrollOver' : '']">
      <span v-if="isShow">{{ myInfo.name }} &nbsp;的个人博客</span>
      <div class="icon" id="icon">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <transition name="toggle">
      <div class="tools" v-show="toolState">
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
      </div>
    </transition>
  </div>
</template>

<script>
import navSearch from "./components/navSearch";
import util from "@/util/util";

export default {
  name: "mobileNav",
  props: ["myInfo"],
  components: {
    navSearch
  },
  data() {
    return {
      scrollOver: false, //是够向下滑动超过了导航栏底部
      toolState: false, //手机导航栏关闭的状态，
      jump: false,
      selectItem: 0,
      isShow: 0,
      handleNavScroll: "",
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
  inject: ["reload"],
  mounted() {
    this.handleNavScroll = util.throttle(this.handleScroll, 200, 300);
    //监听滚动条的位置,调用节流函数
    window.addEventListener("scroll", this.handleNavScroll);
    let select = this.$store.getters.getSelect;
    this.selectItem = select ? select : 0;
    //给小图标导航栏添加点击事件
    document.getElementById("icon");
    icon.onclick = this.handleToggle();
    this.judgeUser();
  },
  beforeDestroy() {
    //移除懒加载监听
    window.removeEventListener("scroll", this.handleNavScroll);
  },
  methods: {
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
    },
    //滚动时为导航条添加样式的函数
    handleScroll() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      if (scrollTop > 150 && this.scrollOver == false) {
        //距离顶部大于150px时添加class
        this.scrollOver = true;
        //					console.log('添加了样式');
      } else if (
        scrollTop < 150 &&
        this.toolState == false &&
        this.scrollOver == true
      ) {
        //在顶部收起导航条时（即toolState==false时，需要把block的样式去除）
        this.scrollOver = false;
        //              	console.log('去除了样式');
      }
    },

    //打开手机导航栏
    handleToggle() {
      let that = this;
      let toggleTimer;
      return function() {
        that.toolState = !that.toolState;
        let scrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop;
        clearTimeout(toggleTimer);
        //					console.log('计数器正在清除')
        if (that.toolState == false && scrollTop < 250) {
          //工具栏被收起来了，并且在导航栏下方时才隐藏标题栏
          toggleTimer = setTimeout(function() {
            //							console.log('文字收起来了正在执行');
            that.scrollOver = false;
          }, 600);
          //						console.log('收起了');
        } else {
          //						console.log('展开了')
          that.scrollOver = true;
        }
      };
    },
    jumpTo() {
      //调用了home.vue中的reload方法，使得在点击导航栏进行页面跳转时，顶部导航栏可以消失
      this.reload();
    }
  }
};
</script>

<style scoped lang="less">
.mobileNav {
  display: none;
  width: 100%;
  height: 300px;
  background: #353d47;
  text-align: center;
  padding: 20px 0;
  box-sizing: border-box;
  h1 {
    font-size: 25px;
    color: #fff;
  }
  a {
    text-decoration: none;
  }
  .iconfont {
    font-size: 2.2rem;
    color: white;
    margin: 0 10px 10px;
  }
  img {
    width: 130px;
    height: 130px;
    border-radius: 50%;
  }
  p {
    margin: 10px 3px;
    font-size: 1.4rem;
    color: white;
  }
  .triger {
    width: 100%;
    height: 50px;
    line-height: 50px;
    position: fixed;
    top: 0;
    z-index: 100;
    cursor: pointer;
    text-align: left;
    padding-left: 20px;
    box-sizing: border-box;
    span {
      color: white;
      font-size: 20px;
      display: none;
    }
    .icon {
      position: absolute;
      top: 15px;
      right: 15px;
      span {
        display: block;
        width: 20px;
        height: 2px;
        background: white;
        margin-bottom: 5px;
      }
    }
  }

  .scrollOver {
    background: #353d47;
    border-bottom: 1px solid gray;
    span {
      display: inline;
    }
  }

  .tools {
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    position: fixed;
    top: 50px;
    z-index: 99;
    background: #353d47;
    overflow: hidden;
    border-bottom: 1px solid white;
    li {
      text-align: center;
      height: 35px;
      line-height: 35px;
      font-size: 18px;
    }
    a {
      color: white;
      text-decoration: none;
    }
  }
  .toggle-enter,
  .toggle-leave-to {
    height: 0px;
  }

  .toggle-enter-active,
  .toggle-leave-active {
    transition: all 0.5s ease;
  }
}

@media screen and (max-width: 900px) {
  .mobileNav {
    display: block;
  }
}
</style>
