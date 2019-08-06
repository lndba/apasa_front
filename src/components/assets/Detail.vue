<template>
    <Drawer title="资产详细信息" :closable="false" width="640" v-model="visibleStat" @on-close="editVisible">
        <p :style="pStyle">资产信息</p>
        <div class="demo-drawer-profile">
            当前状态：{{assetInfo.device_status_info}}
            <Row>
                <Col span="12">
                    区域：{{assetInfo.region}}
                </Col>
                <Col span="12">
                    实例类型：{{assetInfo.modle||'None'}}
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    机柜位置：{{assetInfo.cabinet||'None'}}
                </Col>
                <Col span="12">
                    机位序号：{{assetInfo.cabinet_order||'None'}}
                </Col>
            </Row>
        </div>
        <Divider/>
        <p :style="pStyle">服务商信息</p>
        <div class="demo-drawer-profile">
            <Row>
                服务商名称：{{assetInfo.provider_name}}
            </Row>
            <Row>
                服务商地址：{{assetInfo.provider_address}}
            </Row>
            <Row>
                <Col span="12">
                    联系人：{{assetInfo.provider_contact||'None'}}
                </Col>
                <Col span="12">
                    联系电话：{{assetInfo.provider_phone||'None'}}
                </Col>
            </Row>
        </div>
        <Divider/>
        <p :style="pStyle">服务器信息</p>
        <div class="demo-drawer-profile">
            <Row>
                <Col span="12">
                    主机名：{{assetInfo.server_hostname}}
                </Col>
                <Col span="12">
                    外网IP：{{assetInfo.server_outside_ip}}
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    管理IP：{{assetInfo.server_manager_ip||'None'}}
                </Col>
            </Row>

            <Row>
                <Col span="8">
                    操作系统：{{assetInfo.server_os}}
                </Col>
                <Col span="8">
                    操作系统版本：{{assetInfo.server_os_version}}
                </Col>
                <Col span="8">
                    操作系统类型：{{assetInfo.server_os_type}}
                </Col>
            </Row>
            <Row>
                内核版本：{{assetInfo.server_kernel_version}}
            </Row>

            <Row>
                CPU型号：{{assetInfo.server_cpu_model}}
            </Row>

            <Row>
                CPU核心：{{assetInfo.server_cpu_core}}核
            </Row>

            <Row>
                <Col span="12">
                    内存：{{assetInfo.server_memory_size}}
                </Col>
                <Col span="12">
                    Swap内存：{{assetInfo.server_swap_size||'None'}}
                </Col>
            </Row>

            <Row>
                <Col span="12">
                    到期时间：{{assetInfo.server_expire_date||'None'}}
                </Col>
            </Row>
            <Row>
                描述信息：{{assetInfo.server_descriptions||'None'}}
            </Row>
        </div>
        <Divider/>
        <p :style="pStyle">网卡信息</p>
        <div class="demo-drawer-profile">
            <div v-for="(item,index) in assetInfo.nic_info">
                <b>【网卡{{index+1}}】</b>
                <Row>
                    <Col span="12">
                        网卡名称：{{item.name}}
                    </Col>
                    <Col span="12">
                        带宽：{{item.bandwidth||'None'}}
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        IP地址：{{item.ipaddr}}
                    </Col>
                    <Col span="12">
                        子网掩码：{{item.netmask||'None'}}
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        物理地址：{{item.hwaddr||'None'}}
                    </Col>
                    <Col span="12">
                        网卡速率：{{item.speed||'None'}}
                    </Col>
                </Row>
            </div>

        </div>
        <Divider/>
        <p :style="pStyle">磁盘信息</p>
        <div class="demo-drawer-profile">
            <div v-for="(item,index) in assetInfo.disk_info">
                <b>【磁盘{{index+1}}】</b>
                <Row>
                    <Col span="12">
                        磁盘名称：{{item.name}}
                    </Col>
                    <Col span="12">
                        磁盘容量：{{item.size}}
                    </Col>
                </Row>
            </div>
        </div>
    </Drawer>
</template>
<script>
    export default {
        data() {
            return {
                pStyle: {
                    fontSize: '16px',
                    color: 'rgba(0,0,0,0.85)',
                    lineHeight: '24px',
                    display: 'block',
                    marginBottom: '16px'
                },
                assetInfo: {},
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
                this.$emit('editVisible', false);
            },
            init(asset_id) {
                // 发送ajax
                var that = this
                this.$axios.request({
                    url: this.$store.state.apiList.assetList + asset_id + '/',
                    method: 'GET',
                    params: {
                        token: this.$store.state.token,
                    }

                }).then(function (arg) {
                    that.assetInfo = arg.data

                }).catch(function (arg) {
                    console.log('catch', arg)
                })

            },
        },


    }
</script>
<style>
    .demo-drawer-profile {
        font-size: 14px;
    }

    .demo-drawer-profile {
        margin-bottom: 12px;
    }
</style>
