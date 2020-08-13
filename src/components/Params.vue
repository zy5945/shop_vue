<template>
  <div>
    <!--导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区-->
    <el-card class="box-card">
      <!--警告框不可关闭的-->
      <el-alert
              title="注意：只允许为第三级分类设置相关参数！"
              type="warning"
              show-icon
              :closable="false">
      </el-alert>
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <!--级联选择框-->
          <el-cascader
            expandTrigger="hover"
            v-model="selectedKeys"
            :options="cataList"
            :props="cataProps"
            clearable
            @change="selChange">
          </el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="tabChange">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBtnDisabled" @click="addmany">添加参数</el-button>
          <el-table :data="manyData" border stripe >
            <el-table-column type="expand">
              <template  slot-scope="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable
                @close="handleInputClose(i,scope.row)">{{item}}</el-tag>
                <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" prop="attr_name">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="editMany(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="delMany(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isBtnDisabled" @click="addonly">添加属性</el-button>
          <el-table :data="onlyData" border stripe >
            <el-table-column type="expand">
              <template  slot-scope="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable
                        @close="handleInputClose(i,scope.row)">{{item}}</el-tag>
                <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" prop="attr_name">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="editOnly(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="delOnly(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog title="添加参数" :visible.sync="addManyModel" @close="cancel">
      <el-form :model="addManyForm" ref="addManyRef" label-width="100px">
        <el-form-item label="参数名称">
          <el-input v-model="addManyForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="sureAddMany">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加属性" :visible.sync="addOnlyModel" @close="cancel">
      <el-form :model="addOnlyForm" ref="addOnlyRef" label-width="100px">
        <el-form-item label="属性名称">
          <el-input v-model="addOnlyForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="sureAddOnly">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改参数" :visible.sync="editManyModel" @close="cancel">
      <el-form :model="editManyForm" ref="editManyRef" label-width="100px">
        <el-form-item label="参数名称">
          <el-input v-model="editManyForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="sureeditMany">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改属性" :visible.sync="editOnlyModel" @close="cancel">
      <el-form :model="editOnlyForm" ref="editOnlyRef" label-width="100px">
        <el-form-item label="属性名称">
          <el-input v-model="editOnlyForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="sureeditOnly">确 定</el-button>
      </div>
    </el-dialog>
    <!--删除参数弹框-->
    <el-dialog title="删除动态参数" :visible.sync="delManyModel" @close="cancel">
      <div>确定永久删除此动态参数？</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="suredelMany">确 定</el-button>
      </div>
    </el-dialog>
    <!--删除属性弹框-->
    <el-dialog title="删除静态属性" :visible.sync="delOnlyModel" @close="cancel">
      <div>确定永久删除此静态属性？</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="suredelOnly">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "params",
        data(){
            return {
                cataList:[],
                cataProps:{
                    value:'cat_id',
                    label:'cat_name',
                    children:'children'
                },
                selectedKeys:[],
                activeName:'many',
                manyData:[],
                onlyData:[],
                addManyForm:{
                    attr_name:'',
                    attr_sel:'many',

                },
                addOnlyForm:{
                    attr_name:'',
                    attr_sel:'only',
                },
                attr_id:'',
                editManyForm:{},
                editOnlyForm:{},
                addManyModel:false,
                addOnlyModel:false,
                editManyModel:false,
                editOnlyModel:false,
                delManyModel:false,
                delOnlyModel:false,
            //    添加attr_vals
                inputVisible:false,
                inputValue:''
            }
        },
        created(){
            this.getTableList()
        },
        methods:{
            getTableList(){
                this.$http.get('categories').then((res)=>{
                    this.cataList=res.data.data;
                    this.$message.success('获取数据成功');
                    console.log(this.cataList);
                }).catch(()=>{
                    this.$message.error('获取数据失败')
                })
            },
            selChange(){
                this.getCategories()
            },
            getCategories(){
                if(this.selectedKeys.length!==3) {
                    this.selectedKeys=[];
                    this.manyData=[];
                    this.onlyData=[];
                    return
                }
                this.$http.get(`categories/${this.cateId}/attributes`,
                    {params:{sel:this.activeName}})
                    .then((res)=>{
                        res.data.data.forEach((item)=>{
                            item.attr_vals=item.attr_vals? item.attr_vals.split(','):[]
                        })
                        if(this.activeName==='many'){
                          this.manyData=res.data.data;
                            console.log(this.manyData);
                        }else{
                            this.onlyData=res.data.data;
                            console.log(this.onlyData);
                        }
                    })
            },
            tabChange(){
                this.getCategories()
            },
            addmany(){
                this.addManyModel=true
            },
            addonly(){
                this.addOnlyModel=true
            },
            sureAddMany(){
                this.$http.post(`categories/${this.cateId}/attributes`,this.addManyForm)
                .then(()=>{
                    this.addManyModel=false;
                    this.getCategories()
                }).catch(()=>{
                    this.$message.error('添加参数失败')
                })
            },
            sureAddOnly(){
                this.$http.post(`categories/${this.cateId}/attributes`,this.addOnlyForm)
                    .then(()=>{
                        this.addOnlyModel=false;
                        this.getCategories()
                    }).catch(()=>{
                    this.$message.error('添加属性失败')
                })
            },
            editMany(row){
                this.$http.get(`categories/${this.cateId}/attributes/${row.attr_id}`)
                    .then((res)=>{
                        this.editManyForm=res.data.data;
                        this.attr_id= this.editManyForm.attr_id;
                        this.editManyModel=true;
                    }).catch(()=>{
                    this.$message.error('修改参数失败')
                })
            },
            sureeditMany(){
                this.$http.put(`categories/${this.cateId}/attributes/${this.attr_id}`,this.editManyForm).then(()=>{
                    this.editManyModel=false;
                    this.getCategories()
                }).catch(()=>{
                    this.$message.error('修改参数失败')
                })
            },
            editOnly(row){
                this.$http.get(`categories/${this.cateId}/attributes/${row.attr_id}`)
                    .then((res)=>{
                        this.editOnlyForm=res.data.data;
                        this.attr_id= this.editOnlyForm.attr_id;
                        this.editOnlyModel=true;
                    }).catch(()=>{
                    this.$message.error('修改参数失败')
                })
            },
            sureeditOnly(){
                this.$http.put(`categories/${this.cateId}/attributes/${this.attr_id}`,this.editOnlyForm).then(()=>{
                    this.editOnlyModel=false;
                    this.getCategories()
                }).catch(()=>{
                    this.$message.error('修改参数失败')
                })
            },
            delMany(row){
                this.delManyModel=true;
                this.attr_id=row.attr_id;
            },
            suredelMany(){
                this.$http.delete(`categories/${this.cateId}/attributes/${this.attr_id}`).then(()=>{
                    this.delManyModel=false;
                    this.getCategories()
                }).catch(()=>{
                    this.$message.error('修改参数失败')
                })
            },
            delOnly(row){
                this.delOnlyModel=true;
                this.attr_id=row.attr_id;
            },
            suredelOnly(){
                this.$http.delete(`categories/${this.cateId}/attributes/${this.attr_id}`).then(()=>{
                    this.delOnlyModel=false;
                    this.getCategories()
                }).catch(()=>{
                    this.$message.error('修改参数失败')
                })
            },
            cancel(){
                this.addManyForm.attr_name='';
                this.addOnlyForm.attr_name='';
                this.addManyModel=false;
                this.addOnlyModel=false;
                this.editManyModel=false;
                this.editOnlyModel=false;
                this.delManyModel=false;
                this.delOnlyModel=false;
            },
            showInput(){
                this.inputVisible=true;
            },
            handleInputConfirm(row){
                if( this.inputValue==='') {
                    return
                };
                row.attr_vals.push(this.inputValue);
                row.attr_vals.join(',');
                this.sendParam(row)
                console.log(row);
            },
            sendParam(row){
                console.log(this.addManyForm);
                this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
                    {attr_name:row.attr_name,attr_sel:row.attr_sel,attr_vals:row.attr_vals.join(',')})
                    .then(()=>{
                        this.inputValue='';
                        this.inputVisible=false;
                    }).catch(()=>{
                    this.$message.error('添加参数失败')
                })
            },
            handleInputClose(i,row){
                row.attr_vals.splice(i,1);
                this.sendParam(row)
            }

        },
        computed:{
            isBtnDisabled(){
                if(this.selectedKeys.length!==3) {
                    return true
                }
                return false
            },
            cateId(){
                if(this.selectedKeys.length===3) {
                    return this.selectedKeys[2]
                }
                return null
            }
        }
    }
</script>

<style scoped>
  .el-row{
    margin:15px 0;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>