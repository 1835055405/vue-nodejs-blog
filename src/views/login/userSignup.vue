<template>
  <div class="signup">
    <div class="content">
      <p class="title">萤火博客注册</p>
      <div class="account">
        <span>账号</span>
        <input type="text" v-model="account" @keyup.enter="signup" />
      </div>
      <div class="account">
        <span>昵称</span>
        <input type="text" v-model="name" @keyup.enter="signup" />
      </div>
      <div class="password">
        <span>密码</span>
        <input type="password" v-model="password" @keyup.enter="signup" />
      </div>
      <div class="confirm">
        <button type="button" @click="signup">注册</button>
      </div>
      <div class="toLogin" @click="toLogin">已有帐户？去登录</div>
    </div>
  </div>
</template>

<script>
import api from "@/fetch/api";

export default {
  name: "userSignup",
  data() {
    return {
      account: "",
      name: "",
      password: "",
      token: "",
      err: false
    };
  },
  mounted() {
    this.$store.commit("login", localStorage.token);
  },
  methods: {
    signup() {
      //账号名和密码是否合规验证（待补充）
      api.userSignup(this.account, this.name, this.password).then(
        res => {
          switch (res.code) {
            case "200":
              //将服务器返回的token放入store中
              console.log(res);
              this.$store.commit("login", res.token);
              let userInfo = {
                id: res.id,
                name: res.name,
                imgSrc: res.imgSrc
              };
              sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
              console.log(res);
              this.$router.push("index");
              break;
            case "401":
              this.err = true;
              alert(res.error)
              this.$router.push("userSignup")
              break;
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    toLogin() {
      this.$router.push("userLogin");
    }
  }
};
</script>

<style lang="less" scoped>
.signup {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("../../assets/img/bg.jpg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  .content {
    background-color: rgba(255, 255, 255, 0.9);
    width: 350px;
    height: 320px;
    border: 1px solid #ccc;
    border-radius: 15px;
    padding: 20px 50px;
    box-sizing: border-box;
    input {
      padding: 5px 10px;
      box-sizing: border-box;
      margin-left: 20px;
      border: 1px solid grey;
      border-radius: 3px;
    }
    .title {
      text-align: center;
    }
    .account {
      margin-top: 30px;
    }
    .password {
      height: 55px;
      margin-top: 20px;
      p {
        color: red;
        margin: 5px 55px;
      }
    }
    .confirm {
      input {
        margin: 10px 3px;
        vertical-align: middle;
      }
      label {
        font-size: 10px;
      }
      button {
        width: 100%;
        height: 50px;
        background: #5cb85c;
        border-radius: 5px;
        color: white;
        outline: none;
        font-size: 18px;
        cursor: pointer;
      }
    }
    .toLogin {
      margin: 10px 3px;
      vertical-align: middle;
      color: #5cb85c;
    }
  }
}
</style>
