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
      <el-button type="primary" @click="addUser">+ 添加用户</el-button>
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
            <el-button type="primary" size="small" @click="openEdit(scope.row.id)">
              <i class="el-icon-edit"></i>
              <span>修改</span>
            </el-button>
            <el-button type="danger" size="small" @click="opendelete(scope.row.id)">
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
    <el-dialog title="添加用户" :visible.sync="addUserModel"
    >
      <el-form :model="addUserForm"  :rules="addUserRules" ref="addFormRef" label-width="100px" class="addForm">
        <el-form-item label="姓名" prop="username" >
          <el-input  v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码"  prop="password">
          <el-input  v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input  v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话"  prop="mobile">
          <el-input  v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="this.addUserModel=false;">取 消</el-button>
        <el-button type="primary" @click="sureAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!--修改用户信息-->
    <el-dialog title="修改用户信息" :visible.sync="editUserModel"
    >
      <el-form :model="editUserForm"  :rules="editUserRules" ref="editFormRef" label-width="100px" class="addForm">
        <el-form-item label="姓名" prop="username">
          <el-input  v-model="editUserForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input  v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话"  prop="mobile">
          <el-input  v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserModel=false">取 消</el-button>
        <el-button type="primary" @click="sureEdit">确 定</el-button>
      </div>
    </el-dialog>
    <!--删除用户-->
    <el-dialog title="删除用户信息" :visible.sync="deleteUserModel">
      <span>确定删除用户{{rowUser.username}}？</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteUserModel=false">取 消</el-button>
        <el-button type="primary" @click="sureDelete">确 定</el-button>
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
                addUserModel:false,
                addUserForm:{
                    username:'',
                    password:'',
                    email:'',
                    mobile:'',
                },
                addUserRules:{
                    username:[{
                        required:true,message:'请输入用户名',trigger:'blur'
                    }],
                    password:[{
                        required:true,message:'请输入密码',trigger:'blur'
                    }]
                },
                editUserModel:false,
                editUserForm:{
                    username:'',
                    email:'',
                    mobile:'',
                },
                editUserRules:{
                    email:[{
                        required:true,message:'请输入邮箱',trigger:'blur'
                    }],
                    mobile:[{
                        required:true,message:'请输入电话',trigger:'blur'
                    }]
                },
                rowUser:{},
                deleteUserModel:false,
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
            addUser(){
                this.addUserModel=true;
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
            },
           sureAdd(){
                this.$refs.addFormRef.validate( valid=>{
                    if(!valid) return
                    this.$http.post('users',this.addUserForm).then(()=>{
                        this.addUserModel=false;
                        this.queryInfo.pagenum=1;
                        this.getTableList();
                        this.$refs.addFormRef.resetFields();
                        return this.$message.success('用户添加成功')
                    }).catch(()=>{
                        return this.$message.error('添加用户失败')
                    });

                })

            },
            openEdit(id){
                this.$http.get(`users/${id}`,{params:this.editUserForm}).then((data)=>{

                    this.editUserForm=data.data.data;
                    console.log(data,this.editUserForm);
                    this.editUserModel=true;

                }).catch(()=>{
                    return this.$message.error('获取用户信息失败')
                });
            },
            sureEdit(){
                this.$refs.editFormRef.validate( valid=>{
                    if(!valid) return
                    this.$http.put(`users/${this.editUserForm.id}`,this.editUserForm).then(()=>{
                        this.editUserModel=false;
                        this.queryInfo.pagenum=1;
                        this.getTableList();
                        this.$refs.editFormRef.resetFields();
                        return this.$message.success('用户信息修改成功')
                    }).catch(()=>{
                        return this.$message.error('用户信息修改失败')
                    });

                })

            },
            opendelete(id){
                this.$http.get(`users/${id}`).then((data)=>{

                    this.rowUser=data.data.data;
                    this.deleteUserModel=true;

                }).catch(()=>{
                    return this.$message.error('获取用户信息失败')
                });
            },
            sureDelete(){
                this.$http.delete(`users/${this.rowUser.id}`).then(()=>{
                    this.deleteUserModel=false;
                    this.queryInfo.pagenum=1;
                    this.getTableList();
                    return this.$message.success('删除成功')
                }).catch(()=>{
                    return this.$message.error('删除失败')
                });
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
.addForm{
  width:500px;
  margin: 0 auto;
}

</style>