import Vue from 'vue'
import Router from 'vue-router'
import store from "../store/store"
import Index from '@/components/Index'
import Login from '@/components/Login'
import Dashboard from '@/components/Dashboard'
import Asset from '@/components/assets/Asset'
import DeployInfo from '@/components/deploy/DeployInfo'
import Domain from '@/components/domain/Domain'
import Dns from '@/components/domain/Dns'
import Platform from '@/components/platform/Platform'
import Provider from '@/components/provider/Provider'
import Business from '@/components/business/Business'
import Management from '@/components/management/Management'


Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'index',
            component: Index,
            meta:{
                requireAuth: true,
            },
            children: [
                {
                    path: 'dashboard.html',
                    name: 'dashboard',
                    component: Dashboard,
                    meta:{
                        requireAuth: true,
                        title: 'Apasa CMDB - 仪表盘',
                    }
                },
                {
                    path: 'asset.html',
                    name: 'asset',
                    component: Asset,
                    meta:{
                        requireAuth: true,
                        title: 'Apasa CMDB - 资产信息',
                    }
                },
                {
                    path: 'deployinfo.html',
                    name: 'deployinfo',
                    component: DeployInfo,
                    meta:{
                        requireAuth: true,
                        title: 'Apasa CMDB - 部署信息',
                    }
                },
                {
                    path: 'domain.html',
                    name: 'domain',
                    component: Domain,
                    meta:{
                        requireAuth: true,
                        title: 'Apasa CMDB - 域名信息',
                    },
                },
                {
                    path: 'domain/dns/:id/:domian_name.html',
                    name: 'dns',
                    component: Dns,
                    meta:{
                        requireAuth: true,
                        title: 'Apasa CMDB - 解析记录',
                    }
                },
                {
                    path: 'platform.html',
                    name: 'platform',
                    component: Platform,
                    meta:{
                        requireAuth: true,
                        title: 'Apasa CMDB - 运维平台信息',
                    },
                },
                {
                    path: 'admin/provider.html',
                    name: 'provider',
                    component: Provider,
                    meta:{
                        requireAuth: true,
                        title: 'Apasa CMDB - 服务商管理',
                    },
                },
                {
                    path: 'admin/business.html',
                    name: 'business',
                    component: Business,
                    meta:{
                        requireAuth: true,
                        title: 'Apasa CMDB - 业务管理',
                    },
                },
                {
                    path: 'admin/user.html',
                    name: 'management',
                    component: Management,
                    meta:{
                        requireAuth: true,
                        title: 'Apasa CMDB - 用户管理',
                    },
                },
            ],
            redirect: 'dashboard.html',
        },
        {
            path: '/login.html',
            name: 'login',
            component: Login,
            meta:{
                title: 'Apasa CMDB - 欢迎登录',
                requireAuth: true,
            },
        },
    ]

})

