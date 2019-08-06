<template>
    <Layout :style="{marginLeft: '200px'}" v-wechat-title="$route.meta.title">
        <Content :style="{padding: '0 16px 16px',minHeight: '100vh'}">
            <Breadcrumb :style="{margin: '16px 0'}">
                <BreadcrumbItem>首页</BreadcrumbItem>
                <BreadcrumbItem>应用部署信息</BreadcrumbItem>
                <BreadcrumbItem>应用部署明细</BreadcrumbItem>
            </Breadcrumb>
            <div class="search">
                <Input suffix="ios-search" placeholder="输入关键字支持全局搜索"/>
            </div>
            <div class="header-btn-list">
                <Button type="primary" @click="addApp">添加部署</Button>
                <Button type="error" @click="deleteAllData">批量删除</Button>
            </div>
            <Add ref="add" :isvisible="addIsvisible" @addVisible="closeAdd"></Add>
            <div class="deploy-card">
                <Card>
                    <Table class="table" border ref="selection" @on-selection-change="showOne" :columns="columns" :data="appList">
                        <template slot-scope="{ row }" slot="name">
                            <strong>{{ row.name }}</strong>
                        </template>
                        <template slot-scope="{ row, index }" slot="action">
                            <Button type="success" size="small" style="margin-right: 2px" @click="edit(appList[index].id,appList[index].business)">
                                编辑
                            </Button>
                            <Button type="error" size="small" style="margin-right: 2px"
                                    @click="remove(appList[index].id)">删除
                            </Button>
                        </template>
                    </Table>
                    <Edit ref="edit" :isvisible="editIsvisible" @editVisible="closeEdit"></Edit>
                    <div style="margin-top: 10px">
                        <Page @on-change="changePage" @on-page-size-change="nowPageSize" :total="pageTotal" show-total show-sizer :page-size="pageNumber" :page-size-opts="pageOpts"/>
                    </div>
                </Card>
            </div>
        </Content>
    </Layout>
</template>

<script>
    import Edit from './Edit'
    import Add from './Add'
    export default {
        name: "DeployInfo",
        inject: ['reload'],
        data(){
            return {
                pageTotal: 0,
                pageNumber: 10,
                pageOpts: [10,20,30,40,50],
                pageIndex: 1,
                nextPage: null,
                previousPage: null,
                selectData: [],
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                    },
                    {
                        type: 'index',
                        title: '序号',
                        width: 80,
                        align: 'center',
                    },
                    {
                        title: '应用名称',
                        key: 'name',
                        align: 'center',
                        sortable: true,
                    },
                    {
                        title: '用途',
                        key: 'usage',
                        align: 'center',

                    },
                    {
                        title: '所属业务',
                        key: 'business_name',
                        align: 'center',
                        sortable: true,
                    },
                    {
                        title: '端口',
                        key: 'port',
                        align: 'center',
                        sortable: true,
                    },
                    {
                        title: '外网IP',
                        key: 'outside_ip',
                        width: 130,
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '内网IP',
                        key: 'inside_ip',
                        width: 130,
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '部署路径',
                        key: 'path_install',
                        align: 'center'
                    },
                    {
                        title: '配置路径',
                        key: 'path_configure',
                        align: 'center',
                    },
                    {
                        title: '数据路径',
                        key: 'path_data',
                        align: 'center',
                    },
                    {
                        title: '日志路径',
                        key: 'path_log',
                        align: 'center',
                    },

                    {
                        title: '操作',
                        slot: 'action',
                        width: 130,
                        align: 'center',
                    }
                ],
                appList: [],

                editIsvisible: false,
                addIsvisible: false,
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            changePage(index) {
                this.pageIndex = index
                this.init()
            },
            nowPageSize(index) {
                this.pageNumber = index
                this.init()
            },
            showOne(selection) {
                this.selectData = selection
            },

            init() {
                if (!this.$store.state.token) {
                    this.$router.push({name: 'login'})
                } else {
                    // 发送ajax
                    var that = this
                    this.$axios.request({
                        url: this.$store.state.apiList.appList,
                        method: 'GET',
                        params: {
                            page: this.pageIndex,
                            size: this.pageNumber,
                            token: this.$store.state.token
                        }

                    }).then(function (arg) {
                        that.appList = arg.data.results
                        that.pageTotal = arg.data.count

                    }).catch(function (arg) {
                        console.log('catch', arg)
                    })

                }
            },

            edit(app_id) {
                this.editIsvisible = true
                this.$refs.edit.initApp(app_id)
            },
            closeEdit(value) {
                this.editIsvisible = value
            },

            addApp() {
                this.addIsvisible = true
                this.$refs.add.initBusiness()
            },
            closeAdd(value) {
                this.addIsvisible = value
            },

            remove(appId) {
                this.$Modal.confirm({
                    title: '删除警告',
                    content: '<p>【友情提示】方法千万种，安全第一条。操作不规范，运维两行泪！</p><p style="color: red;font-weight:bold">是否删除此应用部署信息？删除后不可恢复！</p>',
                    onOk: () => {
                        // 发送ajax，删除应用信息
                        var that = this
                        this.$axios.request({
                            url: this.$store.state.apiList.appList + appId + '/',
                            method: 'DELETE',
                            params: {
                                token: this.$store.state.token
                            }

                        }).then(function (arg) {
                            that.$Message.success('应用部署信息删除成功!');
                            that.init()
                        }).catch(function (arg) {
                            that.$Message.error('应用部署信息删除失败！');
                            console.log('catch', arg)
                        })
                    }
                })
            },

            deleteAllData() {
                if (this.selectData.length > 0) {
                    this.$Modal.confirm({
                        title: '删除警告',
                        width: '450',
                        content: '<p>【友情提示】方法千万种，安全第一条。操作不规范，运维两行泪！</p><p style="color: red;font-weight:bold"><b>是否批量删除应用部署信息？删除后不可恢复！</b></p>',
                        onOk: () => {
                            for (let app of this.selectData) {
                                // 发送ajax，删除资产信息
                                var that = this
                                this.$axios.request({
                                    url: this.$store.state.apiList.appList + app.id + '/',
                                    method: 'DELETE',
                                    params: {
                                        token: this.$store.state.token
                                    }

                                }).then(function (arg) {
                                    that.reload()
                                    that.$Message.success('应用部署信息批量删除成功!');
                                }).catch(function (arg) {
                                    that.$Message.error('应用部署信息批量删除失败!');
                                    console.log('catch', arg)
                                })
                            }
                        }
                    })
                } else {
                    this.$Message.error('未选中要删除的数据！');
                }
            },
        },
        components: {
            Edit,
            Add
        }
    }
</script>

<style scoped>

    .search {
        width: 200px;
        display: inline-block;
    }

    .header-btn-list {
        margin-left: 10px;
        display: inline-block;
    }

    .deploy-card {
        margin-top: 10px;
    }


</style>
