<template>
    <Layout :style="{marginLeft: '200px'}" v-wechat-title="$route.meta.title">
        <Content :style="{padding: '0 16px 16px',minHeight: '100vh'}">
            <Breadcrumb :style="{margin: '16px 0'}">
                <BreadcrumbItem>首页</BreadcrumbItem>
                <BreadcrumbItem>后台管理</BreadcrumbItem>
                <BreadcrumbItem>用户管理</BreadcrumbItem>
            </Breadcrumb>
            <div class="search">
                <Input suffix="ios-search" placeholder="输入关键字支持全局搜索"/>
            </div>
            <div class="header-btn-list">
                <Button type="primary" @click="addIsvisible = true">添加用户</Button>
                <Button type="error" @click="deleteAllData">批量删除</Button>
            </div>
            <Modal v-model="addIsvisible" draggable scrollable title="添加用户信息">
                <div class="center-div">
                    <Form ref="formAddUserData" :rules="ruleUserData" :model="formAddUserData">
                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="用户名" prop="username" label-position="top">
                                    <Input v-model="formAddUserData.username" placeholder="用户名"/>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="邮箱地址" prop="email" label-position="top">
                                    <Input v-model="formAddUserData.email" placeholder="邮箱地址"/>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="密码" prop="password" label-position="top">
                                    <Input v-model="formAddUserData.password" placeholder="密码"/>
                                </FormItem>
                            </Col>
                        </Row>

                    </Form>
                </div>
                <div slot="footer">
                    <Button type="text" size="large" @click="addVisible('formAddUserData')">取消</Button>
                    <Button type="primary" size="large" @click="addSubmit('formAddUserData')">提交</Button>
                </div>
            </Modal>

            <div class="domain-card">
                <Card>
                    <Table class="table" border ref="selection" @on-selection-change="showOne" :columns="columns" :data="userList">
                        <template slot-scope="{ row }" slot="name">
                            <strong>{{ row.name }}</strong>
                        </template>
                        <template slot-scope="{ row, index }" slot="action">
                            <Button type="success" size="small" style="margin-right: 2px" @click="edit(userList[index].id)">编辑</Button>
                            <Button type="warning" size="small" style="margin-right: 2px" @click="editPwd(userList[index].id,userList[index].username)">修改密码</Button>
                            <Button type="error" size="small" style="margin-right: 2px" @click="remove(userList[index].id)">删除</Button>

                        </template>
                    </Table>
                    <div style="margin-top: 10px">
                        <Page @on-change="changePage" @on-page-size-change="nowPageSize" :total="pageTotal" show-total show-sizer :page-size="pageNumber" :page-size-opts="pageOpts"/>
                    </div>
                </Card>
            </div>

            <Modal v-model="editIsvisible" draggable scrollable title="修改用户信息">
                <i-switch size="large" v-model="switchUserStatus">
                    <span slot="open">ON</span>
                    <span slot="close">OFF</span>
                </i-switch>
                <div class="center-div">
                    <Form ref="formEditUserData" :rules="ruleUserData" :model="formEditUserData">
                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="用户名" prop="username" label-position="top">
                                    <Input v-model="formEditUserData.username" placeholder="用户名"  :disabled="!switchUserStatus"/>
                                </FormItem>
                            </Col>
                        </Row>

                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="邮箱地址" prop="email" label-position="top">
                                    <Input v-model="formEditUserData.email" placeholder="邮箱地址"  :disabled="!switchUserStatus"/>
                                </FormItem>
                            </Col>
                        </Row>

                    </Form>
                </div>
                <div slot="footer">
                    <Button type="text" size="large" @click="editVisible('formEditUserData')">取消</Button>
                    <Button type="primary" size="large" @click="editSubmit('formEditUserData',formEditUserData.id)">提交</Button>
                </div>
            </Modal>

            <Modal v-model="editPwdIsvisible" draggable scrollable title="修改密码">
                <div class="center-div">
                    <Form ref="formEditUserPwdData" :rules="ruleUserData" :model="formEditUserPwdData">
                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="用户名" label-position="top">
                                    <Input v-model="formEditUserPwdData.username" placeholder="用户名" disabled/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="旧密码" prop="old_password" label-position="top">
                                    <Input v-model="formEditUserPwdData.old_password" placeholder="请输入旧密码"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row :gutter="32">
                            <Col span="24">
                                <FormItem label="新密码" prop="new_password" label-position="top">
                                    <Input v-model="formEditUserPwdData.new_password" placeholder="请输入新密码"/>
                                </FormItem>
                            </Col>
                        </Row>

                    </Form>
                </div>
                <div slot="footer">
                    <Button type="text" size="large" @click="editPwdVisible('formEditUserPwdData')">取消</Button>
                    <Button type="primary" size="large" @click="editPwdSubmit('formEditUserPwdData',uId)">提交</Button>
                </div>
            </Modal>
        </Content>
    </Layout>
</template>

<script>
    export default {
        name: "Management",
        inject: ['reload'],
        data() {
            var ruleMail = (rule, value, callback) => {
                const mailreg = /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/;
                if ((!mailreg.test(value))) {
                    callback(new Error('请输入正确的邮箱地址!'));
                } else {
                    callback();
                }
            };
            var rulePwd = (rule, value, callback) => {
                const reg =/^[\w]{6,64}$/;
                if(value==''||value==undefined||value==null){
                    callback();
                } else {
                    if (!reg.test(value)){
                        callback(new Error('密码仅由英文字母，数字以及下划线组成，长度不小于6位'));
                    } else {
                        callback();
                    }
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
                        title: '用户名',
                        key: 'username',
                        align: 'center',
                        sortable: true,
                    },
                    {
                        title: '邮箱',
                        key: 'email',
                        align: 'center',
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 200,
                        align: 'center',
                    }
                ],
                userList: [],
                uId: undefined,

                formEditUserData: {},
                ruleUserData: {
                    username: [
                        {required: true, message: '用户名不能为空', trigger: 'blur'},
                    ],
                    email: [
                        {required: true, message: '邮箱地址不能为空', trigger: 'blur'},
                        {validator: ruleMail, trigger: 'blur'}
                    ],
                    old_password: [
                        {required: true, message: '旧密码不能为空', trigger: 'blur'},
                        {validator: rulePwd, trigger: 'blur'}
                    ],
                    new_password: [
                        {required: true, message: '新密码不能为空', trigger: 'blur'},
                        {validator: rulePwd, trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'blur'},
                        {validator: rulePwd, trigger: 'blur'}
                    ],
                },

                formAddUserData:{
                    username: '',
                    email: '',
                    password: '',
                },

                formEditUserPwdData: {
                    username: '',
                    old_password: '',
                    new_password: '',
                },

                addIsvisible: false,
                editIsvisible: false,
                editPwdIsvisible: false,
                switchUserStatus: false,

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
                        url: this.$store.state.apiList.userList,
                        method: 'GET',
                        params: {
                            page: this.pageIndex,
                            size: this.pageNumber,
                            token: this.$store.state.token
                        }

                    }).then(function (arg) {
                        that.userList = arg.data.results
                        that.pageTotal = arg.data.count
                    }).catch(function (arg) {
                        console.log('catch', arg)
                    })

                }
            },

            edit(userID) {
                // 发送ajax
                var that = this
                this.$axios.request({
                    url: this.$store.state.apiList.userList + userID + '/',
                    method: 'GET',
                    params: {
                        token: this.$store.state.token
                    }

                }).then(function (arg) {
                    that.formEditUserData = arg.data
                    that.editIsvisible = true
                }).catch(function (arg) {
                    console.log('catch', arg)
                })

            },
            editVisible(name) {
                this.editIsvisible = false
                this.switchUserStatus = false
                this.$refs[name].resetFields();
            },
            editSubmit(name,userID) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('修改用户信息表单校验成功！')
                        // this.$delete(this.formEditPlatformData,'provider_name')
                        var that = this
                        this.$axios.request({
                            url: this.$store.state.apiList.userList + userID + '/',
                            method: 'PUT',
                            params: {
                                token: this.$store.state.token,
                            },
                            data: this.formEditUserData
                        }).then(function (arg) {
                            that.reload()
                            that.$Notice.success({
                                title: '修改用户信息',
                                desc: '修改用户信息成功！'
                            });
                        }).catch(function (arg) {
                            console.log('catch', arg)
                            that.$Notice.error({
                                title: '修改用户信息',
                                desc: '修改用户信息失败！'
                            });
                        })
                    } else {
                        this.$Message.error('修改用户信息表单校验错误！');
                    }
                })
            },

            editPwd(userID,userName) {
                this.uId = userID
                this.formEditUserPwdData.username = userName
                this.editPwdIsvisible = true
            },
            editPwdVisible(name) {
                this.editPwdIsvisible = false
                this.uId = undefined
                this.formEditUserPwdData.username = undefined
                this.$refs[name].resetFields();
            },
            editPwdSubmit(name,userID) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('修改密码信息表单校验成功！')
                        this.formEditUserPwdData.id = userID
                        var that = this
                        this.$axios.request({
                            url: this.$store.state.apiList.userSetPwd,
                            method: 'POST',
                            params: {
                                token: this.$store.state.token,
                            },
                            data: this.formEditUserPwdData
                        }).then(function (arg) {
                            if (arg.data.state_code === 200){
                                that.reload()
                                that.$Notice.success({
                                    title: '修改密码信息',
                                    desc: '修改密码信息成功！'
                                });
                            } else {
                                that.$Notice.error({
                                    title: '修改密码信息',
                                    desc: '修改密码信息失败！'
                                });
                            }

                        }).catch(function (arg) {
                            console.log('catch', arg)
                            that.$Notice.error({
                                title: '修改密码信息',
                                desc: '修改密码信息失败！'
                            });
                        })
                    } else {
                        this.$Message.error('修改密码信息表单校验错误！');
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
                        this.$Message.success('添加用户信息表单校验成功！')
                        var that = this
                        this.$axios.request({
                            url: this.$store.state.apiList.userCreate,
                            method: 'POST',
                            params: {
                                token: this.$store.state.token,
                            },
                            data: this.formAddUserData
                        }).then(function (arg) {
                            if (arg.data.state_code === 200) {
                                that.reload()
                                that.$Notice.success({
                                    title: '添加用户信息',
                                    desc: '添加用户信息成功！'
                                });
                            } else {
                                that.$Notice.error({
                                    title: '错误',
                                    desc: arg.data.msg
                                });
                            }

                        }).catch(function (arg) {
                            console.log('catch', arg)
                            that.$Notice.error({
                                title: '添加用户信息',
                                desc: '添加用户信息失败！'
                            });
                        })
                    } else {
                        this.$Message.error('添加用户信息表单校验错误！');
                    }
                })
            },

            remove(userID) {
                this.$Modal.confirm({
                    title: '删除警告',
                    content: '<p>【友情提示】方法千万种，安全第一条。操作不规范，运维两行泪！</p><p style="color: red;font-weight:bold">是否删除此用户？删除后不可恢复！</p>',
                    onOk: () => {
                        // 发送ajax，删除用户信息
                        var that = this
                        this.$axios.request({
                            url: this.$store.state.apiList.userList + userID + '/',
                            method: 'DELETE',
                            params: {
                                token: this.$store.state.token
                            }

                        }).then(function (arg) {
                            that.$Notice.success({
                                title: '删除用户信息',
                                desc: '删除用户信息成功！'
                            });
                            that.reload()
                        }).catch(function (arg) {
                            that.$Notice.error({
                                title: '删除用户信息',
                                desc: '删除用户信息失败！'
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
                        content: '<p>【友情提示】方法千万种，安全第一条。操作不规范，运维两行泪！</p><p style="color: red;font-weight:bold"><b>是否批量删除用户信息？删除后不可恢复！</b></p>',
                        onOk: () => {
                            for (let user of this.selectData) {
                                // 发送ajax，删除用户信息
                                var that = this
                                this.$axios.request({
                                    url: this.$store.state.apiList.userList + user.id + '/',
                                    method: 'DELETE',
                                    params: {
                                        token: this.$store.state.token
                                    }

                                }).then(function (arg) {
                                    that.reload()
                                    that.$Notice.success({
                                        title: '批量删除用户信息',
                                        desc: '批量删除用户信息成功！'
                                    });
                                }).catch(function (arg) {
                                    that.$Notice.success({
                                        title: '批量删除用户信息',
                                        desc: '批量删除用户信息失败！'
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
