// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import "../static/css/reset.css";
import axios from "axios";
import ElementUI from "element-ui";

//引入ueditor相关的配置
import "../static/UE/ueditor.config.js";
import "../static/UE/ueditor.all.js";
import "../static/UE/lang/zh-cn/zh-cn.js";
import "../static/UE/ueditor.parse.js";
import VueQuillEditor from "vue-quill-editor";
// require styles 引入样式
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

Vue.use(VueQuillEditor);
Vue.use(ElementUI);
// 引入mock文件
// require('./mock/mock')

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});
