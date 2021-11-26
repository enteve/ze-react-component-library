import numeral from "numeral";

numeral.register("format", "million", {
  regexps: {
    format: /(m)/,
    unformat: /(m)/,
  },
  format: function (value: number, format: string, roundingFunction: any) {
    return numeral._.numberToFormat(
      value / 1000000,
      format.substring(0, format.length - 1),
      roundingFunction
    );
  },
  unformat: function (string: string) {
    return numeral._.stringToNumber(string) * 1000000;
  },
});

numeral.register("format", "thousand", {
  regexps: {
    format: /(k)/,
    unformat: /(k)/,
  },
  format: function (value: number, format: string, roundingFunction: any) {
    return numeral._.numberToFormat(
      value / 1000,
      format.substring(0, format.length - 1),
      roundingFunction
    );
  },
  unformat: function (string: string) {
    return numeral._.stringToNumber(string) * 1000;
  },
});
