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
          <el-input placeholder="请输入内容"
                    v-model="queryInfo.query"
                    class="input-with-select"
                    clearable>
            <el-button  slot="append" icon="el-icon-search"
                        @click="searchGoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4" style="margin-left:15px">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
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
        <el-table-column
                label="操作"
                align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="wantEdit(scope.row)">编辑</el-button>
            <el-button type="danger " icon="el-icon-delete" @click="wantDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--删除弹框-->
      <el-dialog title="删除商品" :visible.sync="delModel">
        <div>此操作将永久删除该商品，是否继续？</div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="delSure">确 定</el-button>
        </div>
      </el-dialog>
      <!--编辑弹框-->
      <el-dialog title="修改商品信息" :visible.sync="editModel">
        <el-form :data="editFrom" label-width="100px">
          <el-form-item prop="goods_name" label="商品名称">
              <el-input v-model="editFrom.goods_name"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="goods_price" label="商品价格">
                <el-input v-model="editFrom.goods_price"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="goods_number" label="商品数量">
                <el-input v-model="editFrom.goods_number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="goods_weight" label="商品重量">
                <el-input v-model="editFrom.goods_weight"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="eidtSure">确 定</el-button>
        </div>
      </el-dialog>
      <el-pagination
              @size-change="SizeChange"
              @current-change="CurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="pagesizes"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
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
              goodsId:0,
              total:0,
              pagesizes:[10,20,50,100,200,500],
              delModel:false,
              editModel:false,
              editFrom:{

              }
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
            SizeChange(page){
                this.queryInfo.pagesize=page;
                this.getTableList()
            },
            CurrentChange(page){
                this.queryInfo.pagenum=page;
                this.getTableList()
            },
            searchGoods(){
                this.getTableList()
            },
            wantDel(row){
                this.goodsId=row.goods_id;
                this.delModel=true;
            },
            delSure(){
                this.$http.delete(`goods/${this.goodsId}`).then(()=>{
                    this.delModel=false;
                    this.getTableList()
                }).catch(()=>{
                    this.$message.error('删除失败')
                })
            },
            eidtSure(){
                this.$http.put(`goods/${this.goodsId}`,this.editFrom).then(()=>{
                    this.getTableList()
                    this.editModel=false;
                }).catch(()=>{
                    this.$message.error('删除失败')
                })
            },
            wantEdit(row){
                this.$http.get(`goods/${row.goods_id}`).then((res)=>{
                    this.editModel=true;
                    this.goodsId=row.goods_id;
                    this.editFrom=res.data.data
                }).catch(()=>{
                    this.$message.error('删除失败')
                })

            },
            goAddPage(){
                this.$router.push('/goods/add')
            },
            cancel(){
                this.delModel=false;
                this.editModel=false;
            },
    },
    }
</script>

<style scoped>

</style>