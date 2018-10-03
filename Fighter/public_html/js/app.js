var songoku = {name:"songoku", Mname: "Son Goku", rank: 10, power: 500, win: 0};
var vegeta = {name:"vegeta", Mname: "Vegeta", rank: 8, power: 350, win: 0};
var kuririn = {name:"kuririn", Mname: "Kuririn", rank: 9, power: 450, win: 0};
var android17 = {name:"android17", Mname: "Android 17", rank: 7, power: 250, win: 0};
var android18 = {name:"android18", Mname: "Android 18", rank: 7, power: 280, win: 0};
var picolo = {name:"picolo", Mname: "Picolo", rank: 7, power: 300, win: 0};

var karakterek = [songoku, vegeta, kuririn, android17, android18, picolo];

var sajatkar;
var ellenfel;
var nyertes;
var nyertCsataSajat = 0;
var nyertCsataEllen = 0;
var bonusEllenfel = 1;
var bonusSajat = 1;

var aktualisKor = 0;

var bonusAktiv = false;

var hidden = false;
    function bonusaktivalas() {
        hidden = !hidden;
        if(hidden) { 
            document.getElementById('bonus').style.visibility = 'visible';
        } else {
            document.getElementById('bonus').style.visibility = 'hidden';
            bonusAktiv = true;
        }
        
    }


function rnd(){
    return Math.floor(Math.random() * 101);
}


function top5Check(){
  
    karakterek.sort((a,b) => (a.win > b.win) ? 1 : ((b.win > a.win) ? -1 : 0));
    
    document.getElementById("score1").innerHTML = ":: "+karakterek[5].win+" :: "+karakterek[5].Mname;
    document.getElementById("score2").innerHTML = ":: "+karakterek[4].win+" :: "+karakterek[4].Mname;
    document.getElementById("score3").innerHTML = ":: "+karakterek[3].win+" :: "+karakterek[3].Mname;
    document.getElementById("score4").innerHTML = ":: "+karakterek[2].win+" :: "+karakterek[2].Mname;
    document.getElementById("score5").innerHTML = ":: "+karakterek[1].win+" :: "+karakterek[1].Mname;
}
function Ellenoriz(){
    if(aktualisKor == 10){
       nyertes.win++;
       aktualisKor = 0;
       bonusEllenfel = 1;
       bonusSajat = 1;
	   document.getElementById('bonus').style.visibility = 'hidden';
	   document.getElementById('sajat_karakter').selectedIndex = "0";
       document.getElementById('ellenfel_karakter').selectedIndex = "0";
       if(nyertCsataSajat > nyertCsataEllen){
          document.getElementById("eredmeny").innerHTML = "Gratulálok nyertél :P";
          document.getElementById("bonusS").innerHTML = "";
       }
       else if(nyertCsataSajat < nyertCsataEllen){
          document.getElementById("eredmeny").innerHTML = "Vesztettél!!!";
          document.getElementById("bonusS").innerHTML = "";
       }
       else{
          document.getElementById("eredmeny").innerHTML = "Döntetlen";
          document.getElementById("bonusS").innerHTML = "";
       }
       
       nyertCsataSajat = 0;
       nyertCsataEllen = 0;
       hidden = false;
       top5Check();
    }
}

function karakterkivalasztas(){
   
    var sajatnev = document.getElementById("sajat_karakter").value;
    var ellennev  = document.getElementById("ellenfel_karakter").value;
    var i;
    for (i = 0; i < 6; i++) {
       if(karakterek[i].name == sajatnev){
          sajatkar = karakterek[i];
       }
       if(karakterek[i].name == ellennev){
          ellenfel = karakterek[i];
       }
    }
}

function csata(sb){

aktualisKor++;
var s = sajatkar.rank*sajatkar.power*rnd()*sb;
var e = ellenfel.rank*ellenfel.power*rnd()*bonusEllenfel;
if(s > e){
    bonusEllenfel = bonusEllenfel*1.5;
    nyertCsataSajat++;
   return sajatkar;
   
}
else if (e > s){
    nyertCsataEllen++;
    bonusSajat = bonusSajat*1.5;
    if(hidden){
    
    }
    else{
       bonusaktivalas();
    }
    
    return ellenfel
}
else{
    bonusSajat = bonusSajat*1.5;
    nyertCsataSajat++;
    return sajatkar;
}

}

function clickButton(e) {
    if(document.getElementById('sajat_karakter').selectedIndex != 0 && document.getElementById('ellenfel_karakter').selectedIndex != 0){
    
    
    karakterkivalasztas();
    nyertes = csata(1);
    document.getElementById("eredmeny").innerHTML = aktualisKor+". kör nyertese "+nyertes.Mname;
    document.getElementById("bonusS").innerHTML = "Bonuszod: "+(bonusSajat*100)+"%";
	Ellenoriz();
    }
    else{
       document.getElementById("eredmeny").innerHTML = "Válassz karakter(eket)!!!";
       document.getElementById("bonusS").innerHTML = "";
    }
    
}
function clickButtonBonus(e) {
    if(document.getElementById('sajat_karakter').selectedIndex != 0 && document.getElementById('ellenfel_karakter').selectedIndex != 0){
       nyertes = csata(bonusSajat);
       bonusSajat = 1;
       bonusaktivalas();
       document.getElementById("eredmeny").innerHTML = aktualisKor+". kör nyertese "+nyertes.Mname;
       document.getElementById("bonusS").innerHTML = "Bonuszod: "+(bonusSajat*100)+"%";
	   Ellenoriz();
        }
    else{
       document.getElementById("eredmeny").innerHTML = "Válassz karakter(eket)!!!";
       document.getElementById("bonusS").innerHTML = "";
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
   console.log("start:DOMContentLoaded");
   var buttons=document.querySelectorAll("button");
   for(x=0;x<buttons.length;x++){
       
       if(buttons[x].id == "bonus"){
         buttons[x].addEventListener("click", clickButtonBonus);
       }
       else{
         buttons[x].addEventListener("click", clickButton);
       }
       
   }
   console.log("stop:DOMContentLoaded");
   top5Check();
   
   
});
