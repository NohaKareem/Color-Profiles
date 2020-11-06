(_ => {
	let customClr, colorSwatch = document.querySelector('.colorSwatch');
	let complementary = document.querySelector('.complementary');
	let analogous1 = document.querySelector('.analogous1');
	let analogous2 = document.querySelector('.analogous2'); 
	let pickerSwatchVals = [document.querySelector('.rgbVal'), document.querySelector('.hexVal'), document.querySelector('.hslVal')]; 
	let comSwatchVals = [document.querySelector('.comRgbVal'), document.querySelector('.comHexVal'), document.querySelector('.comHslVal')]; 
	let an1SwatchVals = [document.querySelector('.an1RgbVal'), document.querySelector('.an1HexVal'), document.querySelector('.an1HslVal')]; 
	let an2SwatchVals = [document.querySelector('.an2RgbVal'), document.querySelector('.an2HexVal'), document.querySelector('.an2HslVal')]; 

	setup = _ => {
		createCanvas(windowWidth, windowHeight);
		readCurrColor(); //~setcolor
		renderColorVals();
		noLoop();
	}
	
	// generic color class (akin to a static class), to convet color values given string/numeric input
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

		// helper method to convert hsl val array to p5.js color string
		getHSLStr(hslArr) {
			return `hsl(${ hslArr[0] }, ${ hslArr[1] }%,${ hslArr[2] }%)`;
		}

		// compute complementary/analogous colors
		getComplementary(clr) { 
			return this.getHSLStr([(clr[0] + 180) % 360, clr.slice(1)].flat()); 
		}

		getAnalogous(clr, angle) {
			return this.getHSLStr([(clr[0] + angle) % 360, clr.slice(1)].flat());
		}
	}

	// CustomColor class, to instantiate color values 
	class CustomColor extends Color { 
		constructor(clr) {
			super();
			// this.clr = clr; //~
			this.clrRGB_ = this.toRGB(clr);
			this.clrHex_ = this.toHex(clr);
			console.log('input hex', clr)
			console.log('saved hex', this.clrHex_)
			this.clrHSL_ = this.toHSL(clr);
		}

		// return complemntary color hex value
		getComplementaryHex() {
			// console.log('orginal ->', this.clrHSL_)
			// console.log('complementray->', this.getComplementary(this.clrHSL_))
			return this.toHex(color(this.getComplementary(this.clrHSL_))); 
		}

		getAnalogousHex() {
			// console.log('original rgb ', this.clrRGB_.toString())
			// console.log('original ', this.clrHSL_.toString())
			// console.log('color 1', this.toHex(color(this.getAnalogous(this.clrHSL_, -30))))
			// console.log('color 2', this.toHex(color(this.getAnalogous(this.clrHSL_, -60))))
			return [this.toHex(color(this.getAnalogous(this.clrHSL_, -30))),
				this.toHex(color(this.getAnalogous(this.clrHSL_, -60)))];
		}

		// getter and setters
		get clrRGB() { return this.clrRGB_; }
		get clrHex() { return this.clrHex_; }
		get clrHSL() { return this.clrHSL_; }

		set clrRGB(rgb) { this.clrRGB_ = rgb; }
		set clrHex(hex) { this.clrHex_ = hex; }
		set clrHSL(hsl) { this.clrHSL_ = hsl; }
	}

	readCurrColor = _ => {
		customClr = new CustomColor(color(colorSwatch.value));
		// console.log('swatch', colorSwatch.value) //~
		// console.log('rgb swatch ', customClr.clrRGB_)
		// console.log('hex swatch ', customClr.clrHex_)
	}

	updateSwatchColors = (swatchVals, clr) => {
		swatchVals[0].innerHTML = `rgb(${ clr.clrRGB.toString() })`;
		swatchVals[1].innerHTML = clr.clrHex_;
		swatchVals[2].innerHTML = `hsl(${ clr.clrHSL })`; 

		// update color		
		// swatchVals.forEach(val => { val.style.color = colorSwatch.value; });
	}

	// update text vals + colors
	renderColorVals = _ => {
		// update picker swatch
		colorSwatch.style.backgroundColor = customClr.clrHex;
		colorSwatch.value = customClr.clrHex;

		// update picker vals
		updateSwatchColors(pickerSwatchVals, customClr);

		// complementary
		let complementaryClr = customClr.getComplementaryHex();
		complementary.style.backgroundColor = complementaryClr;

		// analogous
		let analogousClrs = customClr.getAnalogousHex();
		analogous1.style.backgroundColor = analogousClrs[0]; 
		analogous2.style.backgroundColor = analogousClrs[1];
		
		// swatch text vals
		updateSwatchColors(comSwatchVals, new CustomColor(color(complementaryClr)));
		updateSwatchColors(an1SwatchVals, new CustomColor(color(analogousClrs[0])));
		updateSwatchColors(an2SwatchVals, new CustomColor(color(analogousClrs[1])));
	}
	
	// update P5.js color object + ~swatches' background colors on change
	colorSwatch.addEventListener('change', _ => {
		colorSwatch.style.backgroundColor = colorSwatch.value;
		readCurrColor();
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