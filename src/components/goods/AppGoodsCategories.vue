<template>
<!-- 卡片 -->
<el-card class="box-card">
    <!-- 面包屑导航 -->
    <cus-breadcrumb level1="商品管理" level2="商品分类"></cus-breadcrumb>
    <!-- 添加按钮 -->
     <el-button type="success" @click="handleShowAdd()" class="addBtn">添加分类</el-button>
    <!-- 数据表格 -->
    <el-table :data="categories" border height="450">
        <!-- <el-table-column prop="cat_name" label="分类名称">
        </el-table-column> -->
        <!-- 树状列表 -->
        <el-tree-grid
            prop="cat_name" 
            label="分类名称"
            treeKey="cat_id"
            parentKey="cat_pid"
            levelKey="cat_level"
            childKey="children"
            folderIcon=""
            :indentSize="30"
        ></el-tree-grid>
        <el-table-column label="级别">
            <template slot-scope="scope">
                <span v-if="scope.row.cat_level === 0">一级</span>
                <span v-if="scope.row.cat_level === 1">二级</span>
                <span v-if="scope.row.cat_level === 2">三级</span>
            </template>
        </el-table-column>
        <el-table-column label="是否有效">
            <template slot-scope="scope">
                {{scope.row.cat_deleted?'无效':'有效'}}
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button icon="el-icon-edit" type="primary" circle plain size="mini" @click="handleShowEdit(scope.row)"></el-button>
                <el-button icon="el-icon-delete" type="danger" circle plain size="mini" @click="handleDelete(scope.row.cat_id)"></el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 
        分页插件
        size-change pageSize 改变时会触发
        current-change  currentPage 改变时会触发
        current-page 页码 默认1
        page-sizes 页面支持分页条数
        page-size 每页显示条目个数
        total 总条数
     -->
    <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[10, 15, 20,25]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 添加对话框 -->
    <el-dialog title="添加商品分类" :visible.sync="dialogFormVisibleAdd" width="40%" @close="handleEditClose()">
        <el-form :model="formdata" >
            <el-form-item label="分类名称" label-width="100px" >
                <el-input v-model="formdata.cat_name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="分类级别" label-width="100px">
                 <el-cascader v-model="selectOptions" :options="caseCates" clearable :props="defaultProps" ></el-cascader> 如果不选，即根级
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
            <el-button type="primary" @click="handleAdd">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 编辑用户对话框-->
    <el-dialog title="修改商品分类" :visible.sync="dialogFormVisibleEdit" width="40%" @close="handleEditClose()">
        <el-form :model="formdata" >
            <el-form-item label="分类名称" label-width="100px" >
                <el-input v-model="formdata.cat_name" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
            <el-button type="primary" @click="handleEdit()">确 定</el-button>
        </div>
    </el-dialog> 
 
</el-card>
</template>

<script>
// 引入tree-grid
var ElTreeGrid = require('element-tree-grid')

export default {
    data() {
        return {
            categories: [], // 分类列表
            caseCates:[] ,// 分类级联
            pagenum: 1, // 页码
            total: 0, // 总条数
            pagesize: 10, // 每页显示条数
            selectOptions: [],
            dialogFormVisibleAdd: false, // 控制对话框开关 
            dialogFormVisibleEdit: false, // 控制修改对话框开关 
            formdata: {}, // 表单对象 
            defaultProps: { // 级联选择器默认显示数据
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                checkStrictly: true
            }
        }
    },
    components: {
        ElTreeGrid
    },
    created() {
        // 加载数据
        this.loadData()
    },
    methods: {
        // 打开添加对话框
        handleShowAdd(){
            this.$http.get(`categories?type=2`)
                .then(res => {
                    let {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.dialogFormVisibleAdd=true
                        this.caseCates = data
                    } else {
                        this.$message.error(msg)
                    }
                }).catch(res => {})
        },
        // 提交编辑
        handleEdit(){
            // 发送请求
            this.$http.put(`categories/${this.formdata.cat_id}`, this.formdata)
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
                        // 关闭对话框
                        this.dialogFormVisibleEdit = false
                        this.loadData()
                    } else {
                        this.$message.error(msg)
                    }
                }).catch(res => {})
        },
        // 打开修改对话框
        handleShowEdit(category){
            // 打开对话框
            this.dialogFormVisibleEdit = true
            // 根据Id查询用户信息 绑定表单
            this.formdata = {
                cat_id : category.cat_id,
                cat_name : category.cat_name
            }
        },
        // 添加分类
        handleAdd(){
            if(this.selectOptions.length===0){
                // 根级
                this.formdata.cat_pid = 0
                this.formdata.cat_level = 0
            }else if(this.selectOptions.length===1){
                // 第二级
                this.formdata.cat_pid = this.selectOptions[0]
                this.formdata.cat_level = 1
            }else if(this.selectOptions.length===2){
                // 第三级
                this.formdata.cat_pid = this.selectOptions[1]
                this.formdata.cat_level = 2
            }
            // 发送请求
            this.$http.post(`categories`, this.formdata)
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
                        // 关闭对话框
                        this.dialogFormVisibleAdd = false
                        this.loadData()
                    } else {
                        this.$message.error(msg)
                    }
            }).catch(res => {})
        },
        // 关闭对话框
        handleEditClose() {
            // 清空数据
            this.formdata = {}
        },
        // 删除分类
        handleDelete(id) {
            this.$confirm('此操作将永久删除该分离, 是否继续?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.delete(`categories/${id}`)
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
                            this.loadData()
                        } else {
                            this.$message.error(msg)
                        }
                    }).catch(res => {})
            }).catch(() => {})
        },
        // 页面条数发生变化
        handleSizeChange(val) {
            this.pagesize = val
            // 刷新数据
            this.loadData()
        },
        // 页码发生变化时
        handleCurrentChange(val) {
            this.pagenum = val
            // 刷新数据
            this.loadData()
        },
        // 加载分类数据
        loadData() {
            // 发送请求
            this.$http.get(`categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
                .then(res => {
                    let {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.categories = data.result
                        this.pagenum = data.pagenum+1
                        this.total = data.total
                    } else {
                        this.$message.error(msg)
                    }
                }).catch(res => {})
        }
    },
}
</script>

<style scoped>
.addBtn{
    margin: 20px 0;
}
.pagination {
    width: 100%;
    margin: 20px 0;
    text-align: center;
}
</style>
