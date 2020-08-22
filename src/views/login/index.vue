<template>
  <div id="login-content">
    <div class="container">
      <div class="loginLeft">
        <img class="loginImg" src="./../../assets/loginbg2.png" alt="" />
        <div class="logintext">—— 育见美好 智育未来 ——</div>
      </div>
      <div class="form-content">
        <div class="login_title">
          <p style="color:#fff">智慧校园综合管理平台</p>
        </div>
        <el-form
          ref="loginForm"
          :model="loginData"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item prop="mobilePhone">
            <div class="inputBox">
              <img src="@/assets/zhanghao.png" class="icon" />
              <input
                v-model="loginData.mobilePhone"
                maxlength="16"
                placeholder="请输入账号"
                type="text"
              />
            </div>
          </el-form-item>
          <el-form-item prop="password">
            <div class="inputBox">
              <img src="@/assets/mima.png" class="icon" />
              <input
                v-model="loginData.password"
                maxlength="16"
                placeholder="请输入密码"
                type="password"
                show-password
              />
            </div>
          </el-form-item>
        </el-form>
        <div class="login-footer">
          <el-button
            type="primary"
            class="loginBtn"
            size="medium"
            @click="loginIn"
            >登录</el-button
          >
          <!-- <el-button type="text" size="small">忘记密码</el-button> -->
        </div>
        <div class="user_xy">
          <el-checkbox v-model="xy_checked" />
          <div class="xy_modle">
            请阅读后同意<a
              href="https://www.wwwwwedu.com/xy/index.html"
              class="xy_span"
              >《用户使用协议》</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api";
import md5 from "md5";
export default {
  name: "Login",
  data() {
    return {
      xy_checked: true,
      rules: {
        mobilePhone: {
          require: true,
          message: "请输入您的手机号！",
          trigger: "blur"
        },
        passWord: {
          require: true,
          message: "请输入您的密码！",
          trigger: "blur"
        }
      },
      loginData: {
        mobilePhone: "",
        password: "",
        type: "P1"
      }
    };
  },
  mounted() {
    const _this = this;
    document.onkeydown = function(e) {
      const key = e.keyCode;
      if (key == 13) {
        _this.loginIn();
      }
    };
  },
  destroyed() {
    document.onkeydown = null;
  },
  methods: {
    loginIn() {
      const _this = this;
      if (!this.xy_checked) {
        return this.$message({
          type: "warning",
          message: "请同意用户使用协议"
        });
      }
      const load = _this.$loading({
        target: document.querySelector("#login-content")
      });
      _this.$refs.loginForm.validate(valid => {
        if (valid) {
          const options = Object.assign({}, _this.loginData);
          console.log(options);
          options.password = md5(options.password);
          api.login
            .loginInApi(options)
            .then(res => {
              if (res.status == 200) {
                sessionStorage.setItem("token", res.data.token);
                load.close();
              } else {
                load.close();
                _this.$message({
                  message: res.msg,
                  type: "warning"
                });
              }
            })
            .then(() => {
              api.login.getUserInfo().then(res => {
                if (res.status == 200) {
                  // _this.$store.dispatch("setUserInfo", res.data);
                  sessionStorage.setItem("userId", res.data.userInfo.userId);
                  sessionStorage.setItem(
                    "companyId",
                    res.data.companyList[0].id
                  );
                  _this.$router.push("/");
                  _this.$message({
                    message: "登录成功",
                    type: "success"
                  });
                } else {
                  _this.$message({
                    message: res.msg,
                    type: "warning"
                  });
                  load.close();
                }
              });
            })
            .catch(err => {
              load.close();
            });
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
#login-content {
  height: 100vh;
  width: 100vw;
  box-shadow: 0px 0px 20px 0px rgba(255, 82, 82, 0.5);
  background-image: url("./../../assets/loginbg.png");
  background-size: 100% 100%;
}
.container {
  position: relative;
  left: 0;
  top: 0;
  width: 90%;
  margin: 0 10%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  transform: translateZ(10%);
}
.loginLeft {
  display: block;
  width: 30%;
  position: absolute;
  top: 50%;
  left: 20%;
  transform: translate(-50%, -50%);
  -webkit-user-select: none;
}
.loginImg {
  display: block;
  width: 100%;
  height: 80%;
  margin-bottom: 10%;
  -webkit-user-drag: none;
}
.logintext {
  font-weight: bold;
  font-size: 26px;
  color: #fff;
  text-align: center;
}
.el-form demo-ruleForm {
  width: 80%;
  position: absolute;
  top: 0px;
  right: 0px;
  min-width: 32%;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.5);
  padding: 0px 50px;
  padding-right: 5%;
  z-index: 10;
}
.loginBtn {
  width: 280px;
  margin-left: auto;
}
.form-content {
  width: 400px;
  box-sizing: border-box;
  padding: 10px;
  position: absolute;
  top: 50%;
  left: 60%;
  transform: translate(-50%, -50%);
  // position: relative;
}
.login_title {
  width: 100%;
  height: 40px;
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  // margin-left:50px;
  transform: translateX(50px) translateY(-80px);
  p {
    line-height: 40px;
  }
}
.login-footer {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.inputBox {
  position: relative;
  margin-top: 20px;
  display: flex;
  // font-size: 18px;
  height: 40px;
  line-height: 40px;
  align-items: center;
  background: #fff;
  border-radius: 4px;
  .icon {
    display: block;
    position: absolute;
    left: 10px;
    width: 18px;
    height: 18px;
  }
  div {
    height: 100%;
    padding-left: 35px;
  }
  input {
    height: 100%;
    width: 100%;
    padding-left: 38px;
    color: #333;
    border-radius: 4px;
    background-color: transparent !important;
  }
  input::placeholder {
    color: rgba(153, 153, 153, 1);
  }
}
.user_xy {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 280px;
  height: 60px;
  line-height: 60px;
  color: #fff;
  margin-top: 20px;
  margin-left: auto;
}
.xy_modle {
  width: 90%;
  margin-left: 10px;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
}
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background: #2262c6;
  border-color: #2262c6;
}
</style>
