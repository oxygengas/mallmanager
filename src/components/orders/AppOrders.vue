<template>
<!-- 卡片 -->
<el-card class="box-card">
    <!-- 面包屑导航 -->
    <cus-breadcrumb level1="订单管理" level2="订单列表"></cus-breadcrumb>

    <!-- 数据表格 -->
    <el-table :data="orders" border style="margin-top:20px" height="450">
        <el-table-column label="#" type="index" width="50">
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格">
        </el-table-column>
        <el-table-column  label="是否付款">
            <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
                <el-tag v-else-if="scope.row.pay_status==='0'" >未付款</el-tag>
            </template>
        </el-table-column>
         <el-table-column prop="is_send" label="是否发货">
        </el-table-column>
        <el-table-column label="下单时间">
            <!-- 日期处理 -->
            <template slot-scope="scope">
                {{ scope.row.create_time | moment('YYYY-MM-DD HH:mm:ss')}}
            </template>
        </el-table-column>
        <el-table-column label="操作" width="50">
            <template slot-scope="scope">
                <el-button icon="el-icon-edit" type="primary" circle plain size="mini" @click="handleShowEdit(scope.row.order_id)"></el-button>
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
    <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[10, 15, 20, 25]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 编辑对话框 -->
    <el-dialog title="编辑订单" :visible.sync="dialogFormVisibleEdit" width="40%" @close="handleEditClose()">
        <el-form :model="formdata">
            <el-form-item label="订单号" label-width="100px">
                {{formdata.order_number}}
            </el-form-item>
            <el-form-item label="是否发货" label-width="100px">
                <el-switch
                v-model="is_send"
                active-value="是"
                inactive-value="否"
                active-color="#13ce66"
                inactive-color="#ff4949">
                </el-switch>
            </el-form-item>
            <el-form-item label="订单支付" label-width="100px" >
                <el-radio-group v-model="formdata.order_pay">
                    <el-radio label="0">未支付</el-radio>
                    <el-radio label="1">微信</el-radio>
                    <el-radio label="2">支付宝</el-radio>
                    <el-radio label="3">银行卡</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="订单价格" label-width="100px" >
                <el-input v-model="formdata.order_price" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="送货地址" label-width="100px" >
                <!-- 省市区 三级联动 -->
                <el-cascader v-model="selectOptions" :options="citys" clearable></el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" label-width="100px" >
                <el-input v-model="address" autocomplete="off"></el-input>
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
// 导入省市区 联动数据
import { regionData } from 'element-china-area-data'
export default {
    data() {
        return {
            orders: [], // 订单列表
            pagenum: 1, // 页码
            total: 0, // 总条数
            pagesize: 10, // 每页显示条数
            dialogFormVisibleEdit: false, // 控制修改对话框开关 
            formdata: {}, // 表单对象 
            citys:regionData, // 省市联动
            selectOptions:[], // 选中省市联动
            address:'', // 详细地址
            is_send:'', // 是否发货
        }
    },
    created() {
        // 加载数据
        this.loadData()
    },
    methods: {
        // 提交编辑
        handleEdit() {
            // 处理是否发货
            this.formdata.is_send=this.is_send==='是'?'1':'0'
            // 处理支付状态
            this.formdata.pay_status=this.formdata.order_pay!=='0'?'1':'0'
            // 处理地址  = 送货地址 + 详细地址
            this.formdata.consignee_addr = (this.selectOptions.length===0?'':this.selectOptions.join(',')) + (this.address===''?'':(','+this.address))
            // 发送请求
            this.$http.put(`orders/${this.formdata.order_id}`, this.formdata)
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
                        this.dialogFormVisibleEdit = false
                        this.loadData()
                    } else {
                        this.$message.error(msg)
                    }
                }).catch(res => {})
        },
        // 打开修改对话框
        handleShowEdit(id) {
            // 打开对话框
            this.dialogFormVisibleEdit = true
            // 根据Id查询用户信息 绑定表单
            this.$http.get(`orders/${id}`)
                .then(res => {
                    let {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.formdata = {
                            order_id:data.order_id,
                            is_send:data.is_send,
                            order_pay:data.order_pay,
                            order_price:data.order_price,
                            order_number:data.order_number,
                            pay_status:data.pay_status
                        }
                        this.is_send=data.is_send
                        // 处理地址
                        if(data.consignee_addr!==''){
                            this.selectOptions = data.consignee_addr.split(',',3)
                            this.address  = data.consignee_addr.split(',').pop()
                        }
                    } else {
                        this.$message.error(msg)
                    }
                }).catch(res => {})
        },
        // 关闭对话框
        handleEditClose() {
            // 清空数据
            this.formdata = {}
            this.selectOptions = []
            this.address = ''
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
            this.$http.get(`orders?pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
                .then(res => {
                    let {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        console.log(data)
                        this.orders = data.goods
                        this.pagenum = parseInt(data.pagenum)
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
.pagination {
    width: 100%;
    margin: 20px 0;
    text-align: center;
}
</style>
