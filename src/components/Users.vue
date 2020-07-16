<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--主体区域-->
    <!--搜索-->
    <el-card class="box-card">
      <el-input placeholder="请输入内容"
                class="input-with-select">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="primary">+ 添加用户</el-button>
      <!--表格-->
      <el-table
              :data="tableList"
              height="250"
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
                prop="username"
                label="姓名"
                width="180">
        </el-table-column>
        <el-table-column
                prop="mobile"
                label="电话"
                width="180">
        </el-table-column>
        <el-table-column
                prop="create_time"
                label="日期">
        </el-table-column>
        <el-table-column
                prop="role_name"
                label="身份"
                width="180">
        </el-table-column>
        <el-table-column
                prop="mg_state"
                label="状态"
                width="180">
          <template slot-scope="scope">
            <el-switch
               v-model="scope.row.mg_state"
              :value="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ddd"
              @change="changeState(scope.row)">
            </el-switch>
          </template>

        </el-table-column>
        <el-table-column
                label="操作"
                width="300">
          <el-button type="primary" size="small">
            <i class="el-icon-edit"></i>
            <span>编辑</span>
            </el-button>
          <el-button type="danger" size="small">
            <i class="el-icon-delete"></i>
            <span>删除</span>
          </el-button>
          <el-button type="warning" size="small">
            <i class="el-icon-setting"></i>
            <span>设置</span>
          </el-button>
        </el-table-column>
      </el-table>
    </el-card>

  </div>
</template>

<script>
    export default {
        name: "users",
        data(){
            return{
                tableList:[],
                total:0,
                queryInfo:{
                    query:'',
                    pagenum:1,
                    pagesize:5
                },


            }
        },
        created(){
            this.getTableList()
        },
        methods:{
            async getTableList(){
                const res=await this.$http.get('users',{params:this.queryInfo});
                console.log(res);
                if(res.data.meta.status!==200){
                    return this.$message.error(res.data.meta.message)
                }
                this.total=res.data.data.total;
                this.tableList=res.data.data.users
            },
            async changeState(userInfo){
               const {data:res}= await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`);
               if(res.meta.status !==200){
                   userInfo.mg_state=!userInfo.mg_state;
                   return this.$message.error('用户状态更改失败')
               }else{
                   return this.$message.success('用户状态更改成功')

               }
            }
        }
    }
</script>

<style scoped>
  .box-card{
    margin-top: 20px;
    padding: 20px;
  }
  .input-with-select{
    margin-right:30px;
    width:300px;
  }


</style>