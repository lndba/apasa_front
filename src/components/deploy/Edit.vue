<template>
    <Drawer
        title="编辑所有信息"
        v-model="visibleStat"
        width="720"
        :closable="false"
        :mask-closable="false"
        :styles="styles"
    >
        <div class="demo-drawer-profile">
            <!--编辑资产信息表单-->
            <p :style="pStyle">编辑应用部署</p>
            <i-switch size="large" v-model="switchAppStatus">
                <span slot="open">ON</span>
                <span slot="close">OFF</span>
            </i-switch>

            <Form ref="formAppData" :rules="ruleAppData" :model="formAppData">
                <Row :gutter="32">
                    <Col span="10">
                        <FormItem label="所属业务" label-position="top">
                            <Select v-model="formAppData.business" placeholder="所属业务"
                                    :disabled="!switchAppStatus">
                                <Option v-for="(item,index) in formBusinessData" :value=item.id :key="item.id">
                                    {{item.name}}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="10">
                        <FormItem label="应用名称" prop="name" label-position="top">
                            <Input v-model="formAppData.name" placeholder="应用名称" :disabled="!switchAppStatus"/>
                        </FormItem>
                    </Col>
                    <Col span="10">
                        <FormItem label="用途" prop="usage" label-position="top">
                            <Input v-model="formAppData.usage" placeholder="用途" :disabled="!switchAppStatus"/>
                        </FormItem>
                    </Col>
                    <Col span="4">
                        <FormItem label="端口" prop="port" label-position="top">
                            <Input v-model="formAppData.port" placeholder="端口" :disabled="!switchAppStatus"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="12">
                        <FormItem label="外网IP" prop="outside_ip" label-position="top">
                            <Input v-model="formAppData.outside_ip" placeholder="外网IP" :disabled="!switchAppStatus"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="内网IP" prop="inside_ip" label-position="top">
                            <Input v-model="formAppData.inside_ip" placeholder="内网IP" :disabled="!switchAppStatus"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="20">
                    <FormItem label="安装路径" prop="path_install" label-position="top">
                        <Input v-model="formAppData.path_install" placeholder="安装路径" :disabled="!switchAppStatus"/>
                    </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="20">
                    <FormItem label="配置路径" prop="path_configure" label-position="top">
                        <Input v-model="formAppData.path_configure" placeholder="配置路径" :disabled="!switchAppStatus"/>
                    </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="20">
                    <FormItem label="数据路径" label-position="top">
                        <Input v-model="formAppData.path_data" placeholder="数据路径" :disabled="!switchAppStatus"/>
                    </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="20">
                    <FormItem label="日志路径" label-position="top">
                        <Input v-model="formAppData.path_log" placeholder="日志路径" :disabled="!switchAppStatus"/>
                    </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="20">
                        <FormItem label="描述信息" label-position="top">
                            <Input v-model="formAppData.descriptions" type="textarea"
                                   :autosize="{minRows: 2,maxRows: 5}" placeholder="描述信息"
                                   :disabled="!switchAppStatus"/>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <div class="btn-drawer-footer">
                <Button style="margin-right: 8px" @click="switchAppStatus=false" :disabled="!switchAppStatus">
                    关闭修改
                </Button>
                <Button type="primary" @click="appSubmit('formAppData',formAppData.id)"
                        :disabled="!switchAppStatus">提交
                </Button>
            </div>

        </div>

        <div class="demo-drawer-footer">
            <Button @click="editVisible">关闭编辑信息</Button>
        </div>
    </Drawer>
</template>
<script>
    export default {
        // 刷新页面参数，在函数中调用this.reload()
        name: "Edit",
        inject: ['reload'],

        data() {
            var ruleIpaddr = (rule, value, callback) => {
                const ipreg = /^(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)$/;
                    if ((!ipreg.test(value) && value !== '' && value !== null )) {
                        callback(new Error('请输入正确的网络地址'));
                    }else {
                        callback();
                    }
            }
            var ruleNum = (rule, value, callback) => {
                const numreg = /^[0-9]{1,5}$/;
                if (!value) {
                    callback(new Error('端口不能为空'));
                }else if ((!numreg.test(value) || value > 65535)) {
                    callback(new Error('只能是数字类型并且端口不能超过65535'));
                } else {
                    callback();
                }
            }
            return {
                switchAppStatus: false,

                styles: {
                    height: 'calc(100% - 55px)',
                    overflow: 'auto',
                    paddingBottom: '53px',
                    position: 'static'
                },
                pStyle: {
                    fontSize: '16px',
                    color: 'rgba(0,0,0,0.85)',
                    lineHeight: '24px',
                    display: 'block',
                    marginBottom: '16px'
                },
                formBusinessData: [],
                formAppData: {},
                ruleAppData: {
                    name: [
                        {required: true, message: '应用名称不能为空', trigger: 'blur'},
                    ],
                    outside_ip: [
                        {required: false, trigger: 'blur'},
                        {validator: ruleIpaddr,trigger: 'blur'}
                    ],
                    inside_ip: [
                        {required: false, trigger: 'blur'},
                        {validator: ruleIpaddr,trigger: 'blur'}
                    ],
                    usage: [
                        {required: true, message: '用途不能为空', trigger: 'blur'},
                    ],
                    port: [
                        {required:true,validator: ruleNum, trigger: 'blur'}
                    ],
                    path_install: [
                        {required: true, message: '安装路径不能为空', trigger: 'blur'},
                    ],
                    path_configure: [
                        {required: true, message: '配置路径不能为空', trigger: 'blur'},
                    ],

                },
                business_id: 0,

            }
        },
        props: {
            isvisible: Boolean,
        },
        computed: {
            visibleStat: {
                get() {
                    return this.isvisible
                },
                set() {
                    return this.isvisible
                }
            }
        },
        methods: {
            editVisible() {
                this.switchAppStatus = false;
                this.reload()
                this.$emit('editVisible', false);

            },
            initApp(app_id) {
                // 发送ajax请求，获取app表信息
                var that = this
                this.$axios.request({
                    url: this.$store.state.apiList.appList + app_id + '/',
                    method: 'GET',
                    params: {
                        token: this.$store.state.token,
                    }

                }).then(function (arg) {
                    that.formAppData = arg.data
                    that.business_id = arg.data.business
                    that.initBusiness()
                }).catch(function (arg) {
                    console.log('catch', arg)
                })
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

            appSubmit(name,appId) {
                this.$refs[name].validate((valid) => {

                    if (valid) {
                        this.submitAppData(this.formAppData, appId)
                    } else {
                        this.$Message.error('提交失败，表单信息校验错误！');
                        console.log(this.formAppData)
                    }
                })
            },
            submitAppData(data, appId) {
                // 发送ajax请求，提交修改的数据
                var that = this
                this.$axios.request({
                    url: this.$store.state.apiList.appList + appId + '/',
                    method: 'PUT',
                    params: {
                        token: this.$store.state.token,
                    },
                    data: data,

                }).then(function (arg) {
                    that.switchAppStatus = false
                    that.$Message.success('恭喜您，应用部署信息修改成功!');

                }).catch(function (arg) {
                    that.$Message.error('可惜了，应用部署信息修改失败，响应错误代码：' + arg.status);
                    console.log('catch', arg)
                })
            },
        }
    }
</script>
<style scoped>
    .demo-drawer-footer {
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        border-top: 1px solid #e8e8e8;
        padding: 10px 16px;
        text-align: center;
        background: #fff;
    }

    .btn-drawer-footer {
        width: 100%;
        border-top: 1px solid #e8e8e8;
        padding: 10px 16px;
        text-align: right;
        background: #fff;
    }

    .demo-drawer-profile {
        font-size: 14px;
        margin-bottom: 12px;
    }

</style>
