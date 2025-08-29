import 条件检查 from "./条件检查Class"


const 加入打印队列 = 打印队列()
//let a = new 配表流程("03060018000359092371")
//a.流程()



//业务子类
//工单摘要（地址） 
//勘查意见
//配表状态
//配箱状态
//03060018000359213878增容单


/*增容模式
    同计量点 拆单相 装三相   计量点、电源点 【更换前】+【更换后】 measureEntities 20 25     电表 【拆除】【新装】meterEntities 15 10   （装箱+有可能拆箱 03060018000359287056）

    新增计量点+新表 =》按需配表、箱      计量点 【更换前】+【更换后】+ 【新装】 measureEntities 20 25 10       电表    【抄表前】+【抄表后】+【新装】 30 35 10 （大概率装箱）

    带CT换带CT  03060018000359162161



    新增结算户+计量点
*/

/*
判断业务=》配表=》配箱/删除=》保存表箱信息=》打印

*/


const THISURL = location.hostname == "localhost" ? location.origin : "http://10.150.23.1:8010"


const 配表队列 = []

class 配表流程 {
    constructor(gzdbh) {
        this.gzdbh = gzdbh
        this.gzdzy = {}

        this.gzdxx = undefined
        this.勘察信息 = undefined
        this.jlxzcjlsecDataWrap = undefined
        this.yhbh = undefined
        this.info = {
            配箱状态: "",
            表计状态: "",
            state: "初始化",
            busy: false
        }
        this.信息检验 = {
            勘查信息: new 条件检查.勘查意见检查(this),
            工作单环节: new 条件检查.工作单环节(this),
            工作单类别: new 条件检查.工作单类别(this),
            勘查分析: new 条件检查.勘查分析(this)

        }
        配表队列.push(this)
    }


    强制打开配图界面() {
        let tempurl = THISURL + `/YKZX/yk/xckc/ykXckcClientPeibiao.do?tacheId=6&ywzlbh=${this.gzdxx.dataWraps.dataWrapGzdxx.data.ywzl}&dqbm=${this.gzdxx.dataWraps.dataWrapGzdxx.data.dqbm}&gzdbh=${this.gzdbh}&rwh=3&editFlag=YES&menuEnable=Y&runModel=02`
        window.open(tempurl)
    }

    检查() {//主要用于获取工单所有信息
        this.info.state = "获取状态信息中"
        return this.查询工单详情()
            .then(() => { return this.读取配图界面信息() })
            .then(() => { return this.查询表箱配备信息() })
            .then(() => { return this.装拆信息录入界面() })
            .then(() => { this.info.state = "检查完成"; console.log(this); console.log(this.勘察信息.meterEntities[0].values) })
    }




    配表(BDDLDM, 勘察信息 = this.勘察信息) {
        const 映射 = {
            82: {
                BDDLDM: "82",//单相60A
                XXLBDM: "01",//相线类别：单相
                EDDYDM: "1",//额定电压：220V
                ZQDDJDM: "47"//准确度等级：A
            },
            83: {
                BDDLDM: "83",//单相80A
                XXLBDM: "01",//相线类别：单相
                EDDYDM: "1",//额定电压：220V
                ZQDDJDM: "47"//准确度等级：A
            },
            84: {
                BDDLDM: "84",//三相直入
                XXLBDM: "03",//相线类别：三相四线
                EDDYDM: "2",//额定电压：3×220/380V
                ZQDDJDM: "51"//准确度等级：B/2.0
            },
            79: {
                BDDLDM: "79",//三相互感
                XXLBDM: "03",//相线类别：三相四线
                EDDYDM: "2",//额定电压：3×220/380V
                ZQDDJDM: "51"//准确度等级：B/2.0
            }
        }
        return this.配图信息录入(映射[BDDLDM], 勘察信息)
    }
    配箱(isNeed = 1, gzdxx = this.gzdxx, 勘察信息 = this.勘察信息, yhbh = this.yhbh, jlxzcjlsecDataWrap = this.jlxzcjlsecDataWrap) {
        const 映射 = {
            82: {
                "wzplbm": "010039102223",//单相60A
                "bxlxdm": "1041001"
            },
            83: {
                "wzplbm": "010039102223",//单相80A
                "bxlxdm": "1041001"
            },
            84: {
                "wzplbm": "010039102511",//三相直入
                "bxlxdm": "1041002"
            },
            79: {
                "wzplbm": "010039102511",//三相互感
                "bxlxdm": "1041002"
            }
        }
        if (!isNeed && jlxzcjlsecDataWrap.dataList.length != 0) {//不需要表箱则删除所有表箱需求
            return this.删除所有表箱需求(jlxzcjlsecDataWrap.dataList, gzdxx)
        }
        else if (!isNeed && jlxzcjlsecDataWrap.dataList.length == 0) {
            console.log("不需要配箱，当前无箱，跳过")
            return
        }
        else {


            let 需求 = 映射[勘察信息.meterEntities.find(e => { return e.values.BGBZDM == "10" }).values.BDDLDM]
            console.log(勘察信息)
            console.log(需求)
            if (jlxzcjlsecDataWrap.dataList.length == 0) {
                return this.添加表箱(需求, gzdxx, yhbh).then(() => { return this.保存表箱信息 })
            }
            else if (jlxzcjlsecDataWrap.dataList.length == 1 && jlxzcjlsecDataWrap.dataList[0].wzplbm == 需求.wzplbm && jlxzcjlsecDataWrap.dataList[0].bxlxdm == 需求.bxlxdm) {
                console.log("当前配备已符合，无需要调整")
                return this.保存表箱信息()
            }
            else if (jlxzcjlsecDataWrap.dataList.length == 1 && jlxzcjlsecDataWrap.dataList[0].wzplbm != 需求.wzplbm && jlxzcjlsecDataWrap.dataList[0].bxlxdm != 需求.bxlxdm) {
                console.log("当前配备错误")
                return this.删除所有表箱需求(jlxzcjlsecDataWrap.dataList, gzdxx).then(() => { return this.添加表箱(需求, gzdxx, yhbh) }).then(() => { return this.保存表箱信息 })
            }


        }
    }
    配备(BDDLDM, isNeedBox) {
        this.info.state = "正在进行配备"
        if (this.gzdxx && this.勘察信息 && this.jlxzcjlsecDataWrap && this.yhbh) {
            return this.配表(BDDLDM).then(() => { return this.配箱(isNeedBox) }).then(() => { return this.检查() })
        }
        else {
            this.info.state = "未获取基本信息，不可配备"
            return
        }

    }

    配图信息录入(obj, readDataset = this.勘察信息) {
        // BDDLDM=82为60A 83为80A
        console.log(obj)
        let 新表 = readDataset.meterEntities.find(e => { return e.values.BGBZDM == 10 })
        Object.assign(新表.values, obj)
        let sendData = {
            "insertDataSet": {//新建
                "powerEntities": [],
                "transEntities": [],
                "measureEntities": [],
                "meterEntities": [],
                "inductEntities": [],
                "chargeEntities": [],
                "transGroupEntities": [],
                "transToMeasureEntities": [],
                "measureToMeasureEntities": [],
                "measureToMeterEntities": [],
                "measureToInductEntities": [],
                "chargeToMeterEntities": [],
                "appBaseInfo": {
                    "status": readDataset.appBaseInfo.status,
                    "type": readDataset.appBaseInfo.type,
                    "values": {
                        "BGBZDM": readDataset.appBaseInfo.values.BGBZDM
                    }
                },
                "userInfo": {
                    "status": readDataset.userInfo.status,
                    "type": readDataset.userInfo.type,
                    "values": {
                        "BGBZDM": readDataset.userInfo.values.BGBZDM
                    }
                },
                "additionalEntities": {}
            },
            "deleteDataSet": {//删除
                "powerEntities": [],
                "transEntities": [],
                "measureEntities": [],
                "meterEntities": [],
                "inductEntities": [],
                "chargeEntities": [],
                "transGroupEntities": [],
                "transToMeasureEntities": [],
                "measureToMeasureEntities": [],
                "measureToMeterEntities": [],
                "measureToInductEntities": [],
                "chargeToMeterEntities": [],
                "appBaseInfo": {
                    "status": readDataset.appBaseInfo.status,
                    "type": readDataset.appBaseInfo.type,
                    "values": {
                        "BGBZDM": readDataset.appBaseInfo.values.BGBZDM
                    }
                },
                "userInfo": {
                    "status": readDataset.userInfo.status,
                    "type": readDataset.userInfo.type,
                    "values": {
                        "BGBZDM": readDataset.userInfo.values.BGBZDM
                    }
                },
                "additionalEntities": {}
            },//删除
            "updateDataSet": {//更新
                "powerEntities": [],
                "transEntities": [],
                "measureEntities": readDataset.measureEntities,//计量点
                "meterEntities": readDataset.meterEntities,//电表
                "inductEntities": [],
                "chargeEntities": [],
                "transGroupEntities": [],
                "transToMeasureEntities": [],
                "measureToMeasureEntities": [],
                "measureToMeterEntities": [],
                "measureToInductEntities": [],
                "chargeToMeterEntities": [],
                "appBaseInfo": {
                    "status": readDataset.appBaseInfo.status,
                    "type": readDataset.appBaseInfo.type,
                    "values": {
                        "BGBZDM": readDataset.appBaseInfo.values.BGBZDM
                    }
                },
                "userInfo": {
                    "status": readDataset.userInfo.status,
                    "type": readDataset.userInfo.type,
                    "values": {
                        "BGBZDM": readDataset.userInfo.values.BGBZDM
                    }
                },
                "additionalEntities": {}
            },
            "appNo": readDataset.appBaseInfo.values.GZDBH,
            "taskNo": readDataset.appBaseInfo.values.FAYXRWH,
            "areaCode": readDataset.appBaseInfo.values.DQBM,
            "advice": readDataset.advice,
            "locationXmlText": readDataset.location,
            "imageTypeMime": "JPEG",
            "appBaseInfo": readDataset.appBaseInfo,
            "userInfo": readDataset.userInfo,
            "sign": "梁嘉炜18566010567@大沥"
        }

        return fetch(THISURL + "/YKZX/yk/xckc/txpb/saveDataSetAction.do", {
            "headers": {
                "accept": "text/html, */*; q=0.01",
                "accept-language": "zh-CN,zh;q=0.9,ja;q=0.8",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "x-requested-with": "XMLHttpRequest"
            },
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": json2urlencoded({
                params: JSON.stringify(
                    sendData
                )
            })
            , "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(e => e.json())



    }


    查询工单详情(gzdbh = this.gzdbh) {
        return fetch(THISURL + "/GGZX/xtzc/dbrwgl/dbrwglGzdbl.do?" + json2urlencoded({
            "FLAG": "1",
            "isReadOnly": "N",
            "GZDBH": gzdbh,
            "tcbz": "N",
        }), {
            "headers": {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            "method": "post",
            "mode": "cors",
            "credentials": "include"
        }).then(e => { return e.text() })
            .then(提取textarea)
            .then(e => {
                this.gzdxx = e
                this.信息检验.工作单环节.check()
                this.信息检验.工作单类别.check()



                let tempgzdzy = e.dataWraps.dataWrapGzdxx.data.gzdzy.split("；")
                tempgzdzy.forEach(e => {
                    this.gzdzy[e.split("：")[0]] = e.split("：")[1]

                })


                    ; return e
            })
    }
    读取配图界面信息(gzdxx = this.gzdxx) {
        //根据工单信息。找最后一条现场服务
        let temp = gzdxx.dataWraps.dataWrap.dataList.find(e => { return e.hjmc == "现场服务" })
        if (!temp) {
            throw ("还未进入现场服务环节")
        }
        if (gzdxx.dataWraps.dataWrap.dataList[0].hjmc != "现场服务") {
            console.warn(`当前在${gzdxx.dataWraps.dataWrap.dataList[0].hjmc}环节`)
        }

        return fetch(THISURL + "/YKZX/yk/xckc/txpb/readDataset.do", {
            "headers": {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            "body": json2urlencoded({
                "appNo": gzdxx.dataWraps.dataWrapGzdxx.data.gzdbh,
                "taskNo": temp.rwh,
                "areaCode": "030600"
            }),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(e => e.json()).then(e => {


            this.勘察信息 = e


            this.信息检验.勘查分析.check()
            this.信息检验.勘查信息.check()
            //this.信息检验.配备典型.check()
            return e
        })
    }
    查询表箱配备信息(gzdxx = this.gzdxx) {
        return fetch(THISURL + "/YKZX/jlyx/zcgl/jljlxpb/jljlxpbgz.do", {
            "headers": {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": json2urlencoded({
                "gzdbh": gzdxx.dataWraps.dataWrapGzdxx.data.gzdbh,
                "rwh": gzdxx.dataWraps.dataWrap.dataList.find(e => { return e.hjmc == "现场服务" }).rwh, //根据工单信息。找最后一条现场服务
                "dqbmString": gzdxx.dataWraps.dataWrapGzdxx.data.dqbm,
                "action": "queryJlx",
            }),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(e => e.json()).then(e => {

            if (e.dataWraps.jlxzcjlsecDataWrap.dataList.length == 1) {
                let temp43453 = { "1041001": "单相", "1041002": "三相" }[e.dataWraps.jlxzcjlsecDataWrap.dataList[0].bxlxdm]
                if (!temp43453) {
                    this.info.配箱状态 = "已配备表箱，型号超出预期" + e.dataWraps.jlxzcjlsecDataWrap.dataList[0].bxlxdm
                } else {
                    this.info.配箱状态 = temp43453 + "表箱"
                }
            }
            else if (e.dataWraps.jlxzcjlsecDataWrap.dataList.length > 1) {
                console.warn("多个表箱")
                this.info.配箱状态 = "多个表箱"
                e.dataWraps.jlxzcjlsecDataWrap.dataList.forEach(e => { console.log("已配" + { "1041001": "单相", "1041002": "三相" }[e.bxlxdm] + "表箱") })
            }
            else if (e.dataWraps.jlxzcjlsecDataWrap.dataList.length == 0) {
                console.log("当前没有配备表箱")
                this.info.配箱状态 = "没配表箱"
            } else {
                this.info.配箱状态 = "未知错误"
                throw "未知错误"
            }


            this.jlxzcjlsecDataWrap = e.dataWraps.jlxzcjlsecDataWrap
            return e
        })
    }
    装拆信息录入界面(gzdxx = this.gzdxx) {
        //获取详细信息
        return fetch(THISURL + "/YKZX/jlyx/zcgl/jlzzzcxxlr/gdjlJlzzzcxxlr.do?" + json2urlencoded({
            "gzdbh": gzdxx.dataWraps.dataWrapGzdxx.data.gzdbh,
            "rwh": gzdxx.dataWraps.dataWrap.dataList.find(e => { return e.hjmc == "现场服务" }).rwh,//根据工单信息。找最后一条现场服务
            "isEdit": "Y",
            "isFh": "DB",
            "isBl": "bl",
            "dblx": "1",
            "tsdbz": "1",
            "isBatch": "0",
            "fbjoGDXsz": "1",
            "ywzlbh": gzdxx.dataWraps.dataWrapGzdxx.data.ywzl,
            "multitaskMenuFlag": "null",
            "multitaskMenuId": "null"
        }), {
            "headers": {
                "content-type": "application/x-www-form-urlencoded",
            },
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": json2urlencoded({
                "dataWrapGzdxx.jsonData": JSON.stringify({
                    "dataList": [], "pageInfo": { "allPageNum": 0, "allRowNum": 0, "curPageNum": 0, "rowOfPage": 0 }, "data": gzdxx.dataWraps.dataWrapGzdxx.data, "query": {}
                })
            }),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(e => { return e.text() })
            .then(提取textarea)
            .then(e => { this.yhbh = e.parameters.yhbh; return e })
    }


    添加表箱(boxInfo, gzdxx = this.gzdxx, yhbh = this.yhbh) {

        console.log("正在操作添加表箱")
        console.log(boxInfo)
        return fetch(THISURL + "/YKZX/jlyx/zcgl/fqjlzcrw/fqjlzcrwJlxwhgz.do", {
            "headers": {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": json2urlencoded({
                "jlxzcjlDataWrap.jsonData": JSON.stringify({
                    "data":
                    {
                        "gzdbh": gzdxx.dataWraps.dataWrapGzdxx.data.gzdbh,//工单
                        "yhbh": yhbh,//户号
                        "xbdm": "01",
                        "emp_id": "1",
                        "cqgsdm": "1",//产权归属代码
                        "wzplbm": boxInfo.wzplbm,//物资编码 单相"010039102223" 三相 "010039102511"
                        "bxlxdm": boxInfo.bxlxdm,//单相"1041001" 三相"1041002"
                        "bwzs": 1
                    }
                }),
                "shuliang": "1",
                "zxbzbm": gzdxx.parameters.xzryZzbm,
                "action": "onAddJlx",
                "IN_PARAM_SYS_TAG": ""
            }),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(e => e.json())
    }
    保存表箱信息(gzdxx = this.gzdxx) {
        return this.查询表箱配备信息().then(res => res.dataWraps.jlxzcjlsecDataWrap).then(
            jlxzcjlsecDataWrap => {
                return fetch(THISURL + "/YKZX/jlyx/zcgl/jljlxpb/jljlxpbgz.do", {
                    "headers": {
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    },
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "body": json2urlencoded({
                        "jlxzcjlsecDataWrap.jsonData": JSON.stringify(
                            jlxzcjlsecDataWrap
                        ),
                        "zxbzbm": gzdxx.parameters.xzryZzbm,
                        "action": "onSaveJlx",
                        "IN_PARAM_SYS_TAG": ""
                    }),
                    "method": "POST",
                    "mode": "cors",
                    "credentials": "include"
                }).then(e => e.json()).then(e => {
                    if (e.errorMessage.length) {
                        throw e.errorMessage
                    }
                    return jlxzcjlsecDataWrap
                })
            }
        )
    }
    删除所有表箱需求(dataList, gzdxx = this.gzdxx) {
        console.log("正在操作删除所有表箱")
        if (!dataList.length) { return }
        return fetch(THISURL + "/YKZX/jlyx/zcgl/jljlxpb/jljlxpbgz.do", {
            "headers": {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": json2urlencoded({
                "jlxzcjlsecDataWrap.jsonData": JSON.stringify({ "pageInfo": { "allPageNum": 1, "allRowNum": 1, "curPageNum": 1, "rowOfPage": 200 }, "dsName": "null", "dataList": dataList }),
                "LB": "10",
                "gzdbh": gzdxx.dataWraps.dataWrapGzdxx.data.gzdbh,
                "dqbmString": gzdxx.dataWraps.dataWrapGzdxx.data.dqbm,
                "action": "onDelSb",
                "IN_PARAM_SYS_TAG": ""
            }),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(e => e.json())
    }




    打印服务情况表(gzdbh = this.gzdbh, type = "pdf", fileName = this.gzdbh) {



            let bdbs = undefined
            let reportName = undefined
            let cacheId = undefined
            let reportName2 = undefined
        return 加入打印队列(p)

        function p() {

            return AAAAA(gzdbh)
                .then(BBBBB)
                .then(CCCCC)
                // .then(DDDDD)
                //.then(EEEEE)
                .then(() => {

                    if (type == "excel") { return 生成(type, fileName) }
                    else {
                        return 生成2(type, fileName)
                    }
                }
                )
        }

        function AAAAA(gzdbh) {
            return fetch(THISURL + "/YKZX/yk/xckc/ykXckc.do", {
                "headers": {
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "x-requested-with": "XMLHttpRequest"
                },

                "body": json2urlencoded({
                    "gzdbh": gzdbh,
                    "dymc": "打印服务情况表",
                    "action": "scbdbs",
                    "IN_PARAM_SYS_TAG": ""
                }),
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            }).then(e => e.json()).then(e => {
                bdbs = e.parameters.bdbs;
                return bdbs
            }
            )
        }
        function BBBBB() {
            return fetch(THISURL + "/PMS/yk/xckc/ykXckcdy.do?" + json2urlencoded({
                "gzdbh": gzdbh,
                "fwqkb": "fwqkb",
                "appcontext": "PMS",
                "multitaskMenuFlag": "null",
                "multitaskMenuId": "null"
            }), {
                "headers": {
                    "content-type": "application/x-www-form-urlencoded",
                },
                "body": json2urlencoded({
                    "action": "printMulti",
                    "reportName": "../printFiles/wcbb/yk/ykjmxcfwqkbnew.raq",
                    "reportDSName": "ds1",
                    "currentDataWrap": "",
                    "viewResult": "printM",//printM2
                    "printFormId": bdbs,
                }),
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            }).then(e => {
                return e.text()
            }
            ).then(text => {
                let temp = text.substr(text.indexOf(`name="reportName" value="`) + 25)
                temp = temp.substr(0, temp.indexOf(`/>`) - 2)
                let temp2 = text.substr(text.indexOf(`name="cacheId" value="`) + 22)
                temp2 = temp2.substr(0, temp2.indexOf(`/>`) - 2)


                let temp3 = text.substr(text.indexOf(`"reportName":`) + 14)
                temp3 = temp3.substr(0, temp3.indexOf(`"funcBarFontColo`) - 2)

                reportName = temp
                cacheId = temp2
                reportName2 = temp3
                return temp
            }
            )
        }
        function CCCCC() {
            return fetch(THISURL + "/PMS/viewReportServlet", {
                "headers": {
                    "content-type": "application/x-www-form-urlencoded",
                },

                "body": json2urlencoded({
                    "action": "3",
                    "reportName": reportName,
                    "cacheId": cacheId,
                    "width": "0",
                    "height": "0",
                    "needPage": "no"
                }),
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            });
        }
        function DDDDD() {
            return fetch(THISURL + "/PMS/viewReportServlet", {
                "headers": {
                    "content-type": "application/x-www-form-urlencoded",
                },

                "body": json2urlencoded({
                    "action": "4",
                    "reportName": reportName,
                    "cacheId": cacheId,
                    "isInput": "true",
                    "page": "0",
                    "name": "report",
                    "scale": "1",
                    "needScroll": "false",
                    "scrollWidth": "600",
                    "scrollHeight": "400",
                    "width": "0",
                    "height": "0",
                    "needLinkStyle": "true",
                    "selectText": "false",
                    "contextPath": "/PMS"
                }),
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            });
        }
        function EEEEE() {
            return fetch(THISURL + "/PMS/viewReportServlet", {
                "headers": {
                    "content-type": "application/x-www-form-urlencoded",
                },
                "body": json2urlencoded({
                    "action": "8",
                    "reportName": reportName,
                    "cacheId": cacheId,
                    "saveAsName": "",
                    "remoteSavePath": ""
                }),
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            });
        }

        function 生成(type, fileName = fileName) {
            let aaa = THISURL + "/PMS/ExportServlet?" + json2urlencoded({
                "action": "6",
                "format": type,
                "object": "complex",
                "isNeedFormula": "0",
                "dispRatio": "100",
                "pdfExportStyle": "text,1",
                "excelPageStyle": "0",
                "excelFormat": "2003",
                "wordFormat": "2003",
                "reportName": reportName,
                "cacheId": cacheId,
                "vrCacheId": "VR_2",
                "saveAsName": fileName,
                "viewReportListener": "",
                "needExportRat": "no",
                "needExportFlashGraph": "yes",
                "reportType": "1",
                "serverPath": reportName,
                "textDataSeparator": "",
                "textDataLineBreak": "",
            })
            return 下载(aaa, type, fileName)



        }
        function 生成2(type, fileName = fileName) {
            let aaa = THISURL + "/PMS/viewReportServlet?" + json2urlencoded({
                "action": "6",
                "format": type,
                "isNeedFormula": "0",
                "dispRatio": "100",
                "reportName": reportName,
                "cacheId": cacheId,
                "textDataSeparator": "",
                "textDataLineBreak": "",
                "excelPageStyle": "0",
                "excelFormat": "null",
                "wordFormat": "null",
                "excelUsePaperSize": "no",
                "width": "0",
                "height": "0",
                "columns": "0",
                "pdfExportStyle": "graph,1",
                "backAndRefresh": "yes",
                "saveAsName": "hggiu1"//encodeURIComponent(fileName)
            })

            return 下载(aaa, type, fileName)

        }
        function 下载(link, type, fileName = fileName) {


            return fetch(link, {
                "headers": {
                    "content-type": "application/x-www-form-urlencoded",
                },
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            }).then(
                res => res.blob()
            ).then(
                blob => {

                    const downloadUrl = URL.createObjectURL(blob)
                    let a = document.createElement('a')
                    a.download = fileName + { "pdf": ".pdf", "word": ".doc", "excel": ".xls" }[type]
                    a.href = downloadUrl
                    document.body.appendChild(a)
                    a.click()
                    a.remove()
                    return true

                }

            )



        }

    }
    移除() {
        配表队列.splice(配表队列.indexOf(this), 1)
    }
}



/////////////////
function 打印队列() {
    let a = (async () => { })()
    return addarr
    function addarr(func) {
        let b = a.then(() => { return func() }, () => { return func() })
        a = b
        return b
    }
}
////////////////



function json2urlencoded(obj) {
    let arr = []
    for (let key in obj) {
        arr.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    }
    let str = arr.join('&')
    return str

}

function 提取textarea(text) {

    let temp = text.substr(text.indexOf(`id="json_textarea">`) + 20)
    temp = temp.substr(0, temp.indexOf(`</textarea>`))
    return JSON.parse(temp)
}

/*
function 提取textarea(text) {
    let temp = document.createElement("a")
    temp.innerHTML = text
    return JSON.parse(temp.querySelector("#json_textarea").innerText)
}
*/
/*
function returnjson(e) {
    return e.json()
}
/
/*
function urlencoded2json(urlencoded) {
    let a = urlencoded.split("&")
    let result = {}
    a.forEach(e => { result[decodeURIComponent(e.split("=")[0])] = decodeURIComponent(e.split("=")[1]) })
    return result
}
*/

export default {
    配表流程,
    配表队列
}