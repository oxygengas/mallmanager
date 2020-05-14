<template>
<!-- 卡片 -->
<el-card class="box-card">
    <!-- 面包屑导航 -->
    <cus-breadcrumb level1="用户管理" level2="用户列表"></cus-breadcrumb>
    <!-- 搜索框 按钮 -->
    <el-row class="search">
        <el-col :span="7">
            <el-input placeholder="请输入内容" class="input-with-select" v-model="query">
                <el-button slot="append" icon="el-icon-search" @click="loadData"></el-button>
            </el-input>
        </el-col>
        <el-col :span="6" style="margin-left:10px">
            <el-button type="success" plain @click="dialogFormVisible=true">添加用户</el-button>
        </el-col>
    </el-row>
    <!-- 数据表格 -->
    <el-table :data="users" border style="width: 100%">
        <el-table-column label="#" type="index" width="50">
        </el-table-column>
        <el-table-column prop="username" label="姓名">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column label="创建日期">
            <!-- 日期处理 -->
            <template slot-scope="scope">
                {{ scope.row.create_time | moment('YYYY-MM-DD HH:mm:ss')}}
            </template>
        </el-table-column>
        <el-table-column label="用户状态">
            <!-- 处理状态 -->
            <template slot-scope="scope">
                <!-- 开关 -->
                <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="handleStateChange(scope.row.id,scope.row.mg_state)">
                </el-switch>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button icon="el-icon-edit" type="primary" circle plain size="mini" @click="handleShowEdit(scope.row.id)"></el-button>
                <el-button icon="el-icon-delete" type="danger" circle plain size="mini" @click="handleDelete(scope.row.id)"></el-button>
                <el-button icon="el-icon-check" type="success" circle plain size="mini" @click="handleShowRole(scope.row.id)"></el-button>
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
    <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[2, 4, 6, 8,10]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 添加用户对话框 -->
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
    </el-dialog>

    <!-- 编辑用户对话框 -->
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
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole" width="40%" @close="formdata = {}"> <!-- 窗口关闭必须清除数据，否则会照成数据粘连-->
        <el-form :model="formdata">
            <el-form-item label="用户名" label-width="100px">
                {{formdata.username}}
            </el-form-item>
            <el-form-item label="角色" label-width="100px">
                 <el-select v-model="formdata.rid" placeholder="请选择">
                    <el-option
                    v-for="item in roles"
                    :key="item.id"
                    :label="item.roleName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
            <el-button type="primary" @click="handleRole()">确 定</el-button>
        </div>
    </el-dialog>

</el-card>
</template>

<script>

export default {
    data() {
        // 自定义验证规则
        var validateRepwd = (rule, value, callback) => {
            if (value !== this.formdata.password) {
                callback(new Error('两次输入密码不一致'))
            } else {
                callback()
            }
        }
        var validateMobile = (rule, value, callback) => {
            let reg = /^1(3|4|5|7|8)\d{9}$/
            if (value === undefined || value === '') {
                callback(new Error('请输入手机号'));
            } else if (!reg.test(value)) {
                callback(new Error('手机号格式不正确'));
            } else {
                callback();
            }
        }
        var validateEmail = (rule, value, callback) => {
            let reg = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
            if (value === undefined || value === '') {
                callback(new Error('请输入邮箱'));
            } else if (!reg.test(value)) {
                callback(new Error('邮箱格式不正确'));
            } else {
                callback();
            }
        }
        return {
            users: [], // 用户列表
            query: '', // 搜索条件
            pagenum: 1, // 页码
            total: 0, // 总条数
            pagesize: 2, // 每页显示条数
            dialogFormVisible: false, // 控制对话框开关 
            dialogFormVisibleEdit: false, // 控制修改对话框开关 
            dialogFormVisibleRole: false, // 控制角色对话框开关 
            formdata: {}, // 表单对象 
            roles: [], // 角色列表 
            // 验证规则
            rules: {
                username: [{
                        required: true,
                        message: '请输入用户名称',
                        trigger: 'blur'
                    },
                    {
                        min: 2,
                        max: 10,
                        message: '长度在 2 到 10 个字符',
                        trigger: 'blur'
                    }
                ],
                password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }, {
                    min: 6,
                    max: 16,
                    message: '长度在 6 到 16 个字符',
                    trigger: 'blur'
                }],
                repwd: [{
                    required: true,
                    validator: validateRepwd,
                    trigger: 'blur'
                }],
                mobile: [{
                    required: true,
                    validator: validateMobile,
                    trigger: 'blur'
                }],
                email: [{
                    required: true,
                    validator: validateEmail,
                    trigger: 'blur'
                }],
            },
        }
    },
    created() {
        // 加载数据
        this.loadData()
    },
    methods: {
        // 分配角色
        handleRole(){
            this.$http.put(`users/${this.formdata.id}/role`,this.formdata)
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
                        this.dialogFormVisibleRole = false
                    } else {
                        this.$message.error(msg)
                    }
                }).catch(res => {})
        },
        // 打开角色分配对话框
        handleShowRole(id){
            this.dialogFormVisibleRole = true
             // 根据Id查询用户信息 绑定表单
            this.$http.get(`users/${id}`)
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
                    } else {
                        this.$message.error(msg)
                    }
                }).catch(res => {})
            // 获取角色列表
            this.$http.get(`roles`)
                .then(res => {
                    let {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.roles = data
                    } else {
                        this.$message.error(msg)
                    }
                }).catch(res => {})
        },
        // 提交编辑
        handleEdit(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 发送请求
                    this.$http.put(`users/${this.formdata.id}`, this.formdata)
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
                } else {
                    return false;
                }
            })
        },
        // 打开修改用户对话框
        handleShowEdit(id){
            // 打开对话框
            this.dialogFormVisibleEdit = true
            // 根据Id查询用户信息 绑定表单
            this.$http.get(`users/${id}`)
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
                    } else {
                        this.$message.error(msg)
                    }
                }).catch(res => {})
        },
        // 添加用户
        handleAdd(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 发送请求
                    this.$http.post(`users`, this.formdata)
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
                                this.dialogFormVisible = false
                                this.loadData()
                            } else {
                                this.$message.error(msg)
                            }
                        }).catch(res => {})
                } else {
                    return false;
                }
            })
        },
        // 关闭对话框
        handleEditClose(formName) {
            // 清空数据
            this.formdata = {}
            // 重置表单
            this.$refs[formName].resetFields()
        },
        // 删除用户
        handleDelete(id) {
            this.$confirm('此操作将永久删除该用户, 是否继续?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 发送请求delete: users/:id
                this.$http.delete(`users/${id}`)
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
        // 修改用户状态
        handleStateChange(id, state) {
            // 发送请求put: users/:uId/state/:type
            this.$http.put(`users/${id}/state/${state}`)
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
            this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
                .then(res => {
                    let {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.users = data.users
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
