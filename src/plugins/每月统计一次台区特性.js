
/*
//await 获取台区列表()
async function 获取台区列表() {


    let a = (await page(0)).dataWraps.dataWrap.pageInfo.allPageNum
    console.log(a)
    //

    let b = new Array(a).fill(0).map((e, i) => { return page(i + 1).then(e => { return e.dataWraps.dataWrap.dataList }) })

    let c = await Promise.all(b)

    let result = []

    c.forEach(data => { result.push(...data) })
    result = Array.from(new Set(result.map(e => e.tqbh)))
    return result

    function page(index) {
        return fetch("http://10.150.23.1:8010/PMS/yk/cxgn/ykCxgnByqxxcx.do", {
            "headers": {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            "referrer": "http://10.150.23.1:8010/PMS/yk/cxgn/ykCxgnByqxxcx.do?appcontext=PMS&appCode=1000000000645001&helpCode=Help_Menu_1000000000645001&multitaskMenuFlag=true&multitaskMenuId=8",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": json2urlencoded({
                "undefined": "大沥供电所",
                "searchWrap.query.gddwbm": "03061211",
                "searchWrap.query.gbzbbz": "1",
                "searchWrap.query.yxztdm": "01",
                "searchWrap.query.mc": "",
                "searchWrap.query.yhbh": "",
                "searchWrap.query.bh": "",
                "searchWrap.query.gisid": "",
                "searchWrap.query.fjtwz": "",
                "dataWrap.jsonData": JSON.stringify({
                    "pageInfo": {
                        "allPageNum": 1,
                        "allRowNum": 1,
                        "curPageNum": index,
                        "rowOfPage": 20
                    },
                    "dsName": "null"
                })
                , "action": "retrieve",
                "IN_PARAM_SYS_TAG": ""
            }),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(e => e.json())
    }

}

//await 查询台区用户信息("06169000012983")
async function 查询台区用户信息(tqbh) {




    let a = [
        {},
        { "dataWrap.query.hyfldm": "IE4700" },//建筑用电
        { "dataWrap.query.yhmc": "%居民充电桩" },
        { "dataWrap.query.dydjdm": "02" },//220
        { "dataWrap.query.dydjdm": "03" }//380
    ]

    let b = 查询(tqbh, {
        "dataWrap.query.yhmc": "%居民充电桩",
        "dataWrap.query.dydjdm": "02"
    })

    a = await Promise.all([...a.map(tj => { return 查询(tqbh, tj).then(e => e.pageInfo.allRowNum) }), b.then(b => b.pageInfo.allRowNum)])
    b = await b




    return a
    function 查询(tqbh, object) {
        let body = Object.assign({
            "conditionName": "0",
            "dataWrap.query.gddwbm": "03061211",
            "dataWrap.query.yhztdm": "1",
            "dataWrap.query.xqmc": tqbh,
            "dataWrap.jsonData": JSON.stringify({
                "pageInfo": {
                    "allPageNum": 1,
                    "allRowNum": 1,
                    "curPageNum": 1,
                    "rowOfPage": 2000
                },
                "dsName": "null"
            }),
            "cxtj": "0",
            "szCx": "0",
            "bzdz": "",
            "action": "retrieve",
            "IN_PARAM_SYS_TAG": ""
        }, object)
        return fetch("http://10.150.23.1:8010/YKZX/yk/cxgn/ykXzcxsh.do", {
            "headers": {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            "body": json2urlencoded(
                body
            ), "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(e => e.json()).then(e => { return e.dataWraps.dataWrap })
    }
}

await 查询用户表计配置("0306120291991591")
async function 查询用户表计配置(yhbh) {
    let e = await fetch("http://10.150.23.1:8010/YKZX/yk/xckc/txpb/readArchiveDataSet.do", {
        "headers": {

            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",

        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `userNo=${yhbh}&areaCode=030600&userGddw=03061211`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(e => e.json())
    if (e.meterEntities.length!=1||e.powerEntities.length!=1){
        return "双电表，忽略"
    }else{
        let result=`${yhbh}\t${e.meterEntities[0].values.BDDLDM}\t${e.powerEntities[0].values.TQBS}`
        console.log(result)
        return result
    }
}





function json2urlencoded(obj) {
    let arr = []
    for (let key in obj) {
        arr.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    }
    let str = arr.join('&')
    return str

}





*/