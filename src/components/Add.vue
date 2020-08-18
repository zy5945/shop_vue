<template>
  <div>
    <!--导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card  box-card1" >
      <el-alert
              title="添加商品信息"
              type="info"
              show-icon
              center
              :closable="false">
      </el-alert>
      <el-steps :active="stepActive" align-center finish-status="success">
        <el-step v-for="(item,i) in steps" :title="item.title" :key="i"></el-step>
      </el-steps>
      <div id="fillInfo">
        <div class="active boxs" :data-index="0">
          <el-form :model="addForm" label-width="100px" style="width:800px" :rules="rules" ref="addForm">
            <el-form-item prop="goods_name" label="商品名称">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item prop="goods_price" label="商品价格">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item prop="goods_number" label="商品数量">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item prop="goods_weight" label="商品重量">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                      expandTrigger="hover"
                      v-model="addForm.goods_cat"
                      :options="cataList"
                      :props="cataProps"
                      clearable>
              </el-cascader>
            </el-form-item>
            <el-form-item style="text-align: center">
              <el-button type="primary" @click="nextStep1('addForm')" class="next-step">下一步</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="boxs" :data-index="1">
          <el-form class="manyNum">
            <el-form-item v-for="item in manyTableData" :label="item.attr_name" :key="item.attr_id">
              <el-tag v-for="(item1,j) in item.attr_vals"  closable :key="j" @close="closeMany(j,item)">{{item1}}</el-tag>
            </el-form-item>
            <el-form-item style="text-align: center">
              <el-button type="primary" @click="preStep" class="pre-step">上一步</el-button>
              <el-button type="primary" @click="nextStep2" class="next-step">下一步</el-button>
            </el-form-item>
          </el-form>

        </div>
        <div class="boxs" :data-index="2">
          <el-form >
            <el-form-item v-for="item in onlyTableData" :label="item.attr_name" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
            <el-form-item style="text-align: center">
              <el-button type="primary" @click="preStep" class="pre-step">上一步</el-button>
              <el-button type="primary" @click="nextStep3" class="next-step">下一步</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="boxs" :data-index="3">商品图片
          <el-form>
            <el-form-item>
              <el-upload
                      class="upload-demo"
                      :action="uploadURL"
                      :on-preview="handlePreview"
                      :on-remove="handleRemove"
                      :on-success="handleSuccess"
                      list-type="picture"
                      :headers="headerObj"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
            <el-form-item style="text-align: center">
              <el-button type="primary" @click="preStep" class="pre-step">上一步</el-button>
              <el-button type="primary" @click="nextStep4" class="next-step">下一步</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="boxs" :data-index="4">
          <el-form>
            <el-form-item>
              <quill-editor v-model="addForm.goods_introduce" ></quill-editor>
            </el-form-item>
            <el-form-item style="text-align: center">
              <el-button type="primary" @click="preStep" class="pre-step">上一步</el-button>
              <el-button type="primary" @click="nextStep5" class="next-step">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

    </el-card>
    <!--图片预览框-->
    <el-dialog
            title="图片预览框"
            :visible.sync="previewbox"
            width="50%">
      <img :src="previewPath" alt="" class="imgs">
    </el-dialog>
  </div>
</template>

<script>
    import $ from 'jquery';
    import _ from 'lodash'
    export default {
        name: "add",
        data() {
            return {
                steps: [
                    {title: '基本信息'},
                    {title: '商品参数'},
                    {title: '商品属性'},
                    {title: '商品图片'},
                    {title: '商品内容'},
                    {title: '完成'},
                ],
                addForm: {
                    goods_price:0,
                    goods_number:0,
                    goods_weight:0,
                    goods_cat: [],
                    pics:[],
                //    商品详情描述
                    goods_introduce:'',
                //    参数，属性
                    attrs:[]
                },
                rules: {
                    goods_name: [
                        { required: true, message: '请输入商品名称', trigger: 'blur' }
                    ],
                    goods_price: [
                        {required: true, message: '请输入商品价格', trigger: 'blur'}
                    ],
                    goods_number: [
                        {required: true, message: '请输入商品数量', trigger: 'blur' }
                    ],
                    goods_weight: [
                        {required: true, message: '请输入商品重量', trigger: 'blur' }
                    ],
                    goods_cat:[
                        {required: true, message: '请选择商品分类', trigger: 'change' }
                    ]
                },
                cataList: [],
                cataProps: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                step: 0,
                //动态参数列表
                manyTableData:[],
                //静态属性列表
                onlyTableData:[],
                uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
                // 图片上传组件headers请求头
                headerObj:{
                    Authorization:window.sessionStorage.getItem('token')
                },
                previewPath:'',
                previewbox:false,
            }
        },
        created() {
            this.getCategories()
        },
        methods: {
            getCategories() {
                this.$http.get('categories').then((res) => {
                    this.cataList = res.data.data;
                    this.$message.success('获取数据成功');
                }).catch(() => {
                    this.$message.error('获取数据失败')
                })
            },
            showBox() {
                const _this = this;
                $(`.boxs`).removeClass('active')
                $(`.boxs[data-index=${_this.step}]`).addClass('active')
            },
            closeMany(j,item1){
                console.log(item1);
                item1.attr_vals.splice(j,1);
                console.log(item1);
            },
            nextStep1(addForm) {
                console.log(this.$refs);
                this.$refs[addForm].validate((valid) => {
                    if (valid) {
                        this.step = 1;
                        this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'many'}}).then((res)=>{
                            this.manyTableData=res.data.data;
                            this.manyTableData.forEach((item)=>{
                                item.attr_vals=item.attr_vals.split(',')
                            })
                            this.showBox()
                        }).catch(()=>{
                            this.$message.error('获取动态参数失败！')
                        })

                    } else {
                        this.$message.error('请补全基本信息！')
                        return false;
                    }
                });

            },
            nextStep2() {
                this.step = 2;
                this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'only'}}).then((res)=>{
                    this.onlyTableData=res.data.data;
                    console.log(this.onlyTableData);
                    this.showBox()
                }).catch(()=>{
                    this.$message.error('获取动态参数失败！')
                })
            },
            nextStep3() {
                this.step = 3;
                this.showBox()
            },
            nextStep4() {
                this.step = 4;
                this.showBox()
            },
            nextStep5() {
                this.step = 5;
                const _this=this;
                let addForm = _.cloneDeep(this.addForm);
                addForm.goods_cat=addForm.goods_cat.join(',');
                this.manyTableData.forEach(item=>{
                    let newInfo={attr_id:item.attr_id,attr_value:item.attr_vals.join(' ')};
                    this.addForm.attrs.push(newInfo)
                })
                this.onlyTableData.forEach(item=>{
                    let newInfo={attr_id:item.attr_id,attr_value:item.attr_vals};
                    this.addForm.attrs.push(newInfo)
                })
                addForm.attrs=this.addForm.attrs;
                this.$http.post('goods',addForm).then(()=>{
                        _this.step=6;
                        this.$router.push('/goods')
                }).catch((res)=>{
                    console.log(res);
                    this.$message.error('获取动态参数失败！')
                })
                console.log(addForm);
            },
            preStep() {
                this.step--;
                this.showBox()
            },
            handlePreview(file){
                this.previewPath=file.response.data.url;
                this.previewbox=true;
            },
            handleRemove(file){
              let filePath=file.response.data.tmp_path;
              const i=this.addForm.pics.findIndex(x=>x.pic===filePath);
                this.addForm.pics.splice(i,1);
                console.log(this.addForm);
            },
            handleSuccess(response){
            //    1.拼接得到一个图片信息对象
                let picInfo={pic:response.data.tmp_path};
            //    2.讲图片信息对象push到pic中
                this.addForm.pics.push(picInfo);
                console.log(this.addForm);
            }

        },
        computed:{
            stepActive(){
                return this.step;
            },
            cateId(){
                if(this.addForm.goods_cat.length===3){
                    return this.addForm.goods_cat[2]
                }
                return null
            }
        }
    }
</script>

<style>
  .box-card1{
    min-height:600px;
  }
  .el-alert {
    margin: 15px 0 20px;
  }

  .el-steps {
    margin-bottom: 40px;
  }

  .next-step, .pre-step {
    width: 200px;
  }

  #fillInfo {
    position: relative;
    width: 800px;
    margin: 0 auto;
  }

  #fillInfo .boxs {
    display: none;
  }

  #fillInfo .active {
    display: block;
  }
  .manyNum .el-form-item .el-form-item__label{
    float :none;
  }
  .manyNum .el-tag{
    margin:0 10px;
  }
  .imgs{
    width:100%;
  }
</style>