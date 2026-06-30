let currentrow = 0; //Set to a number to test that row from the TSV.
let filled = 0; //For filling the gallery images only once.
let data;
let whichpage;

function loaddata(subsheetID) {
	d3.tsv("https://docs.google.com/spreadsheets/d/e/2PACX-1vRtmdbRQs4nYQ7QHam4WzFWlbU0gOAs-w8-2DMjIvOvc8ituHqsE044CEapZxtOStNMxvy_89UPCovf/pub?gid=" + subsheetID + "&single=true&output=tsv").then(copythisdata => {
		data = copythisdata;
		whichpage = subsheetID;
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

	if( filled == 0 ) { //Populates the main gallery on the initial run.
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
			//Set thumbnail based on which page we're on:
			/*Photography:*/ if (whichpage == '0') { imgG.src = "https://i.imgur.com/" + data[i].URL + "_d.webp?maxwidth=350"; }
			///*Videos:*/ else if (whichpage == '1188620392') { imgG.setAttribute("src", "https://i.ytimg.com/vi_webp/" + data[i].URL + "/hqdefault.webp"); }
			
			let textG = document.createElement("p"); //Create text
			textG.setAttribute("class", "childtext"); //Class the text
			textG.innerHTML = (data[i].Title);
			
			gallery.appendChild(newdiv);
			newdiv.appendChild(imgG);
			newdiv.appendChild(glam);
			newdiv.appendChild(textG);
		}
		filled = 1;
	}
	//The above code populates the main page with the thumbnail images from the TSV if they haven't been loaded already. It even creates the HTML elements as well!
	//Infobox populating code below:
	if (location.hash != "") { // Removes error message on blank initial load.
		let media = document.getElementById("media");
		
		//Quickly clear the last thing before it slides in:
		media.src = "";
		document.querySelector("#infobox").removeAttribute("data-loaded");
		
		document.getElementById("title").innerHTML = (data[currentrow].Title);
		document.getElementById("desc").innerHTML = (data[currentrow].Info);
		
		//Set content based on which page we're on:
		/*Photography:*/
		if (whichpage == '0') {
			//Set to thumb, then set the sizing based on img size:
			//media.src = "https://i.imgur.com/" + data[currentrow].URL + "_d.webp?maxwidth=350";
			//media.style.width = "350px";
			//media.style.height = "350px";
			//media.style.height = document.querySelectorAll(".itemtile > img:first-of-type")[parsin].naturalHeight;
			//Set to actual image:
			media.src = "https://i.imgur.com/" + data[currentrow].URL + ".jpg";
		}
		///*Videos:*/ else if (whichpage == '1188620392') { media.src = ("https://www.youtube.com/embed/" + data[currentrow].URL); }
		
		moveit();
		hidenavbuttons();
	}
}

function fadebox() {
	document.querySelector("#infobox").setAttribute("data-loaded", "1");
}

document.addEventListener('keydown', function(event) {
	let info = document.getElementById('infobox');
	if (info.open) {
		const key = event.key;
		switch (event.key) {
			case "ArrowLeft": nextprev(0); break;
			case "ArrowRight": nextprev(1); break;
		}
	}
});

function nextprev(direction) {
	let gallery = document.getElementById("gallery");
	
	//Looking right...
	if (direction == 1 && currentrow < data.length - 1) {
		while (currentrow < data.length) {
			 //Looks ahead to see if the next element is hidden:
			if (gallery.children[currentrow + 1].classList[0] == "hidden") { currentrow++; }
			else { makehash(data[currentrow + 1].Permahash); break; }
		}
	}
	
	//Looking left...
	else if (direction == 0 && currentrow > 0) {
		while (currentrow > 0) {
			 //Looks behind to see if the previous element is hidden:
			if (gallery.children[currentrow - 1].classList[0] == "hidden") { currentrow--; }
			else { makehash(data[currentrow - 1].Permahash); break; }
		}
	}
	
	hidenavbuttons();
}

function hidenavbuttons() {
	if (currentrow >= data.length - 1) {
		document.getElementById("rightbutton").setAttribute("class", "closeXhidden");
	}
	else { document.getElementById("rightbutton").setAttribute("class", "closeX"); }
	
	if (currentrow <= 0) {
		document.getElementById("leftbutton").setAttribute("class", "closeXhidden");
	}
	else { document.getElementById("leftbutton").setAttribute("class", "closeX"); }
}

function moveit() {
	document.getElementById('infobox').showModal();
}

function moveitout() {
	document.getElementById('infobox').close();
}

//Clicking off the info box removes the hash.
function closeit() {
	history.pushState("", document.title, window.location.pathname + window.location.search); //Removes the hash while maintaining stuff like search parameters. Just in case I add search functionality in the future.
	moveitout();
}