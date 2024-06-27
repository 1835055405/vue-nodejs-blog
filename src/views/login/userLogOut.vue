<template>
  <div class="logOut">
    <p>退出登录，3秒后返回主页</p>
  </div>
</template>

<script>
import api from "@/fetch/api";

export default {
  name: "userLogOut",
  data() {
    return {};
  },
  mounted() {
    this.logOut();
  },
  methods: {
    logOut() {
      sessionStorage.clear();
      setTimeout(() => {
        this.$router.push("index");
      }, 3000);
    }
  }
};
</script>
<style lang="less" scoped>
.logOut {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.logOut p {
  margin: 0;
}
</style>
