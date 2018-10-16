//this function can remove a array element.
Array.remove = function(array, from, to) {
    var rest = array.slice((to || from) + 1 || array.length);
    array.length = from < 0 ? array.length + from : from;
    return array.push.apply(array, rest);
};

//this variable represents the total number of popups can be displayed according to the viewport width
var total_popups = 0;

//arrays of popups ids
var popups = [];

//this is used to close a popup
function close_popup(id)
{
    for(var iii = 0; iii < popups.length; iii++)
    {
        if(id == popups[iii])
        {
            Array.remove(popups, iii);

            document.getElementById(id).style.display = "none";

            calculate_popups();

            return;
        }
    }
}

//displays the popups. Displays based on the maximum number of popups that can be displayed on the current viewport width
function display_popups()
{
    var right = 220;

    var iii = 0;
    for(iii; iii < total_popups; iii++)
    {
        if(popups[iii] != undefined)
        {
            var element = document.getElementById(popups[iii]);
            element.style.right = right + "px";
            right = right + 320;
            element.style.display = "block";
        }
    }

    for(var jjj = iii; jjj < popups.length; jjj++)
    {
        var element = document.getElementById(popups[jjj]);
        element.style.display = "none";
    }
}

//creates markup for a new popup. Adds the id to popups array.
function register_popup(id, name)
{

    for(var iii = 0; iii < popups.length; iii++)
    {
        //already registered. Bring it to front.
        if(id == popups[iii])
        {
            Array.remove(popups, iii);

            popups.unshift(id);

            calculate_popups();


            return;
        }
    }

    var element = '<div class="popup-head">';
    element = element + '<div class="popup-head-left">'+ name +'</div>';
    element = element + '<div class="popup-head-right"><a href="javascript:close_popup(\''+ id +'\');">&#10005;</a></div>';
    element = element + '<div style="clear: both"></div></div><div class="popup-messages" id="user-' +id+'"></div><div class="chat-reply"><input type="text"><button style="right:float" onclick="broker('+id+')">send</button></div>';
    let chatBox = document.createElement("div");
    chatBox.setAttribute('class', 'popup-box chat-popup');
    chatBox.setAttribute('id', id);
    chatBox.innerHTML = element;
    document.getElementsByTagName("body")[0].appendChild(chatBox);
    connectChat({
        receiver: "user-" + id,
        sender: "user-" + getCookie('UserId')
    })

    popups.unshift(id);

    calculate_popups();

}

function broker(id){
    console.log("#user-"+id+" + button")
   let message =  document.querySelector("#user-"+id+" + div>input").value;
   document.querySelector("#user-"+id+" + div>input").value = "";
   messenger("send",message,id)
}
{/* <ul class="chat">
 <li class="chat__bubble chat__bubble--rcvd chat__bubble--stop">What are you up to?</li>
 <li class="chat__bubble chat__bubble--sent">Not much.</li>
 <li class="chat__bubble chat__bubble--sent">Just writing some CSS.</li>
 <li class="chat__bubble chat__bubble--sent">I just LOVE writing CSS.</li>
 <li class="chat__bubble chat__bubble--sent chat__bubble--stop">Do you?</li>
 <li class="chat__bubble chat__bubble--rcvd">Yeah!</li>
 <li class="chat__bubble chat__bubble--rcvd">It's super fun.</li>
 <li class="chat__bubble chat__bubble--rcvd chat__bubble--stop">... SUPER fun.</li>
</ul> */}
function messenger(type,message,receiver){
    let ele = document.createElement('li');
    if (type == "received")
    ele.setAttribute('class', 'chat__bubble chat__bubble--rcvd')
    else
    ele.setAttribute('class', 'chat__bubble chat__bubble--sent')
    ele.innerHTML = message;
    document.getElementById('user-'+receiver).appendChild(ele);
}


//calculate the total number of popups suitable and then populate the toatal_popups variable.
function calculate_popups()
{
    var width = window.innerWidth;
    if(width < 540)
    {
        total_popups = 0;
    }
    else
    {
        width = width - 200;
        //320 is width of a single popup box
        total_popups = parseInt(width/320);
    }

    display_popups();

}

//recalculate when window is loaded and also when window is resized.
window.addEventListener("resize", calculate_popups);
window.addEventListener("load", calculate_popups);

//////////////////////////// for getting cookie value by name

var getCookie = function(name) {
	var getCookieValues = function(cookie) {
		var cookieArray = cookie.split('=');
		return cookieArray[1].trim();
	};

	var getCookieNames = function(cookie) {
		var cookieArray = cookie.split('=');
		return cookieArray[0].trim();
	};

	var cookies = document.cookie.split(';');
	var cookieValue = cookies.map(getCookieValues)[cookies.map(getCookieNames).indexOf(name)];

	return (cookieValue === undefined) ? null : cookieValue;
};
