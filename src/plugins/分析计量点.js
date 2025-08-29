

class 勘查分析 {
    constructor(勘察信息) {
        this.勘察信息 = 勘察信息
        this.勘察配置意见 = new 勘查意见检查(勘察信息).check()//分析电表箱需求
        this.isOnlyOneChange = 勘察信息.meterEntities.filter(v => { return ["10"].includes(v.BGBZDM).length })
        this.multiMuiltmeasureEntitiesInfo = this.拆分()
        this.multiMuiltmeasureEntitiesInfo = this.multiMuiltmeasureEntitiesInfo.map(e => { return new 计量点分析(e, this.isOnlyOneChange, this.勘察配置意见) })
    }
    拆分() {
        let sds = {
            measureEntities: undefined,
            inductEntities: undefined,
            meterEntities: undefined
        }
        for (let a in sds) {
            sds[a] = this.勘察信息[a].map(e => e.values)
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

class 勘查意见检查 {
    constructor(勘察信息) {
        this.勘察信息 = 勘察信息
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
        if (!this.勘察信息) {
            this.info = "未有勘查信息"
            this.type = "error"
        } else {

            this.info = this.勘察信息.advice.values.KCYJ

            let info2 = this.勘察信息.advice.values.KCYJ
                .replaceAll("増", "增")
                .replace(/03[a-zA-Z0-9]{20,24}/, "")//去除电表号
                .replace(/[JjIiNnGg]{0,4}经?度?[:：;；，, ]{0,2}\d{1,}.\d{3,}/, "")//去除经度
                .replace(/[WwEeIi]{0,3}纬?度?[:：;；，, ]{0,2}\d{1,}.\d{3,}/, "")//去除纬度
                .replace(/[\n\r\t ，。.,;:；：、]{1,}/g, " ").split(" ").filter(e => e.length).join("，")
                .replaceAll("电表箱", "表箱")
                .replace(/[三3]位表箱/g, "三相表箱")
                .replace(/[需要与用配换]{0,}三相表箱/g, "配三相表箱")
                .replace(/[需要与用配换]{1,}表箱/g, "配表箱")
                .replace(/位配?表箱/g, "位表箱")
                .replace(/六位表箱/g, "6位表箱")

                .replace("按规办理，", "")
                .replaceAll("一个", "")

                + "。"


            this.info = info2

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
                        '按规办理，不配表箱。'

                    ].includes(info3)
                    ) {
                        info2 = "不配箱⚪"
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
                        this.suggestion.JXFSDM = "1"
                    } else if (['配12位表箱。'
                    ].includes(info3)
                    ) {
                        info2 = "配12位表箱⚪"
                        this.suggestion.opinion = !0
                        this.suggestion.isNeedBox = !0
                        this.suggestion.slots = 12
                        this.suggestion.JXFSDM = "1"
                    }
            } else {
                this.type = "info"
            }
            this.info = info2
        }
        return this.suggestion
    }
}
/*
console.log(new 勘查意见检查(勘察信息).check())
*/
class 计量点分析 {
    constructor(singleMuiltmeasureEntitiesInfo, isOnlyOneChange, 勘察配置意见) {
        this.data = singleMuiltmeasureEntitiesInfo
        this.不合规 = []
        this.isOnlyOneChange = isOnlyOneChange
        this.勘察配置意见 = 勘察配置意见
        this.suggestion = {
            opnion: [],
            boxInfo: [],
            meterInfo: [],
            inductInfo: [],
            conclusion: undefined
        }
        this.分析 = {

            计量点变化方式: { "1": "新", "2": "拆", "3": "改", "0": "意料之外" }[this.分析计量点变化方式()],
            供电变化: this.分析供电改变(),
            表计变化: { "1": "新", "2": "拆", "3": "换", "4": "抄表不换", "0": "意料之外" }[this.分析表计变化方式()],
            新表配置: this.当前表计配置信息(),
            新计量点信息: this.计量更新信息(),
            计量更新信息摘要: this.计量更新信息摘要(),
            根据计量点信息配表: this.根据计量点信息配表(),
            配备典型: this.典型分析()
        }
        this.分析.根据旧表信息配表 = this.根据旧表信息配表()
        this.最终配表()

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
            if (jld.JXFSDM == "1") {
                let a = [this.配表类型()[82], this.配表类型()[83]]
                this.suggestion.meterInfo.push(...a)
                return a
            }
            else if (jld.JXFSDM == "3" && jld.CTBBDM == "") {
                let a = [this.配表类型()[84]]
                this.suggestion.meterInfo.push(...a)
                return a
            }
            else if (jld.JXFSDM == "3" && jld.CTBBDM == "12") {
                console.log("互感+200")
                let a = [this.配表类型()[79]]
                this.suggestion.meterInfo.push(...a)
                return a
            }
            else if (jld.JXFSDM == "3" && jld.CTBBDM == "14") {
                console.log("互感+300")
                let a = [this.配表类型()[79]]
                this.suggestion.meterInfo.push(...a)
                return a
            }
            else if (jld.JXFSDM == "3" && jld.CTBBDM == "16") {
                console.log("互感+500")
                let a = [this.配表类型()[79]]
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
            let f = this.配表类型()[e.BDDLDM]

            if (this.计量更新信息摘要().JXFSDM != 1) {

                return this.分析.根据计量点信息配表//根据计量点信息配表()
            }
            if (["82", "83"].includes(e.BDDLDM)) {
                return [f]
            }
            else if (e.BDDLDM == "73") {
                return [this.配表类型()[82], this.配表类型()[83]]
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

                let temp1 = {
                    82: "单相60A",
                    83: "单相80A",
                    84: "三相直入",
                    79: "互感表",
                }
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



                return `配${temp1[result[0].BDDLDM]}，${bx}。`
            })

            suggestion.conclusion = c.join("\n或")

        }


        console.log(suggestion.conclusion)


        function 配表配箱(匹配, slots = 勘察配置意见.slots) {
            console.log(匹配, slots)
            console.log(suggestion)
            let a = suggestion.meterInfo.filter(e => { return 匹配.includes(e.BDDLDM) })
                .map(e => { return [e, slots] })
            suggestion.opnion.push(...a)
        }




    }
    最终配表2() {

    }


    配表类型() {
        return {
            82: {
                BDDLDM: "82",//单相60A
                XXLBDM: "01",//相线类别：单相
                EDDYDM: "1",//额定电压：220V
                ZQDDJDM: "47",//准确度等级：A
                // sealingStampSlot
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
            },
            加单相表封: {

            },
            加三相表封: {

            }
        }
    }
}


console.log(new 勘查分析(勘察信息))

新配箱操作()
function 新配箱操作(gzdxx) {

    查询当前电表箱配置()
    function 查询当前电表箱配置(gzdxx = gzdxx) {
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
        }).then(e => e.json())
    }
}

export default {
    勘查分析
}