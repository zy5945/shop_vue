<template>
  <div>
    <!--导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table
              :data="rightForm"
              border
              stripe
              style="width: 100%">
        <el-table-column
                class="TableIndex"
                type="index"
                label="#"
                width="80">
        </el-table-column>
        <el-table-column
                prop="authName"
                label="权限名称">
        </el-table-column>
        <el-table-column
                prop="path"
                label="访问路径">
        </el-table-column>

        <el-table-column
                prop="level"
                label="层级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==0">一级</el-tag>
            <el-tag v-if="scope.row.level==1" type="success">二级</el-tag>
            <el-tag v-if="scope.row.level==2" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
    export default {
        name: "right",
        data(){
            return {
                rightForm:[],
            }
        },
        created(){
            this.getTableList();
        },
        methods:{
            getTableList(){
                this.$http.get('rights/list').then((res)=>{

                    console.log(res,res.data.data);
                    this.rightForm=res.data.data;

                }).catch(()=>{
                    console.log('失败')
                })
            }
        }
    }
</script>

<style scoped>

</style>