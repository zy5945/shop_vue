<template>
  <el-container class="container">
    <!--头部-->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="" class="company-logo">
      </div>
      <el-button class="loginout" @click="loginOut" type="info">退出</el-button>
    </el-header>
    <!--主题-->
    <el-container>
      <el-aside width="200px">
          <el-menu
                  background-color="#bbdff0"
                  text-color="#000"
                  active-text-color="#ffd04b">
            <el-submenu index="1">
              <template slot="title">
                <span>导航一</span>
              </template>
                <el-menu-item index="1-1">选项1</el-menu-item>
                <el-menu-item index="1-2">选项2</el-menu-item>
                <el-menu-item index="1-3">选项3</el-menu-item>
                <el-menu-item index="1-4">选项4</el-menu-item>
            </el-submenu>

          </el-menu>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
    import ElButton from "element-ui/packages/button/src/button";

    export default {
        components: {ElButton},
        name: "home",
        methods:{
            loginOut(){
                window.sessionStorage.clear();
                this.$router.push('/login')
            }
        }
    }
</script>

<style lang="less" scoped>
  .container{
    height:100%;
    .company-logo{
      width: 60px;
      height:60px;
      background: aliceblue;
      border-radius: 50%;
      float: left;
    }
    .loginout{
      margin-top:10px;
      float: right;
    }
  }
  .el-header{
    background-color: #006699;
  }
  .el-aside{
    background-color: #bbdff0;
  }
  .el-main{
    background-color: #fff;
  }
</style>