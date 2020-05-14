<template>
<div class="login">
    <el-form label-position="top" label-width="80px" class="login-form" :model="formdata" :rules="rules" ref="ruleForm">
        <h2>用户登录</h2>
        <el-form-item label="用户名" prop="username">
            <el-input v-model="formdata.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input v-model="formdata.password" placeholder="密码" show-password></el-input>
        </el-form-item>
        <el-button type="primary" class="loginBtn" @click="handleLogin">登录</el-button>
    </el-form>
</div>
</template>

<script>
export default {
    data() {
        return {
            // 表单数据
            formdata: {
                username: 'admin',
                password: '123456'
            },
            // 表单校验规则
            rules: {
                username: [{
                        required: true,
                        message: '请输入用户名',
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
                    },
                    {
                        min: 6,
                        max: 16,
                        message: '长度在 6 到 16 个字符',
                        trigger: 'blur'
                    }
                ],

            }
        }
    },
    methods: {
        /**
         * 用户登录
         */
        handleLogin() {
            // 1.验证
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    // 2.发送请求 请求路径：login 请求方法：post
                    this.$http.post(`login`, this.formdata)
                        .then(res => {
                            // 解构对象
                            let {
                                data,
                                meta: {
                                    msg,
                                    status
                                }
                            } = res.data
                            if (status === 200) {
                                // 存储登录凭证
                                localStorage.setItem('token',data.token)
                                // 提示登录成功
                                this.$message.success(msg)
                                // 跳转主页 (显示默认的二级路由)
                                this.$router.push({
                                    path:'/'
                                })
                            } else {
                                this.$message.error(msg)
                            }

                        }).catch(res => {
                            this.$message.error('网络异常')
                        })
                } else {
                    return false
                }
            })
        }
    },
}
</script>

<style scoped>
.login {
    height: 100%;
    background-color: #324152;
    display: flex;
    justify-content: center;
    align-items: center;
}

.login-form {
    border-radius: 5px;
    padding: 20px;
    background-color: #fff;
    width: 450px;
}

.loginBtn {
    width: 100%;
}
</style>
