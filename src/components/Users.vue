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
                class="input-with-select"
                clearable
                v-model="queryInfo.query">
        <el-button slot="append" icon="el-icon-search"
                   @click="searchUser"></el-button>
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
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="editUser(scope.row)">
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
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="pageSizes"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>
    <!--弹框-->
    <!--编辑用户信息-->
    <el-dialog title="编辑用户信息" :visible.sync="editModel">
      <el-form :model="EditForm">
        <el-form-item label="活动名称" label-width="600px">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" label-width="600px">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "users",
        data(){
            return{
                tableList:[],
                queryInfo:{
                    query:'',
                    pagenum:1,
                    pagesize:2,
                },
                pageSizes:[2, 10, 20, 50,100],
                total:0,
                editModel:false,
                EditForm:{},
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
             changeState(userInfo){
               this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`).then(()=>{
                   return this.$message.success('用户状态更改成功')
               }).catch(()=>{
                   userInfo.mg_state=!userInfo.mg_state;
                   return this.$message.error('用户状态更改失败')
               });
            },
            editUser(edituser){
                this.editModel=true
            },
            //监听当前页改变
            handleCurrentChange(page){
                this.queryInfo.pagenum=page;
                this.getTableList()
            },
            //监听每页显示多少条
            handleSizeChange(pages){
                this.queryInfo.pagesize=pages;
                this.getTableList()
            },
            searchUser(){
                this.queryInfo.pagenum=1;
                this.getTableList()
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