let currentrow = 0; //Set to a number to test that row from the TSV.
let filled = 0; //For filling the gallery images only once.
let data = [];
let dataOG; //So we can remove stuff from 'data' while having this as backup.
let hashname; // Moved here for referencing from getfromsearch().
let cachedsearch; // To not reload the search when it's the same as before.

function loaddata() {
	d3.tsv("https://docs.google.com/spreadsheets/d/e/2PACX-1vSsVi4ZkLBQI9OEiEtKEzE9vMGW7Uwu3Wuu60wBgxUAm7uXd16KqCgSLGWwpRbGf6-4YMRpyYLNqjxv/pub?output=tsv").then(copythisdata => {
		dataOG = copythisdata;
		//data = dataOG;
		loadfromhash();
	});
}

function narrowdata() {
	if ( filled == 1 ) {
		let gallery = document.getElementById("gallery");
		data = [];
		
		gallery.innerHTML = "<h1 id='getridofme'>Loading page content...</h1><noscript><h1 style='text-align: center'>This page needs Javascript<br>enabled to function properly.</h1></noscript>";
		
		//Remove all but the h1 and noscript, make loading text visible again before starting.
		document.getElementById("getridofme").style.display = "unset";
		
		/*for (let i = 2; i < (gallery.children.length); i++) { //Starts at 2 to avoid the non-gallery objects.
			console.log("removing " + gallery.children[i]);
			gallery.children[i].remove();
		}*/
		filled = 0;
	}
	
	//data = dataOG;
	
	//Resets the yearly divider toggle button:
	document.getElementById("optionbtn1").style.backgroundColor = "";
	document.getElementById("optionbtn1").removeAttribute("disabled");
	
	if ( found == 1 && anysearches == 1 && searchstring !== '' && searchstring !== 'All' && searchstring !== 'Featured' ) {
		// If it's one of the buttons and a non-empty search was performed...
		//console.log("glung");
		for (let i = 0; i <= (dataOG.length - 1); i++) {
			if ( dataOG[i].Category === searchstring ) {
				data.push(dataOG[i]);
			}
		}
	}
	else if ( searchstring === 'Featured' ) {
		//Disable the yearly divider toggle button:
		document.getElementById("optionbtn1").style.backgroundColor = "var(--davys-gray)";
		document.getElementById("optionbtn1").setAttribute("disabled", "");
		
		//Push Featured content:
		for (let i = 0; i <= (dataOG.length - 1); i++) {
			for (let o = 0; o <= (dataOG.length - 1); o++) {
				if ( dataOG[o].Featured == [i + 1] ) {
					data.push(dataOG[o]);
					break;
				}
			}
		}
	}
	else if ( found == 0 && anysearches == 1 && searchstring !== '' && searchstring !== 'All' ) {
		// If it's NOT one of the buttons and a non-empty search was performed...
		//console.log("grearching");

		//let searchableColumns = ["Title", "Info", "Difficulties", "Skills", "Software", "Client", "Category", "Permahash"];
		
		//Splits the search by commas, allowing multiple searches at once.
		let commaseparatedSearch = searchstring.toLowerCase().replace(/%20/g, ' ').split(", "); //(If no commas, becomes array with length of 0.)
		for (let i = 0; i <= (dataOG.length - 1); i++) {
			for (let splitnum = 0; splitnum < commaseparatedSearch.length; splitnum++) {
				if (
					dataOG[i].Title.toLowerCase().includes(commaseparatedSearch[splitnum]) ||
					dataOG[i].Info.toLowerCase().includes(commaseparatedSearch[splitnum]) ||
					dataOG[i].Difficulties.toLowerCase().includes(commaseparatedSearch[splitnum]) ||
					dataOG[i].Skills.toLowerCase().includes(commaseparatedSearch[splitnum]) ||
					dataOG[i].Software.toLowerCase().includes(commaseparatedSearch[splitnum]) ||
					dataOG[i].Client.toLowerCase().includes(commaseparatedSearch[splitnum]) ||
					dataOG[i].Category.toLowerCase().includes(commaseparatedSearch[splitnum]) ||
					dataOG[i].Permahash.toLowerCase().includes(commaseparatedSearch[splitnum])
				) {
					data.push(dataOG[i]); break; //Breaks to avoid repeating the same data for dual-searches.
				}
			}
		}
	}
	else {
		data = dataOG;
		//console.log("jungle");
	}
	
	if (data.length == 0) {
		gallery.innerHTML = "<h2 style='color: white; opacity: 50%; text-align: center; width: 470px;'>Nothing came up from your search...<br><br>(I'm still migrating content over from my scrappy <a href='https://1yoshibobby1.wixsite.com/bobbyzuch/' target='_blank'>old portfolio</a>, so missing content might be there.)</h2><h1 id='getridofme'>Loading page content...</h1><noscript><h1 style='text-align: center'>This page needs Javascript<br>enabled to function properly.</h1></noscript>";
	}
}

function makehash(currentpermahash) { //Makes a hash out of the value given by the clicked HTML element.
	if ( anysearches == 1 ) { currentpermahash = currentpermahash + '?' + searchstring; }
	location.hash = currentpermahash;
}

function loadfromhash() { //Performs actions based around the number of the hash.
	//console.log("loading...");
	if ( anysearches == 1 ) {
		hashname = location.hash.slice(0, location.hash.indexOf('?')).substring(1);
	}
	else { hashname = location.hash.substring(1); }
	// ^ This removes the '#' from the hash referencer, and removes the search string.
	
	getfromsearch();
	if ( cachedsearch !== searchstring ) { narrowdata(); }
	
	let parsin = 0;
	while (parsin <= (data.length - 1) && (data[parsin].Permahash != hashname)) { parsin++; }
	currentrow = parsin;

	if( filled == 0 ) { //Populates the main gallery on the initial run.
		let gallery = document.getElementById("gallery");
		let cachedyear;
		
		for (let i = 0; i <= (data.length - 1); i++) {
			//Populate yearly dividers, based on the last 4 digits:
			if (data[i].Date.slice(-4) !== cachedyear && searchstring !== 'Featured') {
				cachedyear = data[i].Date.slice(-4);
				
				let d = document.createElement("DIV");
				d.setAttribute("class", "yearlydivider");
				d.innerHTML = cachedyear;
				if (i == 0) { d.setAttribute("style", "margin-top: 0"); }
				gallery.appendChild(d);
			}
			
			//Populate thumbnails:
			let a = document.createElement("a");
			let x = document.createElement("IMG");
			a.setAttribute("id", "imgnum" + i);
			if ( anysearches == 0 ) { a.setAttribute("href", "#" + data[i].Permahash); }
			else { a.setAttribute("href", "#" + data[i].Permahash + '?' + searchstring); }
			x.setAttribute("alt", data[i].Title);
			x.setAttribute("title", data[i].Title); //Tooltip
			x.setAttribute("src", data[i].Thumb);
			gallery.appendChild(a); a.appendChild(x);
		}
		filled = 1;
		document.getElementById("getridofme").style.display = "none"; //Hides the loading text.
	}
	//The above code populates the main page with the thumbnail images from the TSV if they haven't been loaded already. It even creates the HTML elements as well!
	//Infobox populating code below:
	if (hashname != "") { // Removes error message on blank initial load.
		let infoboximage = document.getElementById("image");
		let videoframe = document.getElementById("videoframe");
		infoboximage.src = ""; //Quickly clear the last image before it slides in.
		document.getElementById("title").innerHTML = (data[currentrow].Title);
		document.getElementById("date").innerHTML = "<img src='../clock.svg'> " + (data[currentrow].Date);
		document.getElementById("desc").innerHTML = (data[currentrow].Info);
		document.getElementById("diff").innerHTML = (data[currentrow].Difficulties);
		//Separate skills and softwares into sub-arrays:
		let splitskills = data[currentrow].Skills.split(", ");
		let splitsoftware = data[currentrow].Software.split(", ");
		makesearchlinks(splitskills); makesearchlinks(splitsoftware);
		//Get skills and software from that function, resume other population:
		document.getElementById("skills").innerHTML = "<b>Skills:</b> " + (splitskills);
		document.getElementById("software").innerHTML = "<b>Software:</b> " + (splitsoftware);
		document.getElementById("client").innerHTML = (data[currentrow].Client);
		document.getElementById("category").innerHTML = (data[currentrow].Category).replace(/-/g, " ").replace(/\+/g, " & ");
		
		//Clearing all content before declaring what type is displayed:
		infoboximage.style.display = "none";
		document.getElementById("iframeouter").style.display = "none";
		document.getElementById("iframeA").src = "";
		videoframe.style.display = "none";
		infoboximage.removeAttribute("onclick");
		infoboximage.style.cursor = "";
		infoboximage.parentElement.removeAttribute("class");
		document.getElementById("extra").style.display = "none"; 
		
		//Looking at Type to determine how the content displays:
		if (data[currentrow].Type === "img") {
			//console.log("imgtime");
			infoboximage.style.display = "block";
			infoboximage.src = (data[currentrow].URL);
		}	
		else if (data[currentrow].Type === "iframe") {
			//console.log("iframetime");
			document.getElementById("getridofme2").style.display = "block"; //Will turn back to none after loading.
			document.getElementById("iframeouter").style.display = "flex";
			document.getElementById("iframeA").src = (data[currentrow].URL);
		}
		else if (data[currentrow].Type === "video") {
			//console.log("videotime");
			videoframe.style.display = "block";
			//videoframe.pause();
			videoframe.children[0].src = "../iframes/videos/" + data[currentrow].URL + ".mp4";
			videoframe.children[1].src = "../iframes/videos/" + data[currentrow].URL + ".webm";
			videoframe.children[2].src = "../iframes/videos/" + data[currentrow].URL + ".gif"; 
			videoframe.load();
			//videoframe.play();
		}
		else { // When the Type column contains something else, like a URL, link to it:
			//console.log("clickabletime");
			infoboximage.style.display = "block";
			infoboximage.src = (data[currentrow].URL);
			infoboximage.setAttribute("onclick", "openthis('" + data[currentrow].Type + "')");
			infoboximage.style.cursor = "pointer";
			infoboximage.parentElement.setAttribute("class", "extraroom");
			document.getElementById("extra").style.display = "block";
			document.getElementById("extra").innerHTML = "(Click the image <a href='" + data[currentrow].Type + "' target='_blank'>or this text</a> to interact with it!)";
		}
		
		moveit();
		hidenavbuttons();
		
		//Adds searching functionality to the skills and software tags:
		function makesearchlinks(skillsORsoftware) {
			for (let s = 0; s < skillsORsoftware.length; s++) {
				currentS = " <a href='#?" + skillsORsoftware[s] + "' onclick='SSsearch(this.innerHTML)'>" + skillsORsoftware[s]/*.replace(/_/g, ' ')*/ + "</a>";
				skillsORsoftware[s] = currentS;
			}
		}
	}
	
	cachedsearch = searchstring;
}

//Function for searching Skills & Software. Maneuvers around _ characters.
function SSsearch(thesearch){
	filters[2].children[0].value = thesearch/*.replace(/ /g, '_')*/;
	filter(filters[2].children[0]);
	closeit();
}

document.addEventListener('keydown', function(event) {
	let info = document.getElementById('backborder');
	let rect = info.getBoundingClientRect();
	if ( rect.right < window.innerWidth ) {
		const key = event.key;
		switch (event.key) {
			case "ArrowLeft": nextprev(0); break;
			case "ArrowRight": nextprev(1); break;
			case "Escape": closeit(); break;
		}
	}
});

function openthis(link) { window.open(link, "_blank"); }

function nextprev(direction) {
	if (direction == 1 && currentrow < data.length - 1) { makehash(data[currentrow + 1].Permahash); }
	else if (direction == 0 && currentrow > 0) { makehash(data[currentrow - 1].Permahash); }
	
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