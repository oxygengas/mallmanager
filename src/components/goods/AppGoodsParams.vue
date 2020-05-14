<template>
<!-- 卡片 -->
<el-card class="box-card">
    <!-- 面包屑导航 -->
    <cus-breadcrumb level1="商品管理" level2="分类参数"></cus-breadcrumb>
    <!-- 提示 -->
    <el-alert title="只允许为三级分类设置参数" type="error" class="mt"></el-alert>
    <!-- 商品分类下拉组件 -->
    <el-row class="mt">
        <el-col :span="24">
            商品分类:
            <el-cascader v-model="selectOptions" :options="categorys" clearable :props="defaultProps" :show-all-levels="false" @change="handleChangeCategory"></el-cascader> {{selectOptions}}
        </el-col>
    </el-row>
    <!-- tab标签页 -->
    <el-tabs value="first" type="card" class="mt">
        <el-tab-pane label="动态参数" name="first">
            <!-- 动态参数 -->
            <el-button type="danger" @click="dialogFormVisibleDy=true">设置动态参数</el-button>
            <!-- 动态参数表格 -->
            <el-table :data="categoryDyParams" style="width: 100%" height="400">
                <!-- 展开行 参数属性 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-tag :key="tag" v-for="(tag,index) in scope.row.attr_vals" closable :disable-transitions="false" @close="handleClose(index,scope.row)">
                            {{tag}}
                        </el-tag>
                        <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="#" type="index" width="80">
                </el-table-column>
                <el-table-column prop="attr_name" label="属性名称">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button icon="el-icon-edit" type="primary" circle plain size="mini" @click="handleShowEdit(scope.row.attr_id,'many')"></el-button>
                        <el-button icon="el-icon-delete" type="danger" circle plain size="mini" @click="handleCateDelete(scope.row.attr_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="second">
            <!-- 静态参数 -->
            <el-button type="danger" @click="dialogFormVisibleStatic=true">设置静态参数</el-button>
            <!-- 静态参数表格 -->
            <el-table :data="categoryStaticParams" style="width: 100%" height="400">
                <el-table-column label="#" type="index" width="80">
                </el-table-column>
                <el-table-column prop="attr_name" label="属性名称">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button icon="el-icon-edit" type="primary" circle plain size="mini" @click="handleShowEdit(scope.row.attr_id,'only')"></el-button>
                        <el-button icon="el-icon-delete" type="danger" circle plain size="mini" @click="handleCateDelete(scope.row.attr_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>



        <!-- 添加动态参数对话框 -->
        <el-dialog :title="(formdata.attr_id == null?'添加':'修改')+'动态参数'" :visible.sync="dialogFormVisibleDy" width="45%" @closed="handleDialogClose()">
        <el-form :model="formdata" >
            <el-form-item label="参数名称" label-width="100px">
                <el-input v-model="formdata.attr_name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="参数属性" label-width="100px">
                <el-row>
                    <el-col :span="18"><el-input v-model="formdata.attr_vals" autocomplete="off"></el-input> </el-col>
                    <el-col :span="6"> 参数以","隔开</el-col>
                </el-row>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleDy = false">取 消</el-button>
            <el-button type="primary" @click="handleEditCate('many')">确 定</el-button>
        </div>
    </el-dialog>


     <!-- 添加静态参数对话框 -->
        <el-dialog :title="(formdata.attr_id == null?'添加':'修改')+'静态参数'" :visible.sync="dialogFormVisibleStatic" width="45%" @closed="handleDialogClose()">
        <el-form :model="formdata" >
            <el-form-item label="参数名称" label-width="100px">
                <el-input v-model="formdata.attr_name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="参数属性" label-width="100px">
                <el-input v-model="formdata.attr_vals" autocomplete="off"></el-input> 
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleStatic = false">取 消</el-button>
            <el-button type="primary" @click="handleEditCate('only')">确 定</el-button>
        </div>
    </el-dialog>
    </el-tabs>
</el-card>
</template>

<script>
export default {
    data() {
        return {
            categoryDyParams: [], // 动态参数
            categoryStaticParams: [], // 静态参数
            selectOptions: [1, 3, 6],
            categorys: [],
            inputVisible: false,
            inputValue: '',
            formdata: {}, // 表单数据
            dialogFormVisibleDy: false, // 动态参数编辑对话框
            dialogFormVisibleStatic: false, // 静态参数编辑对话框
            defaultProps: { // 级联选择器默认显示数据
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
            },

        }
    },
    created() {
        this.loadDataCategory()
        this.handleChangeCategory()
    },
    methods: {
        // 删除动态参数
        handleCateDelete(id){
            this.$confirm('此操作将永久删除该参数, 是否继续?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.delete(`categories/${this.selectOptions[2]}/attributes/${id}`)
                .then(res => {
                    let {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.$message.success(msg)
                         this.handleChangeCategory()
                    } else {
                        this.$message.error(msg)
                    }
                }).catch(res => {})
            }).catch(() => {})
        },
        // 打开修改对话框
        handleShowEdit(id,type){
            // 根据ID查询参数
            this.$http.get(`categories/${this.selectOptions[2]}/attributes/${id}`)
                .then(res => {
                    let {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.formdata = data
                        if(type === 'many')
                            this.dialogFormVisibleDy = true
                        else
                            this.dialogFormVisibleStatic = true
                    } else {
                        this.$message.error(msg)
                    }
                }).catch(res => {})
        },
        // 编辑分类参数
        handleEditCate(type){
            // 发送请求
            let request = null
            if(this.formdata.attr_id == null){
               // 添加
               // 设置参数类型
               this.formdata.attr_sel = type
               request = this.$http.post(`categories/${this.selectOptions[2]}/attributes`, this.formdata)
            }else{
                // 修改
                request = this.$http.put(`categories/${this.selectOptions[2]}/attributes/${this.formdata.attr_id}`, this.formdata)
            }
            request.then(res => {
                    let {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 201 || status === 200) {
                        this.$message.success(msg)
                        if(type === 'many'){
                            this.dialogFormVisibleDy = false
                        }else{
                            this.dialogFormVisibleStatic = false
                        }
                        this.handleChangeCategory()
                    } else {
                        this.$message.error(msg)
                    }
                }).catch(res => {})
        },
        // 关闭对话框
        handleDialogClose(){
            this.formdata = {}
        },
        // 关闭标签
        handleClose(index, dyParams) {
            // this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            // 删除指定标签
            dyParams.attr_vals.splice(index, 1)
            // 发送请求
            this.handleDeleteDyParams(dyParams)
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        // 添加标签
        handleInputConfirm(dyParams) {
            let inputValue = this.inputValue;
            if (inputValue) {
                // 当前参数属性 添加 inputvalue
                dyParams.attr_vals.push(inputValue)
                // 发送请求
                this.handleDeleteDyParams(dyParams)
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
        // 删除动态参数属性
        async handleDeleteDyParams(dyParams) {
            let formdata = {
                ...dyParams
            }
            formdata.attr_vals = formdata.attr_vals.lenght === 0 ? '' : formdata.attr_vals.join(',')
            await this.$http.put(`categories/${this.selectOptions[2]}/attributes/${dyParams.attr_id}`, formdata)
                .then(res => {
                    let {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.$message.success(msg)
                    } else {
                        this.$message.error(msg)
                    }
                }).catch(res => {})
        },
        // 当改变分类参数时，加载动态和静态参数
        async handleChangeCategory() {
            await this.loadCategoryParams('many')
            // 处理动态属性 string->array
            this.categoryDyParams.map(item => {
                item.attr_vals = item.attr_vals === '' ? [] : item.attr_vals.split(',')
            })
            await this.loadCategoryParams('only')
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
        },
        // 获取商品分类参数
        async loadCategoryParams(type) {
            // 具体商品分类的参数
            let cate_id = this.selectOptions[2]
            if (cate_id == null) {
                this.categoryDyParams = []
                this.categoryStaticParams = []
                return
            }
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
        }
    },
}
</script>

<style scoped>
.mt {
    margin-top: 20px;
}

.el-tag+.el-tag {
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
