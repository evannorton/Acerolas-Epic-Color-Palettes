// Acerola's code
function hslToRgb(h, s, l) {
  h = h % 1;
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hsvToRgb(h, s, v) {
  var r, g, b;

  var i = Math.floor(h * 6);
  var f = h * 6 - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function oklab_to_linear_srgb(L, a, b) {
  let l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  let m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  let s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  let l = l_ * l_ * l_;
  let m = m_ * m_ * m_;
  let s = s_ * s_ * s_;

  return [
    (+4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    (-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    (-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s),
  ];
}

function oklch_to_oklab(L, c, h) {
  return [(L), (c * Math.cos(h)), (c * Math.sin(h))];
}

function setup() {
  createCanvas(1024, 300);
  noStroke();
}

function Lerp(min, max, t) {
  return min + (max - min) * t;
}

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function generateHSL(HUE_MODE, settings) {
  let hslColors = []

  let hueBase = settings.hueBase;
  let hueContrast = Lerp(0.33, 1.0, settings.hueContrast);

  let saturationBase = Lerp(0.01, 0.5, settings.saturationBase);
  let saturationContrast = Lerp(0.1, 1 - saturationBase, settings.saturationContrast);
  let saturationFixed = Lerp(0.1, 1.0, settings.fixed);

  let lightnessBase = Lerp(0.01, 0.5, settings.luminanceBase);
  let lightnessContrast = Lerp(0.1, 1 - lightnessBase, settings.luminanceContrast);
  let lightnessFixed = Lerp(0.3, 0.85, settings.fixed)


  let saturationConstant = settings.saturationConstant;
  let lightnessConstant = !saturationConstant;

  if (HUE_MODE == "monochromatic") {
    saturationConstant = false;
    lightnessConstant = false;
  }

  for (let i = 0; i < settings.colorCount; ++i) {
    let linearIterator = (i) / (settings.colorCount - 1);

    let hueOffset = linearIterator * hueContrast;

    if (HUE_MODE == "monochromatic") hueOffset *= 0.0;
    if (HUE_MODE == "analagous") hueOffset *= 0.25;
    if (HUE_MODE == "complementary") hueOffset *= 0.33;
    if (HUE_MODE == "triadic complementary") hueOffset *= 0.66;
    if (HUE_MODE == "tetradic complementary") hueOffset *= 0.75;

    if (HUE_MODE != "monochromatic")
      hueOffset += (Math.random() * 2 - 1) * 0.01;

    let saturation = saturationBase + linearIterator * saturationContrast;
    let lightness = lightnessBase + linearIterator * lightnessContrast;

    if (saturationConstant) saturation = saturationFixed;
    if (lightnessConstant) lightness = lightnessFixed;

    hslColors.push(hslToRgb(hueBase + hueOffset, saturation, lightness));
  }

  return hslColors;
}

function generateHSV(HUE_MODE, settings) {
  let hsvColors = []

  let hueBase = settings.hueBase;
  let hueContrast = Lerp(0.33, 1.0, settings.hueContrast);

  let saturationBase = Lerp(0.01, 0.5, settings.saturationBase);
  let saturationContrast = Lerp(0.1, 1 - saturationBase, settings.saturationContrast);
  let saturationFixed = Lerp(0.1, 1.0, settings.fixed);

  let valueBase = Lerp(0.01, 0.5, settings.luminanceBase);
  let valueContrast = Lerp(0.1, 1 - valueBase, settings.luminanceContrast);
  let valueFixed = Lerp(0.3, 1.0, settings.fixed);

  let saturationConstant = settings.saturationConstant;
  let valueConstant = !saturationConstant;

  if (HUE_MODE == "monochromatic") {
    saturationConstant = false;
    valueConstant = false;
  }

  for (let i = 0; i < settings.colorCount; ++i) {
    let linearIterator = (i) / (settings.colorCount - 1);

    let hueOffset = linearIterator * hueContrast;

    if (HUE_MODE == "monochromatic") hueOffset *= 0.0;
    if (HUE_MODE == "analagous") hueOffset *= 0.25;
    if (HUE_MODE == "complementary") hueOffset *= 0.33;
    if (HUE_MODE == "triadic complementary") hueOffset *= 0.66;
    if (HUE_MODE == "tetradic complementary") hueOffset *= 0.75;

    if (HUE_MODE != "monochromatic")
      hueOffset += (Math.random() * 2 - 1) * 0.01;

    let saturation = saturationBase + linearIterator * saturationContrast;
    let value = valueBase + linearIterator * valueContrast;

    if (saturationConstant) saturation = saturationFixed;
    if (valueConstant) value = valueFixed;

    hsvColors.push(hsvToRgb(hueBase + hueOffset, saturation, value));
  }

  return hsvColors;
}

function generateOKLCH(HUE_MODE, settings) {
  let oklchColors = []

  let hueBase = settings.hueBase * 2 * Math.PI;
  let hueContrast = Lerp(0.33, 1.0, settings.hueContrast);

  let chromaBase = Lerp(0.01, 0.1, settings.saturationBase);
  let chromaContrast = Lerp(0.075, 0.125 - chromaBase, settings.saturationContrast);
  let chromaFixed = Lerp(0.01, 0.125, settings.fixed);

  let lightnessBase = Lerp(0.3, 0.6, settings.luminanceBase);
  let lightnessContrast = Lerp(0.3, 1.0 - lightnessBase, settings.luminanceContrast);
  let lightnessFixed = Lerp(0.6, 0.9, settings.fixed)

  let chromaConstant = settings.saturationConstant;
  let lightnessConstant = !chromaConstant;

  if (HUE_MODE == "monochromatic") {
    chromaConstant = false;
    lightnessConstant = false;
  }

  for (let i = 0; i < settings.colorCount; ++i) {
    let linearIterator = (i) / (settings.colorCount - 1);

    let hueOffset = linearIterator * hueContrast * 2 * Math.PI + (Math.PI / 4);

    if (HUE_MODE == "monochromatic") hueOffset *= 0.0;
    if (HUE_MODE == "analagous") hueOffset *= 0.25;
    if (HUE_MODE == "complementary") hueOffset *= 0.33;
    if (HUE_MODE == "triadic complementary") hueOffset *= 0.66;
    if (HUE_MODE == "tetradic complementary") hueOffset *= 0.75;

    if (HUE_MODE != "monochromatic")
      hueOffset += (Math.random() * 2 - 1) * 0.01;

    let chroma = chromaBase + linearIterator * chromaContrast;
    let lightness = lightnessBase + linearIterator * lightnessContrast;

    if (chromaConstant) chroma = chromaFixed;
    if (lightnessConstant) lightness = lightnessFixed;

    let lab = oklch_to_oklab(lightness, chroma, hueBase + hueOffset);
    let rgb = oklab_to_linear_srgb(lab[0], lab[1], lab[2]);

    rgb[0] = Math.round(Math.max(0.0, Math.min(rgb[0], 1.0)) * 255);
    rgb[1] = Math.round(Math.max(0.0, Math.min(rgb[1], 1.0)) * 255);
    rgb[2] = Math.round(Math.max(0.0, Math.min(rgb[2], 1.0)) * 255);

    oklchColors.push(rgb);
  }

  return oklchColors;
}

function PaletteSettings(COLOR_COUNT) {
  return {
    hueBase: Math.random(),
    hueContrast: Math.random(),
    saturationBase: Math.random(),
    saturationContrast: Math.random(),
    luminanceBase: Math.random(),
    luminanceContrast: Math.random(),
    fixed: Math.random(),
    saturationConstant: true,
    colorCount: COLOR_COUNT,
  }
}

function generatePalettes(HUE_MODE, COLOR_COUNT) {
  let paletteSettings = PaletteSettings(COLOR_COUNT);

  let hsl = generateHSL(HUE_MODE, paletteSettings);
  let hsv = generateHSV(HUE_MODE, paletteSettings);
  let lch = generateOKLCH(HUE_MODE, paletteSettings);

  return [hsl, hsv, lch];
}