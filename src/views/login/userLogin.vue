<template>
  <div class="login">
    <div class="content">
      <p class="title">萤火博客登录</p>
      <div class="account">
        <span>账号</span>
        <input type="text" v-model="account" @keyup.enter="login" />
      </div>
      <div class="password">
        <span>密码</span>
        <input type="password" v-model="password" @keyup.enter="login" />
        <p v-show="err">账号或者密码错误</p>
      </div>

      <div class="confirm">
        <input type="checkbox" name="keepAlive" checked disabled />
        <label for="keepAlive">15天免登录</label>
        <button type="button" @click="login">登录</button>
      </div>
      <div class="toSignup" @click="toSignup">没有帐户？去注册</div>
    </div>
  </div>
</template>

<script>
import api from "@/fetch/api";

export default {
  name: "userLogin",
  data() {
    return {
      account: "",
      password: "",
      token: "",
      err: false
    };
  },
  mounted() {
    this.$store.commit("login", localStorage.token);
  },
  methods: {
    login() {
      //账号名和密码是否合规验证（待补充）
      api.userLogin(this.account, this.password).then(
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
              this.$router.push("userLogin");
              break;
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    toSignup() {
      this.$router.push("userSignup");
    }
  }
};
</script>

<style lang="less" scoped>
.login {
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
    height: 300px;
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
    .toSignup {
      margin: 10px 3px;
      vertical-align: middle;
      color: #5cb85c;
    }
  }
}
</style>
