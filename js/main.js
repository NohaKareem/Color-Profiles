(_ => {
	let customClr, colorSwatch = document.querySelector('.colorSwatch');
	let complementary = document.querySelector('.complementary');
	let analogous1 = document.querySelector('.analogous1');
	let analogous2 = document.querySelector('.analogous2'); //~
	let pickerSwatchVals = [document.querySelector('.rgbVal'), document.querySelector('.hexVal'), document.querySelector('.hslVal')]; 
	let comSwatchVals = [document.querySelector('.comRgbVal'), document.querySelector('.comHexVal'), document.querySelector('.comHslVal')]; 
	let an1SwatchVals = [document.querySelector('.an1RgbVal'), document.querySelector('.an1HexVal'), document.querySelector('.an1HslVal')]; 
	let an2SwatchVals = [document.querySelector('.an2RgbVal'), document.querySelector('.an2HexVal'), document.querySelector('.an2HslVal')]; 
	let rgbVal = document.querySelector('.rgbVal');
	let hexVal = document.querySelector('.hexVal');
	let hslVal = document.querySelector('.hslVal');

	setup = _ => {
		createCanvas(windowWidth, windowHeight);
		customClr = new CustomColor(color(colorSwatch.value)); //~setcolor
		renderColorVals();
		noLoop();
	}
	  
	// draw = _ => {
	// 	noLoop();
			
	// 	let x = new CustomColor(color('#ff0000'))
	// 	console.log(x.clrHex)
	// 	console.log(x.clrHSL)
	// 	console.log(x.clrRGB)
	// }

	// generic colorr class, to conver color values given string/numeric input
	class Color {
		// constructor() {}
		toRGB(clr) { return this.strToArr(clr.toString('rgb')); }
		toHex(clr) { return clr.toString('#rrggbb'); }
		toHSL(clr) { return this.strToArr(clr.toString('hsl')); }

		// helper method to clean color text and parse as array of integers
		strToArr(clrStr) {
			return clrStr.replace(')','').replace('rgb(','').replace('hsl(', '')
				.split(',')
				.map(ch => { return parseInt(ch) })
		}

		// compute complementary/analogous colors
		getComplementary(clr) { 
			return [(clr[0] + 180) % 360, clr.slice(1)].flat(); 
		}
	}

	class CustomColor extends Color { //~
		constructor(clr) {
			super(); // ~all methods by Color parent class
			this.clr = clr;
			this.clrRGB_ = this.toRGB(clr);//this.strToArr(clr.toString('rgb'));
			this.clrHex_ = this.toHex(clr);//clr.toString('#rrggbb');	
			this.clrHSL_ = this.toHSL(clr);//this.strToArr(clr.toString('hsl'));	
		}

		// helper method to clean color text and parse as array of integers
		// strToArr(clrStr) {
		// 	return clrStr.replace(')','').replace('rgb(','').replace('hsl(', '')
		// 		.split(',')
		// 		.map(ch => { return parseInt(ch) });
		// }

		getComplementary() {
			return this.toHex(color([(this.clrHSL_[0] + 180) % 360, this.clrHSL_.slice(1)].flat())); 
		}

		getAnalogous() {
			return [this.toHex(color([(this.clrHSL_[0] + 60) % 360, this.clrHSL_.slice(1)].flat())),
				 this.toHex(color([(this.clrHSL_[0] + 120) % 360, this.clrHSL_.slice(1)].flat()))]; 
		}
		
		// getComplementary() {
		// 	return [(this.clrHSL_[0] + 180) % 360, this.clrHSL_.slice(1)].flat(); 
		// }

		// compute complementary/analogous colors
		getComplementaryToHex() { 
			let compl = this.getComplementary(this.clrHSL_);
			return this.toHex(color('hsb(' + compl[0] + ',' + compl[1] + '%,' + compl[2] + '%'));
			// return compl;// [(this.clrHSL_[0] + 180) % 360, this.clrHSL_.slice(1)].flat(); 
		}

		// toRGB(clr) { return this.strToArr(clr.toString('rgb')); }
		// toHex(clr) { return clr.toString('#rrggbb'); }

		// getter and setters
		get clrRGB() { return this.clrRGB_; }
		get clrHex() { return this.clrHex_; }
		get clrHSL() { return this.clrHSL_; }

		set clrRGB(rgb) { this.clrRGB_ = rgb; }
		set clrHex(hex) { this.clrHex_ = hex; }
		set clrHSL(hsl) { this.clrHSL_ = hsl; }
	}

	updateSwatchColors = _ => {
		pickerSwatchVals[0].innerHTML = `rgb(${ customClr.clrRGB.toString() })`;
		pickerSwatchVals[1].innerHTML = colorSwatch.value;
		pickerSwatchVals[2].innerHTML = `hsl(${ customClr.clrHSL })`; //~
	}

	// update text vals + colors
	renderColorVals = _ => {
		// update picker swatch
		colorSwatch.style.backgroundColor = customClr.clrHex;
		colorSwatch.value = customClr.clrHex;

		// update picker vals
		updateSwatchColors(pickerSwatchVals);

		pickerSwatchVals[0].style.color = colorSwatch.value;
		pickerSwatchVals[1].style.color = colorSwatch.value;
		pickerSwatchVals[2].style.color = colorSwatch.value;

		// complementary + analogous
		complementary.style.backgroundColor = customClr.getComplementary();
		analogous1.style.backgroundColor = customClr.getAnalogous()[0]; //~
		analogous2.style.backgroundColor = customClr.getAnalogous()[1];
		
		// ~update complementary swatch colors ~~update vals
		comSwatchVals[0].innerHTML = `rgb(${ customClr.clrRGB.toString() })`;
		comSwatchVals[1].innerHTML = colorSwatch.value;
		comSwatchVals[2].innerHTML = `hsl(${ customClr.clrHSL })`; //~ 

		an1SwatchVals[0].innerHTML = `rgb(${ customClr.clrRGB.toString() })`;
		an1SwatchVals[1].innerHTML = colorSwatch.value;
		an1SwatchVals[2].innerHTML = `hsl(${ customClr.clrHSL })`; //~ 

		an2SwatchVals[0].innerHTML = `rgb(${ customClr.clrRGB.toString() })`;
		an2SwatchVals[1].innerHTML = colorSwatch.value;
		an2SwatchVals[2].innerHTML = `hsl(${ customClr.clrHSL })`; //~ 

		// comSwatchVals[0].innerHTML = `rgb(${ customClr.getComplentary().clrRGB.toString() })`;
		// comSwatchVals[1].innerHTML = customClr.getComplentary();
		// comSwatchVals[2].innerHTML = `hsl(${ customClr.clrHSL })`; //~

		// ~update complemntary vals
		// rgbVal.innerHTML = `rgb(${ customClr.clrRGB.toString() })`;
		// hexVal.innerHTML = colorSwatch.value;
		// hslVal.innerHTML = `hsl(${ customClr.clrHSL })`; //~

		// rgbVal.style.color = colorSwatch.value;
		// hexVal.style.color = colorSwatch.value;
		// hslVal.style.color = colorSwatch.value;
	}
	
	// update P5.js color object + ~swatches' background colors on change
	colorSwatch.addEventListener('change', _ => {
		colorSwatch.style.backgroundColor = colorSwatch.value;
		customClr = new CustomColor(color(colorSwatch.value));
		// console.log(colorSwatch.value)
		// console.log(customClr.toHex(color(349, 45, 45)))
		// console.log('new ' + customClr.getComplementaryToHex())
		// console.log('hsl', (color('hsl(' + customClr.getComplementary().toString() + ')')))//customClr.toRGB
		// console.log('rgb', customClr.toRGB(color(customClr.getComplementary())))//customClr.toRGB

		// complementary.style.backgroundColor = customClr.toHex(color(customClr.getComplementary()));// customClr.toRGB(customClr.getComplementary());
		// console.log('after', complementary.style.backgroundColor)

		renderColorVals();
	});

	// random color generation on 'r' keypress
	// rand hex from https://css-tricks.com/snippets/javascript/random-hex-color/
	document.onkeydown = function(e) {
		if (e.key == 'r' || e.key == 'R') {
			customClr = new CustomColor(color('#' + Math.floor(Math.random() * 16777215).toString(16)));
			renderColorVals();
		}
	}
	
})();