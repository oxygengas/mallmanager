<template>
<el-container class="container">
    <el-header class="header">
        <el-row>
            <el-col :span="22">电商后台管理系统</el-col>
            <el-col :span="2"><a href="#" @click.prevent="handleLogOut">退出</a></el-col>
        </el-row>
    </el-header>
    <el-container>
        <el-aside width="200px" class="aside">
            <!-- 侧边栏 -->
            <el-menu default-active="3" class="menu" :unique-opened="true" :router="true">
                <!-- 动态菜单 -->
                <el-submenu :index="index+''" v-for="(item, index) in menus" :key="index">
                    <template slot="title">
                        <i class="el-icon-s-tools"></i>
                        <span>{{item.authName}}</span>
                    </template>
                    <el-menu-item :index="'/'+item1.path" v-for="(item1, index) in item.children" :key="index">
                        <i class="el-icon-s-unfold"></i>
                        <span>{{item1.authName}}</span>
                    </el-menu-item>
                </el-submenu>
            </el-menu>
        </el-aside>
        <el-main class="main">
            <!-- 主要部分 路由 -->
            <!-- <h1>欢迎使用电商后台管理系统</h1> -->
            <router-view></router-view>
        </el-main>
    </el-container>
</el-container>
</template>

<script>
export default {
    data() {
        return {
            menus: [] // 左侧菜单项
        }
    },
    // 数据初始化，判断token (临时 -> axios拦截器每一次请求都需要验证 ？)
    // beforeCreate() {
    //     let token = localStorage.getItem('token')
    //     if (!token) { // true 没有登录
    //         // 跳转登录
    //         this.$message.warning('没有登录，请先登录')
    //         this.$router.push({
    //             name: 'login'
    //         })
    //     }
    // },
    created() {
        // 查询左侧菜单列表
        this.$http.get(`menus`)
            .then(res => {
                const {
                    data,
                    meta: {
                        msg,
                        status
                    }
                } = res.data
                if (status === 200) {
                    this.menus = data
                } else {
                    this.$message.error(msg)
                }
            }).catch(res => {})
    },
    methods: {
        // 退出
        handleLogOut() {
            localStorage.removeItem('token')
            this.$router.push({
                name: 'login'
            })
            this.$message.success('退出成功')
        }
    },
}
</script>

<style scoped>
.container,
.aside,
.menu {
    height: 100%;
}

.header {
    background-color: #222;
    color: #fff;
    text-align: center;
    line-height: 60px;
    font-size: 24px;
}

.header a {
    color: #fff;
    font-size: 14px;
}

.main {
    background-color: #E9EEF3;
    padding: 20px;
}
</style>
