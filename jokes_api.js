// jokes api
let btn = document.querySelector("button");
btn.addEventListener("click", async ()=>{
let joke = await getJokes();
// console.log(joke);
let p = document.querySelector("#result");
p.innerText = joke;
});
const url = "https://icanhazdadjoke.com/";
async function getJokes(){
    try{
        const config = {headers: {Accept : "application/json"}};
        let res = await axios.get(url, config);
        // console.log(res.data.joke);
        return res.data.joke;
    }catch(e){
        console.log("ERROR--",e);
        return "jokes not found";
    }
}