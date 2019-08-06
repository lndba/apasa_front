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
            <p :style="pStyle">编辑资产信息</p>
            <i-switch size="large" v-model="switchAssetStatus">
                <span slot="open">ON</span>
                <span slot="close">OFF</span>
            </i-switch>
            <Form ref="formAssetData" :rules="ruleAssetData" :model="formAssetData">
                <Row :gutter="32">
                    <Col span="12">
                        <FormItem label="当前状态" label-position="top">
                            <Select v-model="formAssetData.device_status" placeholder="当前状态"
                                    :disabled="!switchAssetStatus">
                                <Option :value=0>上架</Option>
                                <Option :value=1>在线</Option>
                                <Option :value=2>离线</Option>
                                <Option :value=3>下架</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="服务商" label-position="top">
                            <Select v-model="formAssetData.provider" placeholder="服务商"
                                    :disabled="!switchAssetStatus">
                                <Option v-for="(item,index) in formProviderData" :value=item.id :key="item.id">
                                    {{item.name}}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="12">
                        <FormItem label="区域" label-position="top" prop="region">
                            <Input v-model="formAssetData.region" placeholder="区域" :disabled="!switchAssetStatus"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="实例类型" label-position="top">
                            <Input v-model="formAssetData.modle" placeholder="实例类型"
                                   :disabled="!switchAssetStatus"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="12">
                        <FormItem label="机柜位置" label-position="top">
                            <Input v-model="formAssetData.cabinet" placeholder="机柜位置"
                                   :disabled="!switchAssetStatus"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="机位序号" label-position="top">
                            <Input v-model="formAssetData.cabinet_order" placeholder="机位序号"
                                   :disabled="!switchAssetStatus"/>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <div class="btn-drawer-footer">
                <Button style="margin-right: 8px" @click="switchAssetStatus=false" :disabled="!switchAssetStatus">
                    关闭修改
                </Button>
                <Button type="primary" @click="assetSubmit('formAssetData',formAssetData.id)"
                        :disabled="!switchAssetStatus">提交
                </Button>
            </div>

            <!--编辑服务器信息表单-->
            <p :style="pStyle">编辑服务器信息</p>
            <i-switch size="large" v-model="switchServerStatus">
                <span slot="open">ON</span>
                <span slot="close">OFF</span>
            </i-switch>
            <Form ref="formServerData" :rules="ruleServerData" :model="formServerData">
                <Row :gutter="32">
                    <Col span="12">
                        <FormItem label="主机名" prop="hostname" label-position="top">
                            <Input v-model="formServerData.hostname" placeholder="主机名" :disabled="!switchServerStatus"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="外网IP" prop="outside_ip" label-position="top">
                            <Input v-model="formServerData.outside_ip" placeholder="外网IP"
                                   :disabled="!switchServerStatus"/>
                        </FormItem>
                    </Col>
                </Row>

                <Row :gutter="32">
                    <Col span="12">
                        <FormItem label="管理IP" prop="manager_ip" label-position="top">
                            <Input v-model="formServerData.manager_ip" placeholder="管理IP"
                                   :disabled="!switchServerStatus"/>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="到期时间" label-position="top">
                            <DatePicker type="date" @on-change="formServerData.expire_date=$event" format="yyyy-MM-dd" placeholder="选择日期" :value="formServerData.expire_date" :disabled="!switchServerStatus" />
                        </FormItem>
                    </Col>
                </Row>

                <Row :gutter="32">
                    <Col span="8">
                        <FormItem label="操作系统" prop="os" label-position="top">
                            <Input v-model="formServerData.os" placeholder="操作系统"
                                   :disabled="!switchServerStatus"/>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="操作系统版本" prop="os_version" label-position="top">
                            <Input v-model="formServerData.os_version" placeholder="操作系统版本"
                                   :disabled="!switchServerStatus"/>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="操作系统类型" prop="os_type" label-position="top">
                            <Input v-model="formServerData.os_type" placeholder="操作系统类型"
                                   :disabled="!switchServerStatus"/>
                        </FormItem>
                    </Col>
                </Row>

                <Row :gutter="32">
                    <Col span="12">
                        <FormItem label="CPU型号" prop="cpu_model" label-position="top">
                            <Input v-model="formServerData.cpu_model" placeholder="CPU型号"
                                   :disabled="!switchServerStatus"/>
                        </FormItem>
                    </Col>
                    <Col span="4">
                        <FormItem label="CPU核心" label-position="top">
                            <InputNumber :max="100" :min="1" v-model="formServerData.cpu_core"
                                         :disabled="!switchServerStatus"/>
                        </FormItem>
                    </Col>
                </Row>

                <Row :gutter="32">
                    <Col span="12">
                        <FormItem label="内存" prop="memory_size" label-position="top">
                            <Input v-model="formServerData.memory_size" placeholder="内存"
                                   :disabled="!switchServerStatus"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="Swap内存" label-position="top">
                            <Input v-model="formServerData.swap_size" placeholder="Swap内存"
                                   :disabled="!switchServerStatus"/>
                        </FormItem>
                    </Col>
                </Row>

                <Row :gutter="32">
                    <Col span="12">
                        <FormItem label="内核版本" prop="kernel_version" label-position="top">
                            <Input v-model="formServerData.kernel_version" placeholder="内核版本"
                                   :disabled="!switchServerStatus"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="描述信息" label-position="top">
                            <Input v-model="formServerData.descriptions" type="textarea"
                                   :autosize="{minRows: 2,maxRows: 5}" placeholder="描述信息"
                                   :disabled="!switchServerStatus"/>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <div class="btn-drawer-footer">
                <Button style="margin-right: 8px" @click="switchServerStatus=false" :disabled="!switchServerStatus">
                    关闭修改
                </Button>
                <Button type="primary" @click="serverSubmit('formServerData',formServerData.id)"
                        :disabled="!switchServerStatus">提交
                </Button>
            </div>

            <!--编辑网卡信息表单-->
            <!--在编辑中添加网卡-->
            <div>
                <p :style="pStyle">
                    编辑网卡信息
                    <Button type="primary" size="small" @click="addNetwork(formServerData.id)" :disabled="!switchNetworkStatus">
                        添加网卡
                    </Button>
                </p>
                <Modal
                    v-model="modalNicStatus"
                    draggable scrollable
                    title="添加网卡"
                    @on-ok="addNicSubmit('formAddNicData')">
                    <!--@on-cancel="cancel">-->
                    <Form ref="formAddNicData" :rules="ruleAddNicData" :model="formAddNicData">
                        <FormItem label="网卡名称" prop="name" label-position="top">
                            <Input v-model="formAddNicData.name" placeholder="网卡名称"/>
                        </FormItem>
                        <FormItem label="IP地址" prop="ipaddr" label-position="top">
                            <Input v-model="formAddNicData.ipaddr" placeholder="IP地址"/>
                        </FormItem>
                        <FormItem label="子网掩码" prop="netmask" label-position="top">
                            <Input v-model="formAddNicData.netmask" placeholder="子网掩码"/>
                        </FormItem>
                        <FormItem label="物理地址" label-position="top">
                            <Input v-model="formAddNicData.hwaddr" placeholder="物理地址"/>
                        </FormItem>
                        <FormItem label="网卡速率" label-position="top">
                            <Input v-model="formAddNicData.speed" placeholder="网卡速率"/>
                        </FormItem>
                        <FormItem label="带宽" label-position="top">
                            <Input v-model="formAddNicData.bandwidth" placeholder="带宽"/>
                        </FormItem>
                        <FormItem label-position="top" style="display: none">
                            <Input v-model="formAddNicData.server" style="display: none"/>
                        </FormItem>
                    </Form>
                </Modal>

            </div>

            <i-switch size="large" v-model="switchNetworkStatus">
                <span slot="open">ON</span>
                <span slot="close">OFF</span>
            </i-switch>
            <!--显示编辑网卡信息-->
            <div v-for="(item,index) in formNicData">
                <br>
                <div>
                    <p style="display: inline-block">
                        【网卡{{index+1}}】
                    </p>
                    <Button type="error" size="small" @click="deleteNic(item.id,index)" :disabled="!switchNetworkStatus">
                        删除
                    </Button>
                </div>
                <Form ref="formNicData[index]" :rules="ruleAddNicData" :model="formNicData[index]">
                    <Row :gutter="32">
                        <Col span="12">
                            <FormItem label="网卡名称" prop="name" label-position="top">
                                <Input v-model="item.name" placeholder="网卡名称" :disabled="!switchNetworkStatus"/>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="带宽" label-position="top">
                                <Input v-model="item.bandwidth" placeholder="带宽" :disabled="!switchNetworkStatus"/>
                            </FormItem>
                        </Col>
                    </Row>

                    <Row :gutter="32">
                        <Col span="12">
                            <FormItem label="IP地址" prop="ipaddr" label-position="top">
                                <Input v-model="item.ipaddr" placeholder="IP地址" :disabled="!switchNetworkStatus"/>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="子网掩码" prop="netmask" label-position="top">
                                <Input v-model="item.netmask" placeholder="子网掩码" :disabled="!switchNetworkStatus"/>
                            </FormItem>
                        </Col>
                    </Row>

                    <Row :gutter="32">
                        <Col span="12">
                            <FormItem label="物理地址" label-position="top">
                                <Input v-model="item.hwaddr" placeholder="物理地址" :disabled="!switchNetworkStatus"/>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="网卡速率" label-position="top">
                                <Input v-model="item.speed" placeholder="网卡速率" :disabled="!switchNetworkStatus"/>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div class="btn-drawer-footer">
                <Button style="margin-right: 8px" @click="switchNetworkStatus=false" :disabled="!switchNetworkStatus">
                    关闭修改
                </Button>
                <Button type="primary" @click="networkSubmit(formNicData)"
                        :disabled="!switchNetworkStatus">提交
                </Button>
            </div>

            <!--编辑磁盘信息表单-->
            <!--在编辑中添加磁盘-->
            <div>
                <p :style="pStyle">编辑磁盘信息
                    <Button type="primary" size="small" @click="addDisk(formServerData.id)" :disabled="!switchDiskStatus">
                        添加磁盘
                    </Button>
                </p>
                <Modal
                    v-model="modalDiskStatus"
                    draggable scrollable
                    title="添加磁盘"
                    @on-ok="addDiskSubmit('formAddDiskData')">
                    <Form ref="formAddDiskData" :rules="ruleAddDiskData" :model="formAddDiskData">
                        <FormItem label="磁盘名称" prop="name" label-position="top">
                            <Input v-model="formAddDiskData.name" placeholder="磁盘名称"/>
                        </FormItem>
                        <FormItem label="磁盘容量" prop="size" label-position="top">
                            <Input v-model="formAddDiskData.size" placeholder="磁盘容量"/>
                        </FormItem>
                        <FormItem label-position="top" style="display: none">
                            <Input v-model="formAddDiskData.server" style="display: none"/>
                        </FormItem>
                    </Form>
                </Modal>
            </div>
            <i-switch size="large" v-model="switchDiskStatus">
                <span slot="open">ON</span>
                <span slot="close">OFF</span>
            </i-switch>
            <!--显示编辑磁盘信息-->
            <div v-for="(item,index) in formDiskData">
                <br>
                <div>
                    <p style="display: inline-block">
                        【磁盘{{index+1}}】
                        <Button type="error" size="small" @click="deleteDisk(item.id,index)" :disabled="!switchDiskStatus">
                            删除
                        </Button>
                    </p>
                </div>
                <Form ref="formDiskData[index]" :model="formDiskData[index]">
                    <Row :gutter="32">
                        <Col span="12">
                            <FormItem label="磁盘名称" label-position="top">
                                <Input v-model="item.name" placeholder="磁盘名称" :disabled="!switchDiskStatus"/>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="磁盘容量" label-position="top">
                                <Input v-model="item.size" placeholder="磁盘容量" :disabled="!switchDiskStatus"/>
                            </FormItem>
                        </Col>
                    </Row>

                </Form>
            </div>
            <div class="btn-drawer-footer">
                <Button style="margin-right: 8px" @click="switchDiskStatus=false" :disabled="!switchDiskStatus">
                    关闭修改
                </Button>
                <Button type="primary" @click="diskSubmit(formDiskData)"
                        :disabled="!switchDiskStatus">提交
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
            return {
                switchAssetStatus: false,
                switchServerStatus: false,
                switchNetworkStatus: false,
                switchDiskStatus: false,
                modalNicStatus: false,
                modalDiskStatus: false,

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
                formAssetData: {},
                ruleAssetData: {
                    region: [
                        {required: true, message: '区域字段不能为空', trigger: 'blur'}
                    ],
                },
                formProviderData: [],
                provider_id: 0,

                formServerData: {},
                ruleServerData: {
                    hostname: [
                        {required: true, message: '主机名不能为空', trigger: 'blur'}
                    ],
                    outside_ip: [
                        {required: true, message: '外网IP不能为空', trigger: 'blur'},
                        {validator: ruleIpaddr,trigger: 'blur'}
                    ],
                    manager_ip: [
                        {required: false, trigger: 'blur'},
                        {validator: ruleIpaddr,trigger: 'blur'}
                    ],
                    cpu_model: [
                        {required: true, message: 'CPU型号不能为空', trigger: 'blur'}
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

                formNicData: [],
                formDiskData: [],

                formAddNicData:{
                    name:'',
                    ipaddr:'',
                    netmask:'',
                    hwaddr:'',
                    speed:'',
                    bandwidth:'',
                    server:0,
                },
                ruleAddNicData:{
                    name: [
                        {required: true, message: '网卡名称不能为空', trigger: 'blur'}
                    ],
                    ipaddr: [
                        {required: true, message: 'IP地址不能为空', trigger: 'blur'},
                        {validator: ruleIpaddr,trigger: 'blur'}
                    ],
                    netmask: [
                        {required: false, trigger: 'blur'},
                        {validator: ruleIpaddr, trigger: 'blur'}
                    ],
                },

                formAddDiskData:{
                    name:'',
                    size:'',
                    server:0,
                },
                ruleAddDiskData:{
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
            formatDate(date){
                this.formServerData.expire_date = date
            },
            editVisible() {
                this.switchAssetStatus = false;
                this.reload()
                this.$emit('editVisible', false);

            },
            initAsset(asset_id) {
                // 发送ajax请求，获取asset表信息
                var that = this
                this.$axios.request({
                    url: this.$store.state.apiList.assetUpdata + asset_id + '/',
                    method: 'GET',
                    params: {
                        token: this.$store.state.token,
                    }

                }).then(function (arg) {
                    that.formAssetData = arg.data
                    that.provider_id = arg.data.provider
                    that.initProviderInfo()
                }).catch(function (arg) {
                    console.log('catch', arg)
                })

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

            initServer(server_id) {
                // 发送ajax请求，获取server表信息
                var that = this
                this.$axios.request({
                    url: this.$store.state.apiList.serverList + server_id + '/',
                    method: 'GET',
                    params: {
                        token: this.$store.state.token,
                    }

                }).then(function (arg) {
                    that.formServerData = arg.data

                }).catch(function (arg) {
                    console.log('catch', arg)
                })
            },

            initNetwork(nic_id) {
                for (let nic of nic_id) {
                    // 发送ajax请求，获取Network表信息
                    var that = this
                    this.$axios.request({
                        url: this.$store.state.apiList.nicList + nic.id + '/',
                        method: 'GET',
                        params: {
                            token: this.$store.state.token,
                        }

                    }).then(function (arg) {
                        that.formNicData.push(arg.data)

                    }).catch(function (arg) {
                        console.log('catch', arg)
                    })

                }
            },

            initDisk(disk_id) {
                for (let disk of disk_id) {
                    // 发送ajax请求，获取Network表信息
                    var that = this
                    this.$axios.request({
                        url: this.$store.state.apiList.diskList + disk.id + '/',
                        method: 'GET',
                        params: {
                            token: this.$store.state.token,
                        }

                    }).then(function (arg) {
                        that.formDiskData.push(arg.data)

                    }).catch(function (arg) {
                        console.log('catch', arg)
                    })

                }
            },

            assetSubmit(name, assetId) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.submitAssetData(this.formAssetData, assetId)
                    } else {
                        this.$Message.error('提交失败，表单信息校验错误！');
                    }
                })
            },
            submitAssetData(data, assetId) {
                // 发送ajax请求，提交修改的数据
                var that = this
                this.$axios.request({
                    url: this.$store.state.apiList.assetUpdata + assetId + '/',
                    method: 'PUT',
                    params: {
                        token: this.$store.state.token,
                    },
                    data: data,

                }).then(function (arg) {
                    that.switchAssetStatus = false
                    that.$Message.success('恭喜您，资产信息修改成功!');

                }).catch(function (arg) {
                    that.$Message.error('可惜了，资产信息修改失败，响应错误代码：' + arg.status);
                    console.log('catch', arg)
                })
            },

            serverSubmit(name, serverId) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.submitServerData(this.formServerData, serverId)
                    } else {
                        this.$Message.error('提交失败，表单信息校验错误！');
                    }
                })
            },
            submitServerData(data, serverId) {
                // 发送ajax请求，提交server修改的数据
                var that = this
                this.$axios.request({
                    url: this.$store.state.apiList.serverList + serverId + '/',
                    method: 'PUT',
                    params: {
                        token: this.$store.state.token,
                    },
                    data: data,

                }).then(function (arg) {
                    that.switchServerStatus = false
                    that.$Message.success('服务器信息修改成功!');
                }).catch(function (arg) {
                    that.$Message.error('可惜了，服务器信息修改失败，响应错误代码：' + arg.status);
                    console.log('catch', arg)
                })
            },

            networkSubmit(data) {
                for (let nic_data of data) {
                    // 发送ajax请求，提交network修改的数据
                    var that = this
                    this.$axios.request({
                        url: this.$store.state.apiList.nicList + nic_data.id + '/',
                        method: 'PUT',
                        params: {
                            token: this.$store.state.token,
                        },
                        data: nic_data,

                    }).then(function (arg) {
                        that.switchNetworkStatus = false
                        that.$Message.success('网卡信息修改成功!');
                    }).catch(function (arg) {
                        that.$Message.error('可惜了，网卡信息修改失败，响应错误代码：' + arg.status);
                        console.log('catch', arg)
                    })
                }
            },

            diskSubmit(data) {
                for (let disk_data of data) {
                    // 发送ajax请求，提交network修改的数据
                    var that = this
                    this.$axios.request({
                        url: this.$store.state.apiList.diskList + disk_data.id + '/',
                        method: 'PUT',
                        params: {
                            token: this.$store.state.token,
                        },
                        data: disk_data,

                    }).then(function (arg) {
                        that.switchDiskStatus = false
                        that.$Message.success('磁盘信息修改成功!');
                    }).catch(function (arg) {
                        that.$Message.error('可惜了，磁盘信息修改失败，响应错误代码：' + arg.status);
                        console.log('catch', arg)
                    })
                }
            },

            addNetwork(server_id) {
                this.modalNicStatus = true
                this.formAddNicData.server = server_id
            },
            addNicSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.submitAddNic(this.formAddNicData)
                    } else {
                        this.$Message.error('提交失败，表单信息校验错误！');
                    }
                })
            },
            submitAddNic(data) {
                var that = this
                this.$axios.request({
                    url: this.$store.state.apiList.nicList,
                    method: 'POST',
                    params: {
                        token: this.$store.state.token,
                    },
                    data: data,

                }).then(function (arg) {
                    // that.modalstatus = false
                    console.log(arg.data)
                    that.$Message.success('网卡添加成功!');
                    that.formNicData.push(arg.data)

                    that.$refs['formAddNicData'].resetFields();
                }).catch(function (arg) {
                    that.$Message.error('可惜了，网卡添加失败，响应错误代码：' + arg);
                    console.log('catch', arg)
                })
            },
            deleteNic(nicId,index) {
                this.$Modal.confirm({
                    title: '删除警告',
                    content: '<p>【友情提示】方法千万种，安全第一条。操作不规范，运维两行泪！</p><p style="color: red;font-weight:bold">是否删除此块网卡？删除后不可恢复！</p>',
                    onOk: () => {
                        var that = this
                        this.$axios.request({
                            url: this.$store.state.apiList.nicList + nicId + '/',
                            method: 'DELETE',
                            params: {
                                token: this.$store.state.token,
                            },

                        }).then(function (arg) {
                            that.formNicData.splice(index, 1);
                            that.$Message.success('删除网卡成功!');

                        }).catch(function (arg) {
                            that.$Message.error('可惜了，网卡删除失败，响应错误代码：' + arg);
                            console.log('catch', arg)
                        })
                    },
                })

            },

            addDisk(server_id) {
                this.modalDiskStatus = true
                this.formAddDiskData.server = server_id
            },
            addDiskSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.submitAddDisk(this.formAddDiskData)
                    } else {
                        this.$Message.error('提交失败，表单信息校验错误！');
                    }
                })
            },
            submitAddDisk(data) {
                var that = this
                this.$axios.request({
                    url: this.$store.state.apiList.diskList,
                    method: 'POST',
                    params: {
                        token: this.$store.state.token,
                    },
                    data: data,

                }).then(function (arg) {
                    that.$Message.success('磁盘添加成功!');
                    that.formDiskData.push(arg.data)
                    that.$refs['formAddDiskData'].resetFields();
                }).catch(function (arg) {
                    that.$Message.error('可惜了，磁盘添加失败，响应错误代码：' + arg);
                    console.log('catch', arg)
                })
            },
            deleteDisk(diskId,index) {
                this.$Modal.confirm({
                    title: '删除警告',
                    content: '<p>【友情提示】方法千万种，安全第一条。操作不规范，运维两行泪！</p><p style="color: red;font-weight:bold">是否删除此块磁盘？删除后不可恢复！</p>',
                    onOk: () => {
                        var that = this
                        this.$axios.request({
                            url: this.$store.state.apiList.diskList + diskId + '/',
                            method: 'DELETE',
                            params: {
                                token: this.$store.state.token,
                            },

                        }).then(function (arg) {
                            that.formDiskData.splice(index, 1);
                            that.$Message.success('删除网卡成功!');

                        }).catch(function (arg) {
                            that.$Message.error('可惜了，网卡删除失败，响应错误代码：' + arg);
                            console.log('catch', arg)
                        })
                    },
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
