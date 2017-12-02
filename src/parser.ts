import * as P from 'parsimmon';

type tuple = [string, string|number|object];

// Convert an array of tuples [[a,b],[a,c]] to an object {a: [b,c]}
const tuplesToObj = (d: tuple[]) => d.reduce((r: any, c: tuple) => {
  // load tuple [key,val] pair
  let key = c[0], val = c[1];
  // combine old and new value to an array
  r[key] = r.hasOwnProperty(key) ? [].concat(r[key], val) : val;
  // return the object
  return r;
}, {});

// Turn escaped characters into real ones (e.g. "\\n" becomes "\n").
const interpretEscapes = (str: string) => {
  let escapes: {[key: string]: string} = {
    b: "\b",
    f: "\f",
    n: "\n",
    r: "\r",
    t: "\t"
  };
  return str.replace(/\\(u[0-9a-fA-F]{4}|[^u])/, (_, escape) => {
    let type = escape.charAt(0);
    let hex = escape.slice(1);
    if (type === "u") {
      return String.fromCharCode(parseInt(hex, 16));
    }
    if (escapes.hasOwnProperty(type)) {
      return escapes[type];
    }
    return type;
  });
}

const whitespace = P.regexp(/\s*/m);
const token = (parser: P.Parser<any>) => parser.skip(whitespace);
const word = (str: any) => P.string(str).thru(token);

const Prototxt = P.createLanguage({
  value: (r) =>
    P.alt(r.number, r.null, r.true, r.false, r.string, r.identifier)
      .thru(parser => whitespace.then(parser))
      .desc("value"),

  identifier: () =>
    token(P.regexp(/[a-zA-Z_-][a-zA-Z0-9_+-]*/)
      .desc("identifier")),
 
  lbrace: () => word("{"),
  rbrace: () => word("}"),
  colon: () => word(":"),

  null: () => word("null").result(null),
  true: () => word("true").result(true),
  false: () => word("false").result(false),

  doubleQuotedString: () => P.regexp(/"((?:\\.|.)*?)"/, 1),
  singleQuotedString: () => P.regexp(/'((?:\\.|.)*?)'/, 1),

  string: (r) =>
    token(P.alt(r.doubleQuotedString, r.singleQuotedString))
      .map(interpretEscapes)
      .desc("string"),

  number: () =>
    token(P.regexp(/-?(0|[1-9][0-9]*)([.][0-9]+)?([eE][+-]?[0-9]+)?/))
      .map(Number)
      .desc("number"),

  pair: (r) => P.seq(r.identifier.skip(r.colon), r.value),

  message: (r) =>
    P.seq(
      r.identifier,
      r.colon.times(0, 1)
        .then(r.lbrace)
        .then(r.exp)
        .skip(r.rbrace)
    ),

  exp: (r) =>
    P.alt(r.pair, r.message)
      .trim(P.optWhitespace)
      .many()
      .map(tuplesToObj)
});

export function parse(input: string) {
  return Prototxt.exp.tryParse(input);
}