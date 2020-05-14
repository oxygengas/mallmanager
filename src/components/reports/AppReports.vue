<template>
<!-- 卡片 -->
<el-card class="box-card">
    <!-- 面包屑导航 -->
    <cus-breadcrumb level1="数据统计" level2="数据报表"></cus-breadcrumb>

    <!-- 绘制图形区域 -->
    <div id="main" style="width: 800px;height:400px;margin-top:20px"></div>
</el-card>
</template>

<script>
// 导入图形库
var echarts = require('echarts')
export default {
    // 等待页面加载完成之后
    async mounted() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据
        var option1 = {}
        var option2 = {
            title: {
                text: '区域销售情况统计'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
        };

        // 发送请求，调用数据
        await this.$http.get(`reports/type/1`)
            .then(res => {
                let {
                    data,
                    meta: {
                        msg,
                        status
                    }
                } = res.data
                if (status === 200) {
                    option1 = data
                } else {
                    this.$message.error(msg)
                }
            }).catch(res => {})

        // option = option1+option2
        var option = {...option1,...option2}
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option)
    },
}
</script>

<style scoped>

</style>
