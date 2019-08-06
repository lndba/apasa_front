<template>
    <div class="layout" v-wechat-title="$route.meta.title">
        <Layout>

            <Sider hide-trigger
                   :style="{background: '#fff',position: 'fixed', height: '100vh', left: 0, overflow: 'auto'}">
                <Menu :active-name="menu" ref="menu" theme="light" width="auto"
                      :open-names="['1','2','3','4','5','6','7']">
                    <a href="/dashboard.html"><img :src="imgUrl" style="width: 185px;height: auto"></a>
                    <MenuItem name="dashboard" replace :to="{name:'dashboard'}">
                        <Icon type="ios-stats"/>
                        仪表盘
                    </MenuItem>
                    <Submenu name="1">
                        <template slot="title">
                            <Icon type="ios-paper"/>
                            资产信息
                        </template>
                        <MenuItem name="asset" replace :to="{name:'asset'}">资产内容</MenuItem>
                    </Submenu>

                    <MenuItem name="platform" replace :to="{name:'platform'}">
                        <Icon type="ios-desktop"/>
                        运维平台信息
                    </MenuItem>
                    <Submenu name="3">
                        <template slot="title">
                            <Icon type="logo-codepen"/>
                            应用部署信息
                        </template>
                        <MenuItem name="deployinfo" replace :to="{name:'deployinfo'}">应用部署明细</MenuItem>
                    </Submenu>
                    <MenuItem replace :to="{name:'domain'}" name="domain">
                        <Icon type="ios-globe"/>
                        域名信息
                    </MenuItem>
                    <Submenu name="7">
                        <template slot="title">
                            <Icon type="ios-settings"/>
                            后台管理
                        </template>
                        <MenuItem name="admin/provider" replace :to="{name:'provider'}">服务商管理</MenuItem>
                        <MenuItem name="admin/business" replace :to="{name:'business'}">业务管理</MenuItem>
                        <MenuItem name="admin/user" replace :to="{name:'management'}">用户管理</MenuItem>
                    </Submenu>
                </Menu>
            </Sider>
        </Layout>
        <Layout>
            <Header :style="{background: '#fff',padding: '0 0', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'}">
                <div class="layout-nav">
                    <div style="float: right;margin-right: 40px">
                        <div style="display: inline-block;font-size: 15px;">
                            <a href="dashboard.html">首页</a>&emsp;&emsp;
                            <a href="asset.html">资产信息</a>&emsp;&emsp;
                        </div>
                        <div style="display: inline-block;">
                            <Dropdown>
                                <div>
                                    <Avatar style="background-color: #87d068" icon="ios-person" />
                                    <a style="font-size: 16px;color: #808695">{{userName}}</a>
                                </div>
                                <DropdownMenu slot="list">
                                    <a href="/login.html" @click="doLogout">
                                        <DropdownItem>退出</DropdownItem>
                                    </a>
                                    <router-link :to="{name:'management'}">
                                        <DropdownItem>用户管理</DropdownItem>
                                    </router-link>
                                    <router-link :to="{name:'provider'}">
                                        <DropdownItem>服务商管理</DropdownItem>
                                    </router-link>
                                    <router-link :to="{name:'business'}">
                                        <DropdownItem>业务管理</DropdownItem>
                                    </router-link>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </Header>
        </Layout>
        <router-view></router-view>
    </div>
</template>

<script>
    import imgUrl from '@/assets/logo.png'

    export default {
        name: "Index",
        data() {
            return {
                userName: undefined,
                menu: "dashboard",
                imgUrl,
            }
        },
        mounted() {
            this.$nextTick(() => {
                var pathName = this.$route.path.slice(1)
                if (pathName.split('.').length < 3) {
                    this.menu = pathName.split('.')[0]
                    this.$refs.menu.updateActiveName()
                } else {
                    this.menu = pathName.split('.')[0].split('/')[0]
                    this.$refs.menu.updateActiveName()
                }
            })
            this.init()
        },
        methods: {
            init() {
                if (!this.$store.state.token) {
                    this.$router.push({name: 'login'})
                } else {
                    this.userName = this.$store.state.username
                }
            },
            doLogout() {
                this.$store.commit('clearToken')
                // this.$router.push({name: 'login'})
                console.log('ok')
            }
        },

    }
</script>

<style scoped>
    .layout {
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }

    .layout-nav {
        width: 400px;
        margin: 0 auto;
        margin-right: 20px;
    }
</style>
