<template>
  <v-app>


    <v-main>

      <v-row>
        <v-col cols="6">
          <v-card>
            <v-text-field v-model="cookies"></v-text-field>
            <v-btn @click="设置cookies(cookies)">设置cookies</v-btn>
            <v-text-field v-model="newGzdbh"></v-text-field>
            <v-btn @click="new 计量配表.配表流程(newGzdbh.replaceAll(' ', '').replaceAll('	', ''))">新增单个任务</v-btn>


          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card>
            <!--
    <img id="code" hidden style="transform: rotate(0deg) ;transform-origin: left;">
-->

            <v-textarea v-model="muiltTask">

            </v-textarea>
            {{ muiltTask.split('\n').filter(e => e.length).length }}
            <v-btn
              @click="   muiltTask.split('\n').filter(e => e.length).forEach(e => { new 计量配表.配表流程(e.replaceAll(' ', '').replaceAll('	', '')) })">新增全部任务</v-btn>
            <v-btn @click="计量配表.配表队列.forEach(e => e.检查())">全部检查</v-btn>
            <v-btn
              @click="计量配表.配表队列.forEach((e, i) => { e.打印服务情况表(e.gzdbh, 'excel', '序号' + ('000' + (i + 1)).substr(-3) + ' ' + e.gzdbh) })">全部下载excel</v-btn>
            <v-btn @click="制表()">制表</v-btn>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" v-for="(e, index) in 计量配表.配表队列" :key="e.gzdbh">
          <v-card>

            <v-row>






              <v-col cols="12">
                <JRalert :myValue="e.信息检验.工作单类别" />
                <JRalert :myValue="e.信息检验.工作单环节" />
                <div>序号：{{ index + 1 }}/{{ 计量配表.配表队列.length }} 工单编号：{{ e.gzdbh }}</div>
              </v-col>

              <v-col cols="8">

                <div>用户编号：{{ e.yhbh }}</div>
                <div>---摘要地址：{{ e.gzdzy && e.gzdzy.用电地址 }}</div>
                <div>---摘要类别：{{ e.gzdzy && e.gzdzy.主用电类别 }}</div>
                <div>---摘要电压：{{ e.gzdzy && e.gzdzy.供电电压 }}</div>
                <div>---摘要户名：{{ e.gzdzy && e.gzdzy.用户名称 }}</div>

                <JRalert :myValue="e.信息检验.勘查信息" />
                <!--  <JRalert :myValue="e.信息检验.配备典型" />-->
                <JRalert :myValue="e.信息检验.勘查分析" />
                <div>当前表计：{{ e.info.表计状态 }}</div>
                <div>当前表箱：{{ e.info.配箱状态 }}</div>
                <div>工作状态：{{ e.info.state }}</div>


                <v-btn @click="e.检查()">检查</v-btn>
                <v-btn @click="e.配备(82, false)">配单60无箱</v-btn>
                <v-btn @click="e.配备(83, true)">配单80+箱</v-btn>
                <v-btn @click="e.配备(84, true)">配三相+箱</v-btn>
                <v-btn @click="e.配备(79, true)">配三相互感+箱</v-btn>
                <v-btn>手动配备</v-btn>

                <v-btn @click="e.配备(82, true)">配单60+多位</v-btn>
                <v-btn @click="e.配备(84, false)">配三相+无箱</v-btn>
                <v-btn @click="e.配备(79, false)">配三相互感+无箱</v-btn>
                <v-btn color="#217346" dark
                  @click="e.打印服务情况表(e.gzdbh, 'excel', '序号' + ('000' + (i + 1)).substr(-3) + ' ' + e.gzdbh)">打excel <v-icon
                    dark>
                    mdi-microsoft-excel
                  </v-icon></v-btn>
                <v-btn color="error" @click="e.移除()">删除</v-btn>
                <v-btn @click="e.强制打开配图界面()">强制配图</v-btn>
                <v-btn hidden @click="e.保存表箱信息()">保存表箱信息</v-btn>
              </v-col>

              <v-col cols="2" v-for="(g, index) in e.信息检验.勘查分析.multiMuiltmeasureEntitiesInfo" :key="index">
                <div>计量点{{ index + 1 }}</div>

                <div> {{ g.suggestion && g.suggestion.conclusion }}</div>
                <!---->
                <div>{{ g.分析 && g.分析.新计量点信息.YDRL }}kw</div>
                <div>{{ database.电价信息[g.分析.新计量点信息.DJDM].电价 }}</div>
                <div> 已配 {{ g.分析.测试 }}</div>
                <div> 已配 {{ g.表箱信息.状态 }}</div>


                <!--
                <v-btn @click="g.配箱()">配备按钮</v-btn>
                <v-btn @click="g.查询表箱()">查询表箱</v-btn>

                <v-btn @click="g.添加表箱()">添加表箱</v-btn>
                <v-btn @click="g.删除表箱()">删除表箱</v-btn>
                <v-btn @click="g.配箱()">配箱(0)</v-btn>
                <v-btn @click="g.配箱('单相')">配单相箱</v-btn>
                <v-btn @click="g.保存表箱设备列表()">保存表箱设备列表</v-btn>
                <v-btn @click="g.配图信息录入('82')">配图信息录入</v-btn>
              -->
                <v-btn v-for="(k, index) in g.suggestion.buttons" :key="index" @click="k.func()">{{ k.des }}</v-btn>


              </v-col>

            </v-row>






          </v-card>
        </v-col>


      </v-row>



    </v-main>
  </v-app>
</template>

<script>

import database from "./plugins/database"

import 计量配表 from './plugins/计量配表Class';
import JRalert from "./components/JrAlert.vue"
window.计量配表 = 计量配表
export default {
  name: 'App',


  data: () => ({
    cookies: "",
    newGzdbh: "03060018000359594433",//062930000700884
    muiltTask: "03060018000358793332\n03060018000358924779\n03060018000359559034",//,
    计量配表: 计量配表,
    database: database
    //
  }),
  methods: {
    设置cookies(ck) {
      console.log("尝试")
      ck.replaceAll(" ", "").split(";").forEach(async function (e) {
        //   if (e.split("=")[0] == "pt_key" || e.split("=")[0] == "pt_pin") {
        document.cookie = `${e.split("=")[0]}=${e.split("=")[1]}; max-age=99999999; domain=${location.hostname};path=/`
        //}
      })

    },
    制表() {
      let a = 计量配表.配表队列.map(e => {
        let b = {
          工作单编号: e.gzdbh,
          用电地址: e.gzdzy.用电地址.replace(/广?东?省?佛?山?市?南?海?区?/, ""),
          结论: e.信息检验.勘查分析.conclusion
        }
        return b
      })
      console.table(a)
    }
  },
  watch: {


  },
  components: {
    JRalert

  }
};
</script>
<style scoped></style>