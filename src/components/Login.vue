<template>
  <div class="login_container">
    <div class="login_box">
      <!--头像-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!--表单-->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <!--用户名-->
        <el-form-item  prop="username" >
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-lock"
                    type="password"></el-input>
        </el-form-item>
        <!--登录-->
        <el-form-item class="btns">
          <el-button type="primary" @click="sendLoginForm">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
    export default {
        name: "login",
        data() {
            return{
                loginForm:{
                    username:'admin',
                    password:'123456'
                },
                loginFormRules:{
                    //验证用户名
                    username:[
                        { required: true, message: '请输入用户名称', trigger: 'blur' },
                        { min: 1, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    //验证密码
                    password:[
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 3, max: 6, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ]
                }
            };
        },
        methods:{
            sendLoginForm(){
                this.$refs.loginFormRef.validate(async valid=>{

                    if(!valid) return;
                    const {data:res}=await  this.$http.post('login',this.loginForm);
                    console.log(res);
                    if(res.meta.status !==200)return this.$message.error('登录失败');
                    this.$message({
                             message: '登录成功',
                                type: 'success'});
                    // console.log(res);
                    window.sessionStorage.setItem('token',res.data.token);
                    this.$router.push('/home')
                })
            },
            resetLoginForm (){
                console.log(this);
                this.$refs.loginFormRef.resetFields();
            }
        }
    }
</script>

<style lang="less" scoped>
.login_container{
  background:url("../assets/bg.jpg") no-repeat center;
  height:100%;
}
  .login_box{
    width:450px;
    height:300px;
    background-color: #fff;
    border-radius: 5px;
    position: absolute;
    left:50%;
    top:50%;
    transform: translate(-50% ,-50%);
    .avatar_box{
      margin:0% auto;
      transform: translate(0% ,-50%);
      height:130px;
      width: 130px;
      border: 1px solid #ddd;
      border-radius: 50%;
      padding: 10px;
      background-color: #fff;
      box-shadow: 0px 0px 5px #fff;
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #ddd;
      }
    }
    .btns{
      display: flex;
      justify-content: flex-end;
    }

  }
.login_form{
  width:300px;
  margin:0 auto;
  transform: translate(0 ,-20%);
}
</style>