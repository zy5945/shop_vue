<template>
  <div>
    <!--导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区-->
    <el-card class="box-card">
      <!--警告框不可关闭的-->
      <el-alert
              title="注意：只允许为第三级分类设置相关参数！"
              type="warning"
              show-icon
              :closable="false">
      </el-alert>
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <!--级联选择框-->
          <el-cascader
            expandTrigger="hover"
            v-model="selectedKeys"
            :options="cataList"
            :props="cataProps"
            clearable
            @change="selChange">

          </el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="用户管理" name="first">
          <el-button type="primary" :disabled="isBtnDisabled">添加参数</el-button>
        </el-tab-pane>
        <el-tab-pane label="配置管理" name="second">
          <el-button type="primary" :disabled="isBtnDisabled">添加参数</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
    export default {
        name: "params",
        data(){
            return {
                cataList:[],
                cataProps:{
                    value:'cat_id',
                    label:'cat_name',
                    children:'children'
                },
                selectedKeys:[],
                activeName:'first'
            }
        },
        created(){
            this.getTableList()
        },
        methods:{
            getTableList(){
                this.$http.get('categories').then((res)=>{
                    this.cataList=res.data.data;
                    this.$message.success('获取数据成功');
                    console.log(this.cataList);
                }).catch(()=>{
                    this.$message.error('获取数据失败')
                })
            },
            selChange(){
                console.log(this.selectedKeys);
                if(this.selectedKeys.length!==3) {
                    this.selectedKeys=[];
                    return
                }
            }
        },
        computed:{
            isBtnDisabled(){
                if(this.selectedKeys.length!==3) {
                    return true
                }
                return false
            }
        }
    }
</script>

<style scoped>
  .el-row{
    margin:15px 0;
  }
</style>