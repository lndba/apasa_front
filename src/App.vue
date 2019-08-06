<template>

  <!--<div id="app">-->

    <!--<router-view/>-->
    <div id="app">
      <!--<Sider :style="{position: 'fixed',maxHeight: '100vh', left: 0, overflow: 'auto'}">-->
        <!--<router-view/>-->
      <!--</Sider>-->
      <!--<Layout :style="{marginLeft: '200px',height: '100vh'}">-->
        <!--<Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'}"></Header>-->
        <!--<Content :style="{padding: '0 16px 16px'}">-->
          <!--<Breadcrumb :style="{margin: '16px 0'}">-->
            <!--<BreadcrumbItem>首页</BreadcrumbItem>-->
            <!--<BreadcrumbItem>Components</BreadcrumbItem>-->
            <!--<BreadcrumbItem>Layout</BreadcrumbItem>-->
          <!--</Breadcrumb>-->
          <!--<Card>-->
            <!--&lt;!&ndash;<div style="height: 600px">Content</div>&ndash;&gt;-->
            <!--<div style="height: 80vh">Content</div>-->
          <!--</Card>-->
        <!--</Content>-->
      <!--</Layout>-->
        <router-view v-if="isRouterAlive"></router-view>
    </div>

</template>

<script>

export default {
  name: 'App',
    data () {
        return {
            isRouterAlive: true
        }
    },
    provide () {
        return {
            reload: this.reload
        }
    },
    methods: {
        reload () {
            this.isRouterAlive = false
            this.$nextTick(function() {
                this.isRouterAlive = true
            })
        }
    }

}
</script>

<style>

</style>
