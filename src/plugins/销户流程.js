


//脚本没问题，问题在需要登陆张秋宇账号才有权限


二班标识 = "0306121113"

const 张秋宇 = "1000000015940480"
const 陈道文 = "0306001000008282"

const 张秋宇信息 = { "bgdh": null, "bmfzr": null, "bmfzrbz": null, "bmfzrsj": null, "bysj": null, "checked": null, "cjrbs": "1000000015940480", "cjsj": "2021-02-03 09:20:30", "csmmbz": null, "csrq": "1997-11-15 00:00:00", "czsj": "2022-11-18 17:17:22", "dlzh": "zhangqiuyu@fs.gd.csg.cn", "dqbm": "030600", "dwbm": "0306", "fjfzbs": null, "gddwbm": "03061211", "gzrq": null, "kzcjrbs": "zhangqiuyu@fs.gd.csg.cn", "kzrybs": null, "kzzzbm": "8a16cb874c7b0e1f014c7b0ecc3700f5", "pkibs": null, "rowId": 0, "rybh": "a81f993f532645a0932c95fd45179a34", "rybs": "1000000015940480", "rymc": "张秋宇", "sj": "13620803064", "whcd": null, "xbdm": "1", "yjdz": "707646661@qq.com", "zc": "21", "zhmm": null, "ztbz": "1", "ztrq": null, "zw": null, "zzbm": "0306121113" }
const 计划时间 = "2024-02-26"

//查询代办工单()
function 查询代办工单() {
    return fetch("http://10.150.23.1:8010/GGZX/xtzc/dbrwgl/dbrwglDbrwlb.do", {
        "headers": {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        "body": json2urlencoded({
            "dblxval": "", "csbzval": "", "jsonstr": "", "formDataWrap.jsonData": JSON.stringify({
                "data": {
                    "clrbs": 张秋宇,
                    "gddwbm": "03061211" || "03",
                    "gzdcjrq": "1990-01-01 00:00:00",
                    "gzdjsrq": "1990-01-01 00:00:00",
                    "qsddrq": "2024-01-26 14:51:01",
                    "qsddsj": null,
                    "qta": "2",
                    "qtb": "",
                    "rowId": 0,
                    "ywfl": "MK051",
                    "ywlb": "F-CSG-MK0514-11",
                    "ywzl": "",
                    "zzbm": 二班标识,
                }
            }), "dblx": "2", "sfsy": "N", "dbzl": "ptdb", "action": "retrieve", "IN_PARAM_SYS_TAG": ""
        }),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(e => e.json()).then(e => e.dataWraps.dataWrapGwdb.dataList.filter(e => e.hjmc == "计量配表"))
}

class 销户流程 {
    constructor(gzdbh) {
        this.gzdbh = gzdbh
        this.gzdxx = undefined
        this.jhzy = ""


        this.自动流程().then(console.log)
    }

    自动流程() {
        return this.查询工作单信息().then(
            gzdxx => {
                if(gzdxx.dataWraps.dataWrapGzdxx.data.ywzl!="F-CSG-MK0514-11-01"){
                    console.error("非销户工单")
                    throw "非销户工单"
                }

                let hjmc = gzdxx.dataWraps.dataWrap.dataList[0].hjmc
                
                switch (hjmc) {
                    case "计量配表":
                        console.log("执行计量配表")
                        return this.处理计量配表环节().then(() => { return this.自动流程() })
                        break;
                    case "计量装置装拆任务分派":
                        console.log("计量装置装拆任务分派")
                        return this.处理计量装置装拆环节()//.then(() => { return this.自动流程() })
                        break;
                    default:
                        console.warn("非预期环节")
                        break;
                }

            }
        )
    }
    查询工作单信息() {
        return fetch("/GGZX/xtzc/dbrwgl/dbrwglGzdbl.do?" + json2urlencoded({
            "FLAG": "1",
            "isReadOnly": "N",
            "GZDBH": this.gzdbh,
            "tcbz": "N",
        }), {
            "headers": {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            "method": "post",
            "mode": "cors",
            "credentials": "include"
        }).then(res => res.text()).then(提取textarea).then(res => {
            console.log(this.gzdxx = res)
            console.log(this.jhzy = res.dataWraps.dataWrapGzdxx.data.gzdzy.split("；供电电压：")[0]);
            return res
        }
        )
    }
    处理计量配表环节() {
        return this.拆除所有表箱()
            .then(() => { return this.拆除所有电表() })
            .then(() => { return this.工作单传递() })
    }

    拆除所有表箱() {
        let 已有装拆信息 = []
        return 获取电表箱装拆清单.call(this)
            .then(() => { return 获取表箱信息.call(this) })
            .then(list => { return 保存拆除表箱.call(this, list) })
            .then(() => { return 获取电表箱装拆清单.call(this) })
            .then(List => { return 设置装拆班组保存.call(this, List) })
        function 获取表箱信息() {

            return fetch("http://10.150.23.1:8010/YKZX/jlyx/zcgl/jljlxpb/jlpbzcjlbx.do?multitaskMenuFlag=null&multitaskMenuId=null", {
                "headers": {
                    "content-type": "application/x-www-form-urlencoded",

                },
                "body": json2urlencoded({ "gzdbh": this.gzdbh, "flag": "1", "dqbmString": "030600" }),
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            }).then(e => e.text()).then(提取textarea).then(e => e.dataWraps.dataWrap.dataList).then(k => {
                console.log(k)
                return k
            })
        }

        function 保存拆除表箱(List) {
            console.log(List, 已有装拆信息)
            List = List.filter(e => { return !(已有装拆信息.map(d => d.zcbh).includes(e.zcbh)) })
            console.log(List)
            return fetch("http://10.150.23.1:8010/YKZX/jlyx/zcgl/jljlxpb/jlpbzcjlbx.do", {
                "headers": {
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                },
                "body": json2urlencoded({
                    "zcbh": "", "bxlxdm": "",
                    "dataWrap.jsonData": JSON.stringify({
                        "dsName": "null",
                        "dataList": List
                    }),
                    "gzdbh": this.gzdbh, "action": "cc", "IN_PARAM_SYS_TAG": ""
                }),
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            });
        }
        function 获取电表箱装拆清单() {
            return fetch("http://10.150.23.1:8010/YKZX/jlyx/zcgl/jljlxpb/jljlxpb.do", {
                "headers": {

                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",

                },
                "body": json2urlencoded({
                    "jlxzcjlsecDataWrap.jsonData": "{\"pageInfo\":{\"allPageNum\":1,\"allRowNum\":1,\"curPageNum\":1,\"rowOfPage\":200},\"dsName\":\"null\"}",
                    "gzdbh": this.gzdbh,
                    // "rwh": "5",
                    // "yhbh": "0306120293784898",
                    "dqbmString": "030600",
                    "action": "queryJlx",
                    "IN_PARAM_SYS_TAG": ""
                }),
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            }).then(e => e.json()).then(e => e.dataWraps.jlxzcjlsecDataWrap.dataList).then(e => { 已有装拆信息 = e; return e })
        }
        function 设置装拆班组保存(List) {
            return fetch("http://10.150.23.1:8010/YKZX/jlyx/zcgl/jljlxpb/jljlxpb.do", {
                "headers": {

                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",

                },
                "body": json2urlencoded({
                    "jlxzcjlsecDataWrap.jsonData": JSON.stringify({
                        "dsName": "null",
                        "dataList": List.map(e => Object.assign(e, { "zxbzbm": 二班标识 }))
                    }), "action": "onSaveJlx", "IN_PARAM_SYS_TAG": ""
                }),
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            });


        }

    }
    拆除所有电表() {
        return 获取电能表列表.call(this).then(List => { Promise.all(List.map(d => 保存拆除信息.call(this, d))) })
        function 获取电能表列表() {
            return fetch("http://10.150.23.1:8010/YKZX/jlyx/zcgl/jlpb/jlPbxx.do", {
                "headers": {
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                },
                "body": json2urlencoded({
                    "jldbh": "",
                    "gzdbh": this.gzdbh,
                    "yhbh": this.gzdxx.dataWraps.dataWrapGzdxx.data.gzdzy.split("；").find(e => { return e.includes("用户编号：") }).replace(/[^0-9]/g, ""),
                    "dqbmString": "030600",
                    "action": "queryDnb",
                    "IN_PARAM_SYS_TAG": ""
                }),
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            }).then(e => e.json()).then(e => e.dataWraps.dnbzcjlDataWrap.dataList)
        }
        function 保存拆除信息(dnbData) {
            return fetch("http://10.150.23.1:8010/YKZX/jlyx/zcgl/jlpb/jlPbxx.do", {
                "headers": {
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                },
                "body": json2urlencoded({
                    "dnbzcjlDataWrap.jsonData": JSON.stringify({
                        "data": Object.assign(dnbData, { "checked": "1", "zxbzbm": 二班标识 })
                    }),
                    "action": "onSaveDnbPzxx",//保存
                    "IN_PARAM_SYS_TAG": ""
                }),
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            });
        }



    }
    工作单传递() {
        console.log("工作单传递")
        return fetch("http://10.150.23.1:8010/YKZX/xtzc/dbrwgl/dbrwglGzdbl.do", {
            "headers": {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            "body": json2urlencoded(
                {
                    "gzdbh": this.gzdbh,
                    "slbs": this.gzdxx.dataWraps.dataWrapGzdxx.data.slbs,
                    "rwh": this.gzdxx.dataWraps.dataWrap.dataList[0].rwh,
                    "bz": this.gzdxx.dataWraps.dataWrapGzdxx.data.bz,
                    "bbh": this.gzdxx.dataWraps.dataWrapGzdxx.data.bbh,
                    //  "sfsd1": "1",
                    "hjh": this.gzdxx.dataWraps.dataWrapGzdxx.data.hjh,

                    "mbh": this.gzdxx.dataWraps.dataWrapGzdxx.data.mbh,
                    "ywfl": this.gzdxx.dataWraps.dataWrapGzdxx.data.ywfl,
                    "ywlb": this.gzdxx.dataWraps.dataWrapGzdxx.data.ywlb,
                    "ywzl": this.gzdxx.dataWraps.dataWrapGzdxx.data.ywzl,
                    "gzdzy": this.gzdxx.dataWraps.dataWrap.dataList[0].gzdzy,
                    "clrbs": 张秋宇,
                    "dqbm": "030600",
                    "ccbs": this.gzdxx.dataWraps.dataWrap.dataList[0].bzhjurl,
                    "qtb": this.gzdxx.dataWraps.dataWrapGzdxx.data.qtb,
                    "dqhjblr": 张秋宇,
                    "action": "onPgtj",
                    "IN_PARAM_SYS_TAG": ""
                }),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(() => { return this.查询工作单信息() })
    }
    处理计量装置装拆环节() {
        let 派工工单 = []
        return 查询待派工工单.call(this)
            .then(() => { return 分派人员.call(this) })
            .then(() => { return 起计划前.call(this) })
        //.then(() => { return 发起计划2.call(this) })
        function 查询待派工工单() {
            return fetch("http://10.150.23.1:8010/YKZX/jlyx/zcgl/jlzzzcrwfp/jlzzzcrwfp.do", {
                "headers": {
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                },
                "body": json2urlencoded({
                    "gzdcjrq": "",
                    "gzdjsrq": "",
                    "htrl": "",
                    "zbdcrl": "",
                    "Gzdlb.jbrzjbm": "3",
                    "gzdbh": this.gzdbh,
                    "htrl2": "",
                    "slabel": "3",
                    "dqbmString": "030600",
                    "flagBz": "",
                    "action": "retrieve",
                    "IN_PARAM_SYS_TAG": ""
                }),
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            }).then(e => e.json()).then(e => { 派工工单 = e.dataWraps.dataWrap.dataList; return 派工工单 })
        }
        function 分派人员() {//其实无法保存
            return fetch("http://10.150.23.1:8010/YKZX/jlyx/zcgl/jlzzzcrwfp/jlzzzcrwfp.do", {
                "headers": {

                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",

                },
                "body": json2urlencoded({
                    "gzdcjrq": "",
                    "gzdjsrq": "",
                    "htrl": "",
                    "zbdcrl": "",
                    "Gzdlb.jbrzjbm": "3",
                    "dataWrap.jsonData": JSON.stringify({
                        "pageInfo": {
                            "allPageNum": 1,
                            "allRowNum": 1,
                            "curPageNum": 1,
                            "rowOfPage": 100
                        },
                        "dsName": "null",
                        "dataList": 派工工单.map(e => Object.assign(e, { "kcry": 张秋宇, "cxr": 陈道文, 'checked': "1" }))
                    }),
                    "dqbmString": "030600",
                    "flagBz": "",
                    "cdbz": "fpry",
                    "action": "savePgxx",
                    "IN_PARAM_SYS_TAG": ""
                }), "method": "POST",
                "mode": "cors",
                "credentials": "include"
            });
        }

        function 起计划前() {
            return fetch("http://10.150.23.1:8010/YKZX/jlyx/zcgl/jlzzzcrwfp/jlzzzcrwfp.do", {
                "headers": {

                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",

                },
                "body": json2urlencoded({ "gzdcjrq": "", "gzdjsrq": "", "htrl": "", "zbdcrl": "", "Gzdlb.jbrzjbm": "3", "gzdbh": this.gzdbh, "action": "glgzdbhcx", "IN_PARAM_SYS_TAG": "" }),
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            }).then(e => e.json()).then(e => e.parameters.jhbs).then(jhbs => { return jhbs ? 查看计划.call(this, jhbs) : 发起计划2.call(this) })
        }
        function 发起计划() {
            return fetch("http://10.150.23.1:8010/PMS/bzbzh/jhglgd/bzjhsffqjh.do?" +
                json2urlencoded({
                    "appcontext": "PMS",
                    "nyzjhlx": "3",
                    "gzdbh": this.gzdbh,
                    "fzrsj": 张秋宇信息.sj,
                    "fzrbs": 张秋宇,
                    "fzrmc": "张秋宇",
                    "iswcjh": "1"
                }), {

                "body": null,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            }).then(e => e.text()).then(提取textarea)
        }
        function 发起计划2() {
            return fetch("http://10.150.23.1:8010/PMS/bzbzh/jhglgd/bzjhzdGd.do?" + json2urlencoded({
                "appcontext": "PMS",
                "nyzjhlx": "3",
                "isxgfxdj": "undefined",
                "gzdbh": this.gzdbh,
                "fzrsj": 张秋宇信息.sj,
                "fzrbs": 张秋宇,
                "fzrmc": "张秋宇",
                "yddz": "null",
                "zizhilx": "null",
                "iswcjh": "1",
                "oldPageSfsgjyzz": "null"
            }), {
                "body": null,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            }).then(e => e.text()).then(提取textarea).then(e => { return 计划制定.call(this, e.parameters) })
        }
        function 计划制定(parameters) {

            let 日期 = 计划时间.split("-")

            return fetch("http://10.150.23.1:8010/PMS/bzbzh/jhglgd/bzjhzdGd.do", {
                "headers": {
                    "accept": "*/*",
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "x-requested-with": "XMLHttpRequest"
                },
                "referrer": "http://10.150.23.1:8010/PMS/bzbzh/jhglgd/bzjhzdGd.do?appcontext=PMS&nyzjhlx=3&isxgfxdj=undefined&gzdbh=03060018000359489951&fzrsj=13620803064&fzrbs=1000000015940480&fzrmc=%E5%BC%A0%E7%A7%8B%E5%AE%87&yddz=null&zizhilx=null&iswcjh=1&oldPageSfsgjyzz=null",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": json2urlencoded({
                    "action": "save",
                    "bzjh.jhmc": `${日期[0]}年${日期[1]}月大沥供电所低压计量装置装拆`,//计划名称
                    "bzjh.jhnr":  this.jhzy + "\n工作内容：低压客户销户拆除电能表（施工范围内无光缆）。",
                    "bzjh.gzds": parameters.gzds,
                    "bzjh.gzwcbz": "",
                    "bzjh.zxsjzy": 计划时间 + " 08:30:00至" + 计划时间 + " 17:30:00",
                    "bzjh.zqlxbs": "",
                    "bzjh.zqsz": "",
                    "bzjh.jhkssj": 计划时间 + " 08:30:00",
                    "bzjh.jhjssj": 计划时间 + " 17:30:00",
                    "bzjh.jhzqdm": "1",
                    "bzjh.yjzyxcdm": "10000031",//一级代码
                    "bzjh.ejzyxcdm": "10000035",//二级代码
                    "bzjh.jzfxdjdm": "01",
                    "bzjh.jhlxbs": "10000084",//计划类型
                    "bzjh.yhbh": "",
                    "bzjh.gzfzrlxdh": 张秋宇信息.sj,
                    "bzjh.zyrs": "2",//作业人数
                    "bzjh.gzfsdm": "0",
                    "bzjh.kcfsdm": "0",//勘查方式否
                    "bzjh.kcdid": "",
                    "bzjh.bpbz": "0",//办票标志
                    "bzjh.gzpid": "",
                    "bzjh.spgkbz": "0",//视频管控
                    "bzjh.jhly": "01",//计划来源
                    "bzjh.fzrbs": 张秋宇,
                    "bzjh.gljhbs": "",
                    "bzjh.glgzdbh": parameters.gzdbh,
                    "bzjh.bz2": "",
                    "bzjh.gddwbm": parameters.GDDWBM,
                    "bzjh.smbzjlpbh": "",
                    "zyrbs": 陈道文,
                    "bzjh.ajzylx": "301",//安监作业类型
                    "bzjh.zyejfl": "301"//专业分类
                }),
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            }).then(e=>e.json()).then(()=>{return 起计划前.call(this)})
        }
        function 查看计划(jhbs) {
            return fetch("http://10.150.23.1:8010/PMS/bzbzh/jhglgd/bzjhxqGd.do?" + json2urlencoded({
                "appcontext": "PMS",
                "pgflag": "1",
                "spflag": "1",
                "jhbs": jhbs,
                "fzr": 张秋宇,
                "ryzzbm": 二班标识
            }), {
                "headers": {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    "accept-language": "zh-CN,zh;q=0.9,ja;q=0.8",
                    "upgrade-insecure-requests": "1"
                },
                "body": null,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            }).then(e => e.text()).then(提取textarea)
                .then(e => {
                    console.log(e.dataWraps.dataWrap.data.spzt)
                    if (e.dataWraps.dataWrap.data.spzt == 3) { console.log("已审批"); return 1 }
                    else { return 制定计划并派工.call(this, jhbs) }
                })
        }
        function 制定计划并派工(jhbs) {
            fetch("http://10.150.23.1:8010/YKZX/jlyx/zcgl/jlzzzcrwfp/jlzzzcrwfp.do", {
                "headers": {
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                },
                "body": json2urlencoded({
                    "gzdcjrq": "",
                    "gzdjsrq": "",
                    "htrl": "",
                    "zbdcrl": "",
                    "Gzdlb.jbrzjbm": "3",
                    "jhbs": jhbs,
                    "kssj": 计划时间 + " 00:08:30",
                    "jssj": 计划时间 + " 17:30:00",
                    "nyzjhlx": "3",
                    "fzr": 张秋宇,
                    "ryzzbm": 二班标识,
                    "action": "updateNYZ",
                    "IN_PARAM_SYS_TAG": ""
                }),
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            }).then(e => e.json())
        }

    }
}



new 销户流程("03060018000360072577")
//new 销户流程("03060018000360072577")
//new 销户流程("03060018000360075505")

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
function urlencoded2json(urlencoded) {
    let a = urlencoded.split("&")
    let result = {}
    a.forEach(e => {
        result[decodeURIComponent(e.split("=")[0])] = decodeURIComponent(e.split("=")[1])
    }
    )
    copy("json2urlencoded(" + JSON.stringify(result) + ")")
    return result
}

