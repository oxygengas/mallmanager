<template>
<!-- 卡片 -->
<el-card class="box-card">
    <!-- 面包屑导航 -->
    <cus-breadcrumb level1="商品管理" level2="商品列表"></cus-breadcrumb>
    <!-- 搜索框 按钮 -->
    <el-row class="search">
        <el-col :span="7">
            <el-input placeholder="请输入内容" class="input-with-select" v-model="query">
                <el-button slot="append" icon="el-icon-search" @click="loadData"></el-button>
            </el-input>
        </el-col>
        <el-col :span="6" style="margin-left:10px">
            <el-button type="success" plain @click="$router.push({name:'goodsadd'})">添加商品</el-button>
        </el-col>
    </el-row>
    <!-- 数据表格 -->
    <el-table :data="goods" border style="width: 100%" height="400">
        <el-table-column label="#" type="index" width="50">
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）" width="120">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100">
        </el-table-column>
        <el-table-column label="创建日期" width="160">
            <!-- 日期处理 -->
            <template slot-scope="scope">
                {{ scope.row.add_time | moment('YYYY-MM-DD HH:mm:ss')}}
            </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
            <template slot-scope="scope">
                <el-button icon="el-icon-edit" type="primary" circle plain size="mini" @click="handleShowEdit(scope.row.goods_id)"></el-button>
                <el-button icon="el-icon-delete" type="danger" circle plain size="mini" @click="handleDelete(scope.row.goods_id)"></el-button>
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
    <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[5, 10, 15, 20,25]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 添加用户对话框 
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible" width="40%" @close="handleEditClose('addForm')">
        <el-form :model="formdata" :rules="rules" ref="addForm" status-icon>
            <el-form-item label="用户名" label-width="100px" prop="username">
                <el-input v-model="formdata.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" label-width="100px" prop="password">
                <el-input v-model="formdata.password" autocomplete="off" show-password></el-input>
            </el-form-item>
            <el-form-item label="确认密码" label-width="100px" prop="repwd">
                <el-input v-model="formdata.repwd" autocomplete="off" show-password></el-input>
            </el-form-item>
            <el-form-item label="邮箱" label-width="100px" prop="email">
                <el-input v-model="formdata.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号" label-width="100px" prop="mobile">
                <el-input v-model="formdata.mobile" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleAdd('addForm')">确 定</el-button>
        </div>
    </el-dialog>-->

    <!-- 编辑用户对话框 
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit" width="40%" @close="handleEditClose('editForm')">
        <el-form :model="formdata" :rules="rules" ref="editForm" status-icon>
            <el-form-item label="用户名" label-width="100px">
                <el-input v-model="formdata.username" autocomplete="off" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" label-width="100px" prop="email">
                <el-input v-model="formdata.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号" label-width="100px" prop="mobile">
                <el-input v-model="formdata.mobile" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
            <el-button type="primary" @click="handleEdit('editForm')">确 定</el-button>
        </div>
    </el-dialog>-->

</el-card>
</template>

<script>

export default {
    data() {
        return {
            goods: [], // 商品列表
            query: '', // 搜索条件
            pagenum: 1, // 页码
            total: 0, // 总条数
            pagesize: 5, // 每页显示条数
        }
    },
    created() {
        // 加载数据
        this.loadData()
    },
    methods: {
        // 跳转修改页面
        handleShowEdit(id){
            this.$router.push({name:'goodsedit',params:{id}})
        },
        // 删除商品
        handleDelete(id) {
            this.$confirm('此操作将永久删除该商品, 是否继续?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 发送请求delete: goods/:id
                this.$http.delete(`goods/${id}`)
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
        // 加载用户数据
        loadData() {
            // 发送请求
            this.$http.get(`goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
                .then(res => {
                    let {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.goods = data.goods
                        this.pagenum = data.pagenum
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
.search {
    margin: 20px 0;
}

.pagination {
    width: 100%;
    margin: 20px 0;
    text-align: center;
}
</style>
