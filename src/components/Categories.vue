<template>
  <div>
    <!--导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary" @click="showAddBox">添加分类</el-button>
      <tree-table :data="tableList"
                  :columns="columns"
                  show-index
                  border
                  :expand-type="false"
                  :selection-type="false"
      >
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted"
          style="color:green"></i>
          <i class="el-icon-error" v-if="!scope.row.cat_deleted"
             style="color:red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0" type="success">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level===1" >二级</el-tag>
          <el-tag v-else-if="scope.row.cat_level===2" type="warning">三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" @click="showEditModel(scope.row)">编辑</el-button>
          <el-button type="danger" @click="showDelModel(scope.row)">删除</el-button>
        </template>
      </tree-table>
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[2, 5, 10, 50]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>
    <!--添加分类对话框-->
    <el-dialog title="添加分类" :visible.sync="addGoods" @close="addCateclose">
      <el-form :model="addForm" label-width="100px" ref="addFormRef">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name" ></el-input>
        </el-form-item>
        <el-form-item label="父级分类" >
          <!--options 用来指定数据源-->
          <!--props   用来指定配置对象-->
          <el-cascader
                  ref="cascader"
                  id="sel"
                  expandTrigger="hover"
                  size="medium"
                  v-model="selcetedKeys"
                  :options="parentCateList"
                  :props="cascaderProps"
                  clearable
                  change-on-select
                  @change="parentCateChange"

          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <!--@click="sureAdd"-->
        <el-button type="primary" @click="addSure">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑分类名称弹框-->
    <el-dialog title="修改分类" :visible.sync="editGoods">
      <el-form :model="editForm" label-width="100px" ref="editFormRef">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <!--@click="sureAdd"-->
        <el-button type="primary" @click="editSure">确 定</el-button>
      </div>
    </el-dialog>
    <!--确定删除弹框-->
    <el-dialog title="修改分类" :visible.sync="delGoods">
      <div><i class="el-icon-warning"></i>此操作将永久删除该分类，是否继续？</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <!--@click="sureAdd"-->
        <el-button type="primary" @click="delSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "categories",
        data(){
            return {
                queryInfo:{
                    type:3,
                    pagenum:1,
                    pagesize:5
                },
                tableList:[],
                total:0,
                columns:[
                    {
                        label:'分类名称',
                        prop:'cat_name'
                    },
                    {
                        label:'是否有效',
                        type:'template',
                        template:'isok'
                    },
                    {
                        label:'排序',
                        type:'template',
                        template:'order'
                    },
                    {
                        label:'操作',
                        type:'template',
                        template:'opt'
                    }
                ],
                addForm:{
                    cat_pid:0,
                    cat_name:'',
                    cat_level:0
                },
                //控制添加分类对话框显示与隐藏
                addGoods:false,
                editGoods:false,
                delGoods:false,
            //   父级分类列表
                parentCateList:[],
            //    指定级联选择器的配置对象
                cascaderProps:{
                    value:'cat_id',
                    label:'cat_name',
                    children:'children'
                },
                //选中的分类id数组
                selcetedKeys:[],
                editForm:{
                    cat_name:''
                },
                del_id:0,
            }
        },
        created(){
            this.getTableList();
        },
        methods:{
            getTableList(){
            this.$http.get(`categories`,{params:this.queryInfo}).then((res)=>{
                console.log(res);
                this.tableList=res.data.data.result;
                this.total=res.data.data.total;
            }).catch(()=>{
                return this.$message.error('请求失败')
            })
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
            showAddBox(){
                this.getParentList();
                this.addGoods=true;
            },
            addCateclose(){
                console.log(this.addForm,this.$refs);
                this.$refs.addFormRef.resetFields();
                this.$refs.cascader.handleClear();
                this.addForm.selcetedKeys=[];
                this.addForm.cat_pid=0;
                this.addForm.cat_level=0;
            },
            getParentList(){
                this.$http.get('categories',{params:{type:2}}).then((res)=>{
                    console.log(res);
                    this.parentCateList=res.data.data
                }).catch(()=>{
                    return this.$message.error('请求失败')
                })
            },
            parentCateChange(){
                console.log(this.selcetedKeys);
                if(this.selcetedKeys.length>0){
                    this.addForm.cat_pid=this.selcetedKeys[this.selcetedKeys.length-1];
                    this.addForm.cat_level=this.selcetedKeys.length;
                    return
                }else{
                    this.addForm.cat_pid=0;
                    this.addForm.cat_level=0;
                }
            },
            showEditModel(row){
                console.log(row);
                this.editForm=row;
                this.editGoods=true;
            },
            showDelModel(row){
                this.del_id=row.cat_id;
                this.delGoods=true;
            },
            addSure(){
                this.$http.post(`categories`,this.addForm).then(()=>{
                    this.getTableList();
                    this.addGoods=false;
                }).catch(()=>{
                    return this.$message.error('添加失败')
                })
            },
            editSure(){
                this.$http.put(`categories/${this.editForm.cat_id}`,this.editForm).then(()=>{
                    this.getTableList();
                    this.editGoods=false;
                    return this.$message.success('修改成功')
                }).catch(()=>{
                    return this.$message.error('修改失败')
                })
            },
            delSure(){
                this.$http.delete(`categories/${this.del_id}`,this.del_id).then(()=>{
                    this.queryInfo.pagenum=1;
                    this.getTableList();
                    this.delGoods=false;
                    return this.$message.success('删除成功')
                }).catch(()=>{
                    return this.$message.error('删除失败')
                })
            },
            cancel(){
                this.addGoods=false;
                this.editGoods=false;
                this.delGoods=false;
            }
        }
    }
</script>

<style scoped>
.el-cascader{
  width:100%;
}
  .el-icon-warning{
    color:orange;
    font-size:16px;
  }
</style>