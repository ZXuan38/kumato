
import 硬性数据 from "./database"
const THISURL = location.hostname == "localhost" ? location.origin : "http://10.150.23.1:8010"
console.log(硬性数据)

class 勘查意见检查 {
    constructor(配备流程) {
        this.配备流程 = 配备流程
        this.state = 0
        this.info = "勘查意见"
        this.color = "gery"
        this.type = "error"
        this.click = this.check
        this.suggestion = {
            opinion: undefined,
            JXFSDM: undefined,
            isNeedBox: undefined,
            slots: undefined,
        }
    }

    check() {
        this.color = undefined
        if (!this.配备流程.勘察信息) {
            this.info = "未有勘查信息"
            this.type = "error"
        } else {

            this.info = this.配备流程.勘察信息.advice.values.KCYJ

            let info2 = this.配备流程.勘察信息.advice.values.KCYJ
                .replaceAll("増", "增")
                .replace(/03[a-zA-Z0-9]{20,24}/, "")//去除电表号
                .replace(/[JjIiNnGg]{0,4}经?度?[:：;；，, ]{0,2}\d{1,}.\d{3,}/, "")//去除经度
                .replace(/[WwEeIi]{0,3}纬?位?度?[:：;；，, ]{0,2}\d{1,}.\d{3,}/, "")//去除纬度
                .replace(/[\n\r\t ，。.,;:；：、]{1,}/g, " ").split(" ").filter(e => e.length).join("，")
                .replaceAll("电表箱", "表箱")
                .replace(/[三3][相位]表?箱/g, "三相表箱")
                .replace(/[需要与用配换]{0,}三[相位]表?箱/g, "三相表箱")
                .replace(/[需要与用配换]{1,}表箱/g, "配表箱")
                .replace(/位配?表箱一?个?/g, "位表箱")
                .replace(/六位表箱一?个?/g, "6位表箱")

                .replace("按规办理，", "")
                .replaceAll("一个", "")

                + "。"
            console.log([this.配备流程.gzdbh, info2])

            this.info = info2


            //同意増容更换表前线。     =》
            //换线，不用换表。         =》？

            //换表箱，换线。
            let info3 = info2.replace("同意，", "")

            if (["。", "增容。"].includes(info2.replaceAll("同意", ""))) {
                info2 = "同意⚪"
                this.type = "success"
            } else if (info3.includes("箱") || info3.includes("表")) {
                this.type = "warning"

                if (['配单相表箱。',
                    '单相表箱。',
                    '配单相表箱。',
                    '单相表箱。'
                ].includes(info3)
                ) {
                    info2 = "配单相表箱（单相80A + 箱）⚪"
                    this.suggestion.opinion = !0
                    this.suggestion.JXFSDM = "1"
                    this.suggestion.isNeedBox = !0
                    this.suggestion.slots = 1
                } else if (['三相表箱。', '配三相表箱。'
                ].includes(info3)
                ) {
                    info2 = "配三相表箱⚪"
                    this.suggestion.opinion = !0
                    this.suggestion.JXFSDM = "3"
                    this.suggestion.isNeedBox = !0
                    this.suggestion.slots = 1
                } else
                    if (['配一位表箱。',
                        '配一位配表箱。',
                        '配表箱。', '换表箱，不用换表。'
                    ].includes(info3)
                    ) {
                        info2 = "配箱⚪"
                        this.suggestion.opinion = !0
                        this.suggestion.isNeedBox = !0
                        this.suggestion.slots = 1
                    } else if (['不配表箱。',
                        '不用配表箱。',
                        '不用表箱。',
                        '按规办理，不配表箱。',
                        '已有表箱。'

                    ].includes(info3)
                    ) {
                        info2 = "不配箱⚪"
                        this.suggestion.opinion = !0
                        this.suggestion.isNeedBox = !1
                        this.suggestion.slots = 0
                    } else if (['已有6位表箱。',
                        '已有12位表箱。',

                    ].includes(info3)
                    ) {
                        info2 = "不配箱⚪(已有表箱)"
                        this.suggestion.opinion = !0
                        this.suggestion.isNeedBox = !1
                        this.suggestion.slots = 0
                    } else if (['配6位表箱。'
                    ].includes(info3)
                    ) {
                        info2 = "配6位表箱⚪"
                        this.suggestion.opinion = !0
                        this.suggestion.isNeedBox = !0
                        this.suggestion.slots = 6
                    } else if (['配12位表箱。'
                    ].includes(info3)
                    ) {
                        info2 = "配12位表箱⚪"
                        this.suggestion.opinion = !0
                        this.suggestion.isNeedBox = !0
                        this.suggestion.slots = 12
                    }
            } else {
                this.type = "info"
            }
            this.info = info2
        }
        return this.suggestion
    }
}

class 配备典型 {
    constructor(配备流程) {
        this.配备流程 = 配备流程
        this.state = 0
        this.info = "配备方式"
        this.color = "gery"
        this.type = "success"
        this.click = this.check
    }
    check() {
        this.color = undefined
        if (!this.配备流程.勘察信息) {
            this.info = "未有勘查信息"
            this.type = "error"
            return
        }
        let measureEntitiesBGBZDM = this.配备流程.勘察信息.measureEntities.map(e => { return e.values.BGBZDM }) //计量点
        let meterEntitiesBGBZDM = this.配备流程.勘察信息.meterEntities.map(e => { return e.values.BGBZDM })//电表数
        let powerEntitiesBGBZDM = this.配备流程.勘察信息.powerEntities.map(e => { return e.values.BGBZDM })//电源点
        let 计量点摘要2 = this.配备流程.勘察信息.measureEntities.map(e => e.values)
        //所有计量点的信息 数组


        let 计量点摘要 = {}
        计量点摘要2.filter(values => { return ["10", "15", "25", "35", "00"].includes(values.BGBZDM) }).forEach(e => { return 计量点摘要[e.JLDBH] = e })
        console.log(计量点摘要 = JSON.parse(JSON.stringify(计量点摘要)))
        //所有变更后、抄表后、没变更过、新装的信息




        let ywzl = this.配备流程.gzdxx.dataWraps.dataWrapGzdxx.data.ywzl
        const THAT = this.配备流程

        /*
                if (meterEntities.length != 1) {
                    throw "powerEntities1"
                }
        */
        if (["F-CSG-MK0513-03-01", "F-CSG-MK0513-02-01", "F-CSG-MK0513-02-04"].includes(ywzl) //属于[居新、非新、临电]       
        ) {
            if (
                measureEntitiesBGBZDM.length == 1 && measureEntitiesBGBZDM[0] == "10" //电源数量1、新装
                && meterEntitiesBGBZDM.length == 1 && meterEntitiesBGBZDM[0] == "10"//电表数量1、新装
                && powerEntitiesBGBZDM.length == 1 && powerEntitiesBGBZDM[0] == "10"//计量点数量1、新装
            ) {
                this.配备流程.info.配备典型 = "典型新装"
                console.log("典型新装")
                this.info = "典型新装"

                let 计量点 = 计量点摘要2[0]
                this.info += `【${计量点.YDRL}kw】,${硬性数据.电价信息[计量点.DJDM].电价}`

                this.type = "success"
                获取新表状态()

                return
            } else {
                this.配备流程.info.配备典型 = ""

                this.info = "新装--非典型"
                this.type = "warn"

                throw "新装--非典型"
            }

        } else if (
            ["F-CSG-MK0513-03-02", "F-CSG-MK0513-02-02"].includes(ywzl) //属于[居增、非增]   
        ) {
            if (powerEntitiesBGBZDM.length == 2//两个电源点信息
                && powerEntitiesBGBZDM.filter(e => { return e == "20" }).length == 1//一个变更前
                && powerEntitiesBGBZDM.filter(e => { return e == "25" }).length == 1//一个变更后
                && measureEntitiesBGBZDM.length == 2//两个计量点信息
                && measureEntitiesBGBZDM.filter(e => { return e == "20" }).length == 1//一个变更前
                && measureEntitiesBGBZDM.filter(e => { return e == "25" }).length == 1//一个变更后
                && meterEntitiesBGBZDM.length == 2//两个电表信息
                && meterEntitiesBGBZDM.filter(e => { return e == "10" }).length == 1//一个新装
                && meterEntitiesBGBZDM.filter(e => { return e == "15" }).length == 1//一个拆除
            ) {
                this.info = "典型（同计量点一拆一装换表）"
                let 计量点前 = 计量点摘要2.find(e => { return e.BGBZDM == "20" })
                let 计量点后 = 计量点摘要2.find(e => { return e.BGBZDM == "25" })
                this.info += `${计量点前.YDRL}=>【${计量点后.YDRL}kw 】${硬性数据.电价信息[计量点后.DJDM].电价}`


                this.type = "success"



                获取新表状态()
                return
            } else if (
                powerEntitiesBGBZDM.length == 2//两个电源点信息
                && powerEntitiesBGBZDM.filter(e => { return e == "20" }).length == 1//一个变更前
                && powerEntitiesBGBZDM.filter(e => { return e == "25" }).length == 1//一个变更后
                && measureEntitiesBGBZDM.length == 3//两个计量点信息
                && measureEntitiesBGBZDM.filter(e => { return e == "10" }).length == 1//一个新增
                && measureEntitiesBGBZDM.filter(e => { return e == "20" }).length == 1//一个变更前
                && measureEntitiesBGBZDM.filter(e => { return e == "25" }).length == 1//一个变更后
                && meterEntitiesBGBZDM.length == 3//两个电表信息
                && meterEntitiesBGBZDM.filter(e => { return e == "10" }).length == 1//一个新装
                && meterEntitiesBGBZDM.filter(e => { return e == "30" }).length == 1//一个抄表前
                && meterEntitiesBGBZDM.filter(e => { return e == "35" }).length == 1//一个抄表后
            ) {

                this.info = "新增计量点（如加充电桩）"

                let 计量点新 = 计量点摘要2.find(e => { return e.BGBZDM == "10" })
                // let 计量点前 = 计量点摘要2.find(e => { return e.BGBZDM == "20" })
                let 计量点后 = 计量点摘要2.find(e => { return e.BGBZDM == "25" })

                this.info += `新：【${计量点新.YDRL} kw】 ${硬性数据.电价信息[计量点新.DJDM].电价}，原：【${计量点后.YDRL} kw】 ${硬性数据.电价信息[计量点后.DJDM].电价}`

                this.type = "success"
                获取新表状态()
                return
            } else if (powerEntitiesBGBZDM.length == 2//两个电源点信息
                && powerEntitiesBGBZDM.filter(e => { return e == "20" }).length == 1//一个变更前
                && powerEntitiesBGBZDM.filter(e => { return e == "25" }).length == 1//一个变更后
                && measureEntitiesBGBZDM.length == 2//两个计量点信息
                && measureEntitiesBGBZDM.filter(e => { return e == "20" }).length == 1//一个变更前
                && measureEntitiesBGBZDM.filter(e => { return e == "25" }).length == 1//一个变更后
                && meterEntitiesBGBZDM.length == 2//两个电表信息
                && meterEntitiesBGBZDM.filter(e => { return e == "30" }).length == 1//一个抄表前
                && meterEntitiesBGBZDM.filter(e => { return e == "35" }).length == 1//一个抄表后
            ) {

                this.info = "不换表增容（换表前线）"
                let 计量点前 = 计量点摘要2.find(e => { return e.BGBZDM == "20" })
                let 计量点后 = 计量点摘要2.find(e => { return e.BGBZDM == "25" })
                this.info += `${计量点前.YDRL}=>【${计量点后.YDRL} kw】 ${硬性数据.电价信息[计量点后.DJDM].电价}`


                this.type = "success"
                获取新表状态()
            }
            else {
                this.info = "非典型增容"
                this.type = "error"
                //    throw "非典型增容"
            }

        } else if (["F-CSG-MK0514-11-01"].includes(ywzl))//属于[销户]
        {
            this.info = "销户"
            this.type = "error"
            throw "销户"
        } else {

            this.info = "未知设定"
            this.type = "error"
            throw "未知设定"
        }
        function 获取新表状态() {
            let a = THAT.勘察信息.meterEntities.filter(e => { return e.values.BGBZDM == "10" })
            if (a.length > 1) {
                THAT.info.表计状态 = "有多个新表"
                return
            } else if (a.length == 0) {
                THAT.info.表计状态 = "没装新表"
                return
            }
            a = a[0].values
            if (a.BDDLDM == "82" && a.XXLBDM == "01" && a.EDDYDM == "1") {
                THAT.info.表计状态 = "单相60A"
                console.log("单相60A，楼盘内置开关，集中多位表箱")
            } else if (
                a.BDDLDM == "83" && a.XXLBDM == "01" && a.EDDYDM == "1"
            ) {
                THAT.info.表计状态 = "单相80A"
                console.log("单相80A，外置开关 220V")
            }
            else if (
                a.BDDLDM == "84" && a.XXLBDM == "03" && a.EDDYDM == "2"
            ) {
                THAT.info.表计状态 = "三相80A直入式"
                console.log("三相80A直入式")
            } else if (
                a.BDDLDM == "79" && a.XXLBDM == "03" && a.EDDYDM == "2"
            ) {
                THAT.info.表计状态 = "三相带互感"
                console.warn("三相带互感，中止")
            }
        }


    }
    新增表计功率显示() {

    }
}

class 工作单类别 {
    constructor(配备流程) {
        this.配备流程 = 配备流程
        this.state = 0
        this.info = "工单类别"
        this.color = "gery"
        this.type = "success"
        this.click = this.check
    }

    check() {
        this.color = undefined
        if (!this.配备流程.gzdxx) {
            this.info = "未有工作单信息"
            this.type = "error"
        } else {

            let a = this.配备流程.gzdxx.dataWraps.dataWrapGzdxx.data.ywzl
            let b = {
                "F-CSG-MK0513-03-01": "低压居民新装",
                "F-CSG-MK0513-02-01": "低压非居民新装",
                "F-CSG-MK0513-02-04": "低压非居民临时用电",
                "F-CSG-MK0513-03-02": "低压居民增容",
                "F-CSG-MK0513-02-02": "低压非居民增容",
                "F-CSG-MK0514-11-01": "销户"
            }[a]
            if (!b) {
                this.info = a
                this.type = "error"
            } else {
                this.info = b
                this.type = "success"
            }


        }
    }
}
class 工作单环节 {
    constructor(配备流程) {
        this.配备流程 = 配备流程
        this.state = 0
        this.info = "工单环节"
        this.color = "gery"
        this.type = "success"
        this.click = this.check
    }

    check() {
        this.color = undefined
        if (!this.配备流程.gzdxx) {
            this.info = "未有工作单信息"
            this.type = "error"
        } else {
            console.log(this.配备流程.gzdxx)
            let a = this.配备流程.gzdxx.dataWraps.dataWrap.dataList[0].hjmc
            if (["现场服务"].includes(a)) {
                this.info = a
                this.type = "success"
            } else {
                this.info = a
                this.type = "error"
            }


        }
    }
}

class 计量点分析 {
    constructor(singleMuiltmeasureEntitiesInfo, isOnlyOneChange, 配备流程) {
        this.配备流程 = 配备流程
        this.data = singleMuiltmeasureEntitiesInfo
        this.JLDBH = singleMuiltmeasureEntitiesInfo.measureEntities[0].JLDBH
        this.不合规 = []
        this.isOnlyOneChange = isOnlyOneChange
        this.勘察配置意见 = 配备流程.信息检验.勘查信息.check()
        this.suggestion = {
            opnion: [],
            boxInfo: [],
            meterInfo: [],
            inductInfo: [],
            conclusion: undefined,
            buttons: []
        }
        this.分析 = {
            计量点变化方式: { "1": "新", "2": "拆", "3": "改", "0": "意料之外" }[this.分析计量点变化方式()],
            供电变化: this.分析供电改变(),
            表计变化: { "1": "新", "2": "拆", "3": "换", "4": "抄表不换", "0": "意料之外" }[this.分析表计变化方式()],
            新表配置: this.当前表计配置信息(),
            新计量点信息: this.计量更新信息(),
            计量更新信息摘要: this.计量更新信息摘要(),
            根据计量点信息配表: this.根据计量点信息配表(),
            配备典型: this.典型分析(),
            测试: this.已配电表信息()
        }
        this.表箱信息 = {
            状态: "未查询"
        }

        this.分析.根据旧表信息配表 = this.根据旧表信息配表()
        this.查询表箱()
        this.最终配表()
    }



    一键配备(BDDLDM, isNeedBox) {

        let k = 硬性数据.电表类型[BDDLDM].withbox.data
        return Promise.all([this.配图信息录入(BDDLDM), this.配箱(isNeedBox && k)]).then(()=>{return this.配备流程.检查()})
    }



    配箱(data) {

        //console.log(硬性数据.表箱信息[单三相].data)
        return this.删除表箱().then(() => { return data && this.添加表箱(data) })//.then(()=>{return this.保存表箱信息()})
    }

    查询表箱() {
        return 查询表箱.call(this)
    }
    添加表箱(boxModel) {
        return 添加表箱.call(this, boxModel).then(() => { return this.查询表箱() }).then(() => { return this.保存表箱信息() })
    }
    删除表箱() {
        return this.查询表箱().then(jlxzcjlsecDataWrap => { return 删除所有表箱.call(this, jlxzcjlsecDataWrap.dataList) }).then(() => { return this.查询表箱() })
    }
    保存表箱信息() {
        return 保存表箱信息.call(this).then(() => { return 保存表箱设备列表.call(this) })
    }

    已配电表信息() {
        let meterEntities = this.data.meterEntities.filter(e => { return ["10"].includes(e.BGBZDM) })
        switch (meterEntities.length) {
            case 0:
                return "不需要配表"
            // break;
            case 1:
                return 硬性数据.电表类型[meterEntities[0].BDDLDM]?硬性数据.电表类型[meterEntities[0].BDDLDM].name:      硬性数据.相线类别类型[meterEntities[0].XXLBDM] + 硬性数据.标定电流类型[meterEntities[0].BDDLDM]
            //  break;
            default: return "同一计量点配多个电表？"
            //break;
        }
    }

    分析计量点变化方式() {
        let measureEntities = this.data.measureEntities
        if (measureEntities.length == 1 && measureEntities[0].BGBZDM == "10") {
            return 1 //装
        } else if (
            measureEntities.length == 1 && measureEntities[0].BGBZDM == "15") {
            return 2 //拆
        } else if (
            measureEntities.length == 2 && measureEntities[0].BGBZDM == "20" && measureEntities[1].BGBZDM == "25") {
            return 3 //换
        } else {
            console.warn("计量点变化超出预期")
            return 0
        }
    }
    分析供电改变() {
        let measureEntities = this.data.measureEntities
        if (this.分析计量点变化方式() == 3) {
            let a = {
                "YDRL": "用电容量",
                "JLZZFLDM": "计量装置分类",
                "JXFSDM": "接线方式",
                "CTBBDM": "TA变比",
            }
            let isChange = []
            for (let index in a) {
                if (measureEntities[0][index] != measureEntities[1][index]) {
                    isChange.push(index)
                }
            }
            return isChange
        } else {
            return "无换表"
        }



    }
    分析表计变化方式() {
        let meterEntities = this.data.meterEntities
        if (meterEntities.length == 1 && meterEntities[0].BGBZDM == "10") {
            return 1 //装
        } else if (
            meterEntities.length == 1 && meterEntities[0].BGBZDM == "15") {
            return 2 //拆
        } else if (
            meterEntities.length == 2 && meterEntities[0].BGBZDM == "10" && meterEntities[1].BGBZDM == "15") {
            return 3 //一装一拆
        } else if (
            meterEntities.length == 2 && meterEntities[0].BGBZDM == "30" && meterEntities[1].BGBZDM == "35") {
            return 4 //抄表
        } else {
            console.warn("表计变化超出预期")
            return 0
        }
    }
    当前表计配置信息() {
        let meterEntities = this.data.meterEntities
        if (this.分析表计变化方式()) {
            return meterEntities.find(e => e.BGBZDM == "10")
        } else {
            console.warn("没有需要配置表计")
            return undefined
        }

    }
    计量更新信息() {
        return [...this.data.measureEntities].pop()
    }
    计量更新信息摘要() {//最后生效的计量点信息
        let a = this.计量更新信息()
        let b = {
            "DJDM": "电价代码",
            "YDRL": "用电容量",
            "JLZZFLDM": "计量装置分类",
            "JXFSDM": "接线方式",
            "CTBBDM": "TA变比",
        }

        for (let i in b) {

            b[i] = a[i]
        }
        return b
    }

    需要上互感表标识() {
        let CTBBDM = this.计量更新信息摘要().CTBBDM
    }


    根据计量点信息配表() {
        if (this.当前表计配置信息()) {//前提需要换表
            let jld = this.计量更新信息摘要()
            if (["1"].includes(jld.JXFSDM)) {//单相
                let a = ["82", "83"]
                this.suggestion.meterInfo.push(...a)
                return a
            }
            else if (["2", "3"].includes(jld.JXFSDM) && jld.CTBBDM == "") {
                let a = ["84"]
                this.suggestion.meterInfo.push(...a)
                return a
            }
            else if (["2", "3"].includes(jld.JXFSDM) && jld.CTBBDM == "12") {
                console.log("互感+200")
                let a = ["79"]
                this.suggestion.meterInfo.push(...a)
                return a
            }
            else if (["2", "3"].includes(jld.JXFSDM) && jld.CTBBDM == "14") {
                console.log("互感+300")
                let a = ["79"]
                this.suggestion.meterInfo.push(...a)
                return a
            }
            else if (["2", "3"].includes(jld.JXFSDM) && jld.CTBBDM == "16") {
                console.log("互感+500")
                let a = ["79"]
                this.suggestion.meterInfo.push(...a)
                return a
            } else {
                console.warn("配表出错")
            }
            console.log(jld, this.suggestion.meterInfo)
            return undefined

        } else {
            return undefined
        }
    }

    根据旧表信息配表() {//用于受电装置变更
        let a = this.分析计量点变化方式()
        let b = this.分析表计变化方式()
        let c = this.分析供电改变()
        if (a == 3 && c.length == 0 && b == 3) {//无增容
            let e = this.data.meterEntities.find(m => { return m.BGBZDM == "15" })
            let f = 硬性数据.电表类型[e.BDDLDM].data

            if (this.计量更新信息摘要().JXFSDM != 1) {

                return this.分析.根据计量点信息配表//根据计量点信息配表()
            }
            if (["82", "83"].includes(e.BDDLDM)) {
                return [f]
            }
            else if (e.BDDLDM == "73") {
                return [硬性数据.电表类型["82"].data, 硬性数据.电表类型["83"].data]
            }

        }
    }

    典型分析() {
        let a = this.分析计量点变化方式()
        let b = this.分析表计变化方式()
        let c = this.分析供电改变()
        //let d = `【${this.计量更新信息().YDRL}kw${this.根据计量点信息配表()}】`
        if (a == 1 && b == 1) {
            //"典型新装，配" + d

            return 1
        } else if (a == 2 && b == 2) {
            //"典型拆除"
            return 2
        } else if (a == 3 && c.length == 0 && b == 4) {
            //"无变化，忽略。但有可能要换ct之类"
            return 3
        } else if (a == 3 && c.length != 0 && b == 4) {
            // "无换表增容，不需要配表。可能需要开封接线或换箱"
            return 4
        } else if (a == 3 && c.length == 0 && b == 3) {
            //"无增容换表，受电装置变更？或换箱"
            this.根据旧表信息配表()
            return 5
        } else if (a == 3 && c.length != 0 && b == 3) {
            //"增容一装一拆，配" + d
            return 6
        } else {
            console.warn("配表方法超出预期")
            return 0
        }
    }

    最终配表() {
        let 勘察配置意见 = this.勘察配置意见
        let 配备典型 = this.分析.配备典型
        let suggestion = this.suggestion
        console.log(勘察配置意见, 配备典型, suggestion)

        if (suggestion.meterInfo.length == 0) {
            this.suggestion.conclusion = "不需要配表"
        }

        if (["0", "2"].includes(配备典型)) {
            this.suggestion.conclusion = "不需要配表配箱"
            return
        }

        if (!勘察配置意见 || !勘察配置意见.opinion) {
            if (["3", "4", "5"].includes(配备典型)) {//无换表增容或无增容换表默认同意方向
                配表配箱(["82", "84", "79"], 0)//换表不配箱
            } else {//
                配表配箱(["82"], 0)//82不配箱
                配表配箱(["83", "84", "79"], 1)//正常配箱
            }
        } else if (勘察配置意见.slots == 0) {
            配表配箱(["82", "84"], 0)//82不配箱
        } else if (勘察配置意见.JXFSDM == '1' && 勘察配置意见.slots == 1) {
            配表配箱(["83"], 1)//配单80+箱
        } else if (勘察配置意见.JXFSDM == '3' && 勘察配置意见.slots == 1) {
            配表配箱(["84", "79"], 1)//三相或带互感+箱
        } else if (勘察配置意见.slots == 1) {
            配表配箱(["83", "84", "79"], 1)//配单位箱
        } else if (勘察配置意见.slots > 1) {
            配表配箱(["82", "84"], 勘察配置意见.slots)//配单位箱
        } else {
            this.suggestion.conclusion = "没有配表结论"
        }


        if (suggestion.opnion.length) {
            let c = suggestion.opnion.map(result => {
                let bx = ""
                switch (result[1]) {
                    case 0:
                        bx = "不配箱"
                        break;
                    case 1:
                        bx = "配箱"
                        break;
                    default:
                        bx = `配${result[1]}位箱`
                        break;

                }


                suggestion.buttons.push(
                    {
                        des: `${硬性数据.电表类型[result[0]].name}+${result[1] ? "箱" : "无箱"}`,
                        func: ()=>{return this.一键配备(result[0], result[1]) 
                        }
                    })


                return `配${硬性数据.电表类型[result[0]].name}，${bx}。`
            })






            suggestion.conclusion = c.join("\n或")

        }


        suggestion.conclusion =
            {
                "1": "标准【新装】",
                "2": "标准【拆除】",
                "3": "【无变化】",
                "4": "无换表【增容】",
                "5": "无增容【换表】",
                "6": "【一装一拆】",
                "0": "未知",

            }[配备典型] + "，" + suggestion.conclusion
        console.log(suggestion.conclusion)








        function 配表配箱(匹配, slots = 勘察配置意见.slots) {
            console.log(匹配, slots)
            console.log(suggestion)
            let a = suggestion.meterInfo.filter(e => { return 匹配.includes(e) })
                .map(e => { return [e, slots] })
            suggestion.opnion.push(...a)
        }




    }
    最终配表2() {

    }

    配图信息录入(BDDLDM) {
        console.log(this)
        let readDataset = this.配备流程.勘察信息
        // BDDLDM=82为60A 83为80A
        console.log(BDDLDM)
        console.log(readDataset.meterEntities)
        let 新表 = readDataset.meterEntities.find(e => { return e.values.JLDBH == this.JLDBH && e.values.BGBZDM == 10 })
        Object.assign(新表.values, 硬性数据.电表类型[BDDLDM].data)
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


}

class 勘查分析 {
    constructor(配备流程) {
        this.配备流程 = 配备流程
        this.conclusion = ""
        this.state = 0
        this.info = "综合配备结论"
        this.color = "gery"
        this.type = "success"
        this.click = this.check
        this.multiMuiltmeasureEntitiesInfo = []
    }
    check() {
        // this.勘察配置意见 = this.配备流程.信息检验.勘查信息.check()
        this.isOnlyOneChange = this.配备流程.勘察信息.meterEntities.filter(v => { return ["10"].includes(v.BGBZDM).length })
        console.log(this)
        this.multiMuiltmeasureEntitiesInfo = this.拆分()
        this.multiMuiltmeasureEntitiesInfo = this.multiMuiltmeasureEntitiesInfo.map(e => { return new 计量点分析(e, this.isOnlyOneChange, this.配备流程) })

        if (this.multiMuiltmeasureEntitiesInfo.length == 1) {

            this.conclusion = this.multiMuiltmeasureEntitiesInfo[0].suggestion.conclusion
        }
        else {
            this.conclusion = this.multiMuiltmeasureEntitiesInfo.map((e, i) => { return `计量点${i + 1}：${e.suggestion.conclusion}` }).join('\n')
        }
        this.info = this.conclusion
        this.color = undefined
    }
    拆分() {
        let sds = {
            measureEntities: undefined,
            inductEntities: undefined,
            meterEntities: undefined
        }

        for (let a in sds) {
            sds[a] = this.配备流程.勘察信息[a].map(e => e.values)
            sds[a].sort((x, y) => {
                return x.BGBZDM - y.BGBZDM
            }

            )
        }

        sds["measureEntities"] = Array.from(new Set(sds["measureEntities"].map(e => e.JLDBH))).map(e => {
            return {

                measureEntities: sds["measureEntities"].filter(k => {
                    return k.JLDBH == e
                }
                ),
                meterEntities: sds["meterEntities"].filter(k => {
                    return k.JLDBH == e
                }
                ),
                inductEntities: sds["inductEntities"].filter(k => {
                    return k.JLDBH == e
                }
                ),

            }
        }
        )
        return sds["measureEntities"]
    }
}




function 查询表箱(gzdxx = this.配备流程.gzdxx) {
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
        console.log(e)
        let dataList = e.dataWraps.jlxzcjlsecDataWrap.dataList.filter(e => e.bgbzdm == "10")
        console.log(dataList)
        if (dataList.length == 0) {
            this.表箱信息.状态 = "没配表箱"

        } else if (this.配备流程.信息检验.勘查分析.multiMuiltmeasureEntitiesInfo.length == 1) {//单计量点

            if (dataList.length > 1) { this.表箱信息.状态 = "多个表箱" }
            if (dataList.length == 1) {
                console.log(Object.values(硬性数据.表箱信息))
                console.log(dataList[0].wzplbm)

                this.表箱信息.状态 = Object.values(硬性数据.表箱信息).find(e => { return e.data.wzplbm == dataList[0].wzplbm }).name
            }
        } else {//多计量点
            let fList = dataList.filter(e => [null, this.JLDBH].includes(e.jldbh))
            console.log(fList)
            if (fList.length > 1) { this.表箱信息.状态 = "多个表箱" }
            if (fList.length == 1) { this.表箱信息.状态 = Object.values(硬性数据.表箱信息).find(e => { return e.data.wzplbm == fList[0].wzplbm }).name }
        }
        return e.dataWraps.jlxzcjlsecDataWrap
    })
}

function 添加表箱(boxInfo) {

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
                    "gzdbh": this.配备流程.gzdxx.dataWraps.dataWrapGzdxx.data.gzdbh,//工单
                    "jldbh": this.JLDBH,
                    "yhbh": this.配备流程.yhbh,//户号
                    "xbdm": "01",
                    "emp_id": "1",
                    "cqgsdm": "1",//产权归属代码
                    "wzplbm": boxInfo.wzplbm,//物资编码 单相"010039102223" 三相 "010039102511"
                    "bxlxdm": boxInfo.bxlxdm,//单相"1041001" 三相"1041002"
                    "bwzs": 1
                }
            }),
            "shuliang": "1",
            "zxbzbm": this.配备流程.gzdxx.parameters.xzryZzbm,
            "action": "onAddJlx",
            "IN_PARAM_SYS_TAG": ""
        }),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(e => e.json())
}
function 删除所有表箱(aLLDataList, gzdxx = this.gzdxx) {
    let dataList = aLLDataList.filter(e => [null, this.JLDBH].includes(e.jldbh))
    console.log("正在操作删除所有表箱")
    if (!dataList.length) { return }
    return fetch(THISURL + "/YKZX/jlyx/zcgl/jljlxpb/jljlxpbgz.do", {
        "headers": {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": json2urlencoded({
            "jlxzcjlsecDataWrap.jsonData": JSON.stringify({ "dataList": dataList }),
            "LB": "10",
            "gzdbh": this.配备流程.gzdxx.dataWraps.dataWrapGzdxx.data.gzdbh,
            "dqbmString": this.配备流程.gzdxx.dataWraps.dataWrapGzdxx.data.dqbm,
            "action": "onDelSb",
            "IN_PARAM_SYS_TAG": ""
        }),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(e => e.json())
}
function 保存表箱信息() {
    const gzdxx = this.配备流程.gzdxx
    return this.查询表箱().then(
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

function 保存表箱设备列表() {

    return fetch(THISURL + "/YKZX/jlyx/zcgl/jlxzcxx/jlxzcxx.do", {
        "headers": {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        "body": json2urlencoded({
            "dqbmString": "030600",
            "gzdbh": this.配备流程.gzdbh,
            "zcxhjybz": "",
            "isEdit": "Y",
            "action": "retrieve",
            "IN_PARAM_SYS_TAG": ""
        }),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(e => e.json()).then(res => {

        if (!res.dataWraps.dataWrap.dataList.length) { return }
        return fetch(THISURL + "/YKZX/jlyx/zcgl/jlxzcxx/jlxzcxx.do", {
            "headers": {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            "body": json2urlencoded({
                "dataWrap.jsonData": JSON.stringify({
                    "dsName": "null",
                    "dataList": res.dataWraps.dataWrap.dataList.map(e => Object.assign(e, {
                        "yxxmbh": "1004",//项目03
                        "yxxmbs": "1000000000145760",//项目03
                        "zcyydm": "100",//装拆原因：业扩
                        "zcrybs": "0306001000008282"//陈道文协助
                    })),
                    "delete": ""
                }),
                "action": "save",
                "IN_PARAM_SYS_TAG": ""
            }),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });


    })

}

function json2urlencoded(obj) {
    let arr = []
    for (let key in obj) {
        arr.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    }
    let str = arr.join('&')
    return str

}




export default {
    勘查意见检查,
    配备典型,
    工作单环节,
    工作单类别,
    勘查分析
}