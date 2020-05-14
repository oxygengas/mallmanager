<template>
<!-- 卡片 -->
<el-card class="box-card">
    <!-- 面包屑导航 -->
    <cus-breadcrumb level1="权限管理" level2="权限列表"></cus-breadcrumb>
    <!-- 权限列表 -->
    <!-- 数据表格 -->
    <el-table :data="rights" border class="rlist" height="400">
        <el-table-column label="#" type="index" width="50">
        </el-table-column>
        <el-table-column prop="authName" label="权限名称">
        </el-table-column>
        <el-table-column prop="path" label="路径">
        </el-table-column>
        <el-table-column label="层级">
            <template slot-scope="scope">
                <!-- 层级处理 -->
                <span v-if="scope.row.level === '0'">一级</span>
                <span v-if="scope.row.level === '1'">二级</span>
                <span v-if="scope.row.level === '2'">三级</span>
            </template>
        </el-table-column>
    </el-table>
</el-card>
</template>

<script>
export default {
    data() {
        return {
            rights: [], // 权限列表
        }
    },
    created() {
        this.loadData()
    },
    methods: {
        // 获取权限列表
        loadData() {
            // 发送请求
            this.$http.get(`rights/list`)
                .then(res => {
                    let {
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
        }
    },
}
</script>

<style scoped>
.rlist{
    margin: 20px 0;
}
</style>
