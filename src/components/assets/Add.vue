<template>
    <Modal v-model="visibleStat" fullscreen title="添加主机">
        <Steps :current="current">
            <Step title="添加资产信息" content="添加资产信息"></Step>
            <Step title="添加服务器信息" content="添加服务器信息"></Step>
            <Step title="添加网卡信息" content="添加多块网卡功能，在编辑中提供"></Step>
            <Step title="添加磁盘信息" content="添加多块磁盘功能，在编辑中提供"></Step>
        </Steps>
        <br>
        <br>
        <div :class="{'hidden-div': isAsset}">
            <Tabs type="card">
                <TabPane label="添加资产">
                    <div class="center-div">
                        <Form ref="formAssetData" :rules="ruleAssetData" :model="formAssetData">
                            <Row :gutter="32">
                                <Col span="8">
                                    <FormItem label="当前状态" prop="device_status" label-position="top">
                                        <Select v-model="formAssetData.device_status" placeholder="当前状态">
                                            <Option :value=0>上架</Option>
                                            <Option :value=1>在线</Option>
                                            <Option :value=2>离线</Option>
                                            <Option :value=3>下架</Option>
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span="8">
                                    <FormItem label="服务商" prop="provider" label-position="top">
                                        <Select v-model="formAssetData.provider" placeholder="服务商">
                                            <Option v-for="(item,index) in formProviderData" :value=item.id
                                                    :key="item.id">
                                                {{item.name}}
                                            </Option>
                                        </Select>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row :gutter="32">
                                <Col span="12">
                                    <FormItem label="区域" prop="region" label-position="top">
                                        <Input v-model="formAssetData.region" placeholder="区域"/>
                                    </FormItem>
                                </Col>
                                <Col span="12">
                                    <FormItem label="实例类型" label-position="top">
                                        <Input v-model="formAssetData.modle" placeholder="实例类型"/>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row :gutter="32">
                                <Col span="12">
                                    <FormItem label="机柜位置" label-position="top">
                                        <Input v-model="formAssetData.cabinet" placeholder="机柜位置"/>
                                    </FormItem>
                                </Col>
                                <Col span="12">
                                    <FormItem label="机位序号" label-position="top">
                                        <Input v-model="formAssetData.cabinet_order" placeholder="机位序号"/>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </TabPane>
            </Tabs>
        </div>

        <div :class="{'hidden-div': isServer}">
            <Tabs type="card">
                <TabPane label="添加服务器">
                    <div class="center-div">
                        <Form ref="formServerData" :rules="ruleServerData" :model="formServerData">
                            <Row :gutter="32">
                                <Col span="8">
                                    <FormItem label="主机名" prop="hostname" label-position="top">
                                        <Input v-model="formServerData.hostname" placeholder="主机名"/>
                                    </FormItem>
                                </Col>
                                <Col span="8">
                                    <FormItem label="外网IP" prop="outside_ip" label-position="top">
                                        <Input v-model="formServerData.outside_ip" placeholder="外网IP"/>
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row :gutter="32">
                                <Col span="8">
                                    <FormItem label="管理IP" prop="manager_ip" label-position="top">
                                        <Input v-model="formServerData.manager_ip" placeholder="管理IP"/>
                                    </FormItem>
                                </Col>
                                <Col span="4">
                                    <FormItem label="到期时间" label-position="top">
                                        <DatePicker type="date" @on-change="formatDate" format="yyyy-MM-dd" placeholder="选择日期" v-model="formServerData.expire_date"/>
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row :gutter="32">
                                <Col span="8">
                                    <FormItem label="操作系统" prop="os" label-position="top">
                                        <Input v-model="formServerData.os" placeholder="操作系统"/>
                                    </FormItem>
                                </Col>
                                <Col span="8">
                                    <FormItem label="操作系统版本" prop="os_version" label-position="top">
                                        <Input v-model="formServerData.os_version" placeholder="操作系统版本"/>
                                    </FormItem>
                                </Col>
                                <Col span="8">
                                    <FormItem label="操作系统类型" prop="os_type" label-position="top">
                                        <Input v-model="formServerData.os_type" placeholder="操作系统类型"/>
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row :gutter="32">
                                <Col span="8">
                                    <FormItem label="CPU型号" prop="cpu_model" label-position="top">
                                        <Input v-model="formServerData.cpu_model" placeholder="CPU型号"/>
                                    </FormItem>
                                </Col>
                                <Col span="8">
                                    <FormItem label="CPU核心" prop="cpu_core" label-position="top">
                                        <Input v-model="formServerData.cpu_core" placeholder="CPU核心"/>
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row :gutter="32">
                                <Col span="8">
                                    <FormItem label="内存" prop="memory_size" label-position="top">
                                        <Input v-model="formServerData.memory_size" placeholder="内存"/>
                                    </FormItem>
                                </Col>
                                <Col span="8">
                                    <FormItem label="Swap内存" label-position="top">
                                        <Input v-model="formServerData.swap_size" placeholder="Swap内存"/>
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row :gutter="32">
                                <Col span="8">
                                    <FormItem label="内核版本" prop="kernel_version" label-position="top">
                                        <Input v-model="formServerData.kernel_version" placeholder="内核版本"/>
                                    </FormItem>
                                </Col>
                                <Col span="12">
                                    <FormItem label="描述信息" label-position="top">
                                        <Input v-model="formServerData.descriptions" type="textarea"
                                               :autosize="{minRows: 2,maxRows: 5}" placeholder="描述信息"/>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </TabPane>
            </Tabs>
        </div>

        <div :class="{'hidden-div': isNetwork}">
            <Tabs type="card">
                <TabPane label="添加网卡">
                    <div class="center-div">
                        <Form ref="formNicData" :rules="ruleNicData" :model="formNicData">
                            <Row :gutter="32">
                                <Col span="12">
                                    <FormItem label="网卡名称" prop="name" label-position="top">
                                        <Input v-model="formNicData.name" placeholder="网卡名称"/>
                                    </FormItem>
                                </Col>
                                <Col span="12">
                                    <FormItem label="带宽" label-position="top">
                                        <Input v-model="formNicData.bandwidth" placeholder="带宽"/>
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row :gutter="32">
                                <Col span="12">
                                    <FormItem label="IP地址" prop="ipaddr" label-position="top">
                                        <Input v-model="formNicData.ipaddr" placeholder="IP地址"/>
                                    </FormItem>
                                </Col>
                                <Col span="12">
                                    <FormItem label="子网掩码" prop="netmask" label-position="top">
                                        <Input v-model="formNicData.netmask" placeholder="子网掩码"/>
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row :gutter="32">
                                <Col span="12">
                                    <FormItem label="物理地址" label-position="top">
                                        <Input v-model="formNicData.hwaddr" placeholder="物理地址"/>
                                    </FormItem>
                                </Col>
                                <Col span="12">
                                    <FormItem label="网卡速率" label-position="top">
                                        <Input v-model="formNicData.speed" placeholder="网卡速率"/>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </TabPane>
            </Tabs>
        </div>

        <div :class="{'hidden-div': isDisk}">
            <Tabs type="card">
                <TabPane label="添加磁盘">
                    <div class="center-div">
                        <Form ref="formDiskData" :rules="ruleDiskData" :model="formDiskData">
                            <Row :gutter="32">
                                <Col span="12">
                                    <FormItem label="磁盘名称" prop="name" label-position="top">
                                        <Input v-model="formDiskData.name" placeholder="磁盘名称"/>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row :gutter="32">
                                <Col span="12">
                                    <FormItem label="磁盘容量" prop="size" label-position="top">
                                        <Input v-model="formDiskData.size" placeholder="磁盘容量"/>
                                    </FormItem>
                                </Col>
                            </Row>

                        </Form>
                    </div>
                </TabPane>
            </Tabs>
        </div>
        <br>
        <br>
        <Button type="primary" :disabled="backModel" @click="back">上一步</Button>
        <Button type="primary" @click="next" :disabled="nextModel">校验信息</Button>
        <div slot="footer">
            <Button type="text" size="large" @click="addVisible">取消</Button>
            <Button type="primary" size="large" @click="addSubmit"  :disabled="submitBtnStatus">提交</Button>
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
                if ((!ipreg.test(value) && value !== '' && value !== null)) {
                    callback(new Error('请输入正确的网络地址'));
                } else {
                    callback();
                }
            }
            var ruleNum = (rule, value, callback) => {
                const numreg = /^[1-9]\d*$/;
                if ((!numreg.test(value))) {
                    callback(new Error('只能是数字类型'));
                } else {
                    callback();
                }
            }
            return {
                current: 0,
                submitBtnStatus: true,
                backModel: true,
                nextModel: false,
                isAsset: false,
                isServer: true,
                isNetwork: true,
                isDisk: true,
                asset_id:'',
                server_id:0,
                formAssetData: {
                    modle: '',
                    region: '',
                    cabinet: null,
                    cabinet_order: null,
                    device_status: '',
                    provider: '',
                },
                ruleAssetData: {
                    region: [
                        {required: true, message: '区域不能为空', trigger: 'blur'}
                    ],
                    device_status: [
                        {required: true, message: '设备状态选项不能为空'}
                    ],
                    provider: [
                        {required: true, message: '服务商选项不能为空'},
                    ],

                },
                formProviderData: [],

                formServerData: {
                    asset: '',
                    hostname: '',
                    outside_ip: '',
                    manager_ip: null,
                    cpu_model: '',
                    cpu_core: '',
                    memory_size: '',
                    swap_size: null,
                    os: '',
                    os_version: '',
                    os_type: '',
                    kernel_version: '',
                    descriptions: '',
                    expire_date: null,
                },
                ruleServerData: {
                    hostname: [
                        {required: true, message: '主机名不能为空', trigger: 'blur'}
                    ],
                    outside_ip: [
                        {required: true, message: '外网IP不能为空', trigger: 'blur'},
                        {validator: ruleIpaddr, trigger: 'blur'}
                    ],
                    manager_ip: [
                        {required: false, trigger: 'blur'},
                        {validator: ruleIpaddr, trigger: 'blur'}
                    ],
                    cpu_model: [
                        {required: true, message: 'CPU型号不能为空', trigger: 'blur'}
                    ],
                    cpu_core: [
                        {required: true, message: 'CPU核心不能为空', trigger: 'blur'},
                        {validator: ruleNum, trigger: 'blur'}
                    ],
                    memory_size: [
                        {required: true, message: '内存不能为空', trigger: 'blur'}
                    ],
                    os: [
                        {required: true, message: '操作系统不能为空', trigger: 'blur'}
                    ],
                    os_version: [
                        {required: true, message: '操作系统版本不能为空', trigger: 'blur'}
                    ],
                    os_type: [
                        {required: true, message: '操作系统类型不能为空', trigger: 'blur'}
                    ],
                    kernel_version: [
                        {required: true, message: '内核版本不能为空', trigger: 'blur'}
                    ],
                },

                formNicData: {
                    name: '',
                    ipaddr: '',
                    netmask: null,
                    hwaddr: null,
                    speed: null,
                    bandwidth: null,
                    server: '',
                },
                ruleNicData: {
                    name: [
                        {required: true, message: '网卡名称不能为空', trigger: 'blur'}
                    ],
                    ipaddr: [
                        {required: true, message: 'IP地址不能为空', trigger: 'blur'},
                        {validator: ruleIpaddr, trigger: 'blur'}
                    ],
                    netmask: [
                        {required: false, trigger: 'blur'},
                        {validator: ruleIpaddr, trigger: 'blur'}
                    ],
                },

                formDiskData: {
                    name: '',
                    size: '',
                    server: '',
                },
                ruleDiskData: {
                    name: [
                        {required: true, message: '磁盘名称不能为空', trigger: 'blur'}
                    ],
                    size: [
                        {required: true, message: '磁盘容量不能为空', trigger: 'blur'}
                    ],
                },


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
            formatDate(date) {
                this.formServerData.expire_date = date
            },
            addVisible() {
                this.$emit('addVisible', false);
            },
            initProviderInfo() {
                // 发送ajax请求，获取providerinfo表信息
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

            back() {
                if (this.current === 1) {
                    this.current -= 1;
                    this.isAsset = false
                    this.isServer = true
                    this.isNetwork = true
                    this.isDisk = true
                    this.backModel = true
                    this.nextModel = false

                } else if (this.current === 2) {
                    this.current -= 1;
                    this.isAsset = true
                    this.isServer = false
                    this.isNetwork = true
                    this.isDisk = true
                    this.nextModel = false

                } else if (this.current === 3) {
                    this.current -= 1;
                    this.isAsset = true
                    this.isServer = true
                    this.isNetwork = false
                    this.isDisk = true
                    this.nextModel = false
                }
            },
            next() {
                if (this.current === 0) {
                    this.$refs['formAssetData'].validate((valid) => {
                        if (valid) {
                            this.isAsset = true
                            this.isServer = false
                            this.isNetwork = true
                            this.isDisk = true
                            this.backModel = false
                            this.nextModel = false
                            this.current += 1;
                            this.$Message.success('资产信息校验成功！')
                        } else {
                            this.$Message.error('添加资产信息表单校验错误！');
                        }
                    })

                } else if (this.current === 1) {
                    this.$refs['formServerData'].validate((valid) => {
                        if (valid) {
                            this.isServer = true
                            this.isAsset = true
                            this.isNetwork = false
                            this.isDisk = true
                            this.backModel = false
                            this.nextModel = false
                            this.current += 1;
                            this.$Message.success('服务器信息校验成功！')
                        } else {
                            this.$Message.error('添加服务器信息表单校验错误！');
                        }
                    })

                } else if (this.current === 2) {
                    this.$refs['formNicData'].validate((valid) => {
                        if (valid) {
                            this.isServer = true
                            this.isAsset = true
                            this.isNetwork = true
                            this.isDisk = false
                            this.backModel = false
                            this.nextModel = false
                            this.current += 1;
                            this.$Message.success('网卡信息校验成功！')
                        } else {
                            this.$Message.error('添加服务器信息表单校验错误！');
                        }
                    })

                } else {
                    this.$refs['formDiskData'].validate((valid) => {
                        if (valid) {
                            this.backModel = false
                            this.nextModel = true
                            // this.current += 1;
                            this.$Message.success('磁盘信息校验成功！请提交信息。')
                            this.submitBtnStatus = false
                        } else {
                            this.$Message.error('添加服务器信息表单校验错误！');
                        }
                    })

                }

            },

            addSubmit() {
                // 发送ajax请求，添加资产表信息
                var that = this
                this.$axios.request({
                    url: this.$store.state.apiList.assetUpdata,
                    method: 'POST',
                    params: {
                        token: this.$store.state.token,
                    },
                    data: that.formAssetData
                }).then(function (arg) {
                    that.addServerSubmit(arg.data.id)
                }).catch(function (arg) {
                    console.log('catch', arg)
                })
            },
            addServerSubmit(assetId) {
                // 发送ajax请求，添加服务器表信息
                this.formServerData.asset = assetId
                var that = this
                this.$axios.request({
                    url: this.$store.state.apiList.serverList,
                    method: 'POST',
                    params: {
                        token: this.$store.state.token,
                    },
                    data: that.formServerData
                }).then(function (arg) {
                    that.addNicSubmit(arg.data.id)
                    that.addDiskSubmit(arg.data.id)
                }).catch(function (arg) {
                    console.log('catch', arg)
                })
            },
            addNicSubmit(serverId) {
                // 发送ajax请求，添加网卡表信息
                this.formNicData.server = serverId
                var that = this
                this.$axios.request({
                    url: this.$store.state.apiList.nicList,
                    method: 'POST',
                    params: {
                        token: this.$store.state.token,
                    },
                    data: that.formNicData
                }).then(function (arg) {

                }).catch(function (arg) {
                    console.log('catch', arg)
                })
            },
            addDiskSubmit(serverId) {
                // 发送ajax请求，添加磁盘表信息
                this.formDiskData.server = serverId
                var that = this
                this.$axios.request({
                    url: this.$store.state.apiList.diskList,
                    method: 'POST',
                    params: {
                        token: this.$store.state.token,
                    },
                    data: that.formDiskData
                }).then(function (arg) {
                    that.reload()
                    that.$Message.success('添加资产成功！');

                }).catch(function (arg) {
                    console.log('catch', arg)
                })
            },

        }
    }
</script>

<style scoped>
    .hidden-div {
        display: none;
    }

    .center-div {
        margin: 0 auto;
        width: 60%;
    }
</style>
