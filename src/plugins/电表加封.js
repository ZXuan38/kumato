




function 查询电能表列表() {
    return fetch("/YKZX/jlyx/zcgl/jlzzzcxxlr/gdjlJlzzzcxxlr.do", {
        "headers": {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        "body": json2urlencoded({
            "jldbh": "",
            "gzdbh": "03060018000359412351",
            "yhbh": "062150008211132",
            "rwh": "3",
            "dqbmString": "030600",
            "isEdit": "Y",
            "action": "queryDnb",
        }),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(e => { e.json() })
}

function 保存电表信息() {

}

//查询电能表封印_运行封印信息().then(工单电能表封印_拆除封印)
查询电能表封印_装拆封印列表().then(e => { return [e[0]].filter(g => { return g.bgbzdm == "10" }).map(e => { return Object.assign(e, { checked: "1", fyzcbh: "03591FE00000002366492" }) }) }).then(查询电能表封印_取消装拆封印)
//查询电能表封印_装拆封印列表().then( 保存装拆信息 )


function 查询电能表封印_运行封印信息() {
    return fetch("/YKZX/jlyx/zcgl/jlzzzcxxlr/jlfylr.do", {
        "headers": {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        "body": json2urlencoded({
            "gzdbh": "03060018000359412351",
            "sfplbz": "",
            //    "yhbh": "062150008211132",
            //   "pljldbh": "0621500082111321",
            "plzcbh": "",
            "flagBz": "",
            "action": "fyquery",
            "IN_PARAM_SYS_TAG": ""
        }),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(e => e.json()).then(e => e.dataWraps.dataWrap.dataList)
}
function 查询电能表封印_装拆封印列表() {
    return fetch("/YKZX/jlyx/zcgl/jlzzzcxxlr/jlfylr.do", {
        "headers": {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        "body": json2urlencoded({
            "gzdbh": "03060018000359412351",
            //    "sfplbz": "",
            //     "yhbh": "062150008211132",
            "pljldbh": "0621500082111321",
            "plzcbh": "",
            "flagBz": "",
            "action": "fyzcquery",
            "IN_PARAM_SYS_TAG": ""
        }),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(e => e.json()).then(e => e.dataWraps.zcfydatawrap.dataList)
}

function 工单电能表封印_拆除封印(dataList) {
    return fetch("/YKZX/jlyx/zcgl/jlzzzcxxlr/jlfylr.do", {
        "headers": {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        "body": json2urlencoded({
            "gzdbh": "03060018000359412351",
            "sfplbz": "",
            "yhbh": "062150008211132",
            "pljldbh": "0621500082111321",
            "dataWrap.jsonData": JSON.stringify({ "dsName": "null", "dataList": dataList }),
            "plzcbh": "",
            "flagBz": "",
            "action": "chaichuFy",
            "IN_PARAM_SYS_TAG": ""
        }),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });
}

function 查询电能表封印_取消装拆封印(dataList) {
    return fetch("/YKZX/jlyx/zcgl/jlzzzcxxlr/jlfylr.do", {
        "headers": {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        "body": json2urlencoded({
            "gzdbh": "03060018000359412351",
            "sfplbz": "",
            "yhbh": "062150008211132",
            "pljldbh": "0621500082111321",
            "plzcbh": "03001DY00000011700187684",
            "zcfydatawrap.jsonData": JSON.stringify({
                pageInfo
                    :
                    { allPageNum: 1, allRowNum: 3, curPageNum: 1, rowOfPage: 30 }, "dsName": "null", "dataList": dataList
            }),
            "plzcbh": "",
            "flagBz": "",
            "action": "shanchuFy",
            "IN_PARAM_SYS_TAG": ""
        }),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(e => e.json())
}

function 电能表新装封印() {
    return fetch("/YKZX/jlyx/zcgl/jlzzzcxxlr/jlfylr.do", {
        "headers": {

            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",

        },
        "body": json2urlencoded({
            "gzdbh": "03060018000359412351",
            "sfplbz": "",
            "yhbh": "062150008211132",
            "pljldbh": "0621500082111321",
            "plzcbh": "",
            "editflag": "Y",
            "sblbdm": "01",
            "flagBz": "",
            "action": "retrieve",
            "IN_PARAM_SYS_TAG": ""
        }),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(e => e.json())
    //
    let 回应报文 = {
        "dataWraps": {
            "dataWrap": {
                "data": null,
                "dataList": [
                    {
                        "bgbzdm": "00",
                        "bz": "03061211",
                        "checked": null,
                        "cjsj": "2024-01-22 14:23:22",
                        "czsj": "2024-01-22 23:33:14",
                        "dqbm": "030600",
                        "fybs": "1111111136312799",
                        "fyytdm": "02",
                        "fyzcbh": "03061FE00000001602871455",
                        "glbs": null,
                        "gzdbh": "03060018000359412351",
                        "jfdxsbbs": "1000000024348883",
                        "jfdxzcbh": "03001DY00000011700187684",
                        "jfsblbdm": "01",
                        "jfwzdm": "05",
                        "jldbh": "0621500082111321",
                        "rowId": 0,
                        "wzcyy": null,
                        "yhbh": null,
                        "yjfrybs": "0306001000007306",
                        "yjfsj": "2017-09-29 00:00:00",
                        "yxfybs": "1111111169361141",
                        "zcbzdm": null,
                        "zcjlbs": "1111111324109555",
                        "zcrybs": "1000000000940394",
                        "zcsj": "2024-01-22 23:31:33"
                    }
                ],
                "deleteList": [],
                "dsName": null,
                "insertList": [],
                "pageInfo": {
                    "allPageNum": 1,
                    "allRowNum": 1,
                    "checked": null,
                    "curPageNum": 1,
                    "exportFlag": 0,
                    "rowId": 0,
                    "rowOfPage": 30
                },
                "query": {},
                "queryClause": null,
                "rowIndex": 0,
                "sortOptions": null,
                "sortString": "",
                "updateList": []
            },
            "zcfydatawrap": {
                "data": null,
                "dataList": [
                    {
                        "bgbzdm": "10",
                        "bz": null,
                        "checked": null,
                        "cjsj": "2024-01-22 22:25:08",
                        "czsj": "2024-01-22 22:25:25",
                        "dqbm": "030600",
                        "fybs": null,
                        "fyytdm": "02",
                        "fyzcbh": null,
                        "glbs": null,
                        "gzdbh": "03060018000359412351",
                        "jfdxsbbs": null,
                        "jfdxzcbh": null,
                        "jfsblbdm": " ",
                        "jfwzdm": null,
                        "jldbh": "0621500082111321",
                        "rowId": 0,
                        "wzcyy": null,
                        "yhbh": null,
                        "yjfrybs": null,
                        "yjfsj": null,
                        "yxfybs": "1111111269924837",
                        "zcbzdm": null,
                        "zcjlbs": "1111111324166837",
                        "zcrybs": "1000000000940394",
                        "zcsj": "2024-01-22 22:22:12"
                    },
                    {
                        "bgbzdm": "10",
                        "bz": null,
                        "checked": null,
                        "cjsj": "2024-01-22 22:25:08",
                        "czsj": "2024-01-22 22:25:25",
                        "dqbm": "030600",
                        "fybs": null,
                        "fyytdm": "02",
                        "fyzcbh": null,
                        "glbs": null,
                        "gzdbh": "03060018000359412351",
                        "jfdxsbbs": null,
                        "jfdxzcbh": null,
                        "jfsblbdm": " ",
                        "jfwzdm": null,
                        "jldbh": "0621500082111321",
                        "rowId": 0,
                        "wzcyy": null,
                        "yhbh": null,
                        "yjfrybs": null,
                        "yjfsj": null,
                        "yxfybs": "1111111269924838",
                        "zcbzdm": null,
                        "zcjlbs": "1111111324166838",
                        "zcrybs": "1000000000940394",
                        "zcsj": "2024-01-22 22:22:12"
                    }
                ],
                "deleteList": [],
                "dsName": null,
                "insertList": [],
                "pageInfo": {
                    "allPageNum": 1,
                    "allRowNum": 2,
                    "checked": null,
                    "curPageNum": 1,
                    "exportFlag": 0,
                    "rowId": 0,
                    "rowOfPage": 30
                },
                "query": {},
                "queryClause": null,
                "rowIndex": 0,
                "sortOptions": null,
                "sortString": "",
                "updateList": []
            }
        },
        "errorMessage": "",
        "message": "",
        "parameters": {
            "GZDBH": "03060018000359412351",
            "flagBz": "",
            "ywlb": null,
            "zdjfFlag": "N",
            "yhbh": "062150008211132",
            "SYSDATE": "2024-01-22 00:00:00",
            "zcrq": "2024-01-22 22:40:45",
            "editflag": "Y",
            "bgbz": null,
            "DQBM": "030600",
            "sblbdm": "01",
            "RYMC": "梁嘉炜",
            "FYQZ": "03591FE00000002366492",
            "RYBS": "1000000000940394",
            "fysblbdm": "09"
        }
    }
}


function 保存装拆信息(dataList) {
    return fetch("/YKZX/jlyx/zcgl/jlzzzcxxlr/jlfylr.do", {
        "headers": {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        "body": json2urlencoded({
            "gzdbh": "03060018000359412351",
            "sfplbz": "",
            //    "yhbh": "062150008211132",
            //   "pljldbh": "0621500082111321",
            "zcfydatawrap.jsonData": JSON.stringify({ "dsName": "null", "dataList": dataList }),
            "plzcbh": "",
            "flagBz": "",
            "action": "onBc",
            "IN_PARAM_SYS_TAG": ""
        }),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(e => e.json())
}









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
function urlencoded2json(urlencoded) {
    let a = urlencoded.split("&")
    let result = {}
    a.forEach(e => { result[decodeURIComponent(e.split("=")[0])] = decodeURIComponent(e.split("=")[1]) })
    return result
}
*/