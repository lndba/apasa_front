<template>
    <Layout :style="{marginLeft: '200px'}" v-wechat-title="$route.meta.title">
        <Content :style="{padding: '0 16px 16px',minHeight: '100vh'}">
            <Breadcrumb :style="{margin: '16px 0'}">
                <BreadcrumbItem>首页</BreadcrumbItem>
                <BreadcrumbItem>域名信息</BreadcrumbItem>
                <BreadcrumbItem>解析记录</BreadcrumbItem>
            </Breadcrumb>
            <div class="search">
                <Input suffix="ios-search" placeholder="输入关键字支持全局搜索"/>
            </div>
            <div class="header-btn-list">
                <Button type="primary" @click="addIsvisible = true">添加解析</Button>
                <Button type="error" @click="deleteAllData">批量删除</Button>
            </div>

            <Modal v-model="addIsvisible" draggable scrollable title="添加域名信息">
                <div class="center-div">
                    <Form ref="formDnsAddData" :rules="ruleDnsData" :model="formDnsAddData">
                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="主机记录" prop="name" label-position="top">
                                    <Input v-model="formDnsAddData.name" placeholder="主机记录"/>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="记录值" prop="ipaddr" label-position="top">
                                    <Input v-model="formDnsAddData.ipaddr" placeholder="主机记录"/>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="用途" prop="usage" label-position="top">
                                    <Input v-model="formDnsAddData.usage" placeholder="用途"/>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="所属业务" prop="business" label-position="top">
                                    <Select v-model="formDnsAddData.business" placeholder="所属业务">
                                        <Option v-for="(item,index) in formBusinessData" :value=item.id :key="item.id">
                                            {{item.name}}
                                        </Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div slot="footer">
                    <Button type="text" size="large" @click="addVisible('formDnsAddData')">取消</Button>
                    <Button type="primary" size="large" @click="addSubmit('formDnsAddData')">提交</Button>
                </div>
            </Modal>

            <div class="domain-card">
                <Card>
                    <Table class="table" border ref="selection" @on-selection-change="showOne" :columns="columns" :data="dnsList">
                        <template slot-scope="{ row }" slot="name">
                            <strong>{{ row.name }}</strong>
                        </template>
                        <template slot-scope="{ row, index }" slot="action">
                            <Button type="success" size="small" style="margin-right: 2px" @click="edit(dnsList[index].id)">编辑</Button>
                            <Button type="error" size="small" style="margin-right: 2px" @click="remove(dnsList[index].id)">删除</Button>
                        </template>
                    </Table>
                    <div style="margin-top: 10px">
                        <Page @on-change="changePage" @on-page-size-change="nowPageSize" :total="pageTotal" show-total show-sizer :page-size="pageNumber" :page-size-opts="pageOpts"/>
                    </div>
                </Card>
            </div>
            <Modal v-model="editIsvisible" draggable scrollable title="修改解析记录">
                <i-switch size="large" v-model="switchDnsStatus">
                    <span slot="open">ON</span>
                    <span slot="close">OFF</span>
                </i-switch>
                <div class="center-div">
                    <Form ref="formDnsEditData" :rules="ruleDnsData" :model="formDnsEditData">
                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="主机记录" prop="name" label-position="top">
                                    <Input v-model="formDnsEditData.name" placeholder="主机记录"  :disabled="!switchDnsStatus"/>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="记录值" prop="name" label-position="top">
                                    <Input v-model="formDnsEditData.ipaddr" placeholder="主机记录"  :disabled="!switchDnsStatus"/>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="用途" prop="usage" label-position="top">
                                    <Input v-model="formDnsEditData.usage" placeholder="用途" :disabled="!switchDnsStatus"/>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="所属业务" prop="business" label-position="top">
                                    <Select v-model="formDnsEditData.business" placeholder="所属业务"
                                            :disabled="!switchDnsStatus">
                                        <Option v-for="(item,index) in formBusinessData" :value=item.id :key="item.id">
                                            {{item.name}}
                                        </Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div slot="footer">
                    <Button type="text" size="large" @click="editVisible('formDnsEditData')">取消</Button>
                    <Button type="primary" size="large" @click="editSubmit('formDnsEditData',formDnsEditData.id)">提交</Button>
                </div>
            </Modal>
        </Content>
    </Layout>
</template>

<script>
    export default {
        name: "Dns",
        inject: ['reload'],

        data(){
            var ruleDomain = (rule, value, callback) => {
                const domainreg = /^([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/;
                if ((!domainreg.test(value))) {
                    callback(new Error('请输入正确的主机记录!'));
                } else {
                    callback();
                }
            };
            var ruleIpaddr = (rule, value, callback) => {
                const ipreg = /^(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)$/;
                if ((!ipreg.test(value) && value !== '' && value !== null )) {
                    callback(new Error('请输入正确的网络地址'));
                }else {
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
                        title: '主机记录',
                        key: 'name',
                        align: 'center',
                        sortable: true,
                    },
                    {
                        title: '记录值',
                        key: 'ipaddr',
                        align: 'center',
                    },
                    {
                        title: '用途',
                        key: 'usage',
                        align: 'center',
                        sortable: true,
                    },
                    {
                        title: '所属业务',
                        key: 'business_name',
                        align: 'center',
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 130,
                        align: 'center',
                    }
                ],
                dnsList: [],

                switchDnsStatus: false,
                formDnsEditData: {},
                ruleDnsData:{
                    name: [
                        {required: true, message: '域名不能为空', trigger: 'blur'},
                        {validator: ruleDomain, trigger: 'blur'}
                    ],
                    ipaddr: [
                        {required: true, message: '外网IP不能为空', trigger: 'blur'},
                        {validator: ruleIpaddr,trigger: 'blur'}
                    ],
                    usage: [
                        {required: true, message: '用途不能为空', trigger: 'blur'},
                    ],
                },

                formBusinessData:[],

                formDnsAddData:{
                    name:'',
                    ipaddr:'',
                    usage:'',
                    business:1,
                },

                addIsvisible: false,
                editIsvisible: false,

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
            deleteAllData() {
                if (this.selectData.length > 0) {
                    this.$Modal.confirm({
                        title: '删除警告',
                        width: '450',
                        content: '<p>【友情提示】方法千万种，安全第一条。操作不规范，运维两行泪！</p><p style="color: red;font-weight:bold"><b>是否批量删除解析记录？删除后不可恢复！</b></p>',
                        onOk: () => {
                            for (let dns of this.selectData) {
                                // 发送ajax，删除域名信息
                                var that = this
                                this.$axios.request({
                                    url: this.$store.state.apiList.dnsUpdata + dns.id + '/',
                                    method: 'DELETE',
                                    params: {
                                        token: this.$store.state.token
                                    }

                                }).then(function (arg) {
                                    that.reload()
                                    that.$Message.success('解析记录批量删除成功!');
                                }).catch(function (arg) {
                                    that.$Message.error('解析记录批量删除失败!');
                                    console.log('catch', arg)
                                })
                            }
                        }
                    })
                } else {
                    this.$Message.error('未选中要删除的数据！');
                }
            },

            init() {
                if (!this.$store.state.token) {
                    this.$router.push({name: 'login'})
                } else {
                    // 发送ajax
                    var that = this
                    this.$axios.request({
                        url: this.$store.state.apiList.dnsList,
                        method: 'GET',
                        params: {
                            page: this.pageIndex,
                            size: this.pageNumber,
                            domain: this.$route.params.id,
                            token: this.$store.state.token
                        }

                    }).then(function (arg) {
                        that.dnsList = arg.data.results
                        that.pageTotal = arg.data.count
                        that.initBusiness()
                    }).catch(function (arg) {
                        console.log('catch', arg)
                    })

                }
            },
            initBusiness() {
                // 发送ajax请求，获取business表信息
                var that = this
                this.$axios.request({
                    url: this.$store.state.apiList.businessList,
                    method: 'GET',
                    params: {
                        token: this.$store.state.token,
                    }

                }).then(function (arg) {
                    that.formBusinessData = arg.data

                }).catch(function (arg) {
                    console.log('catch', arg)
                })
            },

            edit(dnsId) {
                // 发送ajax
                var that = this
                this.$axios.request({
                    url: this.$store.state.apiList.dnsUpdata + dnsId + '/',
                    method: 'GET',
                    params: {
                        token: this.$store.state.token
                    }

                }).then(function (arg) {
                    that.formDnsEditData = arg.data
                    that.editIsvisible = true

                }).catch(function (arg) {
                    console.log('catch', arg)
                })
            },
            editVisible(name) {
                this.editIsvisible = false
                this.switchDnsStatus = false
                this.$refs[name].resetFields();
            },
            editSubmit(name,dnsId) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('修改解析记录信息表单校验成功！')
                        var that = this
                        this.$axios.request({
                            url: this.$store.state.apiList.dnsUpdata + dnsId + '/',
                            method: 'PUT',
                            params: {
                                token: this.$store.state.token,
                            },
                            data: that.formDnsEditData
                        }).then(function (arg) {
                            that.reload()
                            that.$Message.success('修改解析记录成功！');
                        }).catch(function (arg) {
                            console.log('catch', arg)
                            that.$Message.error('修改解析记录失败！');
                        })
                    } else {
                        this.$Message.error('修改解析记录信息表单校验错误！');
                    }
                })
            },

            remove(dnsId) {
                this.$Modal.confirm({
                    title: '删除警告',
                    content: '<p>【友情提示】方法千万种，安全第一条。操作不规范，运维两行泪！</p><p style="color: red;font-weight:bold">是否删除这条解析记录？删除后不可恢复！</p>',
                    onOk: () => {
                        // 发送ajax，删除应用信息
                        var that = this
                        this.$axios.request({
                            url: this.$store.state.apiList.dnsUpdata + dnsId + '/',
                            method: 'DELETE',
                            params: {
                                token: this.$store.state.token
                            }

                        }).then(function (arg) {
                            that.$Message.success('解析记录删除成功!');
                            that.init()
                        }).catch(function (arg) {
                            that.$Message.error('解析记录删除失败！');
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
                        this.$Message.success('解析记录表单校验成功！')
                        this.formDnsAddData.master_domain_name = this.$route.params.id
                        var that = this
                        this.$axios.request({
                            url: this.$store.state.apiList.dnsUpdata,
                            method: 'POST',
                            params: {
                                token: this.$store.state.token,
                            },
                            data: that.formDnsAddData
                        }).then(function (arg) {
                            that.reload()
                            that.$Message.success('添加解析记录成功！');
                        }).catch(function (arg) {
                            console.log('catch', arg)
                            that.$Message.error('添加解析记录失败！');
                        })
                    } else {
                        this.$Message.error('解析记录信息表单校验错误！');
                    }
                })
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
