<template>
    <Layout :style="{marginLeft: '200px'}" v-wechat-title="$route.meta.title">
        <Content :style="{padding: '0 16px 16px',minHeight: '100vh'}">
            <Breadcrumb :style="{margin: '16px 0'}">
                <BreadcrumbItem>首页</BreadcrumbItem>
                <BreadcrumbItem>运维平台信息</BreadcrumbItem>
            </Breadcrumb>
            <div class="search">
                <Input suffix="ios-search" placeholder="输入关键字支持全局搜索"/>
            </div>
            <div class="header-btn-list">
                <Button type="primary" @click="addIsvisible = true">添加平台</Button>
                <Button type="error" @click="deleteAllData">批量删除</Button>
            </div>

            <Modal v-model="addIsvisible" draggable scrollable title="添加平台信息">
                <div class="center-div">
                    <Form ref="formAddPlatformData" :rules="rulePlatformData" :model="formAddPlatformData">
                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="所属业务" prop="provider" label-position="top">
                                    <Select v-model="formAddPlatformData.provider" placeholder="所属业务">
                                        <Option v-for="(item,index) in formProviderData" :value=item.id :key="item.id">
                                            {{item.name}}
                                        </Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="平台名称" prop="name" label-position="top">
                                    <Input v-model="formAddPlatformData.name" placeholder="平台名称"/>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="链接地址" prop="addr" label-position="top">
                                    <Input v-model="formAddPlatformData.addr" placeholder="链接地址"/>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="用户名" prop="username" label-position="top">
                                    <Input v-model="formAddPlatformData.username" placeholder="用户名"/>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="密码" prop="password" label-position="top">
                                    <Input v-model="formAddPlatformData.password" placeholder="密码"/>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div slot="footer">
                    <Button type="text" size="large" @click="addVisible('formAddPlatformData')">取消</Button>
                    <Button type="primary" size="large" @click="addSubmit('formAddPlatformData')">提交</Button>
                </div>
            </Modal>

            <div class="domain-card">
                <Card>
                    <Table class="table" border ref="selection" @on-selection-change="showOne" :columns="columns" :data="platformList">
                        <template slot-scope="{ row }" slot="name">
                            <strong>{{ row.name }}</strong>
                        </template>
                        <template slot-scope="{ row, index }" slot="action">
                            <Button type="success" size="small" style="margin-right: 2px" @click="edit(platformList[index].id)">编辑</Button>
                            <Button type="error" size="small" style="margin-right: 2px" @click="remove(platformList[index].id)">删除</Button>
                        </template>
                    </Table>
                    <div style="margin-top: 10px">
                        <Page @on-change="changePage" @on-page-size-change="nowPageSize" :total="pageTotal" show-total show-sizer :page-size="pageNumber" :page-size-opts="pageOpts"/>
                    </div>
                </Card>
            </div>

            <Modal v-model="editIsvisible" draggable scrollable title="修改平台信息">
                <i-switch size="large" v-model="switchPlatformStatus">
                    <span slot="open">ON</span>
                    <span slot="close">OFF</span>
                </i-switch>
                <div class="center-div">
                    <Form ref="formEditPlatformData" :rules="rulePlatformData" :model="formEditPlatformData">
                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="所属业务" prop="provider" label-position="top">
                                    <Select v-model="formEditPlatformData.provider" placeholder="所属业务"
                                            :disabled="!switchPlatformStatus">
                                        <Option v-for="(item,index) in formProviderData" :value=item.id :key="item.id">
                                            {{item.name}}
                                        </Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="平台名称" prop="name" label-position="top">
                                    <Input v-model="formEditPlatformData.name" placeholder="平台名称"  :disabled="!switchPlatformStatus"/>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="链接地址" prop="addr" label-position="top">
                                    <Input v-model="formEditPlatformData.addr" placeholder="链接地址" :disabled="!switchPlatformStatus"/>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="用户名" prop="username" label-position="top">
                                    <Input v-model="formEditPlatformData.username" placeholder="用户名" :disabled="!switchPlatformStatus"/>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="密码" prop="password" label-position="top">
                                    <Input v-model="formEditPlatformData.password" placeholder="密码" :disabled="!switchPlatformStatus"/>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div slot="footer">
                    <Button type="text" size="large" @click="editVisible('formEditPlatformData')">取消</Button>
                    <Button type="primary" size="large" @click="editSubmit('formEditPlatformData',formEditPlatformData.id)">提交</Button>
                </div>
            </Modal>
        </Content>
    </Layout>
</template>

<script>
    export default {
        name: "Platform",
        inject: ['reload'],
        data() {
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
                        title: '服务商',
                        key: 'provider_name',
                        align: 'center',
                        sortable: true,
                    },
                    {
                        title: '平台名称',
                        key: 'name',
                        align: 'center',
                        sortable: true,
                    },
                    {
                        title: '链接地址',
                        key: 'addr',
                        align: 'center',
                        render: (h, params) => {
                            let url = params.row.addr
                            return h('a', {
                                attrs: {
                                    href: url,
                                    target: '_black'
                                }
                            }, params.row.addr)
                        },
                    },
                    {
                        title: '用户名',
                        key: 'username',
                        align: 'center',

                    },
                    {
                        title: '密码',
                        key: 'password',
                        align: 'center',
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 130,
                        align: 'center',
                    }
                ],
                platformList: [],

                formEditPlatformData: {},
                rulePlatformData:{
                    name: [
                        {required: true, message: '平台名称不能为空', trigger: 'blur'},
                    ],
                    addr: [
                        {required: true, message: '链接地址不能为空', trigger: 'blur'},
                    ],
                },
                formProviderData:[],

                formAddPlatformData:{
                    provider: 1,
                    name: '',
                    addr: '',
                    username: '',
                    password: '',
                },

                addIsvisible: false,
                editIsvisible: false,
                switchPlatformStatus: false,
            }
        },
        mounted() {
            this.init()
        },
        methods:{
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
                        url: this.$store.state.apiList.platformList,
                        method: 'GET',
                        params: {
                            page: this.pageIndex,
                            size: this.pageNumber,
                            token: this.$store.state.token
                        }

                    }).then(function (arg) {
                        that.platformList = arg.data.results
                        that.pageTotal = arg.data.count
                        that.initProvider()

                    }).catch(function (arg) {
                        console.log('catch', arg)
                    })

                }
            },
            initProvider() {
                // 发送ajax请求，获取provider表信息
                var that = this
                this.$axios.request({
                    url: this.$store.state.apiList.providerList,
                    method: 'GET',
                    params: {
                        token: this.$store.state.token,
                    }

                }).then(function (arg) {
                    that.formProviderData = arg.data

                }).catch(function (arg) {
                    console.log('catch', arg)
                })
            },

            edit(platformID) {
                // 发送ajax
                var that = this
                this.$axios.request({
                    url: this.$store.state.apiList.platformList + platformID + '/',
                    method: 'GET',
                    params: {
                        token: this.$store.state.token
                    }

                }).then(function (arg) {
                    that.formEditPlatformData = arg.data
                    that.editIsvisible = true
                }).catch(function (arg) {
                    console.log('catch', arg)
                })

            },
            editVisible(name) {
                this.editIsvisible = false
                this.switchPlatformStatus = false
                this.$refs[name].resetFields();
            },
            editSubmit(name,platformID) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('修改平台信息表单校验成功！')
                        this.$delete(this.formEditPlatformData,'provider_name')
                        var that = this
                        this.$axios.request({
                            url: this.$store.state.apiList.platformList + platformID + '/',
                            method: 'PUT',
                            params: {
                                token: this.$store.state.token,
                            },
                            data: that.formEditPlatformData
                        }).then(function (arg) {
                            that.reload()
                            that.$Message.success('修改平台信息成功！');
                        }).catch(function (arg) {
                            console.log('catch', arg)
                            that.$Message.error('修改平台信息失败！');
                        })
                    } else {
                        this.$Message.error('修改平台信息表单校验错误！');
                    }
                })
            },

            addVisible(name) {
                this.$refs[name].resetFields();
                this.addIsvisible = false
            },
            addSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('添加平台信息表单校验成功！')
                        var that = this
                        this.$axios.request({
                            url: this.$store.state.apiList.platformList,
                            method: 'POST',
                            params: {
                                token: this.$store.state.token,
                            },
                            data: that.formAddPlatformData
                        }).then(function (arg) {
                            that.reload()
                            that.$Message.success('添加平台信息成功！');
                        }).catch(function (arg) {
                            console.log('catch', arg)
                            that.$Message.error('添加平台信息失败！');
                        })
                    } else {
                        this.$Message.error('添加平台信息表单校验错误！');
                    }
                })
            },

            remove(platformID) {
                this.$Modal.confirm({
                    title: '删除警告',
                    content: '<p>【友情提示】方法千万种，安全第一条。操作不规范，运维两行泪！</p><p style="color: red;font-weight:bold">是否删除此条平台信息？删除后不可恢复！</p>',
                    onOk: () => {
                        // 发送ajax，删除平台信息
                        var that = this
                        this.$axios.request({
                            url: this.$store.state.apiList.platformList + platformID + '/',
                            method: 'DELETE',
                            params: {
                                token: this.$store.state.token
                            }

                        }).then(function (arg) {
                            that.$Message.success('平台信息删除成功!');
                            that.reload()
                        }).catch(function (arg) {
                            that.$Message.error('平台信息删除失败！');
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
                        content: '<p>【友情提示】方法千万种，安全第一条。操作不规范，运维两行泪！</p><p style="color: red;font-weight:bold"><b>是否批量删除平台信息？删除后不可恢复！</b></p>',
                        onOk: () => {
                            for (let platform of this.selectData) {
                                // 发送ajax，删除平台信息
                                var that = this
                                this.$axios.request({
                                    url: this.$store.state.apiList.platformList + platform.id + '/',
                                    method: 'DELETE',
                                    params: {
                                        token: this.$store.state.token
                                    }

                                }).then(function (arg) {
                                    that.reload()
                                    that.$Message.success('域名信息批量删除成功!');
                                }).catch(function (arg) {
                                    that.$Message.error('域名信息批量删除失败!');
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

    .domain-card {
        margin-top: 10px;
    }
    .center-div {
        margin: 0 auto;
        width: 60%;
    }
</style>
