<template>
  <div>
    <!--导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!--添加-搜索商品-->
      <el-row>
        <el-col :span="7">
          <el-input placeholder="请输入内容" class="input-with-select">

            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4" style="margin-left:15px">
          <el-button type="primary">添加商品</el-button>
        </el-col>
      </el-row>
      <!--商品列表-->
      <el-table
              :data="GoodList"
              border
              style="width: 100%">
        <el-table-column
                type="index"
                label="#"
                align="center"
                width="80">
        </el-table-column>
        <el-table-column
                prop="goods_name"
                label="商品名称"
                align="center"
                :show-overflow-tooltip="true"
                width="500">
        </el-table-column>
        <el-table-column
                prop="goods_price"
                label="商品价格"
                align="center"
                width="150">
        </el-table-column>
        <el-table-column
                prop="goods_number"
                label="商品数量"
                align="center"
                width="100">
        </el-table-column>
        <el-table-column
                prop="goods_weight"
                label="商品重量"
                align="center"
                width="100">
        </el-table-column>
        <el-table-column
                prop="add_time"
                label="创建时间"
                align="center"
                width="220">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">

          </template>
        </el-table-column>
      </el-table>
    </el-card>

  </div>

</template>

<script>
    export default {
        name: "goods",
        data(){
          return{
              GoodList:[],
              queryInfo:{
                  query:'',
                  pagenum:1,
                  pagesize:10
              },
              total:0,

          }
        },
        created(){
            this.getTableList()
        },
        methods:{
            getTableList(){
              this.$http.get(`goods`,{params:this.queryInfo}).then((res)=>{
                  this.GoodList=res.data.data.goods;
                  this.total=res.data.data.total
              }).catch(()=>{
                 this.$message.error('获取列表失败')
              })
            },

    },
    }
</script>

<style scoped>

</style>