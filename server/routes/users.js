let express = require("express");
const router = express.Router();
//引入工具文件
let util = require("../util/util.js");
let upload = util.upload.single("file");

//引入封装好的数据库操作
let db = require("../db.js");

//登录路由
router.post("/login", (req, res) => {
  let account = req.body.account;
  //对密码进行加密验证
  let password = util.encrypt(req.body.password);
  console.log(password);
  //生成一个token
  let token = util.encodeJwt();
  let sql = db.login(account, password);
  //生成以一个token
  db.Query(sql).then(
    data => {
      //在数据控能够查找到结果时，将token发送给前台
      if (data.length) {
        console.log("用户登录成功！");
        res.send({
          code: "200",
          sucess: "登录成功！",
          token: token,
          id: data[0].id
        });
      } else {
        res.send({ code: "401", error: "账号或者密码错误，登录失败！" });
      }
    },
    err => {
      res.send({ code: "401", error: "账号或者密码错误，登录失败！" });
    }
  );
});
router.post("/userLogin", (req, res) => {
  let account = req.body.account;
  //对密码进行加密验证
  let password = util.encrypt(req.body.password);
  //生成一个token
  let token = util.encodeJwt();
  let sql = db.userLogin(account, password);
  // 生成以一个token
  db.Query(sql).then(
    data => {
      console.log(data, "data");
      // 在数据控能够查找到结果时，将token发送给前台
      if (data.length) {
        console.log("用户登录成功！");
        res.send({
          code: "200",
          sucess: "登录成功！",
          token: token,
          name: data[0].name,
          imgSrc: data[0].imgsrc,
          id: data[0].id
        });
      } else {
        res.send({ code: "401", error: "账号或者密码错误，登录失败！" });
      }
    },
    err => {
      res.send({ code: "401", error: "账号或者密码错误，登录失败！" });
    }
  );
});
router.post("/userSignup", (req, res) => {
  let account = req.body.account;
  let name = req.body.name;
  //对密码进行加密验证
  let password = util.encrypt(req.body.password);
  //生成一个token
  let token = util.encodeJwt();
  console.log(account, name, password);
  let sql = db.userSignupExam(account);
  db.Query(sql).then(
    data => {
      console.log(data, "data");
      // 在数据控能够查找到结果时，将token发送给前台
      if (data.length == 1) {
        res.send({ code: "401", error: "账号已存在，注册失败！" });
      } else {
        let sql = db.userSignup(account, name, password);
        db.Query(sql).then(result => {
          res.send({
            code: "200",
            sucess: "注册成功！",
            token: token,
            id: result.insertId,
            name: result.name
          });
        });
      }
    },
    err => {
      res.send({ code: "401", error: "未知问题，请联系管理员！" });
    }
  );
});

// 获取个人信息
router.post("/getUserInfo", (req, res) => {
  let id = req.body.id;
  console.log(id);
  let sql = db.getUserInfo(id);
  db.Query(sql).then(
    data => {
      console.log("获取个人信息成功！");
      res.send({ code: "200", data: data[0] });
    },
    err => {
      console.log(err);
      res.send({ code: "400", error: "服务器开小差了" });
    }
  );
});

router.post("/getInfo", (req, res) => {
  let id = req.body.id;
  console.log(id);
  let sql = db.getInfo(id);
  db.Query(sql).then(
    data => {
      console.log("获取个人信息成功！");
      res.send({ code: "200", data: data[0] });
    },
    err => {
      console.log(err);
      res.send({ code: "400", error: "服务器开小差了" });
    }
  );
});

//更改个人信息
router.post("/changeInfo", upload, (req, res) => {
  //如果有传了图片，才
  let url;
  let params = req.body;
  let id = Number(req.body.id);
  //如果有图片，那么就获取图片
  if (req.file) {
    //拼接文件上传后的路径，由于之前用了express.static，所以这里不用写public，直接写/img/
    url = "http://localhost:8081/img/user/" + req.file.filename;
  }
  let sql = db.changeInfo(id, params, url);
  db.Query(sql).then(
    data => {
      console.log("图片上传成功");
      res.send({ code: "200" });
    },
    err => {
      console.log(err);
      res.send({ code: "400" });
    }
  );
});
//前端更改个人信息
router.post("/changeUserInfo", upload, (req, res) => {
  //如果有传了图片，才
  let url;
  let params = req.body;
  console.log(params);
  let password = util.encrypt(req.body.password);
  console.log(password);
  let id = Number(req.body.id);
  //如果有图片，那么就获取图片
  if (req.file) {
    console.log(req.file.filename);
    //拼接文件上传后的路径，由于之前用了express.static，所以这里不用写public，直接写/img/
    url = "http://localhost:8081/img/user/" + req.file.filename;
  }
  let sql = db.changeUserInfo(id, params, password, url);
  db.Query(sql).then(
    data => {
      console.log(data);
      let sql = db.updateComments(id, params, url);
      db.Query(sql)
        .then(result => {
          console.log("修改成功");
          res.send({ code: "200" });
        })
        .catch(error => {
          console.log(error);
        });
    },
    err => {
      console.log(err);
      res.send({ code: "400" });
    }
  );
});
// 获取朋友列表
router.post("/getFriendship", (req, res) => {
  let id = req.body.id;
  console.log(id);
  let sql = db.getFriendship(id);

  db.Query(sql).then(
    data => {
      if (data.length >= 1) {
        console.log("获取朋友列表成功！");
        let friendListPromises = data.map(item => {
          let sql = db.getUserInfo(item.other_user_id);
          return db.Query(sql).then(line => line[0]);
        });

        Promise.all(friendListPromises)
          .then(friendList => {
            console.log(friendList);
            res.send({ code: "200", data: friendList }); // 注意这里发送的是friendList，而不是原始的data
          })
          .catch(err => {
            console.log(err);
            res.send({ code: "400", error: "服务器开小差了" });
          });
      } else {
        res.send({ code: "204", message: "没有找到朋友关系" }); // 如果没有找到朋友关系，可以发送一个不同的响应
      }
    },
    err => {
      console.log(err);
      res.send({ code: "400", error: "服务器开小差了" });
    }
  );
});
router.post("/getFriendRequest", (req, res) => {
  let id = req.body.id;
  console.log(id);
  let sql = db.getFriendRequest(id);
  db.Query(sql).then(
    data => {
      if (data.length >= 1) {
        console.log("获取朋友申请列表成功！");
        let friendRequestPromises = data.map(item => {
          let sql = db.getUserInfo(item.other_user_id);
          return db.Query(sql).then(line => line[0]);
        });

        Promise.all(friendRequestPromises)
          .then(friendRequest => {
            console.log(friendRequest);
            res.send({ code: "200", data: friendRequest });
          })
          .catch(err => {
            console.log(err);
            res.send({ code: "400", error: "服务器开小差了" });
          });
      } else {
        res.send({ code: "204", message: "没有找到好友请求" });
      }
    },
    err => {
      console.log(err);
      res.send({ code: "400", error: "服务器开小差了" });
    }
  );
});
router.post("/addFriendRequest", (req, res) => {
  let receiverId = req.body.receiverId;
  let senderId = req.body.senderId;
  let sql = db.getFriendRequestPending(senderId);
  // 第一步，检查发送者是否已经有待处理的好友请求
  db.Query(sql).then(
    data => {
      // 查找是否已经向接收者发送过请求
      const hasSentRequest = data.some(
        item => item.other_user_id === receiverId
      );

      if (hasSentRequest) {
        // 如果已经发送过请求，直接返回错误消息
        res.send({
          code: "205",
          message: "已经向该用户发送过好友请求！"
        });
      } else {
        // 如果没有发送过请求，则添加新的好友请求
        let sql = db.getFriendRequestAccepted(senderId);
        db.Query(sql).then(dataInfo => {
          const hasAccepted = dataInfo.some(
            item => item.other_user_id === receiverId
          );
          if (hasAccepted) {
            res.send({
              code: "205",
              message: "你们已经是好友了！"
            });
          } else {
            let sql = db.addFriendRequest(receiverId, senderId);
            db.Query(sql)
              .then(result => {
                res.send({ code: "200", message: "好友请求发送成功！" });
              })
              .catch(err => {
                console.log(err);
                res.send({ code: "400", error: "服务器开小差了" });
              });
          }
        });
      }
    },
    err => {
      console.log(err);
      res.send({ code: "400", error: "服务器开小差了" });
    }
  );
});
router.post("/changeFriendRelationAccept", (req, res) => {
  let senderId = req.body.senderId;
  let receiverId = req.body.receiverId;
  let sql = db.changeFriendRelationAccept(senderId, receiverId);
  db.Query(sql).then(
    data => {
      console.log(data);
      res.send({ code: "200", data: data });
    },
    err => {
      console.log(err);
      res.send({ code: "400", error: "服务器开小差了" });
    }
  );
});
router.post("/changeFriendRelationRefuse", (req, res) => {
  let senderId = req.body.senderId;
  let receiverId = req.body.receiverId;
  let sql = db.changeFriendRelationRefuse(senderId, receiverId);
  db.Query(sql).then(
    data => {
      console.log(data);
      res.send({ code: "200", data: data });
    },
    err => {
      console.log(err);
      res.send({ code: "400", error: "服务器开小差了" });
    }
  );
});
module.exports = router;
