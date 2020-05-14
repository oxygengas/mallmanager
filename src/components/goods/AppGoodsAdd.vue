<template>
<!-- 卡片 -->
<el-card class="box-card">
    <!-- 面包屑导航 -->
    <cus-breadcrumb level1="商品管理" level2="商品列表"></cus-breadcrumb>
    <!-- alert 提示 -->
    <el-alert title="添加商品" type="success" center show-icon class="mt"></el-alert>
    <!-- 步骤条 parseInt(active)  '1'+1 = 11 '1'*1 = 1 -->
    <el-steps :active="active*1" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
    </el-steps>
    <el-form :model="formdata" label-position="top">
        <!-- tabs标签页 -->
        <el-tabs tab-position="left" v-model="active" class="mt" :before-leave="handleCheckCate" @tab-click="handleTabClick">
            <el-tab-pane label="基本信息" name="1">
                <!-- 基本信息 -->
                <el-form-item label="商品名称">
                    <el-input v-model="formdata.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格">
                    <el-input v-model="formdata.goods_price"></el-input>
                </el-form-item>
                <el-form-item label="商品重量">
                    <el-input v-model="formdata.goods_weight"></el-input>
                </el-form-item>
                <el-form-item label="商品数量">
                    <el-input v-model="formdata.goods_number"></el-input>
                </el-form-item>
                <el-form-item label="商品分类">
                    <!-- 级联选择器 需要转换成字符串 ,  -->
                    <el-cascader v-model="selectOptions" :options="categorys" clearable :props="defaultProps"></el-cascader> {{selectOptions}}
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品参数" name="2">
                <!-- 商品参数-遍历动态参数 -->
                <el-form-item :label="item.attr_name" v-for="(item, index) in categoryDyParams" :key="index">
                    <!-- 带边框的多选框 -->
                    <el-checkbox v-model="item.attr_vals" :label="item1" border v-for="(item1, index) in item.attr_vals" :key="index"></el-checkbox>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性" name="3">
                <!-- 商品参数-静态参数 -->
                <el-form-item :label="item.attr_name" v-for="(item, index) in categoryStaticParams" :key="index">
                    <el-input v-model="item.attr_vals"></el-input>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name="4">
                <!-- 商品图片 -->
                <p>请选择上传的图片:</p>
                <el-upload action="http://localhost:8888/api/private/v1/upload" list-type="picture-card" :headers="headers" :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess" :on-remove="handleRemove">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="5">
                <el-form-item label="商品描述">
                    <!-- 富文本编辑器 -->
                    <quill-editor v-model="formdata.goods_introduce" />
                </el-form-item>
                <el-button type="primary" @click="handleAddGoods">添加商品</el-button>
            </el-tab-pane>
        </el-tabs>
    </el-form>
</el-card>
</template>

<script>
// 引入富文本编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import {
    quillEditor
} from 'vue-quill-editor'
export default {
    data() {
        return {
            active: '1', // 控制步骤条与标签页
            categorys: [], // 分类参数
            formdata: { // 表单
                goods_cat: [],
                pics: []
            },
            selectOptions:[1,3,6],
            categoryDyParams: [], // 动态参数
            categoryStaticParams: [], // 静态参数
            defaultProps: { // 级联选择器默认显示数据
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
            },
            headers: { // 图片上传请求头部 token
                'Authorization': localStorage.getItem('token')
            }
        }
    },
    components: {
        quillEditor
    },
    created() {
        this.loadDataCategory()
    },
    methods: {
        // 添加商品
        handleAddGoods(){
            // 1.处理分类参数 必须以 ，分割
            this.formdata.goods_cat = this.selectOptions.join(',')

            // 2.商品的参数（数组）= 动态 + 静态 {"attr_id":15,"attr_value":"ddd"}
            var arr1 = this.categoryDyParams.map(item=>{
                return {"attr_id":item.attr_id,"attr_value":item.attr_vals===''?'':item.attr_vals.join(',')}
            })
            var arr2 = this.categoryStaticParams.map(item=>{
                return {"attr_id":item.attr_id,"attr_value":item.attr_vals}
            })
            // 合并数组
            this.formdata.attrs = [...arr1,...arr2]
            // 发送请求，添加商品
            this.$http.post(`goods`,this.formdata)
                .then(res => {
                    let {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 201) {
                       this.$message.success(msg)
                       // 跳转商品列表
                       this.$router.push({name:'goods'})
                    } else {
                        this.$message.error(msg)
                    }
                }).catch(res => {})
        },
        // 控制上传图片的格式
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error('上传图片只能是 JPG或PNG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        // 图片上传成功
        handleAvatarSuccess(res, file) {
            let {
                data,
                meta: {
                    msg,
                    status
                }
            } = res
            if (status === 200) {
                this.$message.success(msg)
                // 把图片添加到表单对象中
                this.formdata.pics.push({
                    pic: data.tmp_path
                })
            } else {
                this.$message.error(msg)
            }
        },
        // 图片移除
        handleRemove(file, fileList) {
            // 将表单中的pic图片移除
            this.formdata.pics.forEach((item, index) => {
                if (item.pic === file.response.data.tmp_path) {
                    // 删除数组的元素 splice(删除元素的位置,长度)
                    this.formdata.pics.splice(index, 1)
                }
            })
        },
        //  标签被选中
        async handleTabClick(tab) {
            // 商品参数
            if (tab.name === '2') {
                await this.loadCategoryParams('many')
                // 解析动态参数 ，数组
                this.categoryDyParams.forEach(item => {
                    item.attr_vals = item.attr_vals !== '' ? item.attr_vals.split(',') : ''
                })
            } else if (tab.name === '3') {
                await this.loadCategoryParams('only')
            }
        },
        // 验证是否选择分类
        handleCheckCate() {
            if (this.selectOptions.length !== 3) {
                this.$message.warning('请先选择商品分类!')
                return false // 阻止提交
            }
        },
        // 获取商品分类参数
        async loadCategoryParams(type) {
            // 具体商品分类的参数
            let cate_id = this.selectOptions[2]
            await this.$http.get(`categories/${cate_id}/attributes?sel=${type}`)
                .then(res => {
                    let {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        if (type === 'only') {
                            // 静态参数
                            this.categoryStaticParams = data
                        } else {
                            // 动态参数
                            this.categoryDyParams = data
                        }
                    } else {
                        this.$message.error(msg)
                    }
                }).catch(res => {})
        },
        // 商品分类
        loadDataCategory() {
            this.$http.get(`categories?type=3`)
                .then(res => {
                    let {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.categorys = data
                    } else {
                        this.$message.error(msg)
                    }

                }).catch(res => {})

        }
    },
}
</script>

<style scoped>
.mt {
    margin: 20px 0;
}

.quill-editor {
    height: 350px;
    margin-bottom: 60px;
}
</style>
