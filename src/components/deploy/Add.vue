<template>
    <Modal v-model="visibleStat" ok-text="提交" fullscreen title="添加应用部署信息">
        <div class="center-div">
            <Form ref="formAppData" :rules="ruleAppData" :model="formAppData">
                <Row :gutter="32">
                    <Col span="10">
                        <FormItem label="所属业务" prop="business" label-position="top">
                            <Select v-model="formAppData.business" placeholder="所属业务">
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
                            <Input v-model="formAppData.name" placeholder="应用名称"/>
                        </FormItem>
                    </Col>
                    <Col span="10">
                        <FormItem label="用途" prop="usage" label-position="top">
                            <Input v-model="formAppData.usage" placeholder="用途"/>
                        </FormItem>
                    </Col>
                    <Col span="4">
                        <FormItem label="端口" prop="port" label-position="top">
                            <Input v-model="formAppData.port" placeholder="端口"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="12">
                        <FormItem label="外网IP" prop="outside_ip" label-position="top">
                            <Input v-model="formAppData.outside_ip" placeholder="外网IP"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="内网IP" prop="inside_ip" label-position="top">
                            <Input v-model="formAppData.inside_ip" placeholder="内网IP"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="20">
                        <FormItem label="安装路径" prop="path_install" label-position="top">
                            <Input v-model="formAppData.path_install" placeholder="安装路径"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="20">
                        <FormItem label="配置路径" prop="path_configure" label-position="top">
                            <Input v-model="formAppData.path_configure" placeholder="配置路径"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="20">
                        <FormItem label="数据路径" label-position="top">
                            <Input v-model="formAppData.path_data" placeholder="数据路径"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="20">
                        <FormItem label="日志路径" label-position="top">
                            <Input v-model="formAppData.path_log" placeholder="日志路径"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="20">
                        <FormItem label="描述信息" label-position="top">
                            <Input v-model="formAppData.descriptions" type="textarea"
                                   :autosize="{minRows: 2,maxRows: 5}" placeholder="描述信息"/>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </div>
        <div slot="footer">
            <Button type="text" size="large" @click="addVisible('formAppData')">取消</Button>
            <Button type="primary" size="large" @click="addSubmit">确定</Button>
        </div>
    </Modal>
</template>

<script>
    export default {
        name: "Add",
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
                formAppData:{
                    name: '',
                    usage: '',
                    port: '',
                    outside_ip: '',
                    inside_ip: '',
                    path_install: '',
                    path_configure: '',
                    path_data: '',
                    path_log: '',
                    descriptions: '',
                    business: '',
                },
                ruleAppData:{
                    business: [
                        {required: true, message: '所属业务不能为空'}
                    ],
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
                formBusinessData:[],
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
            addVisible(name) {
                this.$refs[name].resetFields();
                this.$emit('addVisible', false);
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

            addSubmit() {
                // 发送ajax请求，添加应用部署表信息
                this.$refs['formAppData'].validate((valid) => {
                    if (valid) {
                        this.$Message.success('添加资产信息表单校验成功！')
                        var that = this
                        this.$axios.request({
                            url: this.$store.state.apiList.appList,
                            method: 'POST',
                            params: {
                                token: this.$store.state.token,
                            },
                            data: that.formAppData
                        }).then(function (arg) {
                            that.reload()
                            that.$Message.success('添加应用部署成功！');
                        }).catch(function (arg) {
                            console.log('catch', arg)
                            that.$Message.error('添加应用部署失败！');
                        })
                    } else {
                        this.$Message.error('添加资产信息表单校验错误！');
                    }
                })

            },

        }
    }
</script>

<style scoped>
    .center-div {
        margin: 0 auto;
        width: 60%;
    }
</style>
