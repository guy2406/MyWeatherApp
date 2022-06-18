let weather = {
    "apikey" : "84c4526f40e140eab04202003221406",
    Action : ["history","search"],
    baseURL : "http://api.weatherapi.com/v1/",
    lenCase3 : ""
}

const changeBgColor = (e) => {
    let mycity = document.getElementById("city-select")
    // AS I select a new city clear previous results data
    let testResults = document.getElementById("condition")
    if(testResults.innerHTML!=""){
        testResults.innerHTML = ""
        document.querySelector(".icon").src = ""
    }
    let box = document.getElementById("box")
    box.style.background = e.value
    box.style.backgroundRepeat = "no-repeat"
}

const getDateFromUser = () => {  
    let getVal = document.getElementById("quantity").value
    let reg = new RegExp('^[1-7]$')
    if(reg.test(getVal) == false){
        alert("day not in range")
    return false;
    }
    let today = new Date();
    let substract_no_of_days = getVal
    today.setTime(today.getTime() - substract_no_of_days* 24 * 60 * 60 * 1000);
    let substracted_date = today.getFullYear() + "-" + (today.getMonth()+1) + "-" +today.getDate();
    if(substracted_date.length < 10){
        let [year,mid,end] = substracted_date.split("-")
        if(substracted_date.length === 8){
            mid = '0'+ mid
            end = '0'+ end
        }
        else if(substracted_date.length === 9){
            if(mid.length === 1){
                mid = '0'+ mid
            }else{
                end = '0'+ end
            }
        }
        substracted_date = [year,mid,end].join("-")
    }
    return substracted_date
}

const fetchData = async (q,request) => {
    if(q === 3 && weather.lenCase3 != "")return weather.lenCase3
    let resp = await fetch(request)
    return new Promise(async (resolve,reject) => {
        if(resp.status === 200){
            let data = await resp.json()
            switch (q) {
                case 1:
                    console.log("case 1")
                    const {avgtemp_c,maxtemp_c,mintemp_c} = data.forecast.forecastday[0].day
                    const {lat,lon} = data.location
                    const {astro,date} = data.forecast.forecastday[0]
                    const {text,icon} = data.forecast.forecastday[0].day.condition
                    resolve([lat,lon,astro.sunrise,date,avgtemp_c,maxtemp_c,mintemp_c,text,icon])
                    break
                case 2:
                    console.log(`%cstating to answer Q #2`,`background-color:purple;color:white`)
                    console.log(request)
                    resolve(data.forecast.forecastday[0].astro.sunrise)
                    break
                case 3:
                    console.log("case 3")
                    weather.lenCase3 = data.length
                    resolve(data.length)
                    break
            }    
        }else{
            reject(`fetch issue${resp.status}`)
        }    
    })
}

const dataTOSubmit = () => {
    let getCity = document.getElementById("city-select")
    var selectedText = getCity.options[getCity.selectedIndex].text
    if(selectedText == ""){
        alert("city was not selected")
        return false;
        }
    console.log(selectedText)
    const substracted_date = getDateFromUser()
    console.log(`%c${substracted_date}`,`background-color:red;color:white`)
    
    // --------------    case 1
    let res1 = weather.baseURL + weather.Action[0] 
    + ".json?key=" + weather.apikey 
    + "&q=" + selectedText + "&dt=" + substracted_date
    fetchData(1,res1).then((res) => {
        // res = [lat,lon,SunRise,date,avgT,maxT,minT,condition,icon]
        console.log(`%c${res[res.length-1]}`,`background-color:lime`)
        document.querySelector(".icon").src = "https:"+res[res.length-1]
        let txt = document.getElementById("condition");
        txt.innerHTML = res[res.length-2];
        // compare dates
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        if(res[3] != substracted_date){alert("dates don't match")}
        //Test that max, min and avg values are in the correct range.
        // edge test cases
        //res[4] = res[5]+1 
        //res[4] = res[6]-1 
        if(res[4] > res[5] || res[4] < res[6]){alert("Avg temp not in range")}
        console.log(`%ccheck the following result:\n%c${res}`,
        `background-color:yellow`,
        `background-color:pink`)
        let latLon = res[0]+","+ res[1]
        let res2 = weather.baseURL + weather.Action[0] 
        + ".json?key=" + weather.apikey 
        + "&q=" + latLon + "&dt=" + substracted_date
        console.log(`%c${res2}`,`background-color:yellow`)
        const testSunrise = res[2]
        console.log(testSunrise)
        fetchData(2,res2).then(res => {
            console.log(res)
            console.log(`%ccheck if this value is the same: ${testSunrise}`,
            `background-color:grey;color:white`)
            if(testSunrise != res){
                alert("Sunrise input isn't the same")
                return false;            
            }
            let res3 = weather.baseURL + weather.Action[1] 
            + ".json?key=" + weather.apikey 
            + "&q=aviv"
            fetchData(3,res3).then(res => {
                console.log(`%cthis is the last result:${res}`,
                `background-color:green;color:white`)
            }).catch(err => console.log(`case 3 Error:${err}`))    
        }).catch(err => console.log(`case 2 Error:${err}`))
    }).catch(err => console.log(`case 1 Error:${err}`))
}