(_ => {
	
	// helper method to get document element, for simpler code
	getElem = selector => {
		return document.querySelector(selector);
	}

	const colorSwatch = getElem('.colorSwatch');
	const complementary = getElem('.complementary');
	const analogous1 = getElem('.analogous1');
	const analogous2 = getElem('.analogous2'); 
	const pickerSwatchVals = [getElem('.colorText h3'), getElem('.rgbVal'), getElem('.hexVal'), getElem('.hslVal')]; 
	const comSwatchVals = [getElem('.complementary h3'), getElem('.comRgbVal'), getElem('.comHexVal'), getElem('.comHslVal')]; 
	const an1SwatchVals = [getElem('.analogous1 h3'), getElem('.an1RgbVal'), getElem('.an1HexVal'), getElem('.an1HslVal')]; 
	const an2SwatchVals = [getElem('.analogous2 h3'), getElem('.an2RgbVal'), getElem('.an2HexVal'), getElem('.an2HslVal')]; 
	let colorUndo = [], colorRedo = [], customClr;

	setup = _ => {
		createCanvas(windowWidth, 0);
		readCurrColor();
		renderColorVals();
		noLoop();
	}
	
	// generic color class (akin to a static class), to convet color values given string/numeric input
	class Color {
		// get different color modes for a given color value, clr
		toRGB(clr) { return this.strToArr(clr.toString('rgb')); }
		toHex(clr) { return clr.toString('#rrggbb'); }
		toHSL(clr) { return this.strToArr(clr.toString('hsl')); }

		// helper method to clean color text and parse as array of integers
		strToArr(clrStr) {
			return clrStr.replace(')','').replace('rgb(','').replace('hsl(', '')
				.split(',')
				.map(ch => { return parseInt(ch) })
		}

		// helper method to convert hsl val array, hslArr, to p5.js color string
		getHSLStr(hslArr) { return `hsl(${ hslArr[0] }, ${ hslArr[1] }%,${ hslArr[2] }%)`; }

		// compute complementary color for a given color, hslClr
		getComplementary(hslClr) { return this.getHSLStr([(hslClr[0] + 180) % 360, hslClr.slice(1)].flat()); }

		// compute analogous color for a given color, hslClr, with given angle
		getAnalogous(hslClr, angle) { return this.getHSLStr([(hslClr[0] + angle) % 360, hslClr.slice(1)].flat()); }

		// returns true if color, hslClr, is dark
		isDark(hslClr) { return hslClr[2] <= 50; }
	}

	// CustomColor class, to instantiate color values 
	class CustomColor extends Color {
		constructor(clr) {
			super();
			this.clrRGB_ = this.toRGB(clr);
			this.clrHex_ = this.toHex(clr);
			this.clrHSL_ = this.toHSL(clr);
		}

		// return complemntary color hex value
		getComplementaryHex() { return this.toHex(color(this.getComplementary(this.clrHSL_))); }

		// return two analgous color hex values
		getAnalogousHex() {
			return [this.toHex(color(this.getAnalogous(this.clrHSL_, -30))),
				this.toHex(color(this.getAnalogous(this.clrHSL_, -60)))];
		}

		// returns true if color is dark (need to set light font color)
		isLightFont() { return this.isDark(this.clrHSL_); }

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
		colorUndo.push(customClr);
	}

	updateSwatchColors = (swatchVals, clr) => {
		swatchVals[1].innerHTML = `rgb(${ clr.clrRGB.toString() })`;
		swatchVals[2].innerHTML = clr.clrHex_;
		swatchVals[3].innerHTML = `hsl(${ clr.clrHSL })`; 

		// update color		
		if (swatchVals != pickerSwatchVals) swatchVals.forEach(val => { val.style.color = clr.isLightFont() ? 'white' : 'black'; });
	}

	// update text vals + colors
	renderColorVals = _ => {
		// update picker swatch
		colorSwatch.style.backgroundColor = customClr.clrHex;
		colorSwatch.value = customClr.clrHex;

		// complementary
		let complementaryClr = customClr.getComplementaryHex();
		complementary.style.backgroundColor = complementaryClr;

		// analogous
		let analogousClrs = customClr.getAnalogousHex();
		analogous1.style.backgroundColor = analogousClrs[0]; 
		analogous2.style.backgroundColor = analogousClrs[1];
		
		// swatch picker + text vals
		updateSwatchColors(pickerSwatchVals, customClr);
		updateSwatchColors(comSwatchVals, new CustomColor(color(complementaryClr)));
		updateSwatchColors(an1SwatchVals, new CustomColor(color(analogousClrs[0])));
		updateSwatchColors(an2SwatchVals, new CustomColor(color(analogousClrs[1])));
	}
	
	// update P5.js color object + swatches' background colors on change
	colorSwatch.addEventListener('change', _ => {
		colorSwatch.style.backgroundColor = colorSwatch.value;
		readCurrColor();
		renderColorVals();
	});

	keyPressed = _ => {
		switch(keyCode) {
			// redo
			case RIGHT_ARROW:
				if (colorRedo.length > 0) {
					let tempColor = colorRedo.pop();
					customClr = tempColor;
					colorUndo.push(tempColor);
				}
				renderColorVals(); 
				break;
			
			// undo
			case LEFT_ARROW: 
				if (colorUndo.length > 1) {
					let tempColor = colorUndo.pop();
					customClr = colorUndo.pop();
					colorRedo.push(tempColor);
				}
				renderColorVals();
				break;
			
			// space/r to generate rand color
			// rand hex from https://css-tricks.com/snippets/javascript/random-hex-color/
			case 32: 
				customClr = new CustomColor(color('#' + Math.floor(Math.random() * 16777215).toString(16)));
				colorUndo.push(customClr);
				renderColorVals();
				break;

			default:
				if (key == 'r' || key == 'R') {
					customClr = new CustomColor(color('#' + Math.floor(Math.random() * 16777215).toString(16)));
					colorUndo.push(customClr);
					renderColorVals();
				} 
				break;
		}

	}
})();