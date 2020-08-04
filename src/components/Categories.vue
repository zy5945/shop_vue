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
          <el-button type="primary">编辑</el-button>
          <el-button type="danger" >删除</el-button>
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
    <el-dialog title="添加分类" :visible.sync="addGoods" >
      <el-form :model="addForm" label-width="100px" >
        <el-form-item label="分类名称" >
          <el-input v-model="addForm.cat_name" ></el-input>
        </el-form-item>
        <el-form-item label="父级分类" >
          <!--options 用来指定数据源-->
          <!--props   用来指定配置对象-->
          <el-cascader
                  expandTrigger="hover"
                  size="medium"
                  v-model="selcetedKeys"
                  :options="parentCateList"
                  :props="cascaderProps"
                  clearable
                  @change="parentCateChange"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="sureAdd">确 定</el-button>
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
            //   父级分类列表
                parentCateList:[],
            //    指定级联选择器的配置对象
                cascaderProps:{
                    value:'cat_id',
                    label:'cat_name',
                    children:'children'
                },
                //选中的分类id数组
                selcetedKeys:[]
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
            sureAdd(){
                this.addGoods=false;
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
            },
            cancel(){
                this.addGoods=false;
            }
        }
    }
</script>

<style scoped>
.el-cascader{
  width:100%;
  height:100px;
  overflow: auto;
}
</style>