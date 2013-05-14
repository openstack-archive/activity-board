function showElement(layer){
    hideAll()
    var myLayer = document.getElementById(layer);
    if(myLayer.style.display=="none"){
	myLayer.style.display="block";
	myLayer.backgroundPosition="top";
    } else {
	myLayer.style.display="none";
    }
}

function hideAll(){
    var v1 = document.getElementById("v-menu1");
    v1.style.display="none";
    var v2 = document.getElementById("v-menu2");
    v2.style.display="none";
}
