<template>
    <div class="wrap" id="wrap" :style ="note" v-wechat-title="$route.meta.title">
        <div class="logGet">
            <!-- 头部提示信息 -->
            <div class="logD logDtip">
                <p class="p1">登录</p>
            </div>
            <!-- 输入框 -->
            <div class="lgD">
                <Input type="text" v-model="username" placeholder="输入用户名">
                    <Icon type="md-person" slot="prefix" />
                </Input>
            </div>
            <div class="lgD">
                <Input type="password" v-model="password" placeholder="输入用户密码">
                    <Icon type="md-lock" slot="prefix" />
                </Input>
            </div>
            <div class="logC">
                <Button type="primary" v-on:click="doLogin">登录</Button>

            </div>
            <div class="logE">
                <span>{{error}}</span>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data(){
            return {
                username:"",
                password:"",
                error:"",
                note: {
                    backgroundImage: "url(" + require('@/assets/timg.png') + ")",
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center center",
                }
            }
        },
        methods:{
            doLogin(){
                var that = this
                this.$axios.request({
                    url:this.$store.state.apiList.auth,
                    method:'POST',
                    data:{
                        username:this.username,
                        password:this.password,
                    }
                }).then(function (arg) {
                    if (arg.data.state_code === 200){
                        that.$store.commit('saveToken',{username:that.username,token:arg.data.token})
                        that.$router.push({name:'index'})
                    }else {
                        that.error = '用户名或密码错误'
                    }
                }).catch(function (arg) {
                    that.error = '服务器错误，请联系管理员！'
                })

            }
        }
    }
</script>

<style scoped>

    * {
        margin: 0;
        padding: 0;
    }

    #wrap {
        height: 100vh;
        width: 100vw;
        background-position: center center;
        position: relative;

    }

    #wrap .logGet {
        height: 408px;
        width: 368px;
        position: absolute;
        background-color: #FFFFFF;
        top: 100px;
        right: 15%;
    }

    .logC Button {
        width: 100%;
        height: 45px;
        border: none;
        color: white;
        font-size: 18px;
    }

    .logE span {
        width: 100%;
        border: none;
        font-size: 14px;
        color: #ed4014;
    }

    .logGet .logD.logDtip .p1 {
        display: inline-block;
        font-size: 28px;
        margin-top: 30px;
        width: 86%;
    }

    #wrap .logGet .logD.logDtip {
        width: 86%;
        border-bottom: 1px solid #2d8cf0;
        margin-bottom: 60px;
        margin-top: 0px;
        margin-right: auto;
        margin-left: auto;
    }

    .logGet .lgD img {
        position: absolute;
        top: 12px;
        left: 8px;
    }

    .logGet .lgD input {
        width: 100%;
        height: 42px;
        text-indent: 2.5rem;
    }

    #wrap .logGet .lgD {
        width: 86%;
        position: relative;
        margin-bottom: 30px;
        margin-top: 30px;
        margin-right: auto;
        margin-left: auto;
    }

    #wrap .logGet .logC {
        width: 86%;
        margin-top: 0px;
        margin-right: auto;
        margin-bottom: 0px;
        margin-left: auto;
    }

    #wrap .logGet .logE {
        width: 86%;
        margin-top: 10px;
        margin-right: auto;
        margin-bottom: 0px;
        margin-left: 80px;
    }

</style>
