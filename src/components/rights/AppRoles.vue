<template>
<!-- 卡片 -->
<el-card class="box-card">
    <!-- 面包屑导航 -->
    <cus-breadcrumb level1="权限管理" level2="角色列表"></cus-breadcrumb>
    <!-- 添加角色 -->
    <el-button plain class="mybtn" @click="dialogFormVisible=true">添加角色</el-button>
    <!-- 数据表格 -->
    <el-table :data="roles">
        <!-- 展开行 -->
        <el-table-column type="expand">
            <template slot-scope="scope">
                <p v-if="scope.row.children.length === 0" class="nodata">
                    请分配权限
                </p>
                <!-- 行级遍历 第一级 -->
                <el-row v-for="(item1, index) in scope.row.children" :key="index">
                    <el-col :span="4">
                        <el-tag closable class="tags" @close="handleRightsClose(scope.row,item1.id)">
                            {{item1.authName}}
                        </el-tag>
                        <i class="el-icon-arrow-right"></i>
                    </el-col>
                    <el-col :span="20">
                        <!-- 第二级 -->
                        <el-row v-for="(item2, index) in item1.children" :key="index">
                            <el-col :span="4">
                                <el-tag closable type="success" class="tags" @close="handleRightsClose(scope.row,item2.id)">
                                    {{item2.authName}}
                                </el-tag>
                                <i class="el-icon-arrow-right"></i>
                            </el-col>
                            <el-col :span="20">
                                <!-- 第三级 -->
                                <el-tag closable type="warning" v-for="(item3, index) in item2.children" :key="index" class="tags" @close="handleRightsClose(scope.row,item3.id)">
                                    {{item3.authName}}
                                </el-tag>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </template>
        </el-table-column>
        <el-table-column label="#" type="index" width="50">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述">
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button icon="el-icon-edit" type="primary" circle plain size="mini" @click="handleShowEdit(scope.row)"></el-button>
                <el-button icon="el-icon-delete" type="danger" circle plain size="mini" @click="handleDelete(scope.row.id)"></el-button>
                <el-button icon="el-icon-check" type="success" circle plain size="mini" @click="handleShowRights(scope.row)"></el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 编辑角色对话框 -->
    <el-dialog :title="(!formdata.id?'添加':'修改')+'用户'" :visible.sync="dialogFormVisible" width="40%" @closed="handleEditClose('editForm')">
        <el-form :model="formdata" :rules="rules" ref="editForm" status-icon>
            <el-form-item label="角色名称" label-width="100px" prop="roleName">
                <el-input v-model="formdata.roleName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" label-width="100px" prop="roleDesc">
                <el-input v-model="formdata.roleDesc" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleEdit('editForm')">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="dialogFormVisibleRights" width="40%" @close="handleCloseRights()">
        <!-- 树状菜单 -->
        <el-tree :data="rights" show-checkbox default-expand-all node-key="id" ref="tree" highlight-current :props="defaultProps" :default-checked-keys="defaultCheckeds">
        </el-tree>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleRights = false">取 消</el-button>
            <el-button type="primary" @click="handleAddRights()">确 定</el-button>
        </div>
    </el-dialog>
</el-card>
</template>

<script>
export default {
    data() {
        return {
            roles: [], // 角色列表
            rights: [], // 树状权限列表
            dialogFormVisibleRights: false, // 控制授权对话框
            dialogFormVisible: false, // 控制编辑角色对话框
            defaultCheckeds: [], // 控制默认选中树节点
            roleId: '', // RoleId
            formdata: {}, // 编辑表单
            defaultProps: { // 树状菜单属性控制
                children: 'children',
                label: 'authName',
                id: 'id'
            },
            // 验证规则
            rules: {
                roleName: [{
                        required: true,
                        message: '请输入角色名称',
                        trigger: 'blur'
                    },
                    {
                        min: 2,
                        max: 10,
                        message: '长度在 2 到 10 个字符',
                        trigger: 'blur'
                    }
                ],
                roleDesc: [{
                    required: true,
                    message: '请输入角色描述',
                    trigger: 'blur'
                }],
            }
        }
    },
    created() {
        this.loadData()
    },
    methods: {
        // 打开编辑对话框
        handleShowEdit(role) {
            // 对象拷贝(地址的复制，不是引用)
            this.formdata = {
                ...role
            }
            this.dialogFormVisible = true
        },
        // 保存编辑角色
        handleEdit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 发送请求
                    let rePost;
                    if (!this.formdata.id) {
                        rePost = this.$http.post(`roles`, this.formdata)
                    } else {
                        rePost = this.$http.put(`roles/${this.formdata.id}`, this.formdata)
                    }
                    rePost.then(res => {
                        let {
                            data,
                            meta: {
                                msg,
                                status
                            }
                        } = res.data
                        if (status === 201 || status === 200) {
                            this.$message.success(msg)
                            // 关闭对话框
                            this.dialogFormVisible = false
                            this.loadData()
                        } else {
                            this.$message.error(msg)
                        }
                    }).catch(res => {})
                } else {
                    return false
                }
            })
        },
        // 编辑对话框关闭
        handleEditClose(formName) {
            this.dialogFormVisible = false
            this.formdata = {}
            this.$refs[formName].resetFields()
        },
        // 删除角色
        handleDelete(id) {
            this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 发送请求
                this.$http.delete(`roles/${id}`)
                    .then(res => {
                        const {
                            data,
                            meta: {
                                msg,
                                status
                            }
                        } = res.data
                        if (status === 200) {
                            this.$message.success(msg)
                            // 刷新数据
                            this.loadData()
                        } else {
                            this.$message.error(msg)
                        }
                    }).catch(res => {})
            }).catch(() => {})
        },
        // 角色授权
        handleAddRights() {
            // 角色Id
            // 选中的权限 = 半选 + 全选
            let arr1 = this.$refs.tree.getHalfCheckedKeys()
            let arr2 = this.$refs.tree.getCheckedKeys()
            let arr = [...arr1, ...arr2]
            this.$http.post(`roles/${this.roleId}/rights`, {
                    rids: arr.join(',')
                })
                .then(res => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.loadData()
                        this.$message.success(msg)
                        this.dialogFormVisibleRights = false
                    } else {
                        this.$message.error(msg)
                    }
                }).catch(res => {})
        },
        // 打开授权对话框
        handleShowRights(role) {
            this.roleId = role.id
            this.dialogFormVisibleRights = true
            // 读取角色已有权限 (加载第三级权限)
            role.children.forEach(item1 => {
                item1.children.forEach(item2 => {
                    item2.children.forEach(item3 => {
                        this.defaultCheckeds.push(item3.id)
                    })
                })
            })
            // 加载数据
            this.$http.get(`rights/tree`)
                .then(res => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.rights = data
                    } else {
                        this.$message.error(msg)
                    }
                }).catch(res => {})
        },
        // 关闭授权对话框
        handleCloseRights() {
            // 清空数据
            this.defaultCheckeds = []
        },
        // 删除权限
        handleRightsClose(role, rightId) {
            this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 发送请求
                this.$http.delete(`roles/${role.id}/rights/${rightId}`)
                    .then(res => {
                        const {
                            data,
                            meta: {
                                msg,
                                status
                            }
                        } = res.data
                        if (status === 200) {
                            this.$message.success(msg)
                            // 局部刷新 data 返回是删除后的权限信息
                            role.children = data
                            // 刷新数据
                            // this.loadData()
                        } else {
                            this.$message.error(msg)
                        }
                    }).catch(res => {})
            }).catch(() => {})
        },
        // 加载数据
        loadData() {
            this.$http.get(`roles`)
                .then(res => {
                    const {
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
        }
    },
}
</script>

<style scoped>
.mybtn {
    margin: 20px 0;
}

.tags {
    margin: 5px;
}

.nodata {
    color: #F56C6C;
    margin-left: 160px;
}
</style>
