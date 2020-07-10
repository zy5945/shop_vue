<template>
  <el-container class="container">
    <!--头部-->
    <el-header>
      Header
      <div>
        <img src="../assets/logo.png" alt="">
      </div>
      <el-button class="loginout" @click="loginOut" type="info">退出</el-button>
    </el-header>
    <!--主题-->
    <el-container>
      <el-aside width="200px">Aside</el-aside>
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