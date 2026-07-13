let currentrow = 0; //Set to a number to test that row from the TSV.
let filled = 0; //For filling the gallery images only once.
let data;
let whichpage;
let resume = 0;

function loaddata(subsheetID) {
	d3.tsv("https://docs.google.com/spreadsheets/d/e/2PACX-1vRtmdbRQs4nYQ7QHam4WzFWlbU0gOAs-w8-2DMjIvOvc8ituHqsE044CEapZxtOStNMxvy_89UPCovf/pub?gid=" + subsheetID + "&single=true&output=tsv").then(copythisdata => {
		data = copythisdata;
		whichpage = subsheetID;
		filled = 0;
		currentrow = 0
		loadfromhash();
	});
}

function makehash(currentpermahash) { //Makes a hash out of the value given by the clicked HTML element.
	location.hash = currentpermahash;
}

function loadfromhash() { //Performs actions based around the number of the hash.	
	let hashname = location.hash.substring(1); //This removes the '#' from the hash referencer.
	let parsin = 0;
	while (parsin <= (data.length - 1) && (data[parsin].Permahash != hashname)) { parsin++; }
	currentrow = parsin;

	if (!filled) { //Populates the main gallery on the initial run.
		let gallery = document.getElementById("gallery");
		gallery.innerHTML = "";
		
		const glam = document.createElement("IMG"); //Create image
			glam.setAttribute("class", "glam");
			glam.setAttribute("role", "decorative");
			glam.setAttribute("src", "https://static.vecteezy.com/system/resources/previews/024/234/903/non_2x/rainbow-hologram-gradient-background-luxury-trendy-tender-pearlescent-glam-overlay-rainbow-holographic-princess-fairytale-cute-girlie-texture-unicorn-fairy-tale-neon-hologram-gradient-free-vector.jpg");
		
		for (let i = 0; i <= (data.length - 1); i++) { //Check if the div styling is correct.
			let newdiv = document.createElement("a"); //Create div
			newdiv.setAttribute("id", "divnum" + i); //ID the div
			newdiv.setAttribute("class", "itemtile"); //Class the div
			//newdiv.setAttribute("value", data[i].Genre);
			//newdiv.setAttribute("onclick", "makehash('" + data[i].Permahash + "')"); //Whole div makes clickable hash
			newdiv.setAttribute("href", "#" + data[i].Permahash);
			let imgG = document.createElement("IMG"); //Create image
			imgG.setAttribute("alt", data[i].Title);
			imgG.setAttribute("title", data[i].Title); //Tooltip
			//imgG.setAttribute("src", data[i].Thumb); 
			
			let thumby = data[i].URL;
			//Set the img to use the imgur link if that's what it's entered as (default action):
			if (!thumby.startsWith("http")) { thumby = "https://i.imgur.com/" + thumby + "_d.webp?maxwidth=350"; }
			
			imgG.src = thumby;
			//Set thumbnail based on which page we're on:
			///*Photography:*/ if (whichpage == '0') { imgG.src = thumby; }
			///*Videos:*/ else if (whichpage == '1188620392') { imgG.setAttribute("src", "https://i.ytimg.com/vi_webp/" + data[i].URL + "/hqdefault.webp"); }
			
			let textG = document.createElement("p"); //Create text
			textG.setAttribute("class", "childtext"); //Class the text
			textG.innerHTML = (data[i].Title);
			
			gallery.appendChild(newdiv);
			newdiv.appendChild(imgG);
			if (!data[i].HideFilter) { newdiv.appendChild(glam.cloneNode(true)); }
			newdiv.appendChild(textG);
		}
		filled = 1;
	}
	//The above code populates the main page with the thumbnail images from the TSV if they haven't been loaded already. It even creates the HTML elements as well!
	//Infobox populating code below:
	if (location.hash != "") { // Removes error message on blank initial load.
		resume = 0;
		let media = document.getElementById("media");
		
		//Quickly clear the last thing before it slides in:
		media.src = "";
		media.setAttribute("data-noglam", "1");
		document.querySelector("#infobox").removeAttribute("data-loaded");
		
		let boxtitle = data[currentrow].Title;
		
		if (data[currentrow].Outlink) {
			boxtitle = `&ZeroWidthSpace;<a id="outlink" href="` + data[currentrow].Outlink + `" target="_blank">` + boxtitle + `</a>`;
		}
		
		document.getElementById("title").innerHTML = boxtitle;
		document.getElementById("desc").innerHTML = data[currentrow].Info;
		
		
		let bigimage = data[currentrow].URL;
		//Set the img to use the imgur link if that's what it's entered as (default action):
		if (!bigimage.startsWith("http")) { bigimage = "https://i.imgur.com/" + bigimage + ".jpg"; }
		
		//Show the glam filter if not specified on the sheet, and only on the cooking page:
		if (!data[i].HideFilter && whichpage == '0') {
			media.removeAttribute("data-noglam");
		}
		
		//Set content based on which page we're on:
		/*Photography:*/
		//if (whichpage == '0') {
			//Set to actual image:
			media.src = bigimage;
			media.alt = data[currentrow].Title;
		//}
		///*Videos:*/ else if (whichpage == '1188620392') { media.src = ("https://www.youtube.com/embed/" + data[currentrow].URL); }
		
		moveit();
		//hidenavbuttons();
	}
}

function fadebox() {
	document.querySelector("#infobox").setAttribute("data-loaded", "1");
}

document.addEventListener('keydown', function(event) {
	let info = document.getElementById('infobox');
	if (info.open && !resume) {
		const key = event.key;
		switch (event.key) {
			case "ArrowLeft": nextprev(0); break;
			case "ArrowRight": nextprev(1); break;
		}
	}
});

function nextprev(direction) {
	let gallery = document.getElementById("gallery");
	
	// Looking right:
	if (direction) {
		currentrow++;
		if (currentrow >= data.length) { currentrow = 0; }
		makehash(data[currentrow].Permahash);
	}
	// Looking left:
	else {
		currentrow--;
		if (currentrow < 0) { currentrow = data.length - 1; }
		makehash(data[currentrow].Permahash);
	}
	
	/*
	//Looking right...
	if (direction == 1 && currentrow < data.length - 1) {
		while (currentrow < data.length) {
			 //Looks ahead to see if the next element is hidden:
			if (gallery.children[currentrow + 1].hidden) { currentrow++; }
			else { makehash(data[currentrow + 1].Permahash); break; }
		}
	}
	
	//Looking left...
	else if (direction == 0 && currentrow > 0) {
		while (currentrow > 0) {
			 //Looks behind to see if the previous element is hidden:
			if (gallery.children[currentrow - 1].hidden) { currentrow--; }
			else { makehash(data[currentrow - 1].Permahash); break; }
		}
	}
	*/
	
	//hidenavbuttons();
}

// Improved arrow hiding functionality, but disabled to allow for looping around:
/*function hidenavbuttons() {
	if (currentrow >= data.length - 1) {
		document.getElementById("rightbutton").hidden = true;
	}
	else { document.getElementById("rightbutton").hidden = false; }
	
	if (currentrow <= 0) {
		document.getElementById("leftbutton").hidden = true;
	}
	else { document.getElementById("leftbutton").hidden = false; }
}*/

function moveit() { document.getElementById('infobox').showModal(); }
function moveitout() { document.getElementById('infobox').close(); }

//Clicking off the info box removes the hash.
function closeit() {
	history.pushState("", document.title, window.location.pathname + window.location.search); //Removes the hash while maintaining stuff like search parameters. Just in case I add search functionality in the future.
	moveitout();
}

function swapitall(btn, path) {
	document.querySelector("#current").removeAttribute("id");
	btn.id = "current";
	
	history.replaceState("", "", (window.location.origin + "/" + path))
	
	let fc = document.querySelector("#flexcontent");
	fc.style.opacity = 0;
	
	setTimeout(() => {
		fc.removeAttribute("style");
		replacecontent(path);
	}, 1000);
}

function replacecontent(path) {
	if (path == 'cooking') {
		document.querySelector("#introtext").innerHTML = "<h1>My Cooking</h1><hr><p>A selection of my finest meals. Our menu includes...</p>";
	}
	else if (path == 'projects') {
		document.querySelector("#introtext").innerHTML = "<h1>Game Projects</h1><hr><p>Notable work from my solo game dev projects.</p>";
	}
}

function showresume() {
	resume = 1;
	let media = document.getElementById("media");
		
	//Quickly clear the last thing before it slides in:
	media.src = "";
	media.setAttribute("data-noglam", "1");
	document.querySelector("#infobox").removeAttribute("data-loaded");
	
	document.getElementById("title").innerHTML = `&ZeroWidthSpace;<a id="outlink" href="../Bea Tran Resume.pdf" target="_blank">Open PDF in New Tab</a>`;
	document.getElementById("desc").innerHTML = "";
	
	media.src = "../Bea Tran Resume.jpg";
	media.alt = "Resume";
	
	moveit();
}

function clickthelink() {
	if (document.querySelector("#outlink[href]")) {
		document.querySelector("#outlink").click();
	}
}