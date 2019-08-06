<template>
    <!--<Breadcrumb :style="{margin: '24px 0'}">-->
    <!--<BreadcrumbItem>Home</BreadcrumbItem>-->
    <!--</Breadcrumb>-->


    <Layout :style="{marginLeft: '200px'}" v-wechat-title="$route.meta.title">
        <Content :style="{padding: '0 16px 16px',minHeight: '100vh'}">
            <p style="margin: 20px 0;font-size: 25px;text-align: center">Apasa CMDB 可视化数据展示</p>
            <div id="serverChart" :style="{width: '600px', height: '600px',margin: '100px 0',float:'left'}"></div>
            <div id="domainChart" :style="{width: '600px', height: '600px',margin: '100px 0 0 150px',float:'left'}"></div>
        </Content>
    </Layout>
</template>

<script>
    export default {
        name: "Dashboard",
        data() {
            return {
                serverData: [],
                domainData: [],
            }
        },
        mounted() {
            this.initServerData();
            this.initDomainData();
        },
        methods: {
            initServerData() {
                // 发送ajax
                var that = this
                this.$axios.request({
                    url: this.$store.state.apiList.serverData,
                    method: 'GET',
                    params: {
                        token: this.$store.state.token
                    }
                }).then(function (arg) {
                    if (arg.data.state_code === 200){
                        that.serverData = arg.data.results
                        that.drawServer()
                    } else {
                        that.$Notice.error({
                            title: '数据可视化信息',
                            desc: arg.data.msg
                        });
                    }
                }).catch(function (arg) {
                    console.log('catch', arg)
                })
            },
            initDomainData() {
                // 发送ajax
                var that = this
                this.$axios.request({
                    url: this.$store.state.apiList.domainData,
                    method: 'GET',
                    params: {
                        token: this.$store.state.token
                    }
                }).then(function (arg) {
                    if (arg.data.state_code === 200){
                        that.domainData = arg.data.results
                        that.drawDomain()
                    } else {
                        that.$Notice.error({
                            title: '数据可视化信息',
                            desc: arg.data.msg
                        });
                    }
                }).catch(function (arg) {
                    console.log('catch', arg)
                })
            },

            drawServer() {
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('serverChart'), 'macarons')
                // 绘制图表
                myChart.setOption({
                    title: {
                        text: 'Apasa CMDB 统计服务器分布情况',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                    },
                    series: [
                        {
                            name: '服务器来源',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: this.serverData,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                });
            },
            drawDomain() {
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('domainChart'), 'macarons')
                // 绘制图表
                myChart.setOption({
                    title: {
                        text: 'Apasa CMDB 统计域名分布情况',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                    },
                    series: [
                        {
                            name: '域名信息',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: this.domainData,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                });
            },
        }
    }
</script>

<style scoped>

</style>
