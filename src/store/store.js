import Vue from 'vue'
import Vuex from 'vuex'
import Cookie from 'vue-cookies'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        username: Cookie.get('username'),
        token: Cookie.get('token'),
        apiList: {
            auth: 'http://192.168.3.10:18000/login/',
            assetList: 'http://192.168.3.10:18000/api/v1/assets/',
            assetUpdata: 'http://192.168.3.10:18000/api/v1/asset_updata/',
            providerList: 'http://192.168.3.10:18000/api/v1/providers_all/',
            serverList: 'http://192.168.3.10:18000/api/v1/servers/',
            nicList: 'http://192.168.3.10:18000/api/v1/nics/',
            diskList: 'http://192.168.3.10:18000/api/v1/disks/',
            appList: 'http://192.168.3.10:18000/api/v1/apps/',
            businessList: 'http://192.168.3.10:18000/api/v1/business_all/',
            domainList: 'http://192.168.3.10:18000/api/v1/domain/',
            dnsList: 'http://192.168.3.10:18000/api/v1/dns/',
            dnsUpdata: 'http://192.168.3.10:18000/api/v1/dns_updata/',
            platformList: 'http://192.168.3.10:18000/api/v1/platform/',
            providerInfoList: 'http://192.168.3.10:18000/api/v1/providers/',
            businessInfoList: 'http://192.168.3.10:18000/api/v1/business/',
            userList: 'http://192.168.3.10:18000/api/v1/users/',
            userSetPwd: 'http://192.168.3.10:18000/api/v1/user_setpwd/',
            userCreate: 'http://192.168.3.10:18000/api/v1/user_create/',
            serverData: 'http://192.168.3.10:18000/api/v1/server_data/',
            domainData: 'http://192.168.3.10:18000/api/v1/domain_data/',
        },
    },
    mutations: {
        saveToken: function (state, userToken) {
            state.username = userToken.username;
            state.token = userToken.token;

            Cookie.set("username", userToken.username, "1d")
            Cookie.set("token", userToken.token, "1d")

        },
        clearToken: function (state) {
            state.username = undefined
            state.token = undefined

            Cookie.remove('username')
            Cookie.remove('token')

        }
    }
})
