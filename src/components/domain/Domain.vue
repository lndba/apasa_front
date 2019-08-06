<template>
    <Layout :style="{marginLeft: '200px'}" v-wechat-title="$route.meta.title">
        <Content :style="{padding: '0 16px 16px',minHeight: '100vh'}">
            <Breadcrumb :style="{margin: '16px 0'}">
                <BreadcrumbItem>首页</BreadcrumbItem>
                <BreadcrumbItem>域名信息</BreadcrumbItem>
            </Breadcrumb>
            <div class="search">
                <Input suffix="ios-search" placeholder="输入关键字支持全局搜索"/>
            </div>
            <div class="header-btn-list">
                <Button type="primary" @click="addIsvisible=true">添加域名</Button>
                <Button type="error" @click="deleteAllData">批量删除</Button>
            </div>
            <Modal v-model="addIsvisible" draggable scrollable title="添加域名信息">
                <div class="center-div">
                    <Form ref="formDomainData" :rules="ruleDomainData" :model="formDomainData">
                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="域名" prop="name" label-position="top">
                                    <Input v-model="formDomainData.name" placeholder="域名"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="备案主体" prop="record" label-position="top">
                                    <Input v-model="formDomainData.record" placeholder="备案主体"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="持有人" prop="holder" label-position="top">
                                    <Input v-model="formDomainData.holder" placeholder="持有人"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="注册时间" prop="creation_date" label-position="top">
                                    <DatePicker type="date" @on-change="formDomainData.creation_date=$event" format="yyyy-MM-dd" placeholder="注册时间" v-model="formDomainData.creation_date"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="到期时间" prop="expire_date" label-position="top">
                                    <DatePicker type="date" @on-change="formDomainData.expire_date=$event" format="yyyy-MM-dd" placeholder="到期时间" v-model="formDomainData.expire_date"/>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div slot="footer">
                    <Button type="text" size="large" @click="addVisible('formDomainData')">取消</Button>
                    <Button type="primary" size="large" @click="addSubmit('formDomainData')">提交</Button>
                </div>
            </Modal>

            <div class="domain-card">
                <Card>
                    <Table class="table" border ref="selection" @on-selection-change="showOne" :columns="columns" :data="domainList">
                        <template slot-scope="{ row }" slot="name">
                            <strong>{{ row.name }}</strong>
                        </template>
                        <template slot-scope="{ row, index }" slot="action">
                            <Button type="success" size="small" style="margin-right: 2px" @click="edit(domainList[index].id)">编辑</Button>
                            <Button type="error" size="small" style="margin-right: 2px" @click="remove(domainList[index].id)">删除</Button>
                        </template>
                    </Table>
                    <div style="margin-top: 10px">
                        <Page @on-change="changePage" @on-page-size-change="nowPageSize" :total="pageTotal" show-total show-sizer :page-size="pageNumber" :page-size-opts="pageOpts"/>
                    </div>
                </Card>
            </div>

            <Modal v-model="editIsvisible" draggable scrollable title="修改域名信息">
                <i-switch size="large" v-model="switchDomainStatus">
                    <span slot="open">ON</span>
                    <span slot="close">OFF</span>
                </i-switch>
                <div class="center-div">
                    <Form ref="formEditDomainData" :rules="ruleDomainData" :model="formEditDomainData">
                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="域名" prop="name" label-position="top">
                                    <Input v-model="formEditDomainData.name" placeholder="域名"  :disabled="!switchDomainStatus"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="备案主体" prop="record" label-position="top">
                                    <Input v-model="formEditDomainData.record" placeholder="备案主体" :disabled="!switchDomainStatus"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="持有人" prop="holder" label-position="top">
                                    <Input v-model="formEditDomainData.holder" placeholder="持有人" :disabled="!switchDomainStatus"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="注册时间" prop="creation_date" label-position="top">
                                    <DatePicker type="date" @on-change="formEditDomainData.creation_date=$event" format="yyyy-MM-dd" placeholder="注册时间" :value="formEditDomainData.creation_date" :disabled="!switchDomainStatus"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="到期时间" prop="expire_date" label-position="top">
                                    <DatePicker type="date" @on-change="formEditDomainData.expire_date=$event" format="yyyy-MM-dd" placeholder="到期时间" :value="formEditDomainData.expire_date" :disabled="!switchDomainStatus"/>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div slot="footer">
                    <Button type="text" size="large" @click="editVisible('formEditDomainData')">取消</Button>
                    <Button type="primary" size="large" @click="editSubmit('formEditDomainData',formEditDomainData.id)">提交</Button>
                </div>
            </Modal>
        </Content>
    </Layout>
</template>

<script>
    export default {
        name: "Domain",
        inject: ['reload'],

        data(){
            var ruleDomain = (rule, value, callback) => {
                const domainreg = /^([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/;
                if ((!domainreg.test(value))) {
                    callback(new Error('请输入正确的域名(example.com)!'));
                } else {
                    callback();
                }
            }
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
                        title: '域名',
                        key: 'name',
                        align: 'center',
                        sortable: true,
                        render: (h, params) => {
                            let url = 'domain/dns/' + params.row.id +'/'+ params.row.name+'.html'
                            return h('a', {
                                attrs: {
                                    href: url,
                                    target: '_black'
                                }
                            }, params.row.name)
                        },
                    },
                    {
                        title: '备案主体',
                        key: 'record',
                        align: 'center',

                    },
                    {
                        title: '持有人',
                        key: 'holder',
                        align: 'center',
                        sortable: true,
                    },
                    {
                        title: '注册时间',
                        key: 'creation_date',
                        align: 'center',
                    },
                    {
                        title: '到期时间',
                        key: 'expire_date',
                        align: 'center',
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 130,
                        align: 'center',
                    }
                ],
                domainList: [],

                formDomainData: {
                    name:'',
                    record:'',
                    holder:'',
                    creation_date: null,
                    expire_date: null,
                },
                ruleDomainData: {
                    name: [
                        {required: true, message: '域名不能为空', trigger: 'blur'},
                        {validator: ruleDomain, trigger: 'blur'}
                    ],
                    record: [
                        {required: true, message: '备案主体不能为空', trigger: 'blur'}
                    ],
                    holder: [
                        {required: true, message: '持有人不能为空', trigger: 'blur'}
                    ],
                    creation_date: [
                        {required: true, message: '注册时间不能为空', trigger: 'blur'}
                    ],
                    expire_date: [
                        {required: true, message: '到期时间不能为空', trigger: 'blur'}
                    ],
                },

                formEditDomainData: {},

                addIsvisible: false,
                editIsvisible: false,
                switchDomainStatus: false,

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

            init(){
                if (!this.$store.state.token) {
                    this.$router.push({name: 'login'})
                } else {
                    // 发送ajax
                    var that = this
                    this.$axios.request({
                        url: this.$store.state.apiList.domainList,
                        method: 'GET',
                        params: {
                            page: this.pageIndex,
                            size: this.pageNumber,
                            token: this.$store.state.token
                        }

                    }).then(function (arg) {
                        that.domainList = arg.data.results
                        that.pageTotal = arg.data.count

                    }).catch(function (arg) {
                        console.log('catch', arg)
                    })

                }
            },

            edit(domainID) {
                // 发送ajax
                var that = this
                this.$axios.request({
                    url: this.$store.state.apiList.domainList + domainID + '/',
                    method: 'GET',
                    params: {
                        token: this.$store.state.token
                    }

                }).then(function (arg) {
                    that.formEditDomainData = arg.data
                    that.editIsvisible = true
                }).catch(function (arg) {
                    console.log('catch', arg)
                })

            },
            editVisible(name) {
                this.editIsvisible = false
                this.switchDomainStatus = false
                this.$refs[name].resetFields();
            },

            editSubmit(name,domainID) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('修改域名信息表单校验成功！')
                        var that = this
                        this.$axios.request({
                            url: this.$store.state.apiList.domainList + domainID + '/',
                            method: 'PUT',
                            params: {
                                token: this.$store.state.token,
                            },
                            data: that.formEditDomainData
                        }).then(function (arg) {
                            that.reload()
                            that.$Message.success('修改域名成功！');
                        }).catch(function (arg) {
                            console.log('catch', arg)
                            that.$Message.error('修改域名失败！');
                        })
                    } else {
                        this.$Message.error('修改域名信息表单校验错误！');
                    }
                })
            },

            remove(domainID) {
                this.$Modal.confirm({
                    title: '删除警告',
                    content: '<p>【友情提示】方法千万种，安全第一条。操作不规范，运维两行泪！</p><p style="color: red;font-weight:bold">是否删除此域名？删除后不可恢复！</p>',
                    onOk: () => {
                        // 发送ajax，删除应用信息
                        var that = this
                        this.$axios.request({
                            url: this.$store.state.apiList.domainList + domainID + '/',
                            method: 'DELETE',
                            params: {
                                token: this.$store.state.token
                            }

                        }).then(function (arg) {
                            that.$Message.success('域名删除成功!');
                            that.init()
                        }).catch(function (arg) {
                            that.$Message.error('域名删除失败！');
                            console.log('catch', arg)
                        })
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
                        this.$Message.success('域名信息表单校验成功！')
                        var that = this
                        this.$axios.request({
                            url: this.$store.state.apiList.domainList,
                            method: 'POST',
                            params: {
                                token: this.$store.state.token,
                            },
                            data: that.formDomainData
                        }).then(function (arg) {
                            that.reload()
                            that.$Message.success('添加域名成功！');
                        }).catch(function (arg) {
                            console.log('catch', arg)
                            that.$Message.error('添加域名失败！');
                        })
                    } else {
                        this.$Message.error('添加域名信息表单校验错误！');
                    }
                })
            },

            deleteAllData() {
                if (this.selectData.length > 0) {
                    this.$Modal.confirm({
                        title: '删除警告',
                        width: '450',
                        content: '<p>【友情提示】方法千万种，安全第一条。操作不规范，运维两行泪！</p><p style="color: red;font-weight:bold"><b>是否批量删除域名信息？删除后不可恢复！</b></p>',
                        onOk: () => {
                            for (let domain of this.selectData) {
                                // 发送ajax，删除域名信息
                                var that = this
                                this.$axios.request({
                                    url: this.$store.state.apiList.domainList + domain.id + '/',
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
