class CssColors {
  /**
   * Returns the name of any CSS-defined colors matching colorValue.
   * @param {string} colorValue - the value of the color to search for. It can be the color name or a hex code (starting with #).
   * @returns {string} The name of the color matching colorValue, or empty string if there is no match.
   */
  static findName(colorValue) {
    let value = colorValue.toLowerCase();
    const index = cssColors.findIndex(color => {
      return color.colorString === value || color.hex.toLowerCase() === value;
    });
    if (index !== -1) return cssColors[index].name;
    else return '';
  }

  /**
   * Returns the color object of any CSS-defined colors matching colorValue.
   * @param {string} colorValue - the value of the color to search for. It can be the color name or a hex code (starting with #).
   * @returns The color object matching colorValue, or null if there is no match.
   */
  static findColor(colorValue) {
    let value = colorValue.toLowerCase();
    const index = cssColors.findIndex(color => {
      return color.colorString === value || color.hex.toLowerCase() === value;
    });
    if (index !== -1) return cssColors[index];
    else return null;
  }
}

/**
 * An array of all CSS-defined colors.  \
 * Source: I did a regex replace on the html source of https://www.quackit.com/css/css_color_codes.cfm
 */
export const cssColors = [
  {
    category: 'Reds',
    name: 'IndianRed',
    colorString: 'indianred',
    textColor: 'white',
    hex: '#CD5C5C',
    rgb: { r: 205, g: 92, b: 92 }
  },
  {
    category: 'Reds',
    name: 'LightCoral',
    colorString: 'lightcoral',
    textColor: 'black',
    hex: '#F08080',
    rgb: { r: 240, g: 128, b: 128 }
  },
  {
    category: 'Reds',
    name: 'Salmon',
    colorString: 'salmon',
    textColor: 'black',
    hex: '#FA8072',
    rgb: { r: 250, g: 128, b: 114 }
  },
  {
    category: 'Reds',
    name: 'DarkSalmon',
    colorString: 'darksalmon',
    textColor: 'black',
    hex: '#E9967A',
    rgb: { r: 233, g: 150, b: 122 }
  },
  {
    category: 'Reds',
    name: 'LightSalmon',
    colorString: 'lightsalmon',
    textColor: 'black',
    hex: '#FFA07A',
    rgb: { r: 255, g: 160, b: 122 }
  },
  {
    category: 'Reds',
    name: 'Crimson',
    colorString: 'crimson',
    textColor: 'white',
    hex: '#DC143C',
    rgb: { r: 220, g: 20, b: 60 }
  },
  {
    category: 'Reds',
    name: 'Red',
    colorString: 'red',
    textColor: 'white',
    hex: '#FF0000',
    rgb: { r: 255, g: 0, b: 0 }
  },
  {
    category: 'Reds',
    name: 'FireBrick',
    colorString: 'firebrick',
    textColor: 'white',
    hex: '#B22222',
    rgb: { r: 178, g: 34, b: 34 }
  },
  {
    category: 'Reds',
    name: 'DarkRed',
    colorString: 'darkred',
    textColor: 'white',
    hex: '#8B0000',
    rgb: { r: 139, g: 0, b: 0 }
  },
  {
    category: 'Pinks',
    name: 'Pink',
    colorString: 'pink',
    textColor: 'black',
    hex: '#FFC0CB',
    rgb: { r: 255, g: 192, b: 203 }
  },
  {
    category: 'Pinks',
    name: 'LightPink',
    colorString: 'lightpink',
    textColor: 'black',
    hex: '#FFB6C1',
    rgb: { r: 255, g: 182, b: 193 }
  },
  {
    category: 'Pinks',
    name: 'HotPink',
    colorString: 'hotpink',
    textColor: 'white',
    hex: '#FF69B4',
    rgb: { r: 255, g: 105, b: 180 }
  },
  {
    category: 'Pinks',
    name: 'DeepPink',
    colorString: 'deeppink',
    textColor: 'white',
    hex: '#FF1493',
    rgb: { r: 255, g: 20, b: 147 }
  },
  {
    category: 'Pinks',
    name: 'MediumVioletRed',
    colorString: 'mediumvioletred',
    textColor: 'white',
    hex: '#C71585',
    rgb: { r: 199, g: 21, b: 133 }
  },
  {
    category: 'Pinks',
    name: 'PaleVioletRed',
    colorString: 'palevioletred',
    textColor: 'white',
    hex: '#DB7093',
    rgb: { r: 219, g: 112, b: 147 }
  },
  {
    category: 'Oranges',
    name: 'Coral',
    colorString: 'coral',
    textColor: 'white',
    hex: '#FF7F50',
    rgb: { r: 255, g: 127, b: 80 }
  },
  {
    category: 'Oranges',
    name: 'Tomato',
    colorString: 'tomato',
    textColor: 'white',
    hex: '#FF6347',
    rgb: { r: 255, g: 99, b: 71 }
  },
  {
    category: 'Oranges',
    name: 'OrangeRed',
    colorString: 'orangered',
    textColor: 'white',
    hex: '#FF4500',
    rgb: { r: 255, g: 69, b: 0 }
  },
  {
    category: 'Oranges',
    name: 'DarkOrange',
    colorString: 'darkorange',
    textColor: 'white',
    hex: '#FF8C00',
    rgb: { r: 255, g: 140, b: 0 }
  },
  {
    category: 'Oranges',
    name: 'Orange',
    colorString: 'orange',
    textColor: 'white',
    hex: '#FFA500',
    rgb: { r: 255, g: 165, b: 0 }
  },
  {
    category: 'Yellows',
    name: 'Gold',
    colorString: 'gold',
    textColor: 'black',
    hex: '#FFD700',
    rgb: { r: 255, g: 215, b: 0 }
  },
  {
    category: 'Yellows',
    name: 'Yellow',
    colorString: 'yellow',
    textColor: 'black',
    hex: '#FFFF00',
    rgb: { r: 255, g: 255, b: 0 }
  },
  {
    category: 'Yellows',
    name: 'LightYellow',
    colorString: 'lightyellow',
    textColor: 'black',
    hex: '#FFFFE0',
    rgb: { r: 255, g: 255, b: 224 }
  },
  {
    category: 'Yellows',
    name: 'LemonChiffon',
    colorString: 'lemonchiffon',
    textColor: 'black',
    hex: '#FFFACD',
    rgb: { r: 255, g: 250, b: 205 }
  },
  {
    category: 'Yellows',
    name: 'LightGoldenrodYellow',
    colorString: 'lightgoldenrodyellow',
    textColor: 'black',
    hex: '#FAFAD2',
    rgb: { r: 250, g: 250, b: 210 }
  },
  {
    category: 'Yellows',
    name: 'PapayaWhip',
    colorString: 'papayawhip',
    textColor: 'black',
    hex: '#FFEFD5',
    rgb: { r: 255, g: 239, b: 213 }
  },
  {
    category: 'Yellows',
    name: 'Moccasin',
    colorString: 'moccasin',
    textColor: 'black',
    hex: '#FFE4B5',
    rgb: { r: 255, g: 228, b: 181 }
  },
  {
    category: 'Yellows',
    name: 'PeachPuff',
    colorString: 'peachpuff',
    textColor: 'black',
    hex: '#FFDAB9',
    rgb: { r: 255, g: 218, b: 185 }
  },
  {
    category: 'Yellows',
    name: 'PaleGoldenrod',
    colorString: 'palegoldenrod',
    textColor: 'black',
    hex: '#EEE8AA',
    rgb: { r: 238, g: 232, b: 170 }
  },
  {
    category: 'Yellows',
    name: 'Khaki',
    colorString: 'khaki',
    textColor: 'black',
    hex: '#F0E68C',
    rgb: { r: 240, g: 230, b: 140 }
  },
  {
    category: 'Yellows',
    name: 'DarkKhaki',
    colorString: 'darkkhaki',
    textColor: 'white',
    hex: '#BDB76B',
    rgb: { r: 189, g: 183, b: 107 }
  },
  {
    category: 'Purples',
    name: 'Lavender',
    colorString: 'lavender',
    textColor: 'black',
    hex: '#E6E6FA',
    rgb: { r: 230, g: 230, b: 250 }
  },
  {
    category: 'Purples',
    name: 'Thistle',
    colorString: 'thistle',
    textColor: 'white',
    hex: '#D8BFD8',
    rgb: { r: 216, g: 191, b: 216 }
  },
  {
    category: 'Purples',
    name: 'Plum',
    colorString: 'plum',
    textColor: 'white',
    hex: '#DDA0DD',
    rgb: { r: 221, g: 160, b: 221 }
  },
  {
    category: 'Purples',
    name: 'Violet',
    colorString: 'violet',
    textColor: 'white',
    hex: '#EE82EE',
    rgb: { r: 238, g: 130, b: 238 }
  },
  {
    category: 'Purples',
    name: 'Orchid',
    colorString: 'orchid',
    textColor: 'white',
    hex: '#DA70D6',
    rgb: { r: 218, g: 112, b: 214 }
  },
  {
    category: 'Purples',
    name: 'Magenta',
    colorString: 'magenta',
    textColor: 'white',
    hex: '#FF00FF',
    rgb: { r: 255, g: 0, b: 255 }
  },
  {
    category: 'Purples',
    name: 'Fuchsia',
    colorString: 'fuchsia',
    textColor: 'white',
    hex: '#FF00FF',
    rgb: { r: 255, g: 0, b: 255 }
  },
  {
    category: 'Purples',
    name: 'MediumOrchid',
    colorString: 'mediumorchid',
    textColor: 'white',
    hex: '#BA55D3',
    rgb: { r: 186, g: 85, b: 211 }
  },
  {
    category: 'Purples',
    name: 'MediumPurple',
    colorString: 'mediumpurple',
    textColor: 'white',
    hex: '#9370DB',
    rgb: { r: 147, g: 112, b: 219 }
  },
  {
    category: 'Purples',
    name: 'BlueViolet',
    colorString: 'blueviolet',
    textColor: 'white',
    hex: '#8A2BE2',
    rgb: { r: 138, g: 43, b: 226 }
  },
  {
    category: 'Purples',
    name: 'DarkViolet',
    colorString: 'darkviolet',
    textColor: 'white',
    hex: '#9400D3',
    rgb: { r: 148, g: 0, b: 211 }
  },
  {
    category: 'Purples',
    name: 'DarkOrchid',
    colorString: 'darkorchid',
    textColor: 'white',
    hex: '#9932CC',
    rgb: { r: 153, g: 50, b: 204 }
  },
  {
    category: 'Purples',
    name: 'DarkMagenta',
    colorString: 'darkmagenta',
    textColor: 'white',
    hex: '#8B008B',
    rgb: { r: 139, g: 0, b: 139 }
  },
  {
    category: 'Purples',
    name: 'Purple',
    colorString: 'purple',
    textColor: 'white',
    hex: '#800080',
    rgb: { r: 128, g: 0, b: 128 }
  },
  {
    category: 'Purples',
    name: 'RebeccaPurple',
    colorString: 'rebeccapurple',
    textColor: 'white',
    hex: '#663399',
    rgb: { r: 102, g: 51, b: 153 }
  },
  {
    category: 'Purples',
    name: 'Indigo',
    colorString: 'indigo',
    textColor: 'white',
    hex: '#4B0082',
    rgb: { r: 75, g: 0, b: 130 }
  },
  {
    category: 'Purples',
    name: 'MediumSlateBlue',
    colorString: 'mediumslateblue',
    textColor: 'white',
    hex: '#7B68EE',
    rgb: { r: 123, g: 104, b: 238 }
  },
  {
    category: 'Purples',
    name: 'SlateBlue',
    colorString: 'slateblue',
    textColor: 'white',
    hex: '#6A5ACD',
    rgb: { r: 106, g: 90, b: 205 }
  },
  {
    category: 'Purples',
    name: 'DarkSlateBlue',
    colorString: 'darkslateblue',
    textColor: 'white',
    hex: '#483D8B',
    rgb: { r: 72, g: 61, b: 139 }
  },
  {
    category: 'Greens',
    name: 'GreenYellow',
    colorString: 'greenyellow',
    textColor: 'black',
    hex: '#ADFF2F',
    rgb: { r: 173, g: 255, b: 47 }
  },
  {
    category: 'Greens',
    name: 'Chartreuse',
    colorString: 'chartreuse',
    textColor: 'black',
    hex: '#7FFF00',
    rgb: { r: 127, g: 255, b: 0 }
  },
  {
    category: 'Greens',
    name: 'LawnGreen',
    colorString: 'lawngreen',
    textColor: 'black',
    hex: '#7CFC00',
    rgb: { r: 124, g: 252, b: 0 }
  },
  {
    category: 'Greens',
    name: 'Lime',
    colorString: 'lime',
    textColor: 'black',
    hex: '#00FF00',
    rgb: { r: 0, g: 255, b: 0 }
  },
  {
    category: 'Greens',
    name: 'LimeGreen',
    colorString: 'limegreen',
    textColor: 'black',
    hex: '#32CD32',
    rgb: { r: 50, g: 205, b: 50 }
  },
  {
    category: 'Greens',
    name: 'PaleGreen',
    colorString: 'palegreen',
    textColor: 'black',
    hex: '#98FB98',
    rgb: { r: 152, g: 251, b: 152 }
  },
  {
    category: 'Greens',
    name: 'LightGreen',
    colorString: 'lightgreen',
    textColor: 'black',
    hex: '#90EE90',
    rgb: { r: 144, g: 238, b: 144 }
  },
  {
    category: 'Greens',
    name: 'MediumSpringGreen',
    colorString: 'mediumspringgreen',
    textColor: 'black',
    hex: '#00FA9A',
    rgb: { r: 0, g: 250, b: 154 }
  },
  {
    category: 'Greens',
    name: 'SpringGreen',
    colorString: 'springgreen',
    textColor: 'black',
    hex: '#00FF7F',
    rgb: { r: 0, g: 255, b: 127 }
  },
  {
    category: 'Greens',
    name: 'MediumSeaGreen',
    colorString: 'mediumseagreen',
    textColor: 'white',
    hex: '#3CB371',
    rgb: { r: 60, g: 179, b: 113 }
  },
  {
    category: 'Greens',
    name: 'SeaGreen',
    colorString: 'seagreen',
    textColor: 'white',
    hex: '#2E8B57',
    rgb: { r: 46, g: 139, b: 87 }
  },
  {
    category: 'Greens',
    name: 'ForestGreen',
    colorString: 'forestgreen',
    textColor: 'white',
    hex: '#228B22',
    rgb: { r: 34, g: 139, b: 34 }
  },
  {
    category: 'Greens',
    name: 'Green',
    colorString: 'green',
    textColor: 'white',
    hex: '#008000',
    rgb: { r: 0, g: 128, b: 0 }
  },
  {
    category: 'Greens',
    name: 'DarkGreen',
    colorString: 'darkgreen',
    textColor: 'white',
    hex: '#006400',
    rgb: { r: 0, g: 100, b: 0 }
  },
  {
    category: 'Greens',
    name: 'YellowGreen',
    colorString: 'yellowgreen',
    textColor: 'white',
    hex: '#9ACD32',
    rgb: { r: 154, g: 205, b: 50 }
  },
  {
    category: 'Greens',
    name: 'OliveDrab',
    colorString: 'olivedrab',
    textColor: 'white',
    hex: '#6B8E23',
    rgb: { r: 107, g: 142, b: 35 }
  },
  {
    category: 'Greens',
    name: 'Olive',
    colorString: 'olive',
    textColor: 'white',
    hex: '#808000',
    rgb: { r: 128, g: 128, b: 0 }
  },
  {
    category: 'Greens',
    name: 'DarkOliveGreen',
    colorString: 'darkolivegreen',
    textColor: 'white',
    hex: '#556B2F',
    rgb: { r: 85, g: 107, b: 47 }
  },
  {
    category: 'Greens',
    name: 'MediumAquamarine',
    colorString: 'mediumaquamarine',
    textColor: 'black',
    hex: '#66CDAA',
    rgb: { r: 102, g: 205, b: 170 }
  },
  {
    category: 'Greens',
    name: 'DarkSeaGreen',
    colorString: 'darkseagreen',
    textColor: 'white',
    hex: '#8FBC8F',
    rgb: { r: 143, g: 188, b: 143 }
  },
  {
    category: 'Greens',
    name: 'LightSeaGreen',
    colorString: 'lightseagreen',
    textColor: 'white',
    hex: '#20B2AA',
    rgb: { r: 32, g: 178, b: 170 }
  },
  {
    category: 'Greens',
    name: 'DarkCyan',
    colorString: 'darkcyan',
    textColor: 'white',
    hex: '#008B8B',
    rgb: { r: 0, g: 139, b: 139 }
  },
  {
    category: 'Greens',
    name: 'Teal',
    colorString: 'teal',
    textColor: 'white',
    hex: '#008080',
    rgb: { r: 0, g: 128, b: 128 }
  },
  {
    category: 'Blues/Cyans',
    name: 'Cyan',
    colorString: 'cyan',
    textColor: 'black',
    hex: '#00FFFF',
    rgb: { r: 0, g: 255, b: 255 }
  },
  {
    category: 'Blues/Cyans',
    name: 'Aqua',
    colorString: 'aqua',
    textColor: 'black',
    hex: '#00FFFF',
    rgb: { r: 0, g: 255, b: 255 }
  },
  {
    category: 'Blues/Cyans',
    name: 'LightCyan',
    colorString: 'lightcyan',
    textColor: 'black',
    hex: '#E0FFFF',
    rgb: { r: 224, g: 255, b: 255 }
  },
  {
    category: 'Blues/Cyans',
    name: 'PaleTurquoise',
    colorString: 'paleturquoise',
    textColor: 'black',
    hex: '#AFEEEE',
    rgb: { r: 175, g: 238, b: 238 }
  },
  {
    category: 'Blues/Cyans',
    name: 'Aquamarine',
    colorString: 'aquamarine',
    textColor: 'black',
    hex: '#7FFFD4',
    rgb: { r: 127, g: 255, b: 212 }
  },
  {
    category: 'Blues/Cyans',
    name: 'Turquoise',
    colorString: 'turquoise',
    textColor: 'black',
    hex: '#40E0D0',
    rgb: { r: 64, g: 224, b: 208 }
  },
  {
    category: 'Blues/Cyans',
    name: 'MediumTurquoise',
    colorString: 'mediumturquoise',
    textColor: 'white',
    hex: '#48D1CC',
    rgb: { r: 72, g: 209, b: 204 }
  },
  {
    category: 'Blues/Cyans',
    name: 'DarkTurquoise',
    colorString: 'darkturquoise',
    textColor: 'white',
    hex: '#00CED1',
    rgb: { r: 0, g: 206, b: 209 }
  },
  {
    category: 'Blues/Cyans',
    name: 'CadetBlue',
    colorString: 'cadetblue',
    textColor: 'white',
    hex: '#5F9EA0',
    rgb: { r: 95, g: 158, b: 160 }
  },
  {
    category: 'Blues/Cyans',
    name: 'SteelBlue',
    colorString: 'steelblue',
    textColor: 'white',
    hex: '#4682B4',
    rgb: { r: 70, g: 130, b: 180 }
  },
  {
    category: 'Blues/Cyans',
    name: 'LightSteelBlue',
    colorString: 'lightsteelblue',
    textColor: 'black',
    hex: '#B0C4DE',
    rgb: { r: 176, g: 196, b: 222 }
  },
  {
    category: 'Blues/Cyans',
    name: 'PowderBlue',
    colorString: 'powderblue',
    textColor: 'black',
    hex: '#B0E0E6',
    rgb: { r: 176, g: 224, b: 230 }
  },
  {
    category: 'Blues/Cyans',
    name: 'LightBlue',
    colorString: 'lightblue',
    textColor: 'black',
    hex: '#ADD8E6',
    rgb: { r: 173, g: 216, b: 230 }
  },
  {
    category: 'Blues/Cyans',
    name: 'SkyBlue',
    colorString: 'skyblue',
    textColor: 'black',
    hex: '#87CEEB',
    rgb: { r: 135, g: 206, b: 235 }
  },
  {
    category: 'Blues/Cyans',
    name: 'LightSkyBlue',
    colorString: 'lightskyblue',
    textColor: 'black',
    hex: '#87CEFA',
    rgb: { r: 135, g: 206, b: 250 }
  },
  {
    category: 'Blues/Cyans',
    name: 'DeepSkyBlue',
    colorString: 'deepskyblue',
    textColor: 'white',
    hex: '#00BFFF',
    rgb: { r: 0, g: 191, b: 255 }
  },
  {
    category: 'Blues/Cyans',
    name: 'DodgerBlue',
    colorString: 'dodgerblue',
    textColor: 'white',
    hex: '#1E90FF',
    rgb: { r: 30, g: 144, b: 255 }
  },
  {
    category: 'Blues/Cyans',
    name: 'CornflowerBlue',
    colorString: 'cornflowerblue',
    textColor: 'white',
    hex: '#6495ED',
    rgb: { r: 100, g: 149, b: 237 }
  },
  {
    category: 'Blues/Cyans',
    name: 'RoyalBlue',
    colorString: 'royalblue',
    textColor: 'white',
    hex: '#4169E1',
    rgb: { r: 65, g: 105, b: 225 }
  },
  {
    category: 'Blues/Cyans',
    name: 'Blue',
    colorString: 'blue',
    textColor: 'white',
    hex: '#0000FF',
    rgb: { r: 0, g: 0, b: 255 }
  },
  {
    category: 'Blues/Cyans',
    name: 'MediumBlue',
    colorString: 'mediumblue',
    textColor: 'white',
    hex: '#0000CD',
    rgb: { r: 0, g: 0, b: 205 }
  },
  {
    category: 'Blues/Cyans',
    name: 'DarkBlue',
    colorString: 'darkblue',
    textColor: 'white',
    hex: '#00008B',
    rgb: { r: 0, g: 0, b: 139 }
  },
  {
    category: 'Blues/Cyans',
    name: 'Navy',
    colorString: 'navy',
    textColor: 'white',
    hex: '#000080',
    rgb: { r: 0, g: 0, b: 128 }
  },
  {
    category: 'Blues/Cyans',
    name: 'MidnightBlue',
    colorString: 'midnightblue',
    textColor: 'white',
    hex: '#191970',
    rgb: { r: 25, g: 25, b: 112 }
  },
  {
    category: 'Browns',
    name: 'Cornsilk',
    colorString: 'cornsilk',
    textColor: 'black',
    hex: '#FFF8DC',
    rgb: { r: 255, g: 248, b: 220 }
  },
  {
    category: 'Browns',
    name: 'BlanchedAlmond',
    colorString: 'blanchedalmond',
    textColor: 'black',
    hex: '#FFEBCD',
    rgb: { r: 255, g: 235, b: 205 }
  },
  {
    category: 'Browns',
    name: 'Bisque',
    colorString: 'bisque',
    textColor: 'black',
    hex: '#FFE4C4',
    rgb: { r: 255, g: 228, b: 196 }
  },
  {
    category: 'Browns',
    name: 'NavajoWhite',
    colorString: 'navajowhite',
    textColor: 'black',
    hex: '#FFDEAD',
    rgb: { r: 255, g: 222, b: 173 }
  },
  {
    category: 'Browns',
    name: 'Wheat',
    colorString: 'wheat',
    textColor: 'black',
    hex: '#F5DEB3',
    rgb: { r: 245, g: 222, b: 179 }
  },
  {
    category: 'Browns',
    name: 'BurlyWood',
    colorString: 'burlywood',
    textColor: 'white',
    hex: '#DEB887',
    rgb: { r: 222, g: 184, b: 135 }
  },
  {
    category: 'Browns',
    name: 'Tan',
    colorString: 'tan',
    textColor: 'white',
    hex: '#D2B48C',
    rgb: { r: 210, g: 180, b: 140 }
  },
  {
    category: 'Browns',
    name: 'RosyBrown',
    colorString: 'rosybrown',
    textColor: 'white',
    hex: '#BC8F8F',
    rgb: { r: 188, g: 143, b: 143 }
  },
  {
    category: 'Browns',
    name: 'SandyBrown',
    colorString: 'sandybrown',
    textColor: 'white',
    hex: '#F4A460',
    rgb: { r: 244, g: 164, b: 96 }
  },
  {
    category: 'Browns',
    name: 'Goldenrod',
    colorString: 'goldenrod',
    textColor: 'white',
    hex: '#DAA520',
    rgb: { r: 218, g: 165, b: 32 }
  },
  {
    category: 'Browns',
    name: 'DarkGoldenrod',
    colorString: 'darkgoldenrod',
    textColor: 'white',
    hex: '#B8860B',
    rgb: { r: 184, g: 134, b: 11 }
  },
  {
    category: 'Browns',
    name: 'Peru',
    colorString: 'peru',
    textColor: 'white',
    hex: '#CD853F',
    rgb: { r: 205, g: 133, b: 63 }
  },
  {
    category: 'Browns',
    name: 'Chocolate',
    colorString: 'chocolate',
    textColor: 'white',
    hex: '#D2691E',
    rgb: { r: 210, g: 105, b: 30 }
  },
  {
    category: 'Browns',
    name: 'SaddleBrown',
    colorString: 'saddlebrown',
    textColor: 'white',
    hex: '#8B4513',
    rgb: { r: 139, g: 69, b: 19 }
  },
  {
    category: 'Browns',
    name: 'Sienna',
    colorString: 'sienna',
    textColor: 'white',
    hex: '#A0522D',
    rgb: { r: 160, g: 82, b: 45 }
  },
  {
    category: 'Browns',
    name: 'Brown',
    colorString: 'brown',
    textColor: 'white',
    hex: '#A52A2A',
    rgb: { r: 165, g: 42, b: 42 }
  },
  {
    category: 'Browns',
    name: 'Maroon',
    colorString: 'maroon',
    textColor: 'white',
    hex: '#800000',
    rgb: { r: 128, g: 0, b: 0 }
  },
  {
    category: 'Whites',
    name: 'White',
    colorString: 'white',
    textColor: 'black',
    hex: '#FFFFFF',
    rgb: { r: 255, g: 255, b: 255 }
  },
  {
    category: 'Whites',
    name: 'Snow',
    colorString: 'snow',
    textColor: 'black',
    hex: '#FFFAFA',
    rgb: { r: 255, g: 250, b: 250 }
  },
  {
    category: 'Whites',
    name: 'Honeydew',
    colorString: 'honeydew',
    textColor: 'black',
    hex: '#F0FFF0',
    rgb: { r: 240, g: 255, b: 240 }
  },
  {
    category: 'Whites',
    name: 'MintCream',
    colorString: 'mintcream',
    textColor: 'black',
    hex: '#F5FFFA',
    rgb: { r: 245, g: 255, b: 250 }
  },
  {
    category: 'Whites',
    name: 'Azure',
    colorString: 'azure',
    textColor: 'black',
    hex: '#F0FFFF',
    rgb: { r: 240, g: 255, b: 255 }
  },
  {
    category: 'Whites',
    name: 'AliceBlue',
    colorString: 'aliceblue',
    textColor: 'black',
    hex: '#F0F8FF',
    rgb: { r: 240, g: 248, b: 255 }
  },
  {
    category: 'Whites',
    name: 'GhostWhite',
    colorString: 'ghostwhite',
    textColor: 'black',
    hex: '#F8F8FF',
    rgb: { r: 248, g: 248, b: 255 }
  },
  {
    category: 'Whites',
    name: 'WhiteSmoke',
    colorString: 'whitesmoke',
    textColor: 'black',
    hex: '#F5F5F5',
    rgb: { r: 245, g: 245, b: 245 }
  },
  {
    category: 'Whites',
    name: 'Seashell',
    colorString: 'seashell',
    textColor: 'black',
    hex: '#FFF5EE',
    rgb: { r: 255, g: 245, b: 238 }
  },
  {
    category: 'Whites',
    name: 'Beige',
    colorString: 'beige',
    textColor: 'black',
    hex: '#F5F5DC',
    rgb: { r: 245, g: 245, b: 220 }
  },
  {
    category: 'Whites',
    name: 'OldLace',
    colorString: 'oldlace',
    textColor: 'black',
    hex: '#FDF5E6',
    rgb: { r: 253, g: 245, b: 230 }
  },
  {
    category: 'Whites',
    name: 'FloralWhite',
    colorString: 'floralwhite',
    textColor: 'black',
    hex: '#FFFAF0',
    rgb: { r: 255, g: 250, b: 240 }
  },
  {
    category: 'Whites',
    name: 'Ivory',
    colorString: 'ivory',
    textColor: 'black',
    hex: '#FFFFF0',
    rgb: { r: 255, g: 255, b: 240 }
  },
  {
    category: 'Whites',
    name: 'AntiqueWhite',
    colorString: 'antiquewhite',
    textColor: 'black',
    hex: '#FAEBD7',
    rgb: { r: 250, g: 235, b: 215 }
  },
  {
    category: 'Whites',
    name: 'Linen',
    colorString: 'linen',
    textColor: 'black',
    hex: '#FAF0E6',
    rgb: { r: 250, g: 240, b: 230 }
  },
  {
    category: 'Whites',
    name: 'LavenderBlush',
    colorString: 'lavenderblush',
    textColor: 'black',
    hex: '#FFF0F5',
    rgb: { r: 255, g: 240, b: 245 }
  },
  {
    category: 'Whites',
    name: 'MistyRose',
    colorString: 'mistyrose',
    textColor: 'black',
    hex: '#FFE4E1',
    rgb: { r: 255, g: 228, b: 225 }
  },
  {
    category: 'Greys',
    name: 'Gainsboro',
    colorString: 'gainsboro',
    textColor: 'black',
    hex: '#DCDCDC',
    rgb: { r: 220, g: 220, b: 220 }
  },
  {
    category: 'Greys',
    name: 'LightGrey',
    colorString: 'lightgrey',
    textColor: 'black',
    hex: '#D3D3D3',
    rgb: { r: 211, g: 211, b: 211 }
  },
  {
    category: 'Greys',
    name: 'LightGray',
    colorString: 'lightgrey',
    textColor: 'black',
    hex: '#D3D3D3',
    rgb: { r: 211, g: 211, b: 211 }
  },
  {
    category: 'Greys',
    name: 'Silver',
    colorString: 'silver',
    textColor: 'black',
    hex: '#C0C0C0',
    rgb: { r: 192, g: 192, b: 192 }
  },
  {
    category: 'Greys',
    name: 'DarkGrey',
    colorString: 'darkgrey',
    textColor: 'black',
    hex: '#A9A9A9',
    rgb: { r: 169, g: 169, b: 169 }
  },
  {
    category: 'Greys',
    name: 'DarkGray',
    colorString: 'darkgray',
    textColor: 'black',
    hex: '#A9A9A9',
    rgb: { r: 169, g: 169, b: 169 }
  },
  {
    category: 'Greys',
    name: 'Grey',
    colorString: 'grey',
    textColor: 'black',
    hex: '#808080',
    rgb: { r: 128, g: 128, b: 128 }
  },
  {
    category: 'Greys',
    name: 'Gray',
    colorString: 'gray',
    textColor: 'black',
    hex: '#808080',
    rgb: { r: 128, g: 128, b: 128 }
  },
  {
    category: 'Greys',
    name: 'DimGrey',
    colorString: 'dimgrey',
    textColor: 'white',
    hex: '#696969',
    rgb: { r: 105, g: 105, b: 105 }
  },
  {
    category: 'Greys',
    name: 'DimGray',
    colorString: 'dimgray',
    textColor: 'white',
    hex: '#696969',
    rgb: { r: 105, g: 105, b: 105 }
  },
  {
    category: 'Greys',
    name: 'LightSlateGrey',
    colorString: 'lightslategrey',
    textColor: 'white',
    hex: '#778899',
    rgb: { r: 119, g: 136, b: 153 }
  },
  {
    category: 'Greys',
    name: 'LightSlateGray',
    colorString: 'lightslategray',
    textColor: 'white',
    hex: '#778899',
    rgb: { r: 119, g: 136, b: 153 }
  },
  {
    category: 'Greys',
    name: 'SlateGrey',
    colorString: 'slategrey',
    textColor: 'white',
    hex: '#708090',
    rgb: { r: 112, g: 128, b: 144 }
  },
  {
    category: 'Greys',
    name: 'SlateGray',
    colorString: 'slategray',
    textColor: 'white',
    hex: '#708090',
    rgb: { r: 112, g: 128, b: 144 }
  },
  {
    category: 'Greys',
    name: 'DarkSlateGrey',
    colorString: 'darkslategrey',
    textColor: 'white',
    hex: '#2F4F4F',
    rgb: { r: 47, g: 79, b: 79 }
  },
  {
    category: 'Greys',
    name: 'DarkSlateGray',
    colorString: 'darkslategray',
    textColor: 'white',
    hex: '#2F4F4F',
    rgb: { r: 47, g: 79, b: 79 }
  },
  {
    category: 'Greys',
    name: 'Black',
    colorString: 'black',
    textColor: 'white',
    hex: '#000000',
    rgb: { r: 0, g: 0, b: 0 }
  }
];

export default CssColors;
