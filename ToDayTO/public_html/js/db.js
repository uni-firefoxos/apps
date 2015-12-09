window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var DB_NAME = 'ToDayTO';
var DB_VERSION = 1; 
var TABLE_TODAYTO = 'todos';
var db;

function getRequests() {
    var s1 = location.search.substring(1, location.search.length).split('&'),
            r = {}, s2, i;
    for (i = 0; i < s1.length; i += 1) {
        s2 = s1[i].split('=');
        r[decodeURIComponent(s2[0]).toLowerCase()] = decodeURIComponent(s2[1]);
    }
    return r;
}

function openDB() {
    var req = window.indexedDB.open(DB_NAME, DB_VERSION);
    req.onsuccess = function(evt) {
        db = this.result;
        console.log("succes open db");
        getAllBucketByName();
    };
    req.onerror = function(evt) {
        console.error("req.onerror:", evt.target.error.message);
    };

    req.onupgradeneeded = function(evt) {
        console.log("openDb.onupgradeneeded");
        try {
            var store0 = evt.currentTarget.result.createObjectStore(TABLE_TODAYTO, {keyPath: 'id', autoIncrement: true});
            store0.createIndex('name', 'name', {unique: false});
        }
        catch (e) {console.log(e);}
        console.log("openDb.onupgradeneeded");
    };
}


function getObjectStore(store_name, mode) {
    var tx = db.transaction(store_name, mode);
    return tx.objectStore(store_name);
}

function getAllBucketByName() {
    store = getObjectStore(TABLE_TODAYTO, 'readonly');

    req = store.index("name").openCursor();
    req.onsuccess = function(evt) {
        var cursor = req.result;
        if (cursor) {
            var value = cursor.value;
            
            current_day = new Date().getDay();
            if(current_day == value.day)
            {
                newP0 = document.createElement("p");
                
                //newP1 = document.createElement("p");
                //newP1.innerHTML = value.state;
                newC = document.createElement('input');
                newC.type = 'checkbox';
                newC.setAttribute("id",value.id);
                
                if(value.state == true)
                {
                    newC.setAttribute("checked","checked");
                }
                
                newC.name= value.id;
                
                
                newP0.innerHTML = value.name;
                
                //newP0.appendChild(newlabel);
                //newP0.appendChild(newC);
                
                newA = document.createElement("a");
                newA.setAttribute("href", "#" + value.id);
                newA.onclick = function (event) {
                    modifySate(TABLE_TODAYTO, value.id, value.state);
                    return false;
                };
                
                //newA.appendChild(newlabel);
                newA.appendChild(newC);   
                
                newP0.appendChild(newA);
              
                //newC.appendChild(newP1);
                newLI = document.createElement("li");
                
                newLI.appendChild(newP0);
                //newLI.appendChild(newC);
                document.querySelector("#todoList").appendChild(newLI);
                cursor.continue();
            }
            else
            {
                deleteAll();
            }
        }
    };
}

function deleteAll(){
    store = getObjectStore(TABLE_TODAYTO, 'readwrite');
    store.clear();
    document.querySelector("#todoList").innerHTML = "";

    getAllBucketByName();           
    
}

function putObject(pName, data) {
    storeI = getObjectStore(pName, "readwrite");
    request = storeI.add(data); 
    request.onsuccess = function(event) {
        document.querySelector("#todoList").innerHTML="";
        getAllBucketByName();
    };
    request.onerror = function(event) {
        console.log("tranzakcioserr:" + event.result.error.message);
    };
}

function modifySate(pName, id, state){
    store = getObjectStore(TABLE_TODAYTO, 'readwrite');
    request = store.get(id);
    request.onsuccess = function(event) {
        
        var data = request.result;
        if(state == false)
        {
            data.state=true;
        }
        else{
             data.state=false;
        }
        var requestUpdate =store.put(data);
        requestUpdate.onsuccess = function(event) {
            document.querySelector("#todoList").innerHTML="";
            getAllBucketByName();
        }
        requestUpdate.oneror = function(event) {}
    };
    request.onerror = function(event) {
        console.log("tranzakcioserr:" + event.result.error.message);
    };
}
