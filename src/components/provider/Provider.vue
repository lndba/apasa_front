<template>
    <Layout :style="{marginLeft: '200px'}" v-wechat-title="$route.meta.title">
        <Content :style="{padding: '0 16px 16px',minHeight: '100vh'}">
            <Breadcrumb :style="{margin: '16px 0'}">
                <BreadcrumbItem>首页</BreadcrumbItem>
                <BreadcrumbItem>后台管理</BreadcrumbItem>
                <BreadcrumbItem>服务商管理</BreadcrumbItem>
            </Breadcrumb>
            <div class="search">
                <Input suffix="ios-search" placeholder="输入关键字支持全局搜索"/>
            </div>
            <div class="header-btn-list">
                <Button type="primary" @click="addIsvisible = true">添加服务商</Button>
                <Button type="error" @click="deleteAllData">批量删除</Button>
            </div>

            <Modal v-model="addIsvisible" draggable scrollable title="添加服务商信息">
                <div class="center-div">
                    <Form ref="formAddProviderData" :rules="ruleProviderData" :model="formAddProviderData">
                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="服务商名称" prop="name" label-position="top">
                                    <Input v-model="formAddProviderData.name" placeholder="服务商名称"/>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="服务商地址" prop="address" label-position="top">
                                    <Input v-model="formAddProviderData.address" placeholder="服务商地址"/>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="联系人" prop="contact" label-position="top">
                                    <Input v-model="formAddProviderData.contact" placeholder="联系人"/>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="联系人电话" prop="phone" label-position="top">
                                    <Input v-model="formAddProviderData.phone" placeholder="联系人电话"/>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div slot="footer">
                    <Button type="text" size="large" @click="addVisible('formAddProviderData')">取消</Button>
                    <Button type="primary" size="large" @click="addSubmit('formAddProviderData')">提交</Button>
                </div>
            </Modal>

            <div class="domain-card">
                <Card>
                    <Table class="table" border ref="selection" @on-selection-change="showOne" :columns="columns" :data="providerList">
                        <template slot-scope="{ row }" slot="name">
                            <strong>{{ row.name }}</strong>
                        </template>
                        <template slot-scope="{ row, index }" slot="action">
                            <Button type="success" size="small" style="margin-right: 2px" @click="edit(providerList[index].id)">编辑</Button>
                            <Button type="error" size="small" style="margin-right: 2px" @click="remove(providerList[index].id)">删除</Button>
                        </template>
                    </Table>
                    <div style="margin-top: 10px">
                        <Page @on-change="changePage" @on-page-size-change="nowPageSize" :total="pageTotal" show-total show-sizer :page-size="pageNumber" :page-size-opts="pageOpts"/>
                    </div>
                </Card>
            </div>

            <Modal v-model="editIsvisible" draggable scrollable title="修改服务商信息">
                <i-switch size="large" v-model="switchProviderStatus">
                    <span slot="open">ON</span>
                    <span slot="close">OFF</span>
                </i-switch>
                <div class="center-div">
                    <Form ref="formEditProviderData" :rules="ruleProviderData" :model="formEditProviderData">
                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="服务商名称" prop="name" label-position="top">
                                    <Input v-model="formEditProviderData.name" placeholder="服务商名称"  :disabled="!switchProviderStatus"/>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="服务商地址" prop="address" label-position="top">
                                    <Input v-model="formEditProviderData.address" placeholder="服务商地址"  :disabled="!switchProviderStatus"/>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="联系人" prop="contact" label-position="top">
                                    <Input v-model="formEditProviderData.contact" placeholder="联系人" :disabled="!switchProviderStatus"/>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="联系人电话" prop="phone" label-position="top">
                                    <Input v-model="formEditProviderData.phone" placeholder="联系人电话" :disabled="!switchProviderStatus"/>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div slot="footer">
                    <Button type="text" size="large" @click="editVisible('formEditProviderData')">取消</Button>
                    <Button type="primary" size="large" @click="editSubmit('formEditProviderData',formEditProviderData.id)">提交</Button>
                </div>
            </Modal>
        </Content>
    </Layout>
</template>

<script>
    export default {
        name: "Provider",
        inject: ['reload'],
        data() {
            var rulePhone = (rule, value, callback) => {
                const phonereg = /^0?(13|14|15|17|18|19)[0-9]{9}$/;
                if ((!phonereg.test(value)&& value !== '')) {
                    callback(new Error('请输入正确的手机号!'));
                } else {
                    callback();
                }
            };
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
                        title: '服务商名称',
                        key: 'name',
                        align: 'center',
                        sortable: true,
                    },
                    {
                        title: '服务商地址',
                        key: 'address',
                        align: 'center',
                    },
                    {
                        title: '联系人',
                        key: 'contact',
                        align: 'center',
                    },
                    {
                        title: '联系电话',
                        key: 'phone',
                        align: 'center',
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 130,
                        align: 'center',
                    }
                ],
                providerList:[],

                formEditProviderData:{},
                ruleProviderData:{
                    name: [
                        {required: true, message: '服务商名称不能为空', trigger: 'blur'},
                    ],
                    address: [
                        {required: true, message: '服务商地址不能为空', trigger: 'blur'},
                    ],
                    phone: [
                        {required: false, validator: rulePhone, trigger: 'blur'}
                    ],
                },

                formAddProviderData:{
                    name: '',
                    address: '',
                    contact: '',
                    phone: '',
                },

                addIsvisible: false,
                editIsvisible: false,
                switchProviderStatus: false,
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
                    var that = this
                    this.$axios.request({
                        url: this.$store.state.apiList.providerInfoList,
                        method: 'GET',
                        params: {
                            page: this.pageIndex,
                            size: this.pageNumber,
                            token: this.$store.state.token
                        }

                    }).then(function (arg) {
                        that.providerList = arg.data.results
                        that.pageTotal = arg.data.count
                    }).catch(function (arg) {
                        console.log('catch', arg)
                    })

                }
            },

            edit(providerID) {
                var that = this
                this.$axios.request({
                    url: this.$store.state.apiList.providerInfoList + providerID + '/',
                    method: 'GET',
                    params: {
                        token: this.$store.state.token
                    }

                }).then(function (arg) {
                    that.formEditProviderData = arg.data
                    that.editIsvisible = true
                }).catch(function (arg) {
                    console.log('catch', arg)
                })

            },
            editVisible(name) {
                this.editIsvisible = false
                this.switchProviderStatus = false
                this.$refs[name].resetFields();
            },
            editSubmit(name,providerID) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('修改服务商信息表单校验成功！')
                        var that = this
                        this.$axios.request({
                            url: this.$store.state.apiList.providerInfoList + providerID + '/',
                            method: 'PUT',
                            params: {
                                token: this.$store.state.token,
                            },
                            data: this.formEditProviderData
                        }).then(function (arg) {
                            that.reload()
                            that.$Notice.success({
                                title: '修改服务商信息',
                                desc: '修改服务商信息成功！'
                            });
                        }).catch(function (arg) {
                            console.log('catch', arg)
                            that.$Notice.error({
                                title: '修改服务商信息',
                                desc: '修改服务商信息失败！'
                            });
                        })
                    } else {
                        this.$Message.error('修改服务商信息表单校验错误！');
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
                        this.$Message.success('添加服务商信息表单校验成功！')
                        var that = this
                        this.$axios.request({
                            url: this.$store.state.apiList.providerInfoList,
                            method: 'POST',
                            params: {
                                token: this.$store.state.token,
                            },
                            data: this.formAddProviderData
                        }).then(function (arg) {
                            that.reload()
                            that.$Notice.success({
                                title: '添加服务商信息',
                                desc: '添加服务商信息成功！'
                            });
                        }).catch(function (arg) {
                            console.log('catch', arg)
                            that.$Notice.error({
                                title: '添加服务商信息',
                                desc: '添加服务商信息失败！'
                            });
                        })
                    } else {
                        this.$Message.error('添加服务商信息表单校验错误！');
                    }
                })
            },

            remove(providerID) {
                this.$Modal.confirm({
                    title: '删除警告',
                    content: '<p>【友情提示】方法千万种，安全第一条。操作不规范，运维两行泪！</p><p style="color: red;font-weight:bold">是否删除此条服务商信息？删除后不可恢复！</p>',
                    onOk: () => {
                        // 发送ajax，删除服务商信息
                        var that = this
                        this.$axios.request({
                            url: this.$store.state.apiList.providerInfoList + providerID + '/',
                            method: 'DELETE',
                            params: {
                                token: this.$store.state.token
                            }

                        }).then(function (arg) {
                            that.$Notice.success({
                                title: '删除服务商信息',
                                desc: '删除服务商信息成功！'
                            });
                            that.reload()
                        }).catch(function (arg) {
                            that.$Notice.error({
                                title: '删除服务商信息',
                                desc: '删除服务商信息失败！'
                            });
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
                        content: '<p>【友情提示】方法千万种，安全第一条。操作不规范，运维两行泪！</p><p style="color: red;font-weight:bold"><b>是否批量删除服务商信息？删除后不可恢复！</b></p>',
                        onOk: () => {
                            for (let provider of this.selectData) {
                                // 发送ajax，删除服务商信息
                                var that = this
                                this.$axios.request({
                                    url: this.$store.state.apiList.providerInfoList + provider.id + '/',
                                    method: 'DELETE',
                                    params: {
                                        token: this.$store.state.token
                                    }

                                }).then(function (arg) {
                                    that.reload()
                                    that.$Notice.success({
                                        title: '批量删除服务商信息',
                                        desc: '批量删除服务商信息成功！'
                                    });
                                }).catch(function (arg) {
                                    that.$Notice.success({
                                        title: '批量删除服务商信息',
                                        desc: '批量删除服务商信息失败！'
                                    });
                                    console.log('catch', arg)
                                })
                            }
                        }
                    })
                } else {
                    this.$Message.error('未选中要删除的数据！');
                }
            },
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

    .domain-card {
        margin-top: 10px;
    }
    .center-div {
        margin: 0 auto;
        width: 60%;
    }
</style>
