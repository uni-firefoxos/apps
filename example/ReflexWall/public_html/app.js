var GAMEID = "reflexwall";
var ws;

if(localStorage.getItem("server")==null)
    localStorage.setItem("server", "ws://192.168.150.10:8084/FirefoxOSParty/WsChatServlet");
if(localStorage.getItem("nick")==null)
    localStorage.setItem("nick", ""+Math.random());

function startGame() {
    document.getElementById("configok").addEventListener("click",kihivas);    
    document.querySelector('div[role="main"]').addEventListener("click",touchscreen);    
    
    if (localStorage.getItem("server") == null) {
        localStorage.setItem("server", "ws://192.168.150.10:8084/FirefoxOSParty/WsChatServlet");
    }
    if (localStorage.getItem("server") == null)
        window.location.href = "settings.html";
    else {
        ws = new WebSocket(localStorage.getItem("server"));
        ws.onopen = function() {
            console.log("connected");
            ws.send('{"g":"' + GAMEID + '","u":"' + localStorage.getItem("nick") + '"}');        
        };
        ws.onclose = function() {};
        ws.onmessage = wsMessage;
        ws.onerror = function() {};
    }
}

window.addEventListener("load", startGame);

var playid;
var maserclient=false;
var devices=[];
var firstOK=0;
var points=0;
function wsMessage(msg) {
    console.log("->"+msg.data);
    json = JSON.parse(msg.data);
    if(json["c"] != undefined){
        if(!maserclient){
            if(json["d"] != undefined){
                if(json["d"]==localStorage.getItem("nick"))
                    document.querySelector('div[role="main"]').style.backgroundColor="#ffffff";
                else
                    document.querySelector('div[role="main"]').style.backgroundColor="#000";
            }
        }
        else{
            if(json["o"] != undefined){
                points++;
                printScore();
                if(firstOK<60) playing();
                else sendEndGame();
            }
        }        
    }
    else if (json["s"] != undefined && json["p"] == null ) {
        document.getElementById("gamers").innerHTML="";
        for (var x=0; x < json["s"].length; x++) {
            var input = document.createElement("input");
            input.setAttribute("type", "checkbox");
            input.setAttribute("value", json["s"][x].id);
            var li = document.createElement("li");
            li.appendChild(input);
            li.innerHTML+=json["s"][x].name;
            if (json["s"][x].name != localStorage.getItem("nick"))
                document.getElementById("gamers").appendChild(li);
        }
    }
    else if(json["p"] !== undefined){
        playid=json["p"];
        if(json["m"] === localStorage.getItem("nick")){maserclient=true;}
        ws.send('{"g":"' + GAMEID + '","u":"' + localStorage.getItem("nick") + '","p":"'+playid+'"}'); //kihivas automatikus elfogadasa
    }
    else if(json["r"] != undefined){
        if(json["r"] === localStorage.getItem("nick"))
        ws.send('{"g":"' + GAMEID + '","r":"' + localStorage.getItem("nick") + '","p":"'+playid+'"}');
    }    
    else if(json["v"] !== undefined){
        if(maserclient){
            if(json["v"]!=localStorage.getItem("nick")){
                devices.push(json["v"]);
                var mygroup=document.querySelectorAll("input:checked");
                if(mygroup.length == devices.length) gameing();
            }
        }
        else document.querySelector('div[role="main"]').style.backgroundColor="#ffffff";            
        document.querySelector('#settingspanel').style.display="none";
    }   
}

function gameing(){
    points=0;
    firstOK=0;
    timer();
    playing();    
}

function printScore(){
    document.getElementById("container").innerHTML="<center class='pnt'>"+points+"/"+firstOK+"</center>"    
}

function sendEndGame(){
    ws.send('{"g":"' + GAMEID + '","c":"'+localStorage.getItem("nick")+'","p":"'+playid+'","d":"'+Math.random()+'"}');    
}

function timer(){
    firstOK++
    if(firstOK<60) setTimeout(timer,1000);
    else sendEndGame();
    printScore();
}

function touchscreen(){
    if(maserclient){if(firstOK==60)gameing();}    
    else if(this.style.backgroundColor=="rgb(255, 255, 255)")
    ws.send('{"g":"' + GAMEID + '","c":"'+localStorage.getItem("nick")+'","p":"'+playid+'","o":"1"}');
}
    
var oldvalue=-1;
var x=0;
function playing(){
    do{x=Math.floor(Math.random()*devices.length);}
    while(x==oldvalue)
    oldvalue=x;
    ws.send('{"g":"' + GAMEID + '","c":"'+localStorage.getItem("nick")+'","p":"'+playid+'","d":"'+devices[x]+'"}');
}

function kihivas(){
    var mygroup=document.querySelectorAll("input:checked");
    msg= '{"g":"' + GAMEID + '","u":"' + localStorage.getItem("nick") + '","s":[';
    for(var x=0;x<mygroup.length;x++){
        msg+='"'+mygroup[x].value+'",';
    }
    msg+='"'+localStorage.getItem("nick")+'"]}';
    console.log(msg);
    ws.send(msg);
}

function selectUser() {
    ws.send('{"g":"' + GAMEID + '","p":"' + GAMEID + '","u":"' + document.getElementById("nick").value + '","s":["' + document.getElementById("nick").value + '"]}');
}
