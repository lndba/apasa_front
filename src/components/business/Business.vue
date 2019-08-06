<template>
    <Layout :style="{marginLeft: '200px'}" v-wechat-title="$route.meta.title">
        <Content :style="{padding: '0 16px 16px',minHeight: '100vh'}">
            <Breadcrumb :style="{margin: '16px 0'}">
                <BreadcrumbItem>首页</BreadcrumbItem>
                <BreadcrumbItem>后台管理</BreadcrumbItem>
                <BreadcrumbItem>业务管理</BreadcrumbItem>
            </Breadcrumb>
            <div class="search">
                <Input suffix="ios-search" placeholder="输入关键字支持全局搜索"/>
            </div>
            <div class="header-btn-list">
                <Button type="primary" @click="addIsvisible = true">添加服务商</Button>
                <Button type="error" @click="deleteAllData">批量删除</Button>
            </div>

            <Modal v-model="addIsvisible" draggable scrollable title="添加业务信息">
                <div class="center-div">
                    <Form ref="formAddBusinessData" :rules="ruleBusinessData" :model="formAddBusinessData">
                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="业务(项目)名称" prop="name" label-position="top">
                                    <Input v-model="formAddBusinessData.name" placeholder="业务(项目)名称"/>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="开发负责人" prop="contact" label-position="top">
                                    <Input v-model="formAddBusinessData.contact" placeholder="开发负责人"/>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="运维负责人" prop="administrator" label-position="top">
                                    <Input v-model="formAddBusinessData.administrator" placeholder="运维负责人"/>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="描述信息" label-position="top">
                                    <Input v-model="formAddBusinessData.descriptions" placeholder="描述信息"/>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div slot="footer">
                    <Button type="text" size="large" @click="addVisible('formAddBusinessData')">取消</Button>
                    <Button type="primary" size="large" @click="addSubmit('formAddBusinessData')">提交</Button>
                </div>
            </Modal>

            <div class="domain-card">
                <Card>
                    <Table class="table" border ref="selection" @on-selection-change="showOne" :columns="columns" :data="businessList">
                        <template slot-scope="{ row }" slot="name">
                            <strong>{{ row.name }}</strong>
                        </template>
                        <template slot-scope="{ row, index }" slot="action">
                            <Button type="success" size="small" style="margin-right: 2px" @click="edit(businessList[index].id)">编辑</Button>
                            <Button type="error" size="small" style="margin-right: 2px" @click="remove(businessList[index].id)">删除</Button>
                        </template>
                    </Table>
                    <div style="margin-top: 10px">
                        <Page @on-change="changePage" @on-page-size-change="nowPageSize" :total="pageTotal" show-total show-sizer :page-size="pageNumber" :page-size-opts="pageOpts"/>
                    </div>
                </Card>
            </div>

            <Modal v-model="editIsvisible" draggable scrollable title="修改业务信息">
                <i-switch size="large" v-model="switchBusinessStatus">
                    <span slot="open">ON</span>
                    <span slot="close">OFF</span>
                </i-switch>
                <div class="center-div">
                    <Form ref="formEditBusinessData" :rules="ruleBusinessData" :model="formEditBusinessData">
                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="业务(项目)名称" prop="name" label-position="top">
                                    <Input v-model="formEditBusinessData.name" placeholder="业务(项目)名称"  :disabled="!switchBusinessStatus"/>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="开发负责人" prop="contact" label-position="top">
                                    <Input v-model="formEditBusinessData.contact" placeholder="开发负责人"  :disabled="!switchBusinessStatus"/>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="运维负责人" prop="administrator" label-position="top">
                                    <Input v-model="formEditBusinessData.administrator" placeholder="运维负责人" :disabled="!switchBusinessStatus"/>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="描述信息" label-position="top">
                                    <Input v-model="formEditBusinessData.descriptions" placeholder="描述信息" :disabled="!switchBusinessStatus"/>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div slot="footer">
                    <Button type="text" size="large" @click="editVisible('formEditBusinessData')">取消</Button>
                    <Button type="primary" size="large" @click="editSubmit('formEditBusinessData',formEditBusinessData.id)">提交</Button>
                </div>
            </Modal>
        </Content>
    </Layout>
</template>

<script>
    export default {
        name: "Business",
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
                        title: '业务(项目)名称',
                        key: 'name',
                        align: 'center',
                        sortable: true,
                    },
                    {
                        title: '开发负责人',
                        key: 'contact',
                        align: 'center',
                    },
                    {
                        title: '运维负责人',
                        key: 'administrator',
                        align: 'center',
                    },
                    {
                        title: '描述',
                        key: 'descriptions',
                        align: 'center',
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 130,
                        align: 'center',
                    }
                ],
                businessList:[],

                formEditBusinessData:{},
                ruleBusinessData:{
                    name: [
                        {required: true, message: '业务(项目)名称不能为空', trigger: 'blur'},
                    ],
                    contact: [
                        {required: true, message: '开发负责人不能为空', trigger: 'blur'},
                    ],
                    administrator: [
                        {required: true, message: '运维负责人不能为空', trigger: 'blur'},
                    ],
                },

                formAddBusinessData:{
                    name: '',
                    contact: '',
                    administrator: '',
                    descriptions: '',
                },

                addIsvisible: false,
                editIsvisible: false,
                switchBusinessStatus: false,
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
                        url: this.$store.state.apiList.businessInfoList,
                        method: 'GET',
                        params: {
                            page: this.pageIndex,
                            size: this.pageNumber,
                            token: this.$store.state.token
                        }

                    }).then(function (arg) {
                        that.businessList = arg.data.results
                        that.pageTotal = arg.data.count
                    }).catch(function (arg) {
                        console.log('catch', arg)
                    })

                }
            },

            edit(businessID) {
                // 发送ajax
                var that = this
                this.$axios.request({
                    url: this.$store.state.apiList.businessInfoList + businessID + '/',
                    method: 'GET',
                    params: {
                        token: this.$store.state.token
                    }

                }).then(function (arg) {
                    that.formEditBusinessData = arg.data
                    that.editIsvisible = true
                }).catch(function (arg) {
                    console.log('catch', arg)
                })
            },
            editVisible(name) {
                this.editIsvisible = false
                this.switchBusinessStatus = false
                this.$refs[name].resetFields();
            },
            editSubmit(name,businessID) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('修改业务信息表单校验成功！')
                        var that = this
                        this.$axios.request({
                            url: this.$store.state.apiList.businessInfoList + businessID + '/',
                            method: 'PUT',
                            params: {
                                token: this.$store.state.token,
                            },
                            data: this.formEditBusinessData
                        }).then(function (arg) {
                            that.reload()
                            that.$Notice.success({
                                title: '修改业务信息',
                                desc: '修改业务信息成功！'
                            });
                        }).catch(function (arg) {
                            console.log('catch', arg)
                            that.$Notice.error({
                                title: '修改业务信息',
                                desc: '修改业务信息失败！'
                            });
                        })
                    } else {
                        this.$Message.error('修改业务信息表单校验错误！');
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
                        this.$Message.success('添加业务信息表单校验成功！')
                        var that = this
                        this.$axios.request({
                            url: this.$store.state.apiList.businessInfoList,
                            method: 'POST',
                            params: {
                                token: this.$store.state.token,
                            },
                            data: this.formAddBusinessData
                        }).then(function (arg) {
                            that.reload()
                            that.$Notice.success({
                                title: '添加业务信息',
                                desc: '添加业务信息成功！'
                            });
                        }).catch(function (arg) {
                            console.log('catch', arg)
                            that.$Notice.error({
                                title: '添加业务信息',
                                desc: '修改业务信息失败！'
                            });
                        })
                    } else {
                        this.$Message.error('添加业务信息表单校验错误！');
                    }
                })
            },

            remove(businessID) {
                this.$Modal.confirm({
                    title: '删除警告',
                    content: '<p>【友情提示】方法千万种，安全第一条。操作不规范，运维两行泪！</p><p style="color: red;font-weight:bold">是否删除此条业务信息？删除后不可恢复！</p>',
                    onOk: () => {
                        // 发送ajax，删除业务信息
                        var that = this
                        this.$axios.request({
                            url: this.$store.state.apiList.businessInfoList + businessID + '/',
                            method: 'DELETE',
                            params: {
                                token: this.$store.state.token
                            }

                        }).then(function (arg) {
                            that.$Notice.success({
                                title: '删除业务信息',
                                desc: '删除业务信息成功！'
                            });
                            that.reload()
                        }).catch(function (arg) {
                            that.$Notice.error({
                                title: '删除业务信息',
                                desc: '删除业务信息失败！'
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
                        content: '<p>【友情提示】方法千万种，安全第一条。操作不规范，运维两行泪！</p><p style="color: red;font-weight:bold"><b>是否批量删除业务信息？删除后不可恢复！</b></p>',
                        onOk: () => {
                            for (let business of this.selectData) {
                                // 发送ajax，删除业务信息
                                var that = this
                                this.$axios.request({
                                    url: this.$store.state.apiList.businessInfoList + business.id + '/',
                                    method: 'DELETE',
                                    params: {
                                        token: this.$store.state.token
                                    }

                                }).then(function (arg) {
                                    that.reload()
                                    that.$Notice.success({
                                        title: '批量删除业务信息',
                                        desc: '批量删除业务信息成功！'
                                    });
                                }).catch(function (arg) {
                                    that.$Notice.success({
                                        title: '批量删除业务信息',
                                        desc: '批量删除业务信息失败！'
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
