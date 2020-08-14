<template>
  <div>
    <!--导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert
              title="添加商品信息"
              type="info"
              show-icon
              center
              :closable="false">
      </el-alert>
      <el-steps :active="1" align-center>
        <el-step v-for="(item,i) in steps" :title="item.title" :key="i"></el-step>
      </el-steps>
      <div id="fillInfo">
        <div class="active boxs" :data-index="0">
          <el-form :data="addFrom" label-width="100px" style="width:800px">
            <el-form-item prop="goods_name" label="商品名称">
              <el-input v-model="addFrom.goods_name"></el-input>
            </el-form-item>
            <el-form-item prop="goods_price" label="商品价格">
              <el-input v-model="addFrom.goods_price"></el-input>
            </el-form-item>
            <el-form-item prop="goods_number" label="商品数量">
              <el-input v-model="addFrom.goods_number"></el-input>
            </el-form-item>
            <el-form-item prop="goods_weight" label="商品重量">
              <el-input v-model="addFrom.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                      expandTrigger="hover"
                      v-model="selectedKeys"
                      :options="cataList"
                      :props="cataProps"
                      clearable>
              </el-cascader>
            </el-form-item>
            <el-form-item style="text-align: center">
              <el-button type="primary" @click="nextStep1" class="next-step">下一步</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="boxs" :data-index="1">商品参数
          <el-form>
            <el-form-item style="text-align: center">
              <el-button type="primary" @click="preStep" class="pre-step">上一步</el-button>
              <el-button type="primary" @click="nextStep2" class="next-step">下一步</el-button>
            </el-form-item>
          </el-form>

        </div>
        <div class="boxs" :data-index="2">商品属性
          <el-form>
            <el-form-item style="text-align: center">
              <el-button type="primary" @click="preStep" class="pre-step">上一步</el-button>
              <el-button type="primary" @click="nextStep3" class="next-step">下一步</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="boxs" :data-index="3">商品图片
          <el-form>
            <el-form-item style="text-align: center">
              <el-button type="primary" @click="preStep" class="pre-step">上一步</el-button>
              <el-button type="primary" @click="nextStep4" class="next-step">下一步</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="boxs" :data-index="4">商品内容
          <el-form>
            <el-form-item style="text-align: center">
              <el-button type="primary" @click="preStep" class="pre-step">上一步</el-button>
              <el-button type="primary" @click="nextStep5" class="next-step">下一步</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
    import $ from 'jquery';

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
                addFrom: {},
                selectedKeys: [],
                cataList: [],
                cataProps: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                step: 0,
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
            nextStep1() {
                this.step = 1;
                this.showBox()
            },
            nextStep2() {
                this.step = 2;
                this.showBox()
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
                this.showBox()
            },
            preStep() {
                this.step--
                this.showBox()
            }
        },

    }
</script>

<style scoped>
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
</style>