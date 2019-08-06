<template>
    <Layout :style="{marginLeft: '200px'}" v-wechat-title="$route.meta.title">
        <Content :style="{padding: '0 16px 16px',minHeight: '100vh'}">
            <Breadcrumb :style="{margin: '16px 0'}">
                <BreadcrumbItem>首页</BreadcrumbItem>
                <BreadcrumbItem>资产信息</BreadcrumbItem>
                <BreadcrumbItem>资产内容</BreadcrumbItem>
            </Breadcrumb>
            <div class="search">
                <Input suffix="ios-search" placeholder="输入关键字支持全局搜索"/>
            </div>
            <div class="header-btn-list">
                <Button type="primary" @click="addAsset">添加主机</Button>
                <Button type="error" @click="deleteAllData">批量删除</Button>
            </div>
            <!--加载添加主机子组件-->
            <Add ref="add" :isvisible="addIsvisible" @addVisible="closeAdd"></Add>
            <div class="asset-card">
                <Card>
                    <Table border ref="selection" @on-selection-change="showOne" :columns="columns" :data="assetList">
                        <template slot-scope="{ row }" slot="name">
                            <strong>{{ row.name }}</strong>
                        </template>
                        <template slot-scope="{ row, index }" slot="action">
                            <Button type="primary" size="small" style="margin-right: 2px"
                                    @click="show(assetList[index].id)">详情
                            </Button>
                            <Button type="success" size="small" style="margin-right: 2px"
                                    @click="edit(assetList[index].id,assetList[index].server_id,assetList[index].nic_info,assetList[index].disk_info)">
                                编辑
                            </Button>
                            <Button type="error" size="small" style="margin-right: 2px"
                                    @click="remove(assetList[index].id,index)">删除
                            </Button>
                        </template>
                    </Table>
                    <!--加载详情子组件-->
                    <Detail ref="detail" :isvisible="detailIsvisible" @editVisible="closeDetail"></Detail>
                    <!--加载编辑子组件-->
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
    import Detail from './Detail'
    import Edit from './Edit'
    import Add from './Add'

    export default {
        name: "Asset",
        inject: ['reload'],
        data() {
            return {
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        type: 'index',
                        title: '序号',
                        width: 80,
                        align: 'center',
                    },
                    {
                        title: '服务商',
                        key: 'provider_name',
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '区域',
                        key: 'region',
                        align: 'center'
                    },
                    {
                        title: '主机名',
                        key: 'server_hostname',
                        align: 'center'
                    },
                    {
                        title: 'IP地址',
                        key: 'server_outside_ip',
                        width: 130,
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: 'CPU核心',
                        key: 'server_cpu_core',
                        width: 90,
                        align: 'center'
                    },
                    {
                        title: '内存',
                        key: 'server_memory_size',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '系统',
                        key: 'server_os_version',
                        align: 'center'
                    },
                    {
                        title: '到期时间',
                        key: 'server_expire_date',
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '状态',
                        key: 'device_status_info',
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 200,
                        align: 'center'
                    }
                ],
                assetList: [],
                detailIsvisible: false,
                editIsvisible: false,
                addIsvisible: false,
                pageTotal: 0,
                pageNumber: 10,
                pageOpts: [10,20,30,40,50],
                pageIndex: 1,
                nextPage: null,
                previousPage: null,

                pStyle: {
                    fontSize: '16px',
                    color: 'rgba(0,0,0,0.85)',
                    lineHeight: '24px',
                    display: 'block',
                    marginBottom: '16px'
                },

                selectData: []
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
            init() {
                if (!this.$store.state.token) {
                    this.$router.push({name: 'login'})
                } else {
                    // 发送ajax
                    var that = this
                    this.$axios.request({
                        url: this.$store.state.apiList.assetList,
                        method: 'GET',
                        params: {
                            page: this.pageIndex,
                            size: this.pageNumber,
                            token: this.$store.state.token
                        }

                    }).then(function (arg) {
                        that.assetList = arg.data.results
                        that.pageTotal = arg.data.count

                    }).catch(function (arg) {
                        console.log('catch', arg)
                    })

                }
            },
            show(asset_id) {
                this.detailIsvisible = true
                this.$refs.detail.init(asset_id)

            },
            closeDetail(value) {
                this.detailIsvisible = value
            },

            edit(asset_id, server_id, nic_id, disk_id) {
                this.editIsvisible = true
                this.$refs.edit.initAsset(asset_id)
                this.$refs.edit.initServer(server_id)
                this.$refs.edit.initNetwork(nic_id)
                this.$refs.edit.initDisk(disk_id)
            },
            closeEdit(value) {
                this.editIsvisible = value
            },

            deleteAllData() {
                if (this.selectData.length > 0) {
                    this.$Modal.confirm({
                        title: '删除警告',
                        content: '<p>【友情提示】方法千万种，安全第一条。操作不规范，运维两行泪！</p><p style="color: red;font-weight:bold">是否批量删除资产？删除后不可恢复！</p>',
                        onOk: () => {
                            for (let asset of this.selectData) {
                                // 发送ajax，删除资产信息
                                var that = this
                                this.$axios.request({
                                    url: this.$store.state.apiList.assetList + asset.id + '/',
                                    method: 'DELETE',
                                    params: {
                                        token: this.$store.state.token
                                    }

                                }).then(function (arg) {
                                    that.reload()
                                    that.$Message.success('资产批量删除成功!');
                                }).catch(function (arg) {
                                    that.$Message.error('资产批量删除失败!');
                                    console.log('catch', arg)
                                })
                            }
                        }
                    })
                } else {
                    this.$Message.error('未选中要删除的数据！');
                }
            },

            showOne(selection) {
                this.selectData = selection

            },

            addAsset() {
                this.addIsvisible = true
                this.$refs.add.initProviderInfo()
            },
            closeAdd(value) {
                this.addIsvisible = value
            },

            remove(assetId, index) {
                this.$Modal.confirm({
                    title: '删除警告',
                    content: '<p>【友情提示】方法千万种，安全第一条。操作不规范，运维两行泪！</p><p style="color: red;font-weight:bold">是否删除此块网卡？删除后不可恢复！</p>',
                    onOk: () => {
                        // 发送ajax，删除资产信息
                        var that = this
                        this.$axios.request({
                            url: this.$store.state.apiList.assetList + assetId + '/',
                            method: 'DELETE',
                            params: {
                                token: this.$store.state.token
                            }

                        }).then(function (arg) {
                            that.$Message.success('资产删除成功!');
                            that.init()
                        }).catch(function (arg) {
                            that.$Message.error('资产删除失败！');
                            console.log('catch', arg)
                        })
                    }
                })
            },

        },
        computed: {},
        components: {
            Detail,
            Edit,
            Add,
        }
    }
</script>

<style scoped>
    .layout {
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        width: 100vw;
        /*height: 100vh;*/
        min-height: 100vh;
    }

    .search {
        width: 200px;
        display: inline-block;
    }

    .header-btn-list {
        margin-left: 10px;
        display: inline-block;
    }

    .asset-card {
        margin-top: 10px;
    }

    .demo-drawer-profile {
        font-size: 14px;
    }

    .demo-drawer-profile .ivu-col {
        margin-bottom: 12px;
    }
</style>
