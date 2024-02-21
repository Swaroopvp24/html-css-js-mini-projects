
let bday = document.querySelector("#date");
let bmonth = document.querySelector("#month");
let byear = document.querySelector("#year");
const calc = document.getElementById("calc");
const p = document.getElementById("p_age");
const reset = document.getElementById("reset");

var today = new Date();
console.log(today);


calc.addEventListener("click", ()=>{
    
    d = bday.value;
    m = bmonth.value;
    y = byear.value;
    
    var tday = today.getDate();
    var tmonth = today.getMonth() +1;
    var tyear = today.getFullYear();

    let age = tyear-y;

    if( tmonth<m || (tmonth===m && tday<d) ){
        age=age-1;
    }

    p.innerText = `Age = ${age}`;

    reset.style.visibility = "visible";

});


reset.addEventListener("click",()=>{
    bday.value=``;
    bmonth.value=``;
    byear.value=``;
    p.innerText=``;

    reset.style.visibility = "hidden";
})



