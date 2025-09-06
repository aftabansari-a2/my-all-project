let url = "http://universities.hipolabs.com/search?name=";
let btn = document.querySelector("button");
btn.addEventListener("click",async ()=>{
    let country = document.querySelector("input").value;
    console.log(country);
  let colArr = await getClg(country);
//   console.log(colArr);
show(colArr);

});
function show(colArr){
    let list = document.querySelector("#list")
    // h3.innerText = `Here, List of ${country} colleges.`;
    list.innerText = '';
    for(col of colArr){
        console.log(col.name);
        let li = document.createElement("li");
        li.innerText = col.name;
        list.appendChild(li);
    }
}
async function getClg(country){
    try{
        let res= await axios.get(url+country);
        return res.data;
    }catch(e){
        console.log("error:",e);
        return "weather not found";
    }
}