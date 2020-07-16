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
      <el-aside :width="isCollapse ? '66px':'200px'">
          <div class="toggle-button" @click="changeMenuWidth">|||</div>
          <el-menu :unique-opened="isUniqueOpened"
                   :collapse="isCollapse"
                   :collapse-transition="isCollapseTransition"
                  background-color="#bbdff0"
                  text-color="#000"
                  active-text-color="blue"
                   :default-active="defaultActive"
                   router
                   >
            <el-submenu :index="item.id+''"
                        v-for="item in menuList"
                        :key="item.id">
              <template slot="title">
                <i :class="menuListIcon[item.id]" class="fontI"></i>
                <span>{{item.authName}}</span>
              </template>
                <el-menu-item :index="'/'+subItem.path"
                              v-for="subItem in item.children"
                              :key="subItem.id"
                              @click="nowIn('/'+subItem.path)">
                  <template>
                    <i class="el-icon-menu"></i>
                    <span>{{subItem.authName}}</span>
                  </template>
                  </el-menu-item>
            </el-submenu>

          </el-menu>
      </el-aside>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
    import ElButton from "element-ui/packages/button/src/button";

    export default {
        components: {ElButton},
        name: "home",
        data(){
          return{
              menuList:[],
              menuListIcon:{
                  125:'el-icon-user-solid',
                  103:'el-icon-s-claim',
                  101:'el-icon-shopping-bag-2',
                  102:'el-icon-tickets',
                  145:'el-icon-data-line'
              },
              isCollapse:false,
              isUniqueOpened:true,
              isCollapseTransition:false,
              defaultActive:''
          }
        },
        created(){
            this.getMenuList()
            this.defaultActive=window.sessionStorage.getItem('activePath')
        },
        methods:{
          loginOut(){
              window.sessionStorage.clear();
              this.$router.push('/login')
          },
          changeMenuWidth(e){
              this.isCollapse=!this.isCollapse
          },
          nowIn(subItemPath){
              window.sessionStorage.setItem('activePath',subItemPath)
              this.defaultActive=subItemPath
          },
          //  获取菜单
          async getMenuList(){
             const {data:res} = await this.$http.get('menus')
              console.log(res);
             if(res.meta.status!==200) return this.$message.error(res.meta.$message)
            this.menuList=res.data;
              console.log(this.menuList);
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
  .toggle-button{
    height:20px;
    line-height: 20px;
    letter-spacing: 0.2em;
    text-align: center;
    background: #ddd;
    user-select:none;
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