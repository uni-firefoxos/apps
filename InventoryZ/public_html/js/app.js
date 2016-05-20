/* global IDBKeyRange */
var db;
var objectStore;
var trans;
var decoder;

    console.log("title:", document.querySelector("title").innerHTML);
    
    var ireq = window.indexedDB.open("Inventory", 1); 
    
    ireq.onerror = function (event) {
        console.log("DB error", event);
    };

    ireq.onsuccess = function () {
        console.log("DB open"); 
        db = ireq.result;
        if (document.querySelector("title").innerHTML === "Main") {
            displayData();
        }
        if (document.querySelector("title").innerHTML === "Exit") {
            document.querySelector(".danger").addEventListener("click", exitFromApp, false);
            document.querySelector("#back").addEventListener("click", navToIndex, false);
        }       
        if (document.querySelector("title").innerHTML === "Add") {
            document.getElementById("backButton").addEventListener("click", navToIndex);
            document.getElementById("cancelButton").addEventListener("click", navToIndex);
            document.getElementById("okButton").addEventListener("click", addData);
            document.getElementById("addDataButton").addEventListener("click", addData);
            document.getElementById("scnDataButton").addEventListener("click", scanAddData);
            document.getElementById("scanButton").addEventListener("click", scanAddData);
            addLoad();
        }
        if (document.querySelector("title").innerHTML === "Delete") {
            document.querySelector("#back").addEventListener("click", delBack);
            document.querySelector(".danger").addEventListener("click", delData);            
        }
        if (document.querySelector("title").innerHTML === "Edit") {
            document.getElementById("backButton").addEventListener("click", navToIndex);
            document.getElementById("storeButton").addEventListener("click", storeData);
            document.getElementById("okButton").addEventListener("click", storeData);
            editLoad();            
        }
        if (document.querySelector("title").innerHTML === "Send") {
            document.getElementById("backButton").addEventListener("click", navToIndex);
            document.getElementById("cancelButton").addEventListener("click", navToIndex);
            document.getElementById("okButton").addEventListener("click", sendInEmail);
            document.getElementById("emailInput").focus();
        }
        //if (document.querySelector("title").innerHTML === "Scan") {
            //scanBarCode();
        //}
        if (document.querySelector("title").innerHTML === "Find") {
            document.getElementById("backButton").addEventListener("click", navToIndex);
            document.getElementById("okButton").addEventListener("click", findData);
            document.getElementById("scnDataButton").addEventListener("click", scanFindData);
            document.getElementById("scanButton").addEventListener("click", scanFindData);
            document.getElementById("cancelButton").addEventListener("click", navToIndex);
            findLoad();
        }
        if (document.querySelector("title").innerHTML === "Clear") {
            document.querySelector(".danger").addEventListener("click", clearAllData, false);
            document.querySelector("#back").addEventListener("click", navToIndex, false);
        }       
    };

    // create database if needed
    ireq.onupgradeneeded = function(event) {
      console.log("DB onupgradeneeded");  
      db = event.target.result;
      objectStore = db.createObjectStore("InventoryList", { keyPath: "id", autoIncrement: true });
      objectStore.createIndex("code", "code", { unique: true });
      objectStore.createIndex("name", "name", { unique: false });
    };
    
function logTitle() {  
    console.log("title:", document.querySelector("title").innerHTML);
}

function navToIndex() {
    window.location.href = "index.html";
}

function exitFromApp() {
    window.close();
}

function numericCheck(str, name) { 
    var result = false;  
    if (str !== null) {
         if (str.length > 0) {
             if (!isNaN(str)) {
                 result = parseFloat(str);              
            }
        }
    }
    if ( !result ) {
       navigator.vibrate(500);
       window.alert("DATA ERROR!\nThe " + name + " value is not numeric!"); 
    }
    return result;
}

function lengthCheck(str, name) {
    var result = false;
    if (str !== null) {
        if (str.length > 0) {
            result = true;
        }
    }
    if ( !result ) {
       navigator.vibrate(500);
       window.alert("DATA ERROR!\nThe " + name + " value is empty!"); 
    }
    return result;
}

function addLoad() {   
    var queryData = location.search.split('?code=')[1];
    if (queryData)
    {
        document.getElementById("codeInput").value = decodeURIComponent(queryData.split('&name=')[0]);
        document.getElementById("nameInput").value = decodeURIComponent(queryData.split('&name=')[1]);
        document.getElementById("qtyInput").focus();
    }
    else document.getElementById("codeInput").focus();

}

function addData(){
    
    var codeInput = document.getElementById("codeInput").value;
    var nameInput = document.getElementById("nameInput").value;
    var qtyInput = document.getElementById("qtyInput").value;
    
    if (!lengthCheck(codeInput, "code")) {
        document.getElementById("codeInput").focus();
        return;
    }
    if (!numericCheck(qtyInput, "quantity")) {
        document.getElementById("qtyInput").focus();
        return;
    }
    
    data = { 
        code: codeInput,
        name: nameInput,
        qty: qtyInput
    };

    trans = db.transaction(["InventoryList"], "readwrite");   
    objectStore = trans.objectStore("InventoryList");    
    var req = objectStore.add(data); // asynchron behavior!!!  

    req.onsucces = function(event){
        console.log("DB item added");
    };
    req.onerror = function(event) {
        console.log("DB item add-error", event);
        var msg = "DATA INSERT ERROR\n";
        if (event.target)
            if (event.target.error)
                msg = msg + event.target.error.name + ":" + event.target.error.message;
        alert(msg);
    };

    trans.oncomplete = function(event) {
        navToIndex();
        console.log("Transaction completed: database modification finished.");
    };
    trans.onerror = function(event) {
        console.log("Transaction not opened due to error.", event);
    };
}

function scanAddData() {
    window.location.href = "scan.html?add";
}

function storeData() {
    
    var codeInput = document.getElementById("codeInput").value;
    var nameInput = document.getElementById("nameInput").value;
    var qtyInput = document.getElementById("qtyInput").value;
    
    if (!lengthCheck(codeInput, "code")) {
        document.getElementById("codeInput").focus();
        return;
    }
    if (!numericCheck(qtyInput, "quantity")) {
        document.getElementById("qtyInput").focus();
        return;
    }
    
    var id = document.getElementById("itemId").value;    
    var key = parseInt(id);

    trans = db.transaction(["InventoryList"], "readwrite");   
    objectStore = trans.objectStore("InventoryList");    
    var req = objectStore.get(key); 

    req.onerror = function(event) {
        console.log('Entry data not loaded.');
    };

    req.onsuccess = function(event) {
        console.log('Entry data loaded.');
        var data = req.result; 

        if (data) {     
            data.code = codeInput;
            data.name = nameInput;
            data.qty = qtyInput;
            var requestUpdate = objectStore.put(data);

            requestUpdate.onerror = function(event) {
                console.log('Entry data not updated.');
                var msg = "DATA UPDATE ERROR\n";
                if (event.target)
                    if (event.target.error)
                        msg = msg + event.target.error.name + ":" + event.target.error.message;
                alert(msg);
            };
            requestUpdate.onsuccess = function(event) {
                console.log('Entry data updated.');
            };             
        }
        else {
            console.log("storeData: No result!");
        }        
    };

    trans.oncomplete = function(event) {
        navToIndex();
        console.log("Transaction completed: database modification finished.");
    };
    trans.onerror = function(event) {
        console.log("Transaction not opened due to error.", event);
    };   
}

function editItem(itemId){
    window.location.href = "edit.html?id=" + itemId;
    console.log('Entry (' + itemId + ') to edit.');
}

function delBack() { 
    console.log("delBack");        
    var id = location.search.split('id=')[1];
    window.location.href = "edit.html?id=" + id;
}

function delData() {
    console.log("delData");
    var id = location.search.split('id=')[1];
    deleteItem(id);
}

function deleteItem(itemId){
    console.log('Deleting item(' + itemId + ').');
    objectStore = db.transaction(["InventoryList"], "readwrite").objectStore("InventoryList");  
    
    var key = parseInt(itemId);
    var objectStoreRequest = objectStore.delete(key);

    objectStoreRequest.onsuccess = function(event) {
        console.log('Entry (' + itemId + ') deleted.');
        window.location.href = "index.html";
    };
    
    objectStoreRequest.onerror = function(event) {
        console.log('Error in delete entry (' + itemId + '):' + event);
        window.location.href = "index.html";
    };
}

function displayData(){
    
    objectStore = db.transaction(["InventoryList"], "readwrite").objectStore("InventoryList");    
    var res = objectStore.index("code").openCursor(IDBKeyRange.lowerBound("",true));
    
    res.onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor) {
            var li=document.createElement("LI");
            li.innerHTML='<div class="fit"><p>' + cursor.value["name"] + '</p><p>' + cursor.value["qty"] 
                    + '</p></div><div class="right"><button class="icon icon-dialog"' 
                    + ' id="' + cursor.value["id"] + '">Edit</button></div>';           
            document.getElementById("drawer").querySelector("UL").appendChild(li);
            document.getElementById(cursor.value["id"]).addEventListener("click", editDataClick);
            cursor.continue();
        } else {
            console.log('Entries all displayed.');
        }
    };    
    
}

function editDataClick(){   
    console.log('editDataClick on ' + this.id);
    window.location.href = "edit.html?id=" + this.id;
}

function editLoad(){
    var itemId = location.search.split('id=')[1];
    console.log("Edit data for id=(" + itemId + ")");
    
    document.getElementById("itemId").value = itemId;
    
    trans = db.transaction(["InventoryList"], "readwrite");
    objectStore = trans.objectStore("InventoryList");
    var key = parseInt(itemId);
    var objectStoreRequest = objectStore.get(key);
    
    objectStoreRequest.onsuccess = function(event) {
        console.log('Entry data loaded.');
        var data = objectStoreRequest.result;
        if (data) {
            document.getElementById("codeInput").value = data.code;
            document.getElementById("nameInput").value = data.name;
            document.getElementById("qtyInput").value = data.qty;    
            document.getElementById("deleteButton").onclick = function() { window.location.href = "delete.html?id=" + itemId; };
            document.getElementById("qtyInput").focus();
        }
        else {
            document.getElementById("codeInput").focus();
            console.log("editLoad: No result!");
        }        
    };
}

function sendInEmail(){

    var emailAddress = document.getElementById("emailInput").value + "";

    var alertMessage = "";
    if (emailAddress.length === 0) {
        alertMessage = "ERROR!\nE-mail address is empty!";
    }
    else {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if ((emailAddress.length === 0) || (!re.test(emailAddress))) {
           alertMessage = "ERROR!\nWrong e-mail-address format!"; 
        }
    }
    if (alertMessage.length > 0) {
        navigator.vibrate(500);
        window.alert(alertMessage); 
        document.getElementById("emailInput").focus();
        return;
    }
    
    var fileFormat = 0; // csv
    var fileNameExt = ".csv";
    var fileFormatInput = document.getElementsByName("file-format");
    if (fileFormatInput.length === 3)
    {
        if (fileFormatInput[1].checked) {            
            fileFormat = 1; // xml
            fileNameExt = ".xml";
        }
        else
            if (fileFormatInput[2].checked) {
                fileFormat = 2; // json
                fileNameExt = ".json";
            }
    } 
    
    var contentObject = { inventory : [] };
    var rowNum = -1;
    
    objectStore = db.transaction(["InventoryList"], "readwrite").objectStore("InventoryList");    
    var res = objectStore.index("code").openCursor(IDBKeyRange.lowerBound("",true));
    
    res.onsuccess = function(event) {
        var cursor = event.target.result;       
        if(cursor) {
            //content = content + cursor.value["code"] + ";" + cursor.value["name"] + ";"+ cursor.value["qty"] + "%0D%0A";
            rowNum = rowNum + 1;
            contentObject.inventory.push({});
            contentObject.inventory[rowNum]["code"] = cursor.value["code"];
            contentObject.inventory[rowNum]["name"] = cursor.value["name"];
            contentObject.inventory[rowNum]["qty"] = cursor.value["qty"];
            //
            cursor.continue();
        } else {
            console.log('Entries all collected.');
            var content;
            var blob;

            if (fileFormat === 2 ) {
                content = JSON.stringify(contentObject.inventory);
                blob = new Blob([content], {type : 'application/json'});
            }
            else
            {
                if (fileFormat === 0)
                    content = "code;name;qty\r\n";
                else
                    content = '<?xml version="1.0">'+'\n'+"<inventory>\n";
                //
                contentObject.inventory.forEach(function(rec){
                    if (fileFormat === 0)
                        content = content + '"' + rec["code"] + '";"'+ rec["name"] + '";' + rec["qty"] + "\r\n";
                    else
                        content = content + "\t<record>\n\t\t<code>"+rec["code"]+"</code>\n\t\t<name>"+rec["name"]+"</name>\n\t\t<qty>"+rec["qty"]+"</qty>\n\t</record>\n";
                });
                //
                if (fileFormat === 1){
                    content = content + "</inventory>";
                    blob = new Blob([content], {type : 'text/xml'});
                }
                else
                    blob = new Blob([content], {type : 'text/csv'});
            }
            fileNameExt = "inventory" + fileNameExt;
            var createEmail = new MozActivity({
              name: "new",
              data: {
                type : "mail",
                url: "mailto:"+ emailAddress +"?subject=Inventory-Z%20datafile&body=File%20'"+fileNameExt+"'%20attached.",
                filenames: [fileNameExt],
                blobs: [blob]
              }
            });
            navToIndex();
        };
    };
}

function findData() {
    var codeInput = document.getElementById("codeInput").value;
    var nameInput = document.getElementById("nameInput").value;
    window.location.href = "find.html?code=" + codeInput + "&name=" + nameInput;
}

function scanFindData() {
    window.location.href = "scan.html?find";
}

function findLoad() {   
    var queryData = location.search.split('?code=')[1];
    if (queryData)
    {   
        var itemId = "";
        var c = decodeURIComponent(queryData.split('&name=')[0]);
        var n = decodeURIComponent(queryData.split('&name=')[1]);
        document.getElementById("codeInput").value = c;
        document.getElementById("nameInput").value = n;
        result = document.getElementById("find-result");
        result.innerHTML = "NOT FOUND!";
        
        if(c) // find by code
        {
            objectStore = db.transaction(["InventoryList"], "readwrite").objectStore("InventoryList");    
            var index = objectStore.index("code");
            index.get(c).onsuccess = function(event) {
                if(event.target.result) {
                    itemId = event.target.result.id;
                    window.location.href = "edit.html?id=" + itemId;
                }
            };
        }
        else
        {
            if(n) // find by name
            {
                objectStore = db.transaction(["InventoryList"], "readwrite").objectStore("InventoryList");    
                var index = objectStore.index("name");
                index.get(n).onsuccess = function(event) {
                    if(event.target.result) {
                        itemId = event.target.result.id;
                        window.location.href = "edit.html?id=" + itemId;
                    }
                };
            }            
            else result.innerHTML = "Please enter data to find!";
        }
    }
    else document.getElementById("codeInput").focus();
}

function clearAllData() {
    window.indexedDB.deleteDatabase("Inventory");
    navToIndex();
}
