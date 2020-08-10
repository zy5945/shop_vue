<template>
  <div>
    <!--导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片-->
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table
              :data="roleList"
              border
              stripe
              style="width: 100%">
        <el-table-column
                type="expand"
                width="80">
          <template slot-scope="scope">
            <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id" :class="['vcenter','bdbottom',i1===0 ? 'bdtop':'']">
              <!--一级权限-->
              <el-col :span="5"><el-tag closable @close="removeTagById(scope.row,item1.id)">{{item1.authName}}</el-tag><i class="el-icon-caret-right"></i></el-col>
              <!--二。三级权限-->
              <el-col :span="19">
                <el-row v-for="(item2,i2) in item1.children" :key="item2.id"  :class="['vcenter',i2===0 ? '':'bdtop']">
                  <el-col :span="5"><el-tag type="success" closable @close="removeTagById(scope.row,item2.id)">{{item2.authName}}</el-tag><i class="el-icon-caret-right"></i></el-col>
                  <el-col :span="18">
                    <el-tag  type="warning"  v-for="item3 in item2.children" :key="item3.id" closable @close="removeTagById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
                class="TableIndex"
                type="index"
                label="#"
                width="80">
        </el-table-column>
        <el-table-column
                prop="roleName"
                label="角色名称">
        </el-table-column>
        <el-table-column
                prop="roleDesc"
                label="角色描述">
        </el-table-column>
        <el-table-column
                label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" >
              <i class="el-icon-edit"></i>
              <span>编辑</span>
            </el-button>
            <el-button type="danger" size="small" >
              <i class="el-icon-delete"></i>
              <span>删除</span>
            </el-button>
            <el-button type="warning" size="small" @click="Distribution(scope.row)">
              <i class="el-icon-setting"></i>
              <span>分配权限</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分配权限-->
      <el-dialog title="分配权限" :visible.sync="Distribute" @close="Cancel">
        <!--树形控件-->
        <el-tree :data="rightsLists" :props="TreeProps" show-checkbox node-key="id"
                 :default-expand-all="true" ref="treeRef"
        :default-checked-keys="defkeys"></el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button @click="Cancel">取 消</el-button>
          <el-button type="primary" @click="alotRights">确 定</el-button>
        </div>
      </el-dialog>
      <!--编辑角色弹框-->
      <el-dialog title="编辑角色" :visible.sync="editRoles" @close="Cancel">
        <el-form :model="editForm" label-width="100px">
          <el-form-item  label="角色名称" prop="roleName">
            <el-input></el-input>
          </el-form-item>
          <el-form-item  label="角色描述" prop="roleDesc">
            <el-input></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="Cancel">取 消</el-button>
          <el-button type="primary" @click="alotRights">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
    export default {
        name: "roles",
        data(){
            return {
                roleList:[],
                Distribute:false,
                editRoles:false,
                rightsLists:[],
                TreeProps:{
                    label:'authName',
                    children:'children',
                },
                defkeys:[],
                //当前将分配权限的id
                roleId:'',
            }
        },
        created(){
            this.getTableList();
        },
        methods:{
            getTableList(){
                this.$http.get('roles').then((res)=>{
                    this.roleList = res.data.data;
                    console.log(res,this.roleList);
                    return this.$message.success('请求成功');
                }).catch(()=>{
                    console.log('失败')
                })
            },
            async removeTagById(id1,id2){
            //    弹框提示用户是否删除
              const confirmResult=await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch((err) => err );
              if(confirmResult!=='confirm') return this.$message.info('取消删除');
               const {data:res}= await this.$http.delete(`roles/${id1.id}/rights/${id2}`);
               if(res.meta.status!==200){
                   return this.$message.error('删除失败');
               }else{
                   id1.children =res.data
               }
            },
            async Distribution(role){
                this.roleId=role.id;
                const {data:res}= await this.$http.get('rights/tree')
                if(res.meta.status!==200){
                    return this.$message.error('请求失败');
                }else{
                    this.rightsLists=res.data;
                    this.getLeafKeys(role,this.defkeys)
                    this.Distribute=true;
                }



            },
            //通过递归的形式获取三级权限是id
            getLeafKeys(node,arr){
                if(!node.children){
                    return arr.push(node.id)
                }
                node.children.forEach(item=>{
                    this.getLeafKeys(item,arr)
                })
            },
            //点击拿到分配权限，
            async alotRights(){
                const keys=[
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ];
                const idStr=keys.join(',');
                const {data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr});
                console.log(res);
                if(res.meta.status!==200){
                    return this.$message.error('修改失败');
                }
                 this.$message.success('修改成功');
                this.Distribute = false;
                this.getTableList();
            },
            Cancel(){
                this.Distribute = false;
                this.defkeys=[]
            }
        },

    }
</script>

<style scoped>
  .el-tag{
    margin:6px;
  }
  .bdtop{
    border-top: 1px solid #ddd;

  }
.bdbottom{
  border-bottom: 1px solid #ddd;
}
</style>