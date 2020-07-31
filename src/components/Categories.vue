<template>
  <div>
    <!--导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary">添加分类</el-button>
    </el-card>
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
                width="80"></el-table-column>
        <el-table-column
                prop="cat_name"
                label="分类名称"></el-table-column>
        <el-table-column
                prop="cat_deleted"
                label="是否有效"></el-table-column>
        <el-table-column
                prop="cat_level"
                label="排序"></el-table-column>
    </el-table>
    <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[2, 5, 10, 50]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
         >
    </el-pagination>
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
                total:0
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
        }
    }
</script>

<style scoped>

</style>