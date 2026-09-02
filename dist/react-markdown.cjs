/*! @itslil/react-markdown 10.1.0 | LilScript reimplementation of react-markdown | MIT */

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// react-markdown.esm.js
var react_markdown_esm_exports = {};
__export(react_markdown_esm_exports, {
  MarkdownAsync: () => $c,
  MarkdownHooks: () => ad,
  default: () => _c,
  defaultUrlTransform: () => Pb
});
module.exports = __toCommonJS(react_markdown_esm_exports);
var import_jsx_runtime = require("react/jsx-runtime");
var import_react = require("react");
var development = false;
var hf = "";
var jf = "/";
var kf = "-";
var lf = "Expected usable value, not `";
var mf = " ";
var nf = ".";
var of = "`";
var pf = 122;
function nc(a) {
  return a == null ? false : "object" != typeof a && "function" != typeof a ? false : !!Error.prototype.isPrototypeOf(a);
}
function _d(a) {
  if (development) {
    if (a) {
      if (nc(a)) throw a;
      a += "";
      var b = false;
    } else a = "Unreachable", b = true;
    a = new Error(a);
    a.name = "Assertion", a.code = "ERR_ASSERTION", a.actual = false, a.expected = true, a.generated = b, a.operator = "ok";
    throw a;
  }
}
function $d(a) {
  return "string" == typeof a ? true : oc(a);
}
function oc(a) {
  return !a ? false : "object" != typeof a ? false : "byteLength" in a && "byteOffset" in a;
}
function Oa(a) {
  throw new Error(a);
}
function Fa(a) {
  throw new TypeError(a);
}
function pc(a) {
  if (a) throw a;
}
function rb(a) {
  if ("object" != typeof a || a == null) return false;
  var b = Object.getPrototypeOf(a), q2 = b == null || b === Object.prototype;
  q2 = q2 || Object.getPrototypeOf(b) == null;
  return !q2 ? false : Symbol.toStringTag in a ? false : Symbol.iterator in a ? false : true;
}
var $a = /* @__PURE__ */ (function() {
  function a(a2) {
    if (!a2) return false;
    if ("[object Object]" != cd.call(a2) + "") return false;
    var q2 = !!La.call(a2, "constructor"), b2 = a2.constructor, c2 = b2 && b2.prototype && La.call(b2.prototype, "isPrototypeOf");
    if (b2 && !q2 && !c2) return false;
    c2 = hf, q2 = false;
    for (b2 in a2) c2 = b2, q2 = true;
    return !q2 ? true : !!La.call(a2, c2);
  }
  function b(a2, b2, q2) {
    if ("__proto__" == b2) {
      Object.defineProperty(a2, "__proto__", { enumerable: true, configurable: true, writable: true, value: q2 });
      return;
    }
    a2[b2] = q2;
  }
  function c(a2, b2) {
    return "__proto__" == b2 ? !La.call(a2, b2) ? void 0 : Object.getOwnPropertyDescriptor(a2, b2).value : a2[b2];
  }
  return function(q2, e2) {
    (q2 == null || "object" != typeof q2 && "function" != typeof q2) && (q2 = {});
    if (e2 == null) return q2;
    for (var j2 in e2) {
      var r2 = c(q2, j2), d2 = c(e2, j2);
      q2 === d2 || (d2 && (a(d2) || Array.isArray(d2)) ? (Array.isArray(d2) ? r2 && Array.isArray(r2) || (r2 = []) : r2 && a(r2) || (r2 = {}), b(q2, j2, $a(r2, d2))) : "undefined" != typeof d2 && b(q2, j2, d2));
    }
    return q2;
  };
})();
function ae(a, b) {
  var c = false;
  let q2 = function() {
    if (!c) c = true, b.apply(void 0, arguments);
  }, e2 = function(a2) {
    q2(ib, a2);
  };
  return function() {
    var d2 = ua.call(arguments), r2 = a.length > d2.length;
    r2 && d2.push(q2);
    var b2;
    try {
      b2 = a.apply(this, d2);
    } catch (a2) {
      if (r2 && c) throw a2;
      q2(a2);
      return;
    }
    !r2 && (b2 && b2.then && "function" == typeof b2.then ? b2.then(e2, q2) : nc(b2) ? q2(b2) : e2(b2));
  };
}
function qc(a) {
  return a != null && "object" == typeof a && "href" in a && a.href && "protocol" in a && a.protocol && a.auth === void 0;
}
function be() {
  var a = globalThis.process;
  return a && "function" == typeof a.cwd ? a.cwd() + "" : jf;
}
function rc(a, b) {
  var c, e2, r2, d2, q2 = a.length;
  if (0 == b.length || b.length > a.length) {
    for (b = -1, c = false; ; ) {
      if (q2 <= 0) {
        q2 = 0;
        break;
      }
      q2--;
      if (a.charAt(q2) == jf) {
        if (c) {
          q2++;
          break;
        }
      } else b < 0 && (b = q2 + 1, c = true);
    }
    return b < 0 ? hf : a.slice(q2, b);
  }
  if (b == a) return hf;
  for (c = -1, r2 = false, d2 = -1, e2 = b.length - 1; ; ) {
    if (q2 <= 0) {
      b = 0;
      break;
    }
    q2--;
    if (a.charAt(q2) == jf) {
      if (r2) {
        b = q2 + 1;
        break;
      }
    } else d2 < 0 && (r2 = true, d2 = q2 + 1), e2 > -1 && (a.charAt(q2) == b.charAt(e2) ? (e2 = e2 - 1 | 0, e2 < 0 && (c = q2)) : (c = d2, e2 = -1));
  }
  b == c ? c = d2 : c < 0 && (c = a.length);
  return a.slice(b, c);
}
function ce(a) {
  if (0 == a.length) return nf;
  for (var b = a.length, q2 = false; ; ) {
    if (b <= 1) {
      b = -1;
      break;
    }
    b--;
    if (a.charAt(b) == jf) {
      if (q2) break;
    } else q2 = q2 || true;
  }
  return b < 0 ? a.charAt(0) == jf ? jf : nf : 1 == b && a.charAt(0) == jf ? "//" : a.slice(0, b);
}
function de(a) {
  for (var r2, q2 = a.length, c = -1, b = -1, e2 = 0, d2 = false; ; ) {
    if (q2 <= 0) {
      d2 = 0;
      break;
    }
    q2--;
    r2 = a.charAt(q2);
    if (r2 == jf) {
      if (d2) {
        d2 = q2 + 1;
        break;
      }
    } else c < 0 && (c = q2 + 1, d2 = true), r2 == nf ? b < 0 ? b = q2 : 1 != e2 && (e2 = 1) : b > -1 && (e2 = -1);
  }
  return b < 0 || c < 0 || 0 == e2 || 1 == e2 && b == (c - 1 | 0) && b == (d2 + 1 | 0) ? hf : a.slice(b, c);
}
var ab = /* @__PURE__ */ (function() {
  function a(a2, b2) {
    for (var j2, q2 = hf, d2 = 0, e2 = -1, r2 = 0, c2 = 0; c2 <= a2.length; ) {
      j2 = c2 < a2.length ? a2.charAt(c2) : jf;
      if (j2 == jf) {
        if (!(e2 == c2 - 1 || 1 == r2)) if (e2 != c2 - 1 && 2 == r2) {
          if (q2.length < 2 || 2 != d2 || q2.charAt(q2.length - 1) != nf || q2.charAt(q2.length - 2) != nf) {
            if (q2.length > 2) {
              e2 = q2.lastIndexOf(jf);
              if (e2 != q2.length - 1) {
                e2 < 0 ? (q2 = hf, d2 = 0) : (q2 = q2.slice(0, e2), d2 = q2.length - 1 - q2.lastIndexOf(jf) | 0), e2 = c2, r2 = 0, c2++;
                continue;
              }
            } else if (q2.length > 0) {
              q2 = hf, d2 = 0, e2 = c2, r2 = 0, c2++;
              continue;
            }
          }
          b2 && (q2 = q2.length > 0 ? q2 + "/.." : "..", d2 = 2);
        } else d2 = a2.slice(e2 + 1 | 0, c2), q2 = q2.length > 0 ? q2 + jf + d2 : d2, d2 = (c2 - e2 | 0) - 1 | 0;
        e2 = c2;
        r2 = 0;
      } else r2 = j2 == nf && r2 > -1 ? r2 + 1 | 0 : -1;
      c2++;
    }
    return q2;
  }
  function b(b2) {
    var c2 = b2.charAt(0) == jf, q2 = a(b2, !c2);
    0 == q2.length && !c2 && (q2 = nf), q2.length > 0 && b2.charAt(b2.length - 1) == jf && (q2 = q2 + jf);
    return c2 ? jf + q2 : q2;
  }
  function c(a2) {
    if ("string" != typeof a2) throw new TypeError("Path must be a string. Received " + JSON.stringify(a2));
  }
  return function(a2, q2) {
    c(a2), c(q2);
    var e2 = a2 + "";
    a2 = q2 + "", e2.length > 0 || (e2 = hf), a2.length > 0 ? e2.length > 0 && (a2 = e2 + jf + a2) : a2 = e2;
    return 0 == a2.length ? nf : b(a2);
  };
})();
function sb(a, b) {
  if (a && a.includes(jf)) throw new Error(of + b + "` cannot be a path: did not expect `/`");
}
function tb(a, b) {
  if (!a) throw new Error(of + b + "` cannot be empty");
}
function Ga(a) {
  var b = a.history;
  return 0 == b.length ? void 0 : b[b.length - 1];
}
function Pa(a, b) {
  if (qc(b)) {
    if ("file:" != b.protocol + "") {
      a = new TypeError("The URL must be of scheme file"), a.code = "ERR_INVALID_URL_SCHEME";
      throw a;
    }
    if ((b.hostname + "").length > 0) {
      a = new TypeError('File URL host must be "localhost" or empty on darwin'), a.code = "ERR_INVALID_FILE_URL_HOST";
      throw a;
    }
    var q2 = b.pathname + "";
    for (b = 0; b < q2.length; b++) if ("%" == q2.charAt(b) && "2" == q2.charAt(b + 1) && ("F" == q2.charAt(b + 2) || "f" == q2.charAt(b + 2))) {
      a = new TypeError("File URL path must not include encoded / characters"), a.code = "ERR_INVALID_FILE_URL_PATH";
      throw a;
    }
    b = globalThis.decodeURIComponent(q2);
  }
  tb(b, "path");
  Ga(a) === b || a.history.push(b);
}
var ub = /* @__PURE__ */ (function() {
  function a(a2) {
    if (!a2) return "1:1";
    var b2 = a2.line, q2 = a2.column;
    a2 = "number" == typeof b2 && b2 ? b2 + "" : "1", b2 = "number" == typeof q2 && q2 ? q2 + "" : "1";
    return a2 + ":" + b2;
  }
  function b(b2) {
    return !b2 ? "1:1" : "start" in b2 || "end" in b2 ? a(b2.start) + kf + a(b2.end) : a(b2);
  }
  return function(a2, q2, c) {
    "string" == typeof q2 && (c = q2, q2 = void 0);
    var e2 = {};
    q2 && ("line" in q2 && "column" in q2 ? e2.place = q2 : "start" in q2 && "end" in q2 ? e2.place = q2 : "type" in q2 ? (e2.ancestors = [q2], e2.place = q2.position) : e2 = Object.assign(e2, q2));
    if ("string" == typeof a2) var d2, r2 = a2 + "", j2 = false;
    else !e2.cause && a2 ? (r2 = a2.message, e2.cause = a2, j2 = true) : (r2 = hf, j2 = false);
    !e2.ruleId && !e2.source && "string" == typeof c && (a2 = c + "", q2 = a2.indexOf(":"), q2 < 0 ? e2.ruleId = a2 : (e2.source = a2.slice(0, q2), e2.ruleId = a2.slice(q2 + 1 | 0)));
    d2 = e2.ancestors, !e2.place && d2 && d2.length > 0 && (a2 = d2[d2.length - 1], e2.place = a2.position), q2 = e2.place, c = q2 && "start" in q2 ? q2.start : q2, a2 = new Error(), a2.ancestors = void 0, d2 && (a2.ancestors = d2), a2.cause = void 0, !e2.cause || (a2.cause = e2.cause), a2.column = void 0, c && (a2.column = c.column), a2.fatal = void 0, a2.file = hf, a2.message = r2, a2.line = void 0, c && (a2.line = c.line), a2.name = b(q2), a2.place = void 0, q2 && (a2.place = q2), a2.reason = r2, a2.ruleId = void 0, !e2.ruleId || (a2.ruleId = e2.ruleId), a2.source = void 0, !e2.source || (a2.source = e2.source), a2.actual = void 0, a2.expected = void 0, a2.note = void 0, a2.url = void 0, a2.stack = j2 && "string" == typeof e2.cause.stack ? e2.cause.stack : hf;
    return a2;
  };
})();
function ee(a, b) {
  return ub(a, b, void 0);
}
function Qa(a, b) {
  Object.defineProperty(Xa, a, b);
  let q2 = b.get, c = b.set;
  Object.defineProperty(q2, "name", { configurable: true, value: "get " + a }), Object.defineProperty(c, "name", { configurable: true, value: "set " + a });
}
function bb(a, b) {
  Object.defineProperty(b, "name", { configurable: true, value: a }), Object.defineProperty(Xa, a, { configurable: true, writable: true, value: b });
}
function fe(a) {
  return !a || "object" != typeof a ? false : "message" in a && "messages" in a;
}
function cb(a) {
  return fe(a) ? a : new Ma(a);
}
function vb(a, b) {
  "function" == typeof b || Fa("Cannot `" + a + "` without `parser`");
}
function wb(a, b) {
  "function" == typeof b || Fa("Cannot `" + a + "` without `compiler`");
}
function xb(a, b) {
  !b || Oa("Cannot call `" + a + "` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`.");
}
function sc(a) {
  (!rb(a) || "string" != typeof a.type) && Fa("Expected node, got `" + a + of);
}
function tc(a, b, q2) {
  q2 || Oa(of + a + "` finished async. Use `" + b + "` instead");
}
function yb(a) {
  var b = a.parser;
  b = b || a.Parser;
  return b;
}
function zb(a) {
  var b = a.compiler;
  b = b || a.Compiler;
  return b;
}
function Ab(a, b, q2) {
  for (var d2, r2, c = a.length, e2 = -1; ; ) {
    if (false) {
      e2 = -1;
      break;
    }
    e2++;
    if (e2 >= c) {
      e2 = -1;
      break;
    }
    if (a[e2][0] === b) break;
  }
  if (e2 == -1) {
    q2 = ua.call(q2, 0), q2.unshift(b), a.push(q2);
    return;
  }
  if (q2.length > 0) {
    for (c = q2[0], r2 = ua.call(q2, 1), d2 = a[e2][1], rb(d2) && rb(c) && (c = $a(d2, c)), q2 = [], q2.push(b), q2.push(c), c = r2.length, b = 0; b < c; b++) q2.push(r2[b]);
    Array.prototype.splice.call(a, e2, 1, q2);
  }
}
function uc(a, b, q2) {
  if (q2 != null) {
    Array.isArray(q2) || Fa("Expected a list of plugins, not `" + q2 + of);
    for (var e2 = q2.length, c = -1; ++c < e2; ) ge(a, b, q2[c]);
  }
}
function vc(a, b, q2) {
  !("plugins" in q2) && !("settings" in q2) && Oa("Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither"), uc(a, b, q2.plugins);
  if (a = q2.settings) {
    var c = $a(b.settings, a);
    b.settings = c;
  }
}
function ge(a, b, q2) {
  if ("function" == typeof q2) {
    Ab(a, q2, []);
    return;
  }
  if ("object" == typeof q2) {
    if (Array.isArray(q2)) {
      b = q2[0], Ab(a, b, ua.call(q2, 1));
      return;
    }
    vc(a, b, q2);
    return;
  }
  Fa(lf + q2 + of);
}
function wc(a) {
  for (var b = new Ha(), c = a.attachers, e2 = c.length, q2 = -1; ++q2 < e2; ) b.use.apply(b, c[q2]);
  q2 = b.data, b.data($a({}, a.namespace));
  return b;
}
function he() {
  function a(a2, b, q2) {
    Object.defineProperty(b, "name", { configurable: true, value: a2 }), Object.defineProperty(b, "length", { configurable: true, value: q2 }), Object.defineProperty(Rb, a2, { configurable: true, writable: true, value: b });
  }
  a("copy", gd, 0);
  a("data", nd, 2), a("freeze", od, 0), a("parse", hd, 1), a("process", ld, 2), a("processSync", md, 1), a("run", id, 3), a("runSync", jd, 2), a("stringify", kd, 2), a("use", fd, 1), Object.defineProperty(Ha, "prototype", { writable: false });
}
function ie() {
  var a = (0, function() {
    return wc(a);
  });
  Object.setPrototypeOf(a, Rb), a.Compiler = void 0, a.Parser = void 0, a.attachers = [], a.compiler = void 0, a.freezeIndex = -1, a.frozen = void 0, a.namespace = {}, a.parser = void 0;
  var b = {};
  b.fns = [], b.run = dd, b.use = ed, a.transformers = b;
  return a;
}
function Y(a) {
  return a === null;
}
function na(a) {
  return a == null;
}
function X(a) {
  return "string" == typeof a ? a : a === void 0 ? "undefined" : a == null ? "null" : String(a) + "";
}
function W(a) {
  return na(a) ? 0 : a.length;
}
function db(a, b) {
  return "string" == typeof b ? a[b] : Y(b) ? a.null : a[b + ""];
}
function xc(a, b, q2) {
  if ("string" == typeof b) {
    a[b] = q2;
    return;
  }
  if (Y(b)) {
    a.null = q2;
    return;
  }
  a[b + ""] = q2;
}
function ia(a, b) {
  return na(a) ? false : !!Object.prototype.hasOwnProperty.call(a, b);
}
function Aa(a, b) {
  return Object.assign(a, b);
}
function ka(a, b) {
  return na(a) ? false : !!a.includes(b);
}
function Ia(a) {
  return X(String.fromCharCode(a));
}
function da(a) {
  let b = a._bufferIndex, q2 = a._index, c = a.line, e2 = a.column;
  return { _bufferIndex: b, _index: q2, line: c, column: e2, offset: a.offset };
}
function ta(a) {
  return X(a.type);
}
function yc(a) {
  return na(a) ? {} : a;
}
function je(a, b) {
  if ("string" == typeof a) return a;
  na(b) && (b = void 0), b = new TextDecoder(b);
  return X(b.decode(a));
}
function qa(a, b) {
  return { name: a, tokenize: b };
}
function ra(a, b, q2, c) {
  var e2 = a.length;
  b = +b, q2 = +q2, b < 0 ? e2 = 0 - b > e2 ? 0 : e2 + b : b > e2 || (e2 = b), q2 < 0 && (q2 = 0);
  var d2 = W(c);
  if (d2 < 1e4) b = Array.from(c), b.unshift(e2, q2), q2 = a.splice, q2.apply(a, b);
  else {
    q2 > 0 && a.splice(e2, q2), b = 0;
    while (b < d2) q2 = b + 1e4 | 0, b = c.slice(b, q2), b.unshift(e2, 0), a.splice.apply(a, b), e2 += 1e4, b = q2;
  }
}
function sa(a, b) {
  return W(a) > 0 ? (ra(a, a.length, 0, b), a) : b;
}
function ke(a, b) {
  for (var q2 in b) if (!!ia(b, q2)) {
    var c = void 0;
    ia(a, q2) && (c = a[q2]), na(c) && (c = {}, a[q2] = c);
    var d2 = b[q2];
    if (d2) {
      for (q2 in d2) if (!!ia(d2, q2)) {
        ia(c, q2) || (c[q2] = []);
        var e2 = d2[q2], i2 = [];
        if (Array.isArray(e2)) var j2, f2, r2, g2 = e2;
        else !e2 || i2.push(e2), g2 = i2;
        for (j2 = c[q2], f2 = [], e2 = W(g2), q2 = -1; ++q2 < e2; ) r2 = g2[q2], "after" == r2.add ? j2.push(r2) : f2.push(r2);
        ra(j2, 0, 0, f2);
      }
    }
  }
}
function ba(a, b) {
  return null !== b && +b > -1 && a.test(Ia(b));
}
function Bb(a) {
  return null !== a && (+a < 32 || 127 === a);
}
function Z(a) {
  return null !== a && +a < -2;
}
function oa(a) {
  return null !== a && (+a < 0 || 32 === a);
}
function $(a) {
  return a === -2 || a === -1 || 32 === a;
}
function Cb(a, b, q2) {
  for (var e2, c, d2 = [], j2 = W(a), r2 = -1; ++r2 < j2; ) e2 = a[r2], c = e2.resolveAll, "function" == typeof c && !ka(d2, c) && (b = c(b, q2), d2.push(c));
  return b;
}
function zc(a) {
  return "number" == typeof a ? a | 0 : a | 0;
}
function Ac(a, b) {
  var r2 = b.start, j2 = b.end, q2 = r2._index | 0, c = r2._bufferIndex | 0, e2 = j2._index | 0, d2 = j2._bufferIndex | 0;
  q2 == e2 ? b = [a[q2].slice(c, d2)] : (b = a.slice(q2, e2), c > -1 && (q2 = b[0], "string" == typeof q2 ? b[0] = q2.slice(c) : b.shift()), d2 > 0 && (q2 = a[e2].slice(0, d2), b.push(q2)));
  return b;
}
function le(a, b) {
  for (var q2, c, e2 = [], j2 = W(a), d2 = -1, r2 = false; ++d2 < j2; ) {
    q2 = a[d2];
    if ("string" == typeof q2) c = X(q2);
    else if (q2 === -5) c = "\r";
    else if (q2 === -4) c = "\n";
    else if (q2 === -3) c = "\r\n";
    else if (q2 === -2) c = b ? mf : "	";
    else if (q2 === -1) {
      if (!b && r2) continue;
      c = mf;
    } else c = Ia(q2);
    r2 = q2 === -2;
    e2.push(c);
  }
  return e2.join(hf);
}
function Db(a) {
  return { _bufferIndex: a[0], _index: a[1], line: a[2], column: a[3], offset: a[4] };
}
function me(a, b, q2) {
  if (q2) {
    var e2 = q2.line;
    e2 = e2 ? +e2 : 1;
    var d2 = q2.column;
    d2 = d2 ? +d2 : 1;
    var r2 = q2.offset;
    q2 = r2 ? +r2 : 0;
  } else e2 = 1, d2 = 1, q2 = 0;
  var c = [-1, 0, e2, d2, q2], g2 = {};
  e2 = [];
  var j2 = [], i2 = [];
  q2 = {};
  var k2, f2;
  d2 = function() {
    var a2 = c[2] + "";
    if (a2 in Object(g2) && c[3] < 2) {
      c[3] = +db(g2, a2);
      var b2 = c[4];
      c[4] = b2 + +db(g2, a2) - 1;
    }
  };
  var h2 = function(a2, b2) {
    a2.resolveAll && !ka(e2, a2) && e2.push(a2);
    if (a2.resolve) {
      var c2 = q2.events, r3 = a2.resolve, d3 = a2.resolve(c2.slice(b2), q2);
      r3 = W(c2), ra(c2, b2, r3 - b2 | 0, d3);
    }
    a2.resolveTo && (d3 = a2.resolveTo(q2.events, q2), q2.events = d3);
  };
  r2 = function(a2, b2) {
    return function(e3, r3, j3) {
      var u2, p3, K, g3, f3 = [], h3 = 0, A2 = 0, l2 = function(b3) {
        a2(u2, p3, A2);
        return r3;
      }, n2 = function(a3) {
        p3(), h3++;
        return h3 < f3.length ? K(f3[h3]) : j3;
      };
      K = function(a3) {
        return function(e4) {
          var r4 = c, f4 = [r4[0], r4[1], r4[2], r4[3], r4[4]], g4 = q2.previous, h4 = q2.currentConstruct;
          A2 = W(q2.events);
          var j4 = i2;
          j4 = Array.from(j4), p3 = function() {
            c = f4, q2.previous = g4, q2.currentConstruct = h4, q2.events.length = A2, i2 = j4, d2();
          }, u2 = a3, a3.partial || (q2.currentConstruct = a3);
          if (a3.name && (r4 = q2.parser.constructs.disable.null, r4.includes(a3.name))) return n2(e4);
          var K2 = b2 ? Aa(Object.create(q2), b2) : q2;
          return a3.tokenize.call(K2, k2, l2, n2)(e4);
        };
      }, g3 = function(a3) {
        f3 = a3, h3 = 0;
        return 0 == f3.length ? j3 : K(f3[0]);
      };
      return Array.isArray(e3) ? g3(e3) : "tokenize" in Object(e3) ? g3([e3]) : function(a3) {
        var b3, q3 = void 0;
        Y(a3) || (b3 = db(e3, a3), q3 = e3.null);
        var c2 = [];
        Array.isArray(b3) ? c2 = b3 : !b3 || (c2 = [b3]), b3 = [], Array.isArray(q3) ? b3 = q3 : !q3 || (b3 = [q3]);
        return g3([...c2, ...b3])(a3);
      };
    };
  };
  var p2 = function(a2, b2, q3) {
    b2();
  }, N = r2(function(a2, b2, q3) {
    h2(a2, q3);
  }, void 0), L = r2(p2, void 0);
  k2 = { attempt: N, check: L, consume: function(a2) {
    if (Z(a2)) {
      var b2 = c[2];
      c[2] = b2 + 1, c[3] = 1, c[4] = c[4] + (a2 === -3 ? 2 : 1), d2();
    } else a2 === -1 || (c[3] = c[3] + 1, c[4] = c[4] + 1);
    if (c[0] < 0) c[1] = c[1] + 1;
    else c[0] = c[0] + 1, b2 = j2[c[1]].length, c[0] == b2 && (c[0] = -1, c[1] = c[1] + 1);
    q2.previous = a2;
  }, enter: function(a2, b2) {
    b2 = b2 || {}, b2.type = a2, b2.start = Db(c), q2.events.push(["enter", b2, q2]), i2.push(b2);
    return b2;
  }, exit: function(a2) {
    let b2 = i2.pop();
    b2.end = Db(c);
    let e3 = q2.events, d3 = ["exit", b2, q2];
    e3.push(d3);
    return b2;
  }, interrupt: r2(p2, { interrupt: true }) }, r2 = null, q2.code = r2, q2.containerState = {}, q2.defineSkip = function(a2) {
    xc(g2, a2.line, a2.column), d2();
  }, q2.events = [], q2.now = function() {
    return Db(c);
  }, q2.parser = a, q2.previous = r2, q2.sliceSerialize = function(a2, b2) {
    return le(Ac(j2, a2), b2);
  }, q2.sliceStream = function(a2) {
    return Ac(j2, a2);
  }, q2.write = function(a2) {
    for (j2 = sa(j2, a2); ; ) {
      var d3 = c[1];
      if (d3 >= W(j2)) break;
      d3 = j2[c[1]];
      if ("string" == typeof d3) {
        var r3 = c[1];
        c[0] < 0 && (c[0] = 0);
        for (; ; ) {
          a2 = c[1] == r3 && c[0] < d3.length;
          if (!a2) break;
          f2 = f2(d3.charCodeAt(c[0]));
        }
      } else f2 = f2(d3);
    }
    var g3 = j2;
    if (!Y(g3[W(j2) - 1])) return [];
    h2(b, 0);
    var i3 = Cb(e2, q2.events, q2);
    q2.events = i3;
    return q2.events;
  }, f2 = b.tokenize.call(q2, k2), !b.resolveAll || e2.push(b);
  return q2;
}
function ca(a, b, q2, c) {
  var d2 = 1 / 0;
  0 != c && (d2 = c - 1);
  var e2 = 0, r2 = function(c2) {
    if ($(c2) && e2 < d2) return e2 = e2 + 1, a.consume(c2), r2;
    a.exit(q2);
    return b(c2);
  };
  return function(c2) {
    return $(c2) ? (a.enter(q2), r2(c2)) : b(c2);
  };
}
function Ra(a, b, q2, c) {
  for (var e2 = q2.length; e2 > c; ) {
    e2--;
    var d2 = q2[e2];
    a.containerState = d2.state, d2.construct.exit.call(a, b);
  }
  for (; q2.length > c; ) q2.pop();
}
function Eb(a, b) {
  var q2 = b[3];
  if (q2) {
    var c = [];
    c.push(null), q2.write(c);
  }
  b[4] = void 0;
  b[3] = void 0, a.containerState._closeFlow = void 0;
}
function Bc(a, b, q2, c) {
  var r2 = b[3], e2 = a.sliceStream(q2);
  c && e2.push(null), q2.previous = b[4], !b[4] || (b[4].next = q2), b[4] = q2, r2.defineSkip(q2.start), r2.write(e2), c = a.parser.lazy;
  if (c[q2.start.line]) {
    q2 = W(r2.events);
    for (var d2 = b[5]; --q2 >= 0; ) {
      c = r2.events[q2][1];
      if (+c.start.offset < d2 && (!c.end || +c.end.offset > d2)) return;
    }
    for (r2 = W(a.events), c = void 0, q2 = r2, d2 = false; --q2 >= 0; ) {
      e2 = a.events[q2];
      if ("exit" == e2[0]) var f2 = e2[1], j2 = "chunkFlow" == f2.type;
      else j2 = false;
      if (j2) {
        if (d2) {
          d2 = e2[1], c = d2.end;
          break;
        }
        d2 = true;
      }
    }
    Ra(a, b[2], b[0], b[1]);
    for (b = r2; b < W(a.events); b++) e2 = a.events[b], d2 = e2[1], d2.end = da(c);
    e2 = a.events, c = q2 + 1 | 0, q2 = a.events, ra(e2, c, 0, q2.slice(r2)), a.events.length = b;
  }
}
function Sa(a, b) {
  var c = W(b);
  if (c < 1e4) {
    var q2 = Array.from(b);
    b = a.push, b.apply(a, q2);
  } else {
    q2 = 0;
    while (q2 < c) {
      var e2 = q2 + 1e4 | 0, d2 = b.slice(q2, e2);
      q2 = a.push, q2.apply(a, d2), q2 = e2;
    }
  }
}
function Ca(a, b) {
  var c = a.left, e2 = a.right, q2 = c.length, d2 = e2.length;
  if (!(b == q2 || b > q2 && 0 == d2 || b < 0 && 0 == q2)) b < q2 ? (a = Ea.POSITIVE_INFINITY, a = c.splice(b, a), a.reverse(), Sa(e2, a)) : (a = q2 + d2 - b, b = Ea.POSITIVE_INFINITY, a = e2.splice(a, b), a.reverse(), Sa(c, a));
}
function ne(a, b) {
  var d2 = a.get(b), c = d2[1], r2 = d2[2], e2 = b - 1 | 0, h2 = [];
  b = c._tokenizer, b || (d2 = r2.parser, b = d2[X(c.contentType)](c.start), !c._contentTypeTextTrailing || (b._contentTypeTextTrailing = true));
  var j2 = b.events, i2 = [], p2 = {};
  d2 = [], d2.push(0);
  for (var f2, k2, K, g2 = void 0, q2 = c; q2; ) {
    for (; true; ) {
      e2++;
      if (a.get(e2)[1] == q2) break;
    }
    h2.push(e2);
    q2._tokenizer || (f2 = r2.sliceStream(q2), q2.next || f2.push(null), !g2 || b.defineSkip(q2.start), !q2._isInFirstContentOfListItem || (b._gfmTasklistFirstContentOfListItem = true), b.write(f2), !q2._isInFirstContentOfListItem || (b._gfmTasklistFirstContentOfListItem = void 0)), f2 = q2.next, g2 = q2, q2 = f2;
  }
  for (f2 = W(j2), r2 = -1; true; ) {
    q2 = r2 + 1 | 0;
    if (q2 >= f2) break;
    "exit" == j2[q2][0] && "enter" == j2[q2 - 1][0] ? (g2 = j2[q2], k2 = g2[1], e2 = k2.type, e2 = e2 == j2[q2 - 1][1].type) : e2 = false;
    e2 ? (g2 = j2[q2], k2 = g2[1], e2 = k2.start.line, K = j2[q2][1], e2 = e2 != K.end.line) : e2 = false, e2 && (d2.push(r2 + 2 | 0), c._tokenizer = void 0, c.previous = void 0, c = c.next), r2 = q2;
  }
  b.events = [];
  c ? (c._tokenizer = void 0, c.previous = void 0) : d2.pop(), b = W(d2);
  for (; --b >= 0; ) c = void 0, (b + 1 | 0) < W(d2) && (c = d2[b + 1]), q2 = d2[b], e2 = j2.slice(q2, c), q2 = +h2.pop() | 0, c = [], c.push(q2), r2 = (q2 + W(e2) | 0) - 1 | 0, c.push(r2), i2.push(c), a.splice(q2, 2, e2);
  i2.reverse();
  for (e2 = W(i2), a = -1, b = 0; ++a < e2; ) c = i2[a], q2 = +c[0] | 0, d2 = +c[1] | 0, d2 = b + d2 | 0, p2[(b + q2 | 0) + ""] = d2, b = (d2 - q2 | 0) - 1 | 0;
  return p2;
}
function Cc(a) {
  for (var c, b, g2, q2, h2, p2, f2, K, r2, j2, i2, k2 = {}, d2 = new Sb(a), e2 = -1, A2 = false; ++e2 < d2.length; ) {
    for (; e2 + "" in Object(k2); ) e2 = +k2[e2 + ""] | 0;
    var u2 = d2.get;
    j2 = d2.get(e2);
    if (e2 > 0 && "chunkFlow" == j2[1].type && "listItemPrefix" == d2.get(e2 - 1 | 0)[1].type) {
      c = j2[1], b = c._tokenizer.events, 0 < W(b) ? (c = b[0][1], q2 = "lineEndingBlank" == c.type) : q2 = false, c = q2 ? 2 : 0, c < W(b) ? (g2 = b[c][1], q2 = "content" == g2.type) : q2 = false;
      if (q2) while (true) {
        q2 = c + 1 | 0;
        if (q2 >= W(b)) break;
        h2 = b[q2][1];
        if ("content" == h2.type) break;
        p2 = b[q2][1], "chunkText" == p2.type && (f2 = b[q2][1], f2._isInFirstContentOfListItem = true, q2 = c + 2 | 0), c = q2;
      }
    }
    if ("enter" == j2[0]) b = j2[1], !b.contentType || (Aa(k2, ne(d2, e2)), e2 = +k2[e2 + ""] | 0, A2 = true);
    else {
      b = j2[1];
      if (b._container) {
        for (f2 = e2, b = 0; --f2 >= 0; ) {
          i2 = d2.get(f2), K = i2[1], r2 = X(K.type);
          if ("lineEnding" == r2 || "lineEndingBlank" == r2) "enter" == i2[0] && (b > 0 && (r2 = d2.get(b)[1], r2.type = "lineEndingBlank"), r2 = i2[1], r2.type = "lineEnding", b = f2);
          else if (!("linePrefix" == r2 || "listItemIndent" == r2)) break;
        }
        b > 0 && (q2 = j2[1], g2 = d2.get(b)[1], q2.end = da(g2.start), c = d2.slice(b, e2), c.unshift(j2), q2 = (e2 - b | 0) + 1 | 0, d2.splice(b, q2, c));
      }
    }
  }
  ra(a, 0, 1 / 0, d2.slice(0, void 0));
  return !A2;
}
function oe(a, b) {
  for (var d2, c, e2, q2, g2, f2, r2, i2, j2 = W(a), k2 = 0; true; ) {
    d2 = k2 + 1 | 0;
    if (d2 > j2) break;
    c = d2 == j2, !c ? (e2 = a[d2][1], q2 = "lineEnding" == e2.type) : q2 = false, q2 = q2;
    if ((c || q2) && "data" == a[d2 - 1][1].type) {
      for (e2 = a[d2 - 1][1], i2 = b.sliceStream(e2), g2 = W(i2), q2 = -1, c = 0, r2 = false; --g2 >= 0; ) {
        f2 = i2[g2];
        if ("string" == typeof f2) {
          f2 += "", q2 = f2.length;
          for (; q2 > 0 && 32 == f2.charCodeAt(q2 - 1); c++) q2--;
          if (q2 > 0) break;
          q2 = -1;
        } else if (f2 === -2) c++, r2 = true;
        else if (f2 !== -1) {
          g2++;
          break;
        }
      }
      b._contentTypeTextTrailing && d2 == j2 && (c = 0);
      if (c > 0) {
        r2 = d2 == j2 || r2 || c < 2, f2 = !r2 ? "hardBreakTrailing" : "lineSuffix", r2 = {}, r2._bufferIndex = 0 != g2 ? q2 : (+e2.start._bufferIndex | 0) + q2 | 0, r2._index = (+e2.start._index | 0) + g2 | 0, r2.line = e2.end.line, r2.column = (+e2.end.column | 0) - c | 0, r2.offset = (+e2.end.offset | 0) - c | 0, c = {}, c.type = f2, c.start = r2, c.end = da(e2.end), e2.end = da(c.start), q2 = e2.start.offset;
        if (q2 == e2.end.offset) Aa(e2, c);
        else {
          q2 = [], q2[0] = "enter", q2[1] = c, q2[2] = b, j2 = [], j2[0] = "exit", j2[1] = c, j2[2] = b, a.splice(d2, 0, q2, j2);
          var h2 = k2 + 3 | 0;
          j2 = W(a), d2 = h2;
        }
      }
      d2++;
    }
    k2 = d2;
  }
  return a;
}
function Dc(a) {
  return Y(a) || oa(a) || ba(ud, a) ? 1 : ba(td, a) ? 2 : void 0;
}
function Fb(a) {
  return ia(Ub, a) ? Ub[a] : false;
}
function pe(a, b) {
  return 0 == a ? ba(wa, b) : 1 == a ? ba(rd, b) : ba(lb, b);
}
function Ec(a, b, q2, c, e2, d2, r2, j2, f2) {
  var p2 = 1 / 0;
  0 != f2 && (p2 = f2);
  var i2, h2, g2, k2 = 0;
  f2 = function(b2) {
    return 60 === b2 || 62 === b2 || 92 === b2 ? (a.consume(b2), i2) : i2(b2);
  }, i2 = function(b2) {
    if (62 === b2) return a.exit("chunkString"), a.exit(j2), h2(b2);
    if (Y(b2) || 60 === b2 || Z(b2)) return q2(b2);
    a.consume(b2);
    return 92 === b2 ? f2 : i2;
  }, h2 = function(q3) {
    if (62 === q3) return a.enter(d2), a.consume(q3), a.exit(d2), a.exit(e2), a.exit(c), b;
    a.enter(j2);
    var f3 = a.enter, r3 = {};
    r3.contentType = "string", a.enter("chunkString", r3);
    return i2(q3);
  };
  var K = function(b2) {
    return 40 === b2 || 41 === b2 || 92 === b2 ? (a.consume(b2), g2) : g2(b2);
  };
  g2 = function(e3) {
    if (0 == k2 && (Y(e3) || 41 === e3 || oa(e3))) return a.exit("chunkString"), a.exit(j2), a.exit(r2), a.exit(c), b(e3);
    if (k2 < p2 && 40 === e3) return a.consume(e3), k2++, g2;
    if (41 === e3) return a.consume(e3), k2--, g2;
    if (Y(e3) || 32 === e3 || 40 === e3 || Bb(e3)) return q2(e3);
    a.consume(e3);
    return 92 === e3 ? K : g2;
  };
  return function(b2) {
    if (60 === b2) return a.enter(c), a.enter(e2), a.enter(d2), a.consume(b2), a.exit(d2), h2;
    if (Y(b2) || 32 === b2 || 41 === b2 || Bb(b2)) return q2(b2);
    a.enter(c), a.enter(r2), a.enter(j2);
    var i3 = a.enter, f3 = {};
    f3.contentType = "string", a.enter("chunkString", f3);
    return g2(b2);
  };
}
function Fc(a, b, q2, c, e2, d2) {
  var j2, f2, g2, r2 = 0;
  let i2 = function(b2) {
    return b2 == r2 || 92 === b2 ? (a.consume(b2), j2) : j2(b2);
  };
  j2 = function(b2) {
    if (b2 == r2 || Y(b2) || Z(b2)) return a.exit("chunkString"), f2(b2);
    a.consume(b2);
    return 92 === b2 ? i2 : j2;
  }, f2 = function(b2) {
    if (b2 == r2) return a.exit(d2), g2(r2);
    if (Y(b2)) return q2(b2);
    if (Z(b2)) return a.enter("lineEnding"), a.consume(b2), a.exit("lineEnding"), ca(a, f2, "linePrefix", 0);
    var c2 = {};
    c2.contentType = "string", a.enter("chunkString", c2);
    return j2(b2);
  }, g2 = function(q3) {
    if (q3 == r2) return a.enter(e2), a.consume(q3), a.exit(e2), a.exit(c), b;
    a.enter(d2);
    return f2(q3);
  };
  return function(b2) {
    return 34 === b2 || 39 === b2 || 40 === b2 ? (a.enter(c), a.enter(e2), a.consume(b2), a.exit(e2), r2 = 40 === b2 ? 41 : b2 | 0, g2) : q2(b2);
  };
}
function Ta(a, b) {
  var c = false, q2 = function(e2) {
    return Z(e2) ? (a.enter("lineEnding"), a.consume(e2), a.exit("lineEnding"), c = true, q2) : $(e2) ? ca(a, q2, c ? "linePrefix" : "lineSuffix", 0)(e2) : b(e2);
  };
  return q2;
}
function Ja(a) {
  return a.replace(Bd, mf).replace(Cd, hf).toLowerCase().toUpperCase();
}
function aa(a, b, q2) {
  a[b + ""] = q2;
}
function qe(a) {
  var b = yc(a);
  a = [];
  var q2 = xa;
  a.push(q2);
  if (q2 = b.extensions) {
    var c = W(q2);
    for (b = 0; b < c; b++) {
      var e2 = q2[b];
      a.push(e2);
    }
  }
  for (q2 = {}, c = W(a), b = -1; ++b < c; ) ke(q2, a[b]);
  a = {}, a.constructs = q2, a.defined = [], a.lazy = {}, b = vd, a.content = function(q3) {
    return me(a, b, q3);
  }, q2 = wd, a.document = function(b2) {
    return me(a, q2, b2);
  }, c = yd, a.flow = function(b2) {
    return me(a, c, b2);
  }, e2 = zd, a.string = function(b2) {
    return me(a, e2, b2);
  }, a.text = function(b2) {
    return me(a, Ad, b2);
  };
  return a;
}
function re() {
  var a = 1, q2 = hf, c = true, b = false;
  return function(e2, d2, r2) {
    var f2 = [], g2 = q2;
    g2 += je(e2, d2), q2 = hf, c ? (e2 = g2.length > 0 && 65279 == g2.charCodeAt(0) ? 1 : 0, c = false) : e2 = 0;
    var k2 = g2.length;
    while (e2 < k2) {
      for (d2 = e2; ; d2++) {
        if (d2 >= k2) {
          var i2, h2, j2 = -1;
          break;
        }
        j2 = g2.charCodeAt(d2);
        if (0 == j2 || 9 == j2 || 10 == j2 || 13 == j2) break;
      }
      if (j2 < 0) {
        q2 = g2.slice(e2);
        break;
      }
      if (10 == j2 && e2 == d2 && b) f2.push(-3), b = false;
      else {
        b && (f2.push(-5), b = false), e2 < d2 && (i2 = g2.slice(e2, d2), f2.push(i2), a = a + (d2 - e2 | 0));
        if (0 == j2) f2.push(65533), a++;
        else if (9 == j2) {
          for (j2 = Ya.ceil, e2 = Ya, i2 = a, j2 = +j2.call(e2, i2 / 4) * 4, f2.push(-2); a < j2; a++) f2.push(-1);
          a++;
        } else 10 == j2 ? (f2.push(-4), a = 1) : (b = true, a = 1);
      }
      e2 = d2 + 1 | 0;
    }
    r2 && (b && f2.push(-5), q2.length > 0 && (h2 = q2, f2.push(h2)), f2.push(null));
    return f2;
  };
}
function Gb(a, b) {
  a = +Number.parseInt(a, b) | 0;
  return a < 9 || 11 == a || a > 13 && a < 32 || a > 126 && a < 160 || a > 55295 && a < 57344 || a > 64975 && a < 65008 || 65535 == (a & 65535) || 65534 == (a & 65535) || a > 1114111 ? "\uFFFD" : X(String.fromCodePoint(a));
}
var Gc;
var eb;
(function() {
  function a(a2) {
    return !!a2 && "number" == typeof a2 ? X(a2) : "1";
  }
  function b(b2) {
    if (na(b2)) return b2 = a(void 0) + ":", b2 + a(void 0);
    var q2 = a(b2.line) + ":";
    return q2 + a(b2.column);
  }
  Gc = function(a2) {
    if (na(a2)) return a2 = b(void 0) + kf, a2 + b(void 0);
    var q2 = b(a2.start) + kf;
    return q2 + b(a2.end);
  };
  eb = function(a2) {
    return !a2 || "object" != typeof a2 ? hf : ia(a2, "position") || ia(a2, "type") ? Gc(a2.position) : ia(a2, "start") || ia(a2, "end") ? Gc(a2) : ia(a2, "line") || ia(a2, "column") ? b(a2) : hf;
  };
})();
function Hc(a, b, q2) {
  for (var d2 = W(a), e2 = hf, c = 0; c < d2; c++) e2 += X(ob(a[c], b, q2));
  return e2;
}
function Da(a) {
  let b = a.line, q2 = a.column;
  return { line: b, column: q2, offset: a.offset };
}
function se(a) {
  let b = "Cannot close `" + ta(a) + "` (", q2 = a.start;
  throw new kb(b + eb({ start: q2, end: a.end }) + "): it\u2019s not open");
}
function te(a, b) {
  for (var q2 in b) if (!!ia(b, q2)) if ("canContainEols" == q2) {
    var c = b[q2];
    if (c) {
      var e2 = a[q2], d2 = W(c);
      for (q2 = 0; q2 < d2; q2++) {
        var r2 = c[q2];
        e2.push(r2);
      }
    }
  } else if ("transforms" == q2) {
    if (c = b[q2]) for (e2 = a[q2], d2 = W(c), q2 = 0; q2 < d2; q2++) r2 = c[q2], e2.push(r2);
  } else ("enter" == q2 || "exit" == q2) && (c = b[q2], !c || Aa(a[q2], c));
}
function Ic(a, b) {
  for (var q2, e2 = W(b), c = -1; ++c < e2; ) q2 = b[c], Array.isArray(q2) ? Ic(a, q2) : te(a, q2);
}
function ga(a, b, q2) {
  return function(c) {
    a.call(this, b(c), c), !q2 || q2.call(this, c);
  };
}
function ha(a, b) {
  return function(q2) {
    !b || b.call(this, q2), a.call(this, q2);
  };
}
function ea(a) {
  let b = a.stack;
  return b[W(b) - 1];
}
function Jc(a) {
  var b = ea(a);
  if (a.data.inReference) {
    var q2 = a.data.referenceType;
    q2 = q2 || "shortcut";
    var c = X(b.type) + "Reference";
    b.type = c, b.referenceType = q2, delete b.url, delete b.title;
  } else delete b.identifier, delete b.label;
  a.data.referenceType = void 0;
}
function Hb(a) {
  return "listOrdered" == a || "listUnordered" == a;
}
function ue(a) {
  return Hb(a) || "blockQuote" == a;
}
function ve(a) {
  return "linePrefix" == a || "listItemValue" == a || "listItemMarker" == a ? true : "listItemPrefix" == a || "listItemPrefixWhitespace" == a;
}
function we(a) {
  return "linePrefix" == a || "blockQuotePrefix" == a || "blockQuotePrefixWhitespace" == a ? true : "blockQuoteMarker" == a || "listItemIndent" == a;
}
function xe(a, b, q2) {
  for (var e2, r2, j2, f2, c, p2, g2, u2, A2 = b - 1 | 0, i2 = -1, K = false, d2 = void 0, k2 = 0, h2 = false; true; ) {
    e2 = A2 + 1 | 0;
    if (e2 > q2) break;
    r2 = a[e2], j2 = ta(r2[1]), c = X(r2[0]), ue(j2) ? (i2 = "enter" == c ? i2 + 1 | 0 : i2 - 1 | 0, h2 = false) : "lineEndingBlank" == j2 ? "enter" == c && (d2 && !h2 && 0 == i2 && 0 == k2 && (k2 = e2), h2 = false) : ve(j2) || (h2 = false);
    if (0 == i2 && "enter" == c && "listItemPrefix" == j2 || i2 == -1 && "exit" == c && Hb(j2)) {
      if (d2) {
        for (c = 0, f2 = e2; --f2 >= 0; ) {
          p2 = a[f2], g2 = ta(p2[1]);
          if ("lineEnding" == g2 || "lineEndingBlank" == g2) {
            if ("exit" == X(p2[0])) continue;
            c && (K = a[c][1], K.type = "lineEndingBlank", K = true), g2 = p2[1], g2.type = "lineEnding", c = f2;
          } else if (!we(g2)) break;
        }
        0 != k2 && (0 != c ? k2 < c : true) && (d2._spread = true);
        f2 = r2[1].end, 0 != c && (e2 = a[c][1], f2 = e2.start, e2 = c), d2.end = Aa({}, f2), ra(a, e2, 0, [["exit", d2, r2[2]]]), q2++, e2 = A2 + 2 | 0;
      }
      "listItemPrefix" == j2 && (d2 = {}, d2.type = "listItem", d2._spread = false, d2.start = Aa({}, r2[1].start), d2.end = void 0, ra(a, e2, 0, [["enter", d2, r2[2]]]), q2++, e2++, k2 = 0, h2 = true);
    }
    A2 = e2;
  }
  d2 = a[b][1];
  d2._spread = K;
  return q2;
}
function ye(a) {
  var g2 = [];
  g2.push("emphasis"), g2.push("fragment"), g2.push("heading"), g2.push("paragraph"), g2.push("strong");
  var c, e2, d2, j2, f2, q2 = {}, b = {}, i2 = { transforms: [], canContainEols: g2, enter: q2, exit: b }, r2 = (0, function() {
    let a2 = this.stack;
    a2.push({ type: "fragment", children: [] });
  });
  d2 = (0, function() {
    var a2 = this.stack, c2 = a2.pop(), q3 = void 0;
    q3 = yc(q3);
    var b2 = q3.includeImageAlt;
    a2 = q3.includeHtml, "boolean" == typeof b2 || (b2 = true), "boolean" == typeof a2 || (a2 = true), b2 = X(Id(c2, b2, a2));
    return b2;
  }), c = (0, function(a2, b2, q3) {
    var e3 = ea(this).children;
    e3.push(a2);
    var d3 = this.stack;
    d3.push(a2);
    var c2 = [];
    c2.push(b2), q3 ? c2.push(q3) : c2.push(void 0), q3 = this.tokenStack, q3.push(c2), a2.position = { start: Da(b2.start), end: void 0 };
  }), e2 = (0, function(a2, b2) {
    var c2 = this.stack, e3 = c2.pop(), d3 = this.tokenStack, q3 = d3.pop();
    na(q3) ? se(a2) : ta(q3[0]) != ta(a2) && (b2 ? b2.call(this, a2, q3[0]) : (b2 = q3[1], b2 = b2 || bc, b2.call(this, a2, q3[0]))), e3.position.end = Da(a2.end);
  });
  var p2 = (0, function(a2) {
    this.data.expectingFirstListItemValue = true;
  }), l2 = (0, function(a2) {
    let b2 = X(d2.call(this));
    a2 = ea(this), a2.value = b2.replace(Jd, hf), this.data.flowCodeInside = void 0;
  }), y2 = (0, function(a2) {
    let b2 = X(d2.call(this)), q3 = ea(this);
    q3.value = b2.replace(Kd, hf);
  }), Q = (0, function(a2) {
    this.data.setextHeadingSlurpLineEnding = void 0;
  });
  j2 = (0, function(a2) {
    var q3 = ea(this).children, b2 = void 0;
    W(q3) > 0 && (b2 = q3[W(q3) - 1]), (na(b2) || "text" != X(b2.type)) && (b2 = { type: "text", value: hf, position: void 0 }, b2.position = { start: Da(a2.start), end: void 0 }, q3.push(b2)), a2 = this.stack, a2.push(b2);
  }), f2 = (0, function(a2) {
    let c2 = this.stack, b2 = c2.pop(), q3 = X(b2.value);
    b2.value = q3 + X(this.sliceSerialize(a2)), q3 = b2.position, q3.end = Da(a2.end);
  });
  var k2 = (0, function(a2) {
    this.data.atHardBreak = true;
  }), M = (0, function(a2) {
    let b2 = d2.call(this);
    ea(this).value = b2;
  }), o2 = (0, function(a2) {
    let b2 = d2.call(this);
    ea(this).value = b2;
  }), C = (0, function(a2) {
    let b2 = d2.call(this);
    ea(this).value = b2;
  }), T2 = (0, function(a2) {
    Jc(this);
  }), m2 = (0, function(a2) {
    Jc(this);
  }), h2 = (0, function(a2) {
    let b2 = this.data;
    b2.characterReferenceType = a2.type;
  });
  q2.autolink = ga(c, gc, void 0), q2.autolinkProtocol = j2, q2.autolinkEmail = j2, q2.atxHeading = ga(c, dc, void 0), q2.blockQuote = ga(c, Ld, void 0), q2.characterEscape = j2, q2.characterReference = j2, q2.codeFenced = ga(c, cc, void 0), q2.codeFencedFenceInfo = r2, q2.codeFencedFenceMeta = r2, q2.codeIndented = ga(c, cc, r2), q2.codeText = ga(c, Md, r2), q2.codeTextData = j2, q2.data = j2, q2.codeFlowValue = j2, q2.definition = ga(c, Nd, void 0), q2.definitionDestinationString = r2, q2.definitionLabelString = r2, q2.definitionTitleString = r2, q2.emphasis = ga(c, Od, void 0), q2.hardBreakEscape = ga(c, ec, void 0), q2.hardBreakTrailing = ga(c, ec, void 0), q2.htmlFlow = ga(c, fc, r2), q2.htmlFlowData = j2, q2.htmlText = ga(c, fc, r2), q2.htmlTextData = j2, q2.image = ga(c, Pd, void 0), q2.label = r2, q2.link = ga(c, gc, void 0), q2.listItem = ga(c, Qd, void 0), q2.listItemValue = function(a2) {
    if (this.data.expectingFirstListItemValue) {
      var b2 = this.stack, q3 = b2[W(b2) - 2];
      a2 = X(this.sliceSerialize(a2)), q3.start = +Number.parseInt(a2, 10), this.data.expectingFirstListItemValue = void 0;
    }
  }, q2.listOrdered = ga(c, hc, p2), q2.listUnordered = ga(c, hc, void 0), q2.paragraph = ga(c, Rd, void 0), q2.reference = function(a2) {
    this.data.referenceType = "collapsed";
  }, q2.referenceString = r2, q2.resourceDestinationString = r2, q2.resourceTitleString = r2, q2.setextHeading = ga(c, dc, void 0), q2.strong = ga(c, Sd, void 0), q2.thematicBreak = ga(c, Td, void 0), b.atxHeading = ha(e2, void 0), b.atxHeadingSequence = function(a2) {
    var b2 = ea(this);
    b2.depth || (b2.depth = X(this.sliceSerialize(a2)).length);
  }, b.autolink = ha(e2, void 0), b.autolinkEmail = function(a2) {
    f2.call(this, a2);
    let b2 = ea(this);
    b2.url = "mailto:" + X(this.sliceSerialize(a2));
  }, b.autolinkProtocol = function(a2) {
    f2.call(this, a2);
    let b2 = ea(this);
    b2.url = this.sliceSerialize(a2);
  }, b.blockQuote = ha(e2, void 0), b.characterEscapeValue = f2, b.characterReferenceMarkerHexadecimal = h2, b.characterReferenceMarkerNumeric = h2, b.characterReferenceValue = function(a2) {
    a2 = X(this.sliceSerialize(a2));
    var b2 = this.data.characterReferenceType;
    b2 ? (b2 = "characterReferenceMarkerNumeric" == X(b2) ? 10 : 16, a2 = Gb(a2, b2), this.data.characterReferenceType = void 0) : (a2 = Fb(a2), false === a2 && Oa("expected reference to decode"), a2 = X(a2));
    var q3 = ea(this), c2 = X(q3.value) + a2;
    q3.value = c2;
  }, b.characterReference = function(a2) {
    let b2 = this.stack, q3 = b2.pop().position;
    q3.end = Da(a2.end);
  }, b.codeFenced = ha(e2, l2), b.codeFencedFence = function(a2) {
    if (!this.data.flowCodeInside) r2.call(this), this.data.flowCodeInside = true;
  }, b.codeFencedFenceInfo = function(a2) {
    let b2 = d2.call(this);
    ea(this).lang = b2;
  }, b.codeFencedFenceMeta = function(a2) {
    let b2 = d2.call(this);
    ea(this).meta = b2;
  }, b.codeFlowValue = f2, b.codeIndented = ha(e2, y2), b.codeText = ha(e2, C), b.codeTextData = f2, b.data = f2, b.definition = ha(e2, void 0), b.definitionDestinationString = function(a2) {
    let b2 = d2.call(this);
    ea(this).url = b2;
  }, b.definitionLabelString = function(a2) {
    let q3 = d2.call(this), b2 = ea(this);
    b2.label = q3, b2.identifier = Ja(X(this.sliceSerialize(a2))).toLowerCase();
  }, b.definitionTitleString = function(a2) {
    let b2 = d2.call(this);
    ea(this).title = b2;
  }, b.emphasis = ha(e2, void 0), b.hardBreakEscape = ha(e2, k2), b.hardBreakTrailing = ha(e2, k2), b.htmlFlow = ha(e2, M), b.htmlFlowData = f2, b.htmlText = ha(e2, o2), b.htmlTextData = f2, b.image = ha(e2, m2), b.label = function(a2) {
    a2 = ea(this);
    var q3 = d2.call(this), b2 = ea(this);
    this.data.inReference = true, "link" == X(b2.type) ? b2.children = a2.children : b2.alt = q3;
  }, b.labelText = function(a2) {
    a2 = X(this.sliceSerialize(a2));
    let b2 = this.stack, q3 = b2[W(b2) - 2];
    q3.label = X(a2.replace(Hd, function(a3, b3, q4) {
      var d3 = X(a3), c2 = b3;
      if (c2) return c2;
      c2 = X(q4);
      if (35 == c2.charCodeAt(0)) {
        var e3 = c2.charCodeAt(1);
        return 120 == e3 || 88 == e3 ? Gb(c2.slice(2), 16) : Gb(c2.slice(1), 10);
      }
      c2 = Fb(c2);
      return c2 || d3;
    })), q3.identifier = Ja(a2).toLowerCase();
  }, b.lineEnding = function(a2) {
    var q3 = ea(this);
    if (this.data.atHardBreak) {
      var c2 = q3.children, e3 = c2[W(c2) - 1], d3 = e3.position;
      d3.end = Da(a2.end), this.data.atHardBreak = void 0;
      return;
    }
    if (!this.data.setextHeadingSlurpLineEnding) {
      var b2 = i2.canContainEols;
      b2 = ka(b2, X(q3.type));
    } else b2 = false;
    b2 && (j2.call(this, a2), f2.call(this, a2));
  }, b.link = ha(e2, T2), b.listItem = ha(e2, void 0), b.listOrdered = ha(e2, void 0), b.listUnordered = ha(e2, void 0), b.paragraph = ha(e2, void 0), b.referenceString = function(a2) {
    let q3 = d2.call(this), b2 = ea(this);
    b2.label = q3, b2.identifier = Ja(X(this.sliceSerialize(a2))).toLowerCase(), this.data.referenceType = "full";
  }, b.resourceDestinationString = function(a2) {
    let b2 = d2.call(this);
    ea(this).url = b2;
  }, b.resourceTitleString = function(a2) {
    let b2 = d2.call(this);
    ea(this).title = b2;
  }, b.resource = function(a2) {
    this.data.inReference = void 0;
  }, b.setextHeading = ha(e2, Q), b.setextHeadingLineSequence = function(a2) {
    a2 = X(this.sliceSerialize(a2)), a2 = a2.length > 0 ? 61 == (+a2.codePointAt(0) | 0) ? 1 : 2 : 2, ea(this).depth = a2;
  }, b.setextHeadingText = function(a2) {
    this.data.setextHeadingSlurpLineEnding = true;
  }, b.strong = ha(e2, void 0), b.thematicBreak = ha(e2, void 0), na(a) && (a = {}), b = a.mdastExtensions, na(b) && (b = []), Ic(i2, b), a = {};
  return function(b2) {
    var g3 = { type: "root", children: [], position: void 0 }, u2 = [];
    u2.push(g3);
    var p3 = [], f3 = {};
    f3.stack = u2, f3.tokenStack = p3, f3.config = i2, f3.enter = c, f3.exit = e2, f3.buffer = r2, f3.resume = d2, f3.data = a;
    for (var k3, K, A2, h3, j3 = [], q3 = -1; ++q3 < W(b2); ) Hb(ta(b2[q3][1])) && ("enter" == X(b2[q3][0]) ? j3.push(q3) : q3 = xe(b2, j3.pop(), q3));
    for (q3 = -1; ++q3 < W(b2); ) j3 = b2[q3], h3 = i2[X(j3[0])], k3 = ta(j3[1]), ia(h3, k3) && (K = Aa({ sliceSerialize: j3[2].sliceSerialize }, f3), h3[k3].call(K, j3[1]));
    W(p3) > 0 && (j3 = p3[W(p3) - 1], q3 = j3[1], q3 = q3 || bc, q3.call(f3, void 0, j3[0]));
    for (q3 = { line: 1, column: 1, offset: 0 }, j3 = { line: 1, column: 1, offset: 0 }, W(b2) > 0 && (k3 = b2[0], h3 = k3[1], q3 = h3.start, K = b2[W(b2) - 2][1], j3 = K.end), q3 = Da(q3), g3.position = { start: q3, end: Da(j3) }, j3 = i2.transforms, A2 = -1; ++A2 < W(j3); ) q3 = j3[A2](g3), q3 && (g3 = q3);
    return g3;
  };
}
function Kc(a) {
  return !!a ? a : [];
}
function ya(a, b) {
  return !!Object.prototype.hasOwnProperty.call(a, b);
}
function pa(a, b) {
  b = a[b];
  return "string" == typeof b ? b : hf;
}
function fa(a) {
  let b = [];
  Array.prototype.push.call(b, a);
  return b;
}
function _(a, b, q2) {
  return { type: "element", tagName: a, properties: b, children: q2 };
}
function ma(a) {
  return { type: "text", value: a };
}
function Lc(a, b) {
  if (!(b == null || "object" != typeof b)) for (var q2 in b) ya(b, q2) && (a[q2] = b[q2]);
}
function Mc(a) {
  return a >= 48 && a <= 57 || a >= 65 && a <= 90 || a >= 97 && a <= pf;
}
function ze(a) {
  return 33 == a || 35 == a || 36 == a || 61 == a || 95 == a || 126 == a ? true : a >= 38 && a <= 59 ? true : a >= 63 && a <= 90 ? true : a >= 97 && a <= pf ? true : false;
}
function Nc(a) {
  a = String.fromCharCode(a);
  return "string" == typeof a ? a : hf;
}
function Ae(a, b) {
  a = String.fromCharCode(a, b);
  return "string" == typeof a ? a : hf;
}
function Ka(a) {
  for (var b, q2, e2 = a.length, d2 = hf, c = 0, r2 = 0; c < e2; c++) b = a.charCodeAt(c), 37 == b && (c + 2 | 0) < e2 && Mc(a.charCodeAt(c + 1)) && Mc(a.charCodeAt(c + 2)) ? (b = hf, q2 = 2) : b < 128 ? (b = !ze(b) ? Nc(b) : hf, q2 = 0) : b > 55295 && b < 57344 ? (q2 = c + 1 < e2 ? a.charCodeAt(c + 1) : 0, b < 56320 && q2 > 56319 && q2 < 57344 ? (b = Ae(b, q2), q2 = 1) : (b = "\uFFFD", q2 = 0)) : (b = Nc(b), q2 = 0), b.length > 0 && (d2 = d2 + a.slice(r2, c) + encodeURIComponent(b), r2 = (c + q2 | 0) + 1 | 0), q2 > 0 && (c = c + q2 | 0);
  return d2 + a.slice(r2);
}
function Oc(a, b, q2) {
  var c = a.length;
  if (b) for (b = 0; b < c; b++) {
    var e2 = a.charCodeAt(b);
    if (9 != e2 && 32 != e2) break;
  }
  else b = 0;
  if (q2) while (c > b) {
    q2 = a.charCodeAt(c - 1);
    if (9 != q2 && 32 != q2) break;
    c--;
  }
  return c > b ? a.slice(b, c) : hf;
}
function Be(a) {
  for (var e2, b, r2 = new RegExp("\\r\\n|\\n|\\r", "g"), c = r2.exec(a), d2 = hf, q2 = 0; c != null; ) e2 = c.index | 0, b = c[0], "string" == typeof b || (b = hf), d2 = d2 + Oc(a.slice(q2, e2), q2 > 0, true) + b, q2 = e2 + b.length, c = r2.exec(a);
  return d2 + Oc(a.slice(q2), q2 > 0, false);
}
function Pc(a) {
  for (var q2, c = a.length, b = 0; b < c; b++) {
    q2 = a.charCodeAt(b);
    if (9 != q2 && 32 != q2) break;
  }
  return a.slice(b);
}
function Ib(a) {
  if (!(a == null || "object" != typeof a)) {
    var b, q2, c = a.line, e2 = a.column;
    if (!("number" != typeof c || +c <= 0 || "number" != typeof e2 || +e2 <= 0)) return q2 = a.offset, b = {}, b.line = c, b.column = e2, b.offset = "number" == typeof q2 && +q2 > -1 ? q2 : void 0, b;
  }
}
function Ce(a) {
  var b = a.position;
  if (!(b == null || "object" != typeof b)) {
    var q2 = Ib(b.start), c = Ib(b.end);
    return q2 == null || c == null ? void 0 : { start: q2, end: c };
  }
}
function Qc(a, b) {
  if (!(a == null || "object" != typeof a)) {
    var q2 = a.position;
    return q2 == null || "object" != typeof q2 ? void 0 : Ib(q2[b]);
  }
}
function De(a, b) {
  var q2 = a.data;
  if (a == null || q2 == null) return b;
  var c = q2.hName, e2 = q2.hChildren, d2 = q2.hProperties;
  "string" == typeof c && (a = b.type, "string" == typeof a && "element" == a ? b.tagName = c : (a = b.children, Array.isArray(a) || (a = fa(b)), b = _(c, {}, a)));
  a = b.type, "string" == typeof a && "element" == a && d2 !== void 0 && d2 != null && (a = b.properties, a == null && (a = {}, b.properties = a), Lc(a, structuredClone(d2))), ya(b, "children") && b.children !== void 0 && b.children != null && e2 !== void 0 && e2 != null && (b.children = e2);
  return b;
}
function fb(a, b, q2) {
  if (a == null) return q2;
  b = a[b];
  return "string" == typeof b ? b : q2;
}
function Ee(a) {
  for (var q2 = a.length, b = 0; b < q2; b++) if (a.charCodeAt(b) <= 32) return a.slice(0, b);
  return a;
}
function Rc(a, b) {
  if (!Array.isArray(a)) return false;
  for (var q2, e2 = a.length, c = 0; c < e2; c++) {
    q2 = a[c];
    if ("string" == typeof q2 && q2 == b) return true;
  }
  return false;
}
function Fe(a, b) {
  if (!Array.isArray(a)) return -1;
  for (var c = a.length, q2 = 0; q2 < c; q2++) if (a[q2] == b) return q2;
  return -1;
}
function Ge(a, b) {
  if (!Array.isArray(a)) return -1;
  for (var c, e2 = a.length, q2 = 0; q2 < e2; q2++) {
    c = a[q2];
    if ("string" == typeof c && c == b) return q2;
  }
  return -1;
}
function Sc(a) {
  var b = a.spread;
  return b == null ? (b = a.children, a = Array.isArray(b) && b.length > 1, a) : !!b;
}
function He(a) {
  var b;
  if ("string" == typeof a.type && "list" == a.type && a.spread) return true;
  if ("string" != typeof a.type || "list" != a.type) return false;
  b = a.children;
  if (!Array.isArray(b)) return false;
  var q2 = b.length;
  for (a = 0; a < q2; a++) if (Sc(b[a])) return true;
  return false;
}
function gb(a) {
  return !Array.isArray(a) ? 0 : a.length;
}
function Ie(a, b, q2, c, e2) {
  var r2 = {};
  if (Array.isArray(q2) && e2 < gb(q2)) {
    var d2 = q2[e2];
    q2 = d2 == null, !q2 && d2 && (r2.align = d2);
  }
  d2 = _(b, r2, []);
  Array.isArray(c) && e2 < gb(c) && (b = c[e2], q2 = b == null, q2 || (d2.children = a.all(b), a.patch(b, d2), d2 = a.applyData(b, d2)));
  return d2;
}
function Je(a) {
  var b = pa(a, "referenceType");
  return "collapsed" == b ? "][]" : "full" == b ? (b = a.label, b == null ? "][" + X(a.identifier) + "]" : "][" + X(b) + "]") : "]";
}
function Tc(a, b) {
  var q2, c = Je(b);
  if ("string" == typeof b.type && "imageReference" == b.type) return fa(ma("![" + pa(b, "alt") + c));
  b = a.all(b), b.length > 0 ? (q2 = b[0], a = "string" == typeof q2.type) : a = false;
  if (a && "text" == b[0].type) a = b[0], a.value = "[" + pa(b[0], "value"), a = b;
  else {
    a = fa(ma("["));
    var e2 = b.length;
    for (q2 = 0; q2 < e2; q2++) Array.prototype.push.call(a, b[q2]);
  }
  b = a.length;
  b > 0 ? (e2 = a[b - 1], q2 = "string" == typeof e2.type) : q2 = false, q2 && "text" == a[b - 1].type ? (b = b - 1, q2 = a[b], q2.value = pa(a[b], "value") + c) : Array.prototype.push.call(a, ma(c));
  return a;
}
function Ke(a, b) {
  var q2 = b.data;
  q2 == null && (q2 = {}), q2 = ya(b, "value") && !(ya(q2, "hProperties") || ya(q2, "hChildren")) ? ma(X(b.value)) : _("div", {}, a.all(b)), a.patch(b, q2);
  return a.applyData(b, q2);
}
function Le(a, b, q2) {
  if (b == null || "object" != typeof b) {
    a = Error;
    throw new a("Cannot compile `" + X(b) + of);
  }
  var c = b.type;
  if ("string" != typeof c) throw new Error("Cannot compile unknown node");
  var d2 = a.handlers;
  if (ya(d2, c)) {
    var e2 = d2[c], r2 = e2 == null || !e2;
    if (!r2) return e2.call(d2, a, b, q2);
  }
  e2 = a.options.passThrough;
  if (Array.isArray(e2) && Rc(e2, c)) {
    if (ya(b, "children")) {
      c = {};
      for (q2 in b) "children" != q2 && ya(b, q2) && (c[q2] = structuredClone(b[q2]));
      c.children = a.all(b);
      return c;
    }
    return structuredClone(b);
  }
  c = a.options.unknownHandler;
  return "function" == typeof c ? c(a, b, q2) : Ke(a, b);
}
function Me(a, b) {
  var d2 = [];
  if (b == null || !ya(b, "children")) return d2;
  var r2 = b.children;
  if (!Array.isArray(r2)) return d2;
  for (var q2, c, j2, f2 = r2.length, e2 = 0; e2 < f2; e2++) {
    q2 = a.one(r2[e2], b), c = q2 == null || !q2;
    if (!c) {
      e2 > 0 && "string" == typeof r2[e2 - 1].type && "break" == r2[e2 - 1].type && !Array.isArray(q2) && ("string" == typeof q2.type && "text" == q2.type ? q2.value = Pc(pa(q2, "value")) : "string" == typeof q2.type && "element" == q2.type && (c = q2.children, Array.isArray(c) && c.length > 0 && "string" == typeof c[0].type && "text" == c[0].type && (j2 = c[0], j2.value = Pc(pa(c[0], "value")))));
      if (Array.isArray(q2)) for (j2 = q2.length, c = 0; c < j2; c++) Array.prototype.push.call(d2, q2[c]);
      else Array.prototype.push.call(d2, q2);
    }
  }
  return d2;
}
function Ne() {
  let a = {};
  a.paragraph = function(a2, b, q2) {
    let c = _("p", {}, a2.all(b));
    a2.patch(b, c);
    return a2.applyData(b, c);
  }, a.root = function(a2, b, q2) {
    let c = a2.wrap;
    c = { type: "root", children: a2.wrap(a2.all(b), false) }, a2.patch(b, c);
    return a2.applyData(b, c);
  }, a.text = function(a2, b, q2) {
    let c = ma(Be(X(b.value)));
    a2.patch(b, c);
    return a2.applyData(b, c);
  }, a.blockquote = function(a2, b, q2) {
    let c = a2.wrap;
    c = _("blockquote", {}, a2.wrap(a2.all(b), true)), a2.patch(b, c);
    return a2.applyData(b, c);
  }, a.break = function(a2, b, q2) {
    q2 = _("br", {}, []), a2.patch(b, q2);
    let c = [];
    Array.prototype.push.call(c, a2.applyData(b, q2)), Array.prototype.push.call(c, Ba());
    return c;
  }, a.delete = function(a2, b, q2) {
    let c = _("del", {}, a2.all(b));
    a2.patch(b, c);
    return a2.applyData(b, c);
  }, a.emphasis = function(a2, b, q2) {
    let c = _("em", {}, a2.all(b));
    a2.patch(b, c);
    return a2.applyData(b, c);
  }, a.strong = function(a2, b, q2) {
    let c = _("strong", {}, a2.all(b));
    a2.patch(b, c);
    return a2.applyData(b, c);
  }, a.thematicBreak = function(a2, b, q2) {
    let c = _("hr", {}, []);
    a2.patch(b, c);
    return a2.applyData(b, c);
  }, a.footnoteReference = function(a2, b, q2) {
    var j2 = fb(a2.options, "clobberPrefix", "user-content-"), c = X(b.identifier).toUpperCase(), f2 = Ka(c.toLowerCase()), e2 = a2.footnoteOrder;
    q2 = a2.footnoteCounts;
    var r2, g2 = Ge(e2, c), d2 = q2.get(c);
    d2 == null ? (Array.prototype.push.call(e2, c), d2 = e2.length, e2 = 0) : (e2 = d2 | 0, d2 = g2 + 1 | 0), r2 = e2 + 1 | 0, q2.set(c, r2), e2 = j2 + "fnref-" + f2, r2 > 1 && (e2 = e2 + kf + r2.toString(10)), c = {}, c.href = "#" + j2 + "fn-" + f2, c.id = e2, c.dataFootnoteRef = true, c.ariaDescribedBy = fa("footnote-label"), c = _("a", c, fa(ma(d2.toString(10)))), a2.patch(b, c), c = _("sup", {}, fa(c)), a2.patch(b, c);
    return a2.applyData(b, c);
  }, a.heading = function(a2, b, q2) {
    var c = b.depth;
    c = "number" == typeof c ? (c | 0).toString(10) : "1", c = "h" + c, c = _(c, {}, a2.all(b)), a2.patch(b, c);
    return a2.applyData(b, c);
  }, a.html = function(a2, b, q2) {
    if (a2.options.allowDangerousHtml) {
      var c = { type: "raw", value: pa(b, "value") };
      a2.patch(b, c);
      return a2.applyData(b, c);
    }
  }, a.image = function(a2, b, q2) {
    var e2 = {};
    e2.src = Ka(pa(b, "url"));
    var c = b.alt;
    q2 = c == null, q2 || (e2.alt = c), c = b.title, q2 = c == null, q2 || (e2.title = c), c = _("img", e2, []), a2.patch(b, c);
    return a2.applyData(b, c);
  }, a.link = function(a2, b, q2) {
    var e2 = {};
    e2.href = Ka(pa(b, "url"));
    var c = b.title;
    q2 = c == null, q2 || (e2.title = c), c = _("a", e2, a2.all(b)), a2.patch(b, c);
    return a2.applyData(b, c);
  }, a.linkReference = function(a2, b, q2) {
    q2 = a2.definitionById;
    var c = X(b.identifier).toUpperCase();
    c = q2.get(c);
    if (c == null) return Tc(a2, b);
    var e2 = {};
    e2.href = Ka(pa(c, "url")), q2 = c.title, c = q2 == null, c || (e2.title = q2), c = _("a", e2, a2.all(b)), a2.patch(b, c);
    return a2.applyData(b, c);
  }, a.imageReference = function(a2, b, q2) {
    q2 = a2.definitionById;
    var c = X(b.identifier).toUpperCase();
    c = q2.get(c);
    if (c == null) return Tc(a2, b);
    var e2 = {};
    e2.src = Ka(pa(c, "url")), q2 = b.alt, q2 == null || (e2.alt = q2), q2 = c.title, c = q2 == null, c || (e2.title = q2), c = _("img", e2, []), a2.patch(b, c);
    return a2.applyData(b, c);
  }, a.list = function(a2, b, q2) {
    var e2 = {}, d2 = a2.all(b), c = b.start;
    "number" == typeof c && 1 != (c | 0) && (e2.start = c);
    var r2 = d2.length;
    for (q2 = 0; q2 < r2; q2++) {
      var j2 = d2[q2];
      c = j2.properties, c !== void 0 && c != null && Rc(c.className, "task-list-item") && (e2.className = fa("contains-task-list"));
    }
    c = b.ordered ? "ol" : "ul";
    c = _(c, e2, a2.wrap(d2, true)), a2.patch(b, c);
    return a2.applyData(b, c);
  }, a.listItem = function(a2, b, q2) {
    var k2 = a2.all, d2 = a2.all(b), f2 = Sc(b), e2 = q2 == null;
    e2 || (f2 = He(q2));
    var g2 = {}, r2 = b.checked;
    if ("boolean" == typeof r2) {
      e2 = void 0;
      if (d2.length > 0) {
        var c = d2[0];
        "string" == typeof c.type && "element" == c.type && "string" == typeof c.tagName && "p" == c.tagName && (e2 = c);
      }
      if (e2 == null) {
        e2 = _("p", {}, []), q2 = fa(e2);
        var j2 = d2.length;
        for (c = 0; c < j2; c++) Array.prototype.push.call(q2, d2[c]);
      } else q2 = d2;
      d2 = e2.children;
      Array.isArray(d2) || (d2 = []), c = fa(_("input", { type: "checkbox", checked: r2, disabled: true }, [])), d2.length > 0 && Array.prototype.push.call(c, ma(mf)), j2 = d2.length, r2 = 0;
      for (; r2 < j2; r2++) Array.prototype.push.call(c, d2[r2]);
      e2.children = c, g2.className = fa("task-list-item");
    } else q2 = d2;
    for (d2 = [], r2 = q2.length, c = 0; c < r2; c++) {
      e2 = q2[c], j2 = "string" == typeof e2.type && "element" == e2.type && "string" == typeof e2.tagName && "p" == e2.tagName, (f2 || c || !j2) && Array.prototype.push.call(d2, Ba());
      if (j2 && !f2) {
        j2 = e2.children;
        var i2 = Array.isArray(j2) ? j2.length : 0;
        for (e2 = 0; e2 < i2; e2++) Array.prototype.push.call(d2, j2[e2]);
      } else Array.prototype.push.call(d2, e2);
    }
    r2 > 0 && (c = q2[r2 - 1], (f2 || !("string" == typeof c.type && "element" == c.type && "string" == typeof c.tagName && "p" == c.tagName)) && Array.prototype.push.call(d2, Ba()));
    e2 = _("li", g2, d2), a2.patch(b, e2);
    return a2.applyData(b, e2);
  }, a.inlineCode = function(a2, b, q2) {
    let c = new RegExp("\\r\\n|\\n|\\r", "g");
    c = ma(pa(b, "value").replace(c, mf)), a2.patch(b, c), c = _("code", {}, fa(c)), a2.patch(b, c);
    return a2.applyData(b, c);
  }, a.code = function(a2, b, q2) {
    var c = b.value;
    q2 = "string" == typeof c && c.length > 0 ? c + "\n" : hf;
    var e2 = {};
    c = b.lang, "string" == typeof c && c.length > 0 && (c = Ee(c), c.length > 0 && (e2.className = fa("language-" + c))), e2 = _("code", e2, fa(ma(q2))), c = b.meta, c !== void 0 && c != null && c && (e2.data = { meta: c }), a2.patch(b, e2), c = _("pre", {}, fa(a2.applyData(b, e2))), a2.patch(b, c);
    return c;
  };
  a.table = function(a2, b, q2) {
    var c = a2.all(b), d2 = [];
    if (c.length > 0) {
      var e2 = c.shift(), j2 = {};
      e2 = _("thead", j2, a2.wrap(fa(e2), true)), q2 = b.children;
      var r2;
      Array.isArray(q2) && q2.length > 0 && a2.patch(q2[0], e2), Array.prototype.push.call(d2, e2);
    }
    c.length > 0 && (r2 = _("tbody", {}, a2.wrap(c, true)), c = b.children, Array.isArray(c) && c.length > 1 && (q2 = Qc(c[1], "start"), e2 = Qc(c[c.length - 1], "end"), c = q2 == null || e2 == null, c || (r2.position = { start: q2, end: e2 })), Array.prototype.push.call(d2, r2));
    c = _("table", {}, a2.wrap(d2, true)), a2.patch(b, c);
    return a2.applyData(b, c);
  }, a.tableRow = function(a2, b, q2) {
    var e2, d2 = void 0, c = q2 == null;
    c || (e2 = q2.children, "string" == typeof q2.type && "table" == q2.type && (d2 = q2.align));
    var r2, j2 = Array.isArray(e2) && 0 == Fe(e2, b) ? "th" : "td";
    for (e2 = b.children, c = gb(e2), Array.isArray(d2) && (c = gb(d2)), r2 = [], q2 = 0; q2 < c; q2++) Array.prototype.push.call(r2, Ie(a2, j2, d2, e2, q2));
    c = _("tr", {}, a2.wrap(r2, true)), a2.patch(b, c);
    return a2.applyData(b, c);
  }, a.tableCell = function(a2, b, q2) {
    let c = _("td", {}, a2.all(b));
    a2.patch(b, c);
    return a2.applyData(b, c);
  }, a.definition = function(a2, b, q2) {
  }, a.yaml = function(a2, b, q2) {
  }, a.toml = function(a2, b, q2) {
  }, a.footnoteDefinition = function(a2, b, q2) {
  };
  return a;
}
function Uc(a, b, q2) {
  if (!(a == null || "object" != typeof a)) {
    var e2, c = a.type;
    "string" == typeof c && ("definition" == c || "footnoteDefinition" == c) && (e2 = X(a.identifier).toUpperCase(), c = "footnoteDefinition" == c ? q2 : b, c.has(e2) || c.set(e2, a));
    c = a.children;
    if (!!Array.isArray(c)) for (e2 = c.length, a = 0; a < e2; a++) Uc(c[a], b, q2);
  }
}
function Oe(a, b) {
  b == null && (b = {});
  var q2 = {};
  q2.options = b, q2.definitionById = /* @__PURE__ */ new Map(), q2.footnoteById = /* @__PURE__ */ new Map(), q2.footnoteCounts = /* @__PURE__ */ new Map(), q2.footnoteOrder = [], Uc(a, q2.definitionById, q2.footnoteById), q2.handlers = Ne(), a = b.handlers;
  if (a !== void 0 && a != null && "object" == typeof a) for (b in a) ya(a, b) && (q2.handlers[b] = a[b]);
  q2.patch = function(a2, b2) {
    var q3 = Ce(a2);
    a2 = q3 == null, a2 || (b2.position = q3);
  }, q2.applyData = function(a2, b2) {
    return De(a2, b2);
  }, q2.wrap = function(a2, b2) {
    b2 = !!b2;
    var q3 = [];
    b2 && Array.prototype.push.call(q3, Ba());
    for (var e2 = a2.length, c = 0; c < e2; c++) c > 0 && Array.prototype.push.call(q3, Ba()), Array.prototype.push.call(q3, a2[c]);
    b2 && e2 > 0 && Array.prototype.push.call(q3, Ba());
    return q3;
  }, q2.all = function(a2) {
    return Me(this, a2);
  }, q2.one = function(a2, b2) {
    return Le(this, a2, b2);
  };
  return q2;
}
function Pe(a, b, q2) {
  "string" == typeof a || (a = a(b, q2));
  return "string" == typeof a ? fa(ma(a)) : Array.isArray(a) ? a : fa(a);
}
function Qe(a, b, q2) {
  return "string" == typeof a ? a : X(a(b, q2));
}
function Re(a) {
  var c, i2, A2, u2, f2, h2, n2, p2, d2, q2, r2, e2, j2, k2, g2, b = a.options, l2 = fb(b, "clobberPrefix", "user-content-"), K = b.footnoteBackContent;
  K == null && (K = function(a2, b2) {
    var q3 = fa(ma("\u21A9"));
    a2 = +b2, a2 > 1 && Array.prototype.push.call(q3, _("sup", {}, fa(ma(X(a2)))));
    return q3;
  }), i2 = b.footnoteBackLabel, i2 == null && (i2 = function(a2, b2) {
    var q3 = +a2;
    a2 = +b2, q3 = "Back to reference " + X(q3 + 1), a2 > 1 && (q3 = q3 + kf + X(a2));
    return q3;
  }), A2 = fb(b, "footnoteLabel", "Footnotes"), u2 = fb(b, "footnoteLabelTagName", "h2"), c = b.footnoteLabelProperties, c == null ? (f2 = {}, f2.className = fa("sr-only")) : f2 = structuredClone(c), f2.id = "footnote-label", k2 = [], h2 = a.footnoteOrder, n2 = h2.length, j2 = 0;
  for (; j2 < n2; ) {
    b = h2[j2], "string" == typeof b || (b = hf), c = a.footnoteById, g2 = c.get(b);
    if (g2 == null) j2++;
    else {
      for (c = a.all(g2), p2 = Ka(X(g2.identifier).toUpperCase().toLowerCase()), d2 = a.footnoteCounts, b = d2.get(b), q2 = b == null, r2 = !q2 ? b | 0 : 0, d2 = [], b = 1; b <= r2; b++) d2.length > 0 && Array.prototype.push.call(d2, ma(mf)), e2 = "#" + l2 + "fnref-" + p2, b > 1 && (e2 = e2 + kf + b.toString(10)), q2 = {}, q2.href = e2, q2.dataFootnoteBackref = hf, q2.ariaLabel = Qe(i2, j2, b), q2.className = fa("data-footnote-backref"), Array.prototype.push.call(d2, _("a", q2, Pe(K, j2, b)));
      q2 = c.length, q2 > 0 ? (r2 = c[q2 - 1], b = "string" == typeof r2.type) : b = false;
      if (b && "element" == c[q2 - 1].type && "string" == typeof c[q2 - 1].tagName && "p" == c[q2 - 1].tagName) for (r2 = c[q2 - 1], b = r2.children, Array.isArray(b) || (b = [], q2 = c[q2 - 1], q2.children = b), q2 = b.length, q2 > 0 ? (r2 = b[q2 - 1], e2 = "string" == typeof r2.type) : e2 = false, e2 && "text" == b[q2 - 1].type ? (q2 = q2 - 1, e2 = b[q2], e2.value = pa(b[q2], "value") + mf) : Array.prototype.push.call(b, ma(mf)), e2 = d2.length, q2 = 0; q2 < e2; q2++) Array.prototype.push.call(b, d2[q2]);
      else for (q2 = d2.length, b = 0; b < q2; b++) Array.prototype.push.call(c, d2[b]);
      b = { id: l2 + "fn-" + p2 }, b = _("li", b, a.wrap(c, true)), a.patch(g2, b), Array.prototype.push.call(k2, b), j2++;
    }
  }
  if (0 != k2.length) return b = [], Array.prototype.push.call(b, _(u2, f2, fa(ma(A2)))), Array.prototype.push.call(b, Ba()), Array.prototype.push.call(b, _("ol", {}, a.wrap(k2, true))), Array.prototype.push.call(b, Ba()), _("section", { dataFootnotes: true, className: fa("footnotes") }, b);
}
function Vc(a, b) {
  b = Oe(a, b), a = b.one(a, void 0), Array.isArray(a) ? a = { type: "root", children: a } : a == null && (a = { type: "root", children: [] });
  var q2 = Re(b);
  b = q2 == null, b || (b = a.children, Array.isArray(b) || (b = [], a.children = b), Array.prototype.push.call(b, Ba()), Array.prototype.push.call(b, q2));
  return a;
}
function Wc(a, b) {
  var q2 = {}, c = a == null;
  c || (q2.file = a), Lc(q2, b);
  return q2;
}
function Se(a) {
  return a == null ? false : "function" == typeof a.run;
}
var Jb;
var Te;
(function() {
  function a(a2) {
    for (var c2, q2 = hf, b2 = 0; b2 < a2.length; b2++) c2 = a2.charCodeAt(b2), q2 = c2 >= 65 && c2 <= 90 ? q2 + kf + a2.charAt(b2).toLowerCase() : q2 + a2.charAt(b2);
    return q2;
  }
  function b() {
    ic || (ic = true, Kb(hf, "ariaActiveDescendant|@\nariaAtomic|@\nariaAutoComplete|@\nariaBusy|@\nariaChecked|@\nariaColCount|@\nariaColIndex|@\nariaColSpan|@\nariaControls|@\nariaCurrent|@\nariaDescribedBy|@\nariaDetails|@\nariaDisabled|@\nariaDropEffect|@\nariaErrorMessage|@\nariaExpanded|@\nariaFlowTo|@\nariaGrabbed|@\nariaHasPopup|@\nariaHidden|@\nariaInvalid|@\nariaKeyShortcuts|@\nariaLabel|@\nariaLabelledBy|@\nariaLevel|@\nariaLive|@\nariaModal|@\nariaMultiLine|@\nariaMultiSelectable|@\nariaOrientation|@\nariaOwns|@\nariaPlaceholder|@\nariaPosInSet|@\nariaPressed|@\nariaReadOnly|@\nariaRelevant|@\nariaRequired|@\nariaRoleDescription|@\nariaRowCount|@\nariaRowIndex|@\nariaRowSpan|@\nariaSelected|@\nariaSetSize|@\nariaSort|@\nariaValueMax|@\nariaValueMin|@\nariaValueNow|@\nariaValueText|@\nrole\nclassName|class|s\ncontent||s\ncrossOrigin|~|s\ndownload||s\nheight||s\nhref||s\nhrefLang|~|s\nid||s\nlang||s\nmax||s\nmedia||s\nmethod||s\nmin||s\nname||s\nonAbort|~|s\nonAfterPrint|~|s\nonBeforePrint|~|s\nonCancel|~|s\nonCanPlay|~|s\nonCanPlayThrough|~|s\nonChange|~|s\nonClick|~|s\nonClose|~|s\nonCopy|~|s\nonCueChange|~|s\nonCut|~|s\nonDblClick|~|s\nonDrag|~|s\nonDragEnd|~|s\nonDragEnter|~|s\nonDragExit|~|s\nonDragLeave|~|s\nonDragOver|~|s\nonDragStart|~|s\nonDrop|~|s\nonDurationChange|~|s\nonEmptied|~|s\nonEnded|~|s\nonError|~|s\nonFocus|~|s\nonHashChange|~|s\nonInput|~|s\nonInvalid|~|s\nonKeyDown|~|s\nonKeyPress|~|s\nonKeyUp|~|s\nonLoad|~|s\nonLoadedData|~|s\nonLoadedMetadata|~|s\nonLoadStart|~|s\nonMessage|~|s\nonMouseDown|~|s\nonMouseEnter|~|s\nonMouseLeave|~|s\nonMouseMove|~|s\nonMouseOut|~|s\nonMouseOver|~|s\nonMouseUp|~|s\nonOffline|~|s\nonOnline|~|s\nonPageHide|~|s\nonPageShow|~|s\nonPaste|~|s\nonPause|~|s\nonPlay|~|s\nonPlaying|~|s\nonPopState|~|s\nonProgress|~|s\nonRateChange|~|s\nonReset|~|s\nonResize|~|s\nonScroll|~|s\nonSeeked|~|s\nonSeeking|~|s\nonSelect|~|s\nonStalled|~|s\nonStorage|~|s\nonSubmit|~|s\nonSuspend|~|s\nonTimeUpdate|~|s\nonToggle|~|s\nonUnload|~|s\nonVolumeChange|~|s\nonWaiting|~|s\nping||s\nreferrerPolicy|~|s\nrel||s\nstyle||s\ntabIndex|~|s\ntarget||s\ntitle||s\ntype||s\nwidth||s\ncolor||s\nevent||s\nrev||s\nversion||s\nproperty||s\nxLinkActuate|xlink:actuate|s\nxLinkArcRole|xlink:arcrole|s\nxLinkHref|xlink:href|s\nxLinkRole|xlink:role|s\nxLinkShow|xlink:show|s\nxLinkTitle|xlink:title|s\nxLinkType|xlink:type|s\nxmlnsXLink|xmlns:xlink|s\nxmlns||s\nxmlBase|xml:base|s\nxmlLang|xml:lang|s\nxmlSpace|xml:space|s"), Kb("html", "abbr\naccept||c\nacceptCharset|-\naccessKey|~\naction\nallow\nallowFullScreen|~\nallowPaymentRequest|~\nallowUserMedia|~\nalpha\nalt\nas\nasync\nautoCapitalize|~\nautoComplete|~\nautoFocus|~\nautoPlay|~\nblocking\ncapture\ncharSet|~\nchecked\ncite\nclosedBy|~\ncolorSpace|~\ncols\ncolSpan|~\ncommand\ncommandFor|~\ncontentEditable|~\ncontrols\ncontrolsList|~\ncoords||c\ndata\ndateTime|~\ndecoding\ndefault\ndefer\ndir\ndirName|~\ndisabled\ndraggable\nencType|~\nenterKeyHint|~\nfetchPriority|~\nform\nformAction|~\nformEncType|~\nformMethod|~\nformNoValidate|~\nformTarget|~\nheaders\nhidden\nhigh\nhtmlFor|for\nhttpEquiv|-\nimageSizes|~\nimageSrcSet|~\ninert\ninputMode|~\nintegrity\nis\nisMap|~\nitemId|~\nitemProp|~\nitemRef|~\nitemScope|~\nitemType|~\nkind\nlabel\nlanguage\nlist\nloading\nloop\nlow\nmanifest\nmaxLength|~\nminLength|~\nmultiple\nmuted\nnonce\nnoModule|~\nnoValidate|~\nonAuxClick|~\nonBeforeMatch|~\nonBeforeToggle|~\nonBeforeUnload|~\nonBlur|~\nonContextLost|~\nonContextMenu|~\nonContextRestored|~\nonFormData|~\nonLanguageChange|~\nonLoadEnd|~\nonMessageError|~\nonRejectionHandled|~\nonScrollEnd|~\nonSecurityPolicyViolation|~\nonSlotChange|~\nonUnhandledRejection|~\nonWheel|~\nopen\noptimum\npattern\nplaceholder\nplaysInline|~\npopover\npopoverTarget|~\npopoverTargetAction|~\nposter\npreload\nreadOnly|~\nrequired\nreversed\nrows\nrowSpan|~\nsandbox\nscope\nscoped\nseamless\nselected\nshadowRootClonable|~\nshadowRootCustomElementRegistry|~\nshadowRootDelegatesFocus|~\nshadowRootMode|~\nshadowRootSerializable|~\nshape\nsize\nsizes\nslot\nspan\nspellCheck|~\nsrc\nsrcDoc|~\nsrcLang|~\nsrcSet|~\nstart\nstep\ntranslate\ntypeMustMatch|~\nuseMap|~\nvalue\nwrap\nwritingSuggestions|~\nalign\naLink|~\narchive\naxis\nbackground\nbgColor|~\nborder\nborderColor|~\nbottomMargin|~\ncellPadding|~\ncellSpacing|~\nchar\ncharOff|~\nclassId|~\nclear\ncode\ncodeBase|~\ncodeType|~\ncompact\ndeclare\nface\nframe\nframeBorder|~\nhSpace|~\nleftMargin|~\nlink\nlongDesc|~\nlowSrc|~\nmarginHeight|~\nmarginWidth|~\nnoResize|~\nnoHref|~\nnoShade|~\nnoWrap|~\nobject\nprofile\nprompt\nrightMargin|~\nrules\nscheme\nscrolling\nstandby\nsummary\ntext\ntopMargin|~\nvalueType|~\nvAlign|~\nvLink|~\nvSpace|~\nallowTransparency|~\nautoCorrect|~\nautoSave|~\ncredentialless\ndisablePictureInPicture|~\ndisableRemotePlayback|~\nexportParts|~|c\npart\nprefix\nresults\nsecurity\nunselectable"), Kb("svg", "about\naccentHeight|-\naccumulate\nadditive\nalignmentBaseline|-\nalphabetic\namplitude\narabicForm|-\nascent\nattributeName\nattributeType\nazimuth\nbandwidth\nbaselineShift|-\nbaseFrequency\nbaseProfile\nbbox\nbegin\nbias\nby\ncalcMode\ncapHeight|-\nclip\nclipPath|-\nclipPathUnits\nclipRule|-\ncolorInterpolation|-\ncolorInterpolationFilters|-\ncolorProfile|-\ncolorRendering|-\ncontentScriptType\ncontentStyleType\ncursor\ncx\ncy\nd\ndataType|~\ndefaultAction\ndescent\ndiffuseConstant\ndirection\ndisplay\ndur\ndivisor\ndominantBaseline|-\ndx\ndy\nedgeMode\neditable\nelevation\nenableBackground|-\nend\nexponent\nexternalResourcesRequired\nfill\nfillOpacity|-\nfillRule|-\nfilter\nfilterRes\nfilterUnits\nfloodColor|-\nfloodOpacity|-\nfocusable\nfocusHighlight\nfontFamily|-\nfontSize|-\nfontSizeAdjust|-\nfontStretch|-\nfontStyle|-\nfontVariant|-\nfontWeight|-\nformat\nfr\nfrom\nfx\nfy\ng1||c\ng2||c\nglyphName|-|c\nglyphOrientationHorizontal|-\nglyphOrientationVertical|-\nglyphRef\ngradientTransform\ngradientUnits\nhandler\nhanging\nhatchContentUnits\nhatchUnits\nhorizAdvX|-\nhorizOriginX|-\nhorizOriginY|-\nideographic\nimageRendering|-\ninitialVisibility\nin\nin2\nintercept\nk\nk1\nk2\nk3\nk4\nkernelMatrix\nkernelUnitLength\nkeyPoints\nkeySplines\nkeyTimes\nkerning\nlengthAdjust\nletterSpacing|-\nlightingColor|-\nlimitingConeAngle\nlocal\nmarkerEnd|-\nmarkerMid|-\nmarkerStart|-\nmarkerHeight\nmarkerUnits\nmarkerWidth\nmask\nmaskContentUnits\nmaskType|-\nmaskUnits\nmathematical\nmediaCharacterEncoding\nmediaContentEncodings\nmediaSize\nmediaTime\nmode\nnavDown|-\nnavDownLeft|-\nnavDownRight|-\nnavLeft|-\nnavNext|-\nnavPrev|-\nnavRight|-\nnavUp|-\nnavUpLeft|-\nnavUpRight|-\nnumOctaves\nobserver\noffset\nonActivate|~\nonBegin|~\nonEnd|~\nonFocusIn|~\nonFocusOut|~\nonMouseWheel|~\nonRepeat|~\nonShow|~\nonZoom|~\nopacity\noperator\norder\norient\norientation\norigin\noverflow\noverlay\noverlinePosition|-\noverlineThickness|-\npaintOrder|-\npanose1|panose-1\npath\npathLength\npatternContentUnits\npatternTransform\npatternUnits\nphase\npitch\nplaybackOrder|~\npointerEvents|-\npoints\npointsAtX\npointsAtY\npointsAtZ\npreserveAlpha\npreserveAspectRatio\nprimitiveUnits\npropagate\nr\nradius\nrefX\nrefY\nrenderingIntent|-\nrepeatCount\nrepeatDur\nrequiredExtensions\nrequiredFeatures\nrequiredFonts\nrequiredFormats\nresource\nrestart\nresult\nrotate\nrx\nry\nscale\nseed\nshapeRendering|-\nside\nslope\nsnapshotTime\nspecularConstant\nspecularExponent\nspreadMethod\nspacing\nstartOffset\nstdDeviation\nstemh\nstemv\nstitchTiles\nstopColor|-\nstopOpacity|-\nstrikethroughPosition|-\nstrikethroughThickness|-\nstring\nstroke\nstrokeDashArray|stroke-dasharray\nstrokeDashOffset|stroke-dashoffset\nstrokeLineCap|stroke-linecap\nstrokeLineJoin|stroke-linejoin\nstrokeMiterLimit|stroke-miterlimit\nstrokeOpacity|-\nstrokeWidth|-\nsurfaceScale\nsyncBehavior\nsyncBehaviorDefault\nsyncMaster\nsyncTolerance\nsyncToleranceDefault\nsystemLanguage\ntableValues\ntargetX\ntargetY\ntextAnchor|-\ntextDecoration|-\ntextRendering|-\ntextLength\ntimelineBegin|~\ntransformBehavior\ntypeOf|~\nto\ntransform\ntransformOrigin|-\nu1\nu2\nunderlinePosition|-\nunderlineThickness|-\nunicode\nunicodeBidi|-\nunicodeRange|-\nunitsPerEm|-\nvalues\nvAlphabetic|-\nvMathematical|-\nvectorEffect|-\nvHanging|-\nvIdeographic|-\nvertAdvY|-\nvertOriginX|-\nvertOriginY|-\nviewBox\nviewTarget\nvisibility\nwidths\nwordSpacing|-\nwritingMode|-\nx\nx1\nx2\nxChannelSelector\nxHeight|-\ny\ny1\ny2\nyChannelSelector\nz\nzoomAndPan"));
  }
  function c(a2) {
    for (var q2, c2 = hf, b2 = 0; b2 < a2.length; ) {
      if (a2.charAt(b2) == kf && b2 + 1 < a2.length) {
        q2 = a2.charCodeAt(b2 + 1);
        if (q2 >= 97 && q2 <= pf) {
          c2 += a2.charAt(b2 + 1).toUpperCase(), b2 = b2 + 2 | 0;
          continue;
        }
      }
      c2 += a2.charAt(b2);
      b2++;
    }
    return c2;
  }
  function d2(a2) {
    if (a2.length < 5 || "data" != a2.slice(0, 4).toLowerCase()) return false;
    for (var b2, q2 = 4; q2 < a2.length; q2++) {
      b2 = a2.charCodeAt(q2), b2 = 45 == b2 || 46 == b2 || 58 == b2 || 95 == b2 || b2 >= 48 && b2 <= 57 || b2 >= 65 && b2 <= 90 || b2 >= 97 && b2 <= pf;
      if (!b2) return false;
    }
    return true;
  }
  Jb = function(b2, q2, c2, e2, d3) {
    "~" == c2 && (c2 = q2.toLowerCase());
    "@" == c2 && (c2 = "aria-" + q2.slice(4).toLowerCase());
    c2 == kf && (c2 = a(q2)), 0 == c2.length && (c2 = q2), e2 = { property: q2, attribute: c2, spaceSeparated: d3, commaSeparated: e2.indexOf("c") >= 0 }, b2 += "|", pb.set(b2 + q2.toLowerCase(), e2), pb.set(b2 + c2.toLowerCase(), e2);
  };
  Te = function(q2, e2) {
    b();
    var r2 = e2.toLowerCase();
    if (q2 = pb.get(q2 + "|" + r2)) return q2;
    r2.length > 4 && "data" == r2.slice(0, 4) && d2(e2) ? e2.charAt(4) == kf ? (q2 = c(e2.slice(5)), q2 = q2.length > 0 ? "data" + q2.charAt(0).toUpperCase() + q2.slice(1) : "data", r2 = e2, e2 = q2, q2 = r2) : (q2 = e2.slice(4), q2.indexOf(kf) < 0 ? (q2 = a(q2), (0 == q2.length || q2.charAt(0) != kf) && (q2 = kf + q2), q2 = "data" + q2) : q2 = e2) : q2 = e2;
    return { property: e2, attribute: q2, spaceSeparated: false, commaSeparated: false };
  };
})();
function Kb(a, b) {
  for (var q2, e2, r2, c = 0, d2 = 0; d2 <= b.length; d2++) (d2 == b.length || "\n" == b.charAt(d2)) && (c = b.slice(c, d2), q2 = c.indexOf("|"), e2 = c.indexOf("|", q2 + 1 | 0), q2 >= 0 ? (r2 = c.slice(0, q2), e2 > q2 ? (q2 = c.slice(q2 + 1 | 0, e2), e2 = c.slice(e2 + 1 | 0)) : (q2 = c.slice(q2 + 1 | 0), e2 = hf), c = r2) : (q2 = hf, e2 = hf), 0 == a.length ? (r2 = e2.indexOf("s") >= 0, Jb("html", c, q2, e2, r2), Jb("svg", c, q2, e2, r2)) : Jb(a, c, q2, e2, true), c = d2 + 1 | 0);
}
function Ue(a) {
  var b = ja.get(a);
  return null != b ? b : a;
}
function Lb(a) {
  return 9 == a || 10 == a || 12 == a || 13 == a || 32 == a;
}
function Xc(a) {
  for (var b = a.length, q2 = 0; q2 < b && Lb(a.charCodeAt(q2)); ) q2++;
  for (; b > q2 && Lb(a.charCodeAt(b - 1)); ) b--;
  return a.slice(q2, b);
}
function Ua(a, b) {
  for (var q2 = a.length; b < q2 && Lb(a.charCodeAt(b)); ) b++;
  return b;
}
var Mb;
var Xe;
(function() {
  function a(a2) {
    return 42 == a2 || 45 == a2 || 35 == a2 || 47 == a2 || 92 == a2 || 95 == a2 || a2 >= 48 && a2 <= 57 || a2 >= 65 && a2 <= 90 || a2 >= 97 && a2 <= pf;
  }
  function b(a2, b2) {
    let q2 = new Error("undefined:1:" + a2 + ": " + b2);
    q2.reason = b2, q2.filename = "undefined", q2.line = 1, q2.column = a2;
    throw q2;
  }
  function c(a2) {
    for (var q2 = hf, b2 = 0; b2 < a2.length; ) b2 + 1 < a2.length && a2.charAt(b2) == jf && "*" == a2.charAt(b2 + 1) ? b2 = Mb(a2, b2) : (q2 = q2 + a2.charAt(b2), b2++);
    return q2;
  }
  function d2(a2) {
    if (0 == a2.length || !(a2.indexOf(kf) >= 0) || Ve(a2)) return a2;
    a2 = a2.toLowerCase(), "-ms-" == a2.slice(0, 4) && (a2 = "ms-" + a2.slice(4));
    return We(a2);
  }
  function e2(a2, b2, q2) {
    b2 = Xc(c(b2));
    var e3 = Xc(c(q2));
    b2.length > 0 && e3.length > 0 && (a2[d2(b2)] = e3);
  }
  Mb = function(a2, q2) {
    if (q2 + 1 >= a2.length || a2.charAt(q2) != jf || "*" != a2.charAt(q2 + 1)) return q2;
    for (var c2 = q2 + 2 | 0; (c2 + 1 | 0) < a2.length && !("*" == a2.charAt(c2) && a2.charAt(c2 + 1) == jf); ) c2++;
    (c2 + 1 | 0) >= a2.length && b(q2 + 1, "End of comment missing");
    return c2 + 2 | 0;
  };
  Xe = function(q2) {
    var g2 = {};
    if (0 == q2.length) return g2;
    for (var d3, f2, i2, k2, j2, r2 = q2.length, c2 = 0; c2 < r2; ) {
      for (c2 = Ua(q2, c2); (c2 + 1 | 0) < r2 && q2.charAt(c2) == jf && "*" == q2.charAt(c2 + 1); ) c2 = Ua(q2, Mb(q2, c2));
      if (c2 >= r2) break;
      for (d3 = "*" == q2.charAt(c2) ? c2 + 1 | 0 : c2; d3 < r2 && a(q2.charCodeAt(d3)); ) d3++;
      if (d3 == c2 || d3 == (c2 + 1 | 0) && "*" == q2.charAt(c2)) break;
      for (i2 = q2.slice(c2, d3), c2 = Ua(q2, d3), (c2 + 1 | 0) < r2 && q2.charAt(c2) == jf && "*" == q2.charAt(c2 + 1) && (c2 = Ua(q2, Mb(q2, c2))), (c2 >= r2 || ":" != q2.charAt(c2)) && b(c2 + 1 | 0, "property missing ':'"), c2 = k2 = Ua(q2, c2 + 1 | 0), j2 = hf, f2 = 0; c2 < r2; ) {
        d3 = q2.charAt(c2);
        if (j2.length > 0) {
          if ("\\" == d3) {
            c2 = c2 + 2 | 0;
            continue;
          }
          d3 = d3 == j2 ? hf : j2;
        } else if (!("'" == d3 || '"' == d3)) {
          if ("(" == d3) f2++;
          else if (")" == d3 && f2 > 0) f2--;
          else {
            if (";" == d3 && 0 == f2 || "}" == d3) break;
          }
          d3 = j2;
        }
        c2++;
        j2 = d3;
      }
      e2(g2, i2, q2.slice(k2, c2));
      if (c2 < r2 && "}" == q2.charAt(c2)) break;
      c2 < r2 && ";" == q2.charAt(c2) && (c2 = c2 + 1 | 0);
    }
    return g2;
  };
})();
function Ve(a) {
  if (a.length < 3 || "--" != a.slice(0, 2)) return false;
  for (var b, q2 = 2; q2 < a.length; q2++) {
    b = a.charCodeAt(q2), b = 45 == b || 95 == b || b >= 48 && b <= 57 || b >= 65 && b <= 90 || b >= 97 && b <= pf;
    if (!b) return false;
  }
  return true;
}
function We(a) {
  for (var q2, c = hf, b = 0; b < a.length; ) {
    if (b + 1 < a.length && a.charAt(b) == kf) {
      q2 = a.charCodeAt(b + 1);
      if (q2 >= 97 && q2 <= pf) {
        c += a.charAt(b + 1).toUpperCase(), b = b + 2 | 0;
        continue;
      }
    }
    c += a.charAt(b);
    b++;
  }
  return c;
}
function Ye(a, b) {
  b = b ? ", " : mf;
  return a.join(b).trim();
}
function Nb(a, b) {
  var q2 = b.length;
  if (q2 > 0) {
    var c = b[0];
    q2 > 1 || (b = c), b && (a.children = b);
  }
}
function Va(a, b) {
  b = ee("Cannot handle MDX estrees without `createEvaluater`", { ancestors: a[1], place: b, ruleId: "mdx-estree", source: "hast-util-to-jsx-runtime" }), b.file = void 0, b.url = "https://github.com/syntax-tree/hast-util-to-jsx-runtime#cannot-handle-mdx-estrees-without-createevaluater";
  throw b;
}
function Ze(a, b) {
  for (var c, q2, d2 = {}, r2 = b.attributes, e2 = 0; e2 < r2.length; e2++) c = r2[e2], "mdxJsxExpressionAttribute" === c.type ? Va(a, b.position) : (q2 = c.value, q2 && "object" == typeof q2 ? Va(a, b.position) : q2 === null && (q2 = true), d2[c.name + ""] = q2);
  return d2;
}
function Ob(a, b) {
  for (var c, e2, q2, r2 = [], j2 = b.children, f2 = /* @__PURE__ */ new Map(), d2 = 0; d2 < j2.length; d2++) c = j2[d2], e2 = void 0, q2 = c.type, b = void 0, "element" === q2 ? b = c.tagName : ("mdxJsxFlowElement" === q2 || "mdxJsxTextElement" === q2) && (b = c.name), b && (b = b + "", e2 = f2.get(b), q2 = e2 ?? 0, e2 = b + kf + q2, f2.set(b, q2 + 1 | 0)), b = Yc(a, c, e2), b === void 0 || Array.prototype.push.call(r2, b);
  return r2;
}
var _e;
var af;
(function() {
  function f2(a) {
    return "table" == a || "tbody" == a || "thead" == a || "tfoot" == a || "tr" == a;
  }
  function g2(a) {
    return "td" == a || "th" == a;
  }
  function h2(a) {
    for (var b, q2 = 0; q2 < a.length; q2++) {
      b = a.charCodeAt(q2);
      if (9 != b && 10 != b && 12 != b && 13 != b && 32 != b) return false;
    }
    return true;
  }
  function i2(a, b, q2, c) {
    "string" != typeof q2 && q2 !== a[0] && (b.node = c);
  }
  function j2(a, b, q2) {
    if (!q2 || b.indexOf(nf) < 0 && (!Xd.test(b) || b.charCodeAt(0) >= 97 && b.charCodeAt(0) <= pf)) return q2 = a[2], Wa.call(q2, b) ? q2[b] : b;
    Va(a, void 0);
  }
  function k2(a) {
    try {
      return Xe(a);
    } catch {
      return {};
    }
  }
  function l2(a, b, q2) {
    var e2 = a[4], c = Te(e2, b);
    if (q2 == null || "number" == typeof q2 && Number.isNaN(q2)) return null;
    Array.isArray(q2) && (q2 = Ye(q2, c.commaSeparated));
    if ("style" == c.property) return "object" != typeof q2 && (q2 = k2(q2 + "")), { key: "style", value: q2 };
    a = c.attribute, c.spaceSeparated && (a = Ue(c.property));
    return { key: a, value: q2 };
  }
  function m2(a, b) {
    var q2, e2, r2, d2 = {}, j3 = b.tagName + "", f3 = b.properties, c = void 0;
    for (q2 in f3) "children" != q2 && Wa.call(b.properties, q2) ? (e2 = l2(a, q2, b.properties[q2]), e2 ? (r2 = e2.key, q2 = e2.value, "align" === r2 && "string" == typeof q2 && g2(j3) || (d2[r2] = q2, q2 = c)) : q2 = c) : q2 = c, c = q2;
    c && (a = d2.style, a || (a = {}, d2.style = a), a.textAlign = c);
    return d2;
  }
  _e = function(a, b, q2) {
    var e2, g3 = a[4], c = b.tagName + "";
    "svg" == c.toLowerCase() && "html" == g3 && (a[4] = "svg");
    a[1].push(b);
    var k3 = j2(a, c, false), d2 = m2(a, b);
    e2 = Ob(a, b);
    if (f2(c)) {
      for (var p2 = [], r2 = 0; r2 < e2.length; r2++) c = e2[r2], ("string" != typeof c || !h2(c + "")) && Array.prototype.push.call(p2, c);
      e2 = p2;
    }
    i2(a, d2, k3, b);
    Nb(d2, e2), a[1].pop(), a[4] = g3;
    return a[3](b, k3, d2, q2);
  };
  af = function(a, b, q2) {
    var e2, d2 = a[4], c = b.name;
    "svg" === c && "html" == d2 && (a[4] = "svg");
    a[1].push(b), e2 = a[0], c == null || (e2 = j2(a, c + "", true)), c = Ze(a, b), i2(a, c, e2, b), Nb(c, Ob(a, b)), a[1].pop(), a[4] = d2;
    return a[3](b, e2, c, q2);
  };
})();
function $e(a, b, q2) {
  let c = {};
  Nb(c, Ob(a, b));
  return a[3](b, a[0], c, q2);
}
function Yc(a, b, q2) {
  var c = b.type;
  if ("element" === c) return _e(a, b, q2);
  if ("mdxFlowExpression" === c || "mdxTextExpression" === c) {
    Va(a, b.position);
    return;
  }
  if ("mdxJsxFlowElement" === c || "mdxJsxTextElement" === c) return af(a, b, q2);
  if ("mdxjsEsm" === c) {
    Va(a, b.position);
    return;
  }
  if ("root" === c) return $e(a, b, q2);
  if ("text" === c) return b.value;
}
function bf(a) {
  return Array.isArray(a) ? a : "number" == typeof a ? [true, a] : a == null ? Yd : [a];
}
function Zc(a, b, q2) {
  var c, e2 = void 0, d2 = q2.length;
  d2 > 0 && (c = q2[d2 - 1], e2 = c.children.indexOf(a)), c = bf(b(a, e2, c)), e2 = c[0];
  if (false === e2) return c;
  if ("children" in a && a.children && "skip" !== c[0]) {
    e2 = a.children, d2 = q2.slice(), d2.push(a), a = 0;
    while (a < e2.length) {
      q2 = Zc(e2[a], b, d2);
      var r2 = q2[0];
      if (false === r2) return q2;
      a = q2.length > 1 && "number" == typeof q2[1] ? +q2[1] | 0 : a + 1;
    }
  }
  return c;
}
function Pb(a) {
  var b = +a.indexOf(":"), q2 = +a.indexOf("?"), c = +a.indexOf("#"), e2 = +a.indexOf(jf);
  return b == -1 ? a : e2 != -1 && b > e2 ? a : q2 != -1 && b > q2 ? a : c != -1 && b > c ? a : Zd.test(a.slice(0, b)) ? a : hf;
}
function Qb(a) {
  var b = a.children;
  b = b || hf, a = new Wd();
  if ("string" == typeof b) return a.value = b, a;
  _d("Unexpected value `" + b + "` for `children` prop, expected `string`");
  return a;
}
function cf(a) {
  for (var b, q2, e2, d2 = mc.length, c = 0; c < d2; c++) b = mc[c], q2 = b[0], !Wa.call(a, q2) || (e2 = b[2].length > 0 ? "use `" + b[2] + "` instead" : "remove it", _d("Unexpected `" + q2 + "` prop, " + e2 + " (see <https://github.com/remarkjs/react-markdown/blob/main/changelog.md#" + b[1] + "> for more info)"));
}
var _c;
var $c;
var ad;
(function() {
  function a(a2, b2) {
    if (b2 != null) {
      b2 = Object(b2);
      for (var q3, e2 = Reflect.ownKeys(b2), d2 = e2.length, c = 0; c < d2; c++) q3 = e2[c], !bd.call(b2, q3) || Reflect.defineProperty(a2, q3, { configurable: true, enumerable: true, value: Reflect.get(b2, q3), writable: true });
    }
  }
  function b(b2) {
    var e2 = b2.rehypePlugins;
    e2 = e2 || kc;
    var c = b2.remarkPlugins;
    c = c || kc;
    var q3 = lc;
    !b2.remarkRehypeOptions || (q3 = {}, a(q3, b2.remarkRehypeOptions), a(q3, lc)), b2 = pd();
    var d2 = b2.use(Ud);
    c = d2.use(c), q3 = c.use(Vd, q3);
    return q3.use(e2);
  }
  var q2 = /* @__PURE__ */ (function() {
    function a2(a3, b3, q3, c, e2) {
      var d2 = function(a4, b4, q4, d3) {
        var r3, j2 = Array.isArray(q4.children) ? e2 : c;
        r3 = void 0;
        return (r3 = d3) ? j2(b4, q4, r3) : j2(b4, q4);
      };
      q3 = q3 || {}, q3 = [b3, [], q3, d2, "html"], b3 = Yc(q3, a3, void 0);
      var r2;
      if (b3 && "string" != typeof b3) return b3;
      r2 = void 0, b3 = b3 || r2;
      return d2(a3, q3[0], { children: b3 }, void 0);
    }
    function b2(a3, b3, q3) {
      var c = [];
      Array.prototype.push.call(c, b3), Array.prototype.push.call(c, 1);
      if (Array.isArray(q3)) {
        var e2 = q3.length;
        for (b3 = 0; b3 < e2; b3++) Array.prototype.push.call(c, q3[b3]);
      }
      a3.splice.apply(a3, c);
    }
    return function(q3, c) {
      var e2 = c.allowedElements, j2 = c.allowElement, f2 = c.components, d2 = c.disallowedElements, g2 = c.skipHtml, i2 = c.unwrapDisallowed, r2 = c.urlTransform;
      r2 = r2 || Pb, cf(c), e2 && d2 && _d("Unexpected combined `allowedElements` and `disallowedElements`, expected one or the other"), Zc(q3, function(a3, q4, c2) {
        if ("raw" === a3.type && c2 && "number" == typeof q4) {
          if (g2) {
            var f3 = c2.children;
            f3.splice(q4 | 0, 1);
          } else f3 = {}, f3.type = "text", f3.value = a3.value, c2.children[(q4 | 0) + ""] = f3;
          return q4;
        }
        if ("element" === a3.type) for (var k2, p2, A2, h2, n2, K, u2 = 0; u2 < jc.length; u2++) {
          k2 = jc[u2], p2 = k2[0];
          if (Wa.call(a3.properties, p2)) {
            A2 = a3.properties[p2], h2 = k2[2];
            if (!h2) {
              for (n2 = a3.tagName + "", K = 0; K < k2[1].length; K++) if ((k2[1][K] || "") == n2) {
                h2 = true;
                break;
              }
            }
            h2 && (h2 = A2 ? String(A2) + "" : hf, k2 = a3.properties, k2[p2] = r2(h2, p2, a3));
          }
        }
        if ("element" === a3.type && (f3 = e2 ? !e2.includes(a3.tagName) : d2 && d2.includes(a3.tagName), !f3 && j2 && "number" == typeof q4 && (f3 = !j2(a3, q4, c2)), f3 && c2 && "number" == typeof q4)) return i2 && a3.children ? (f3 = c2.children, b2(f3, q4 | 0, a3.children)) : (f3 = c2.children, f3.splice(q4 | 0, 1)), q4;
      }, []);
      return a2(q3, import_jsx_runtime.Fragment, f2, import_jsx_runtime.jsx, import_jsx_runtime.jsxs);
    };
  })();
  _c = function(a2) {
    let c = b(a2), e2 = Qb(a2), d2 = c.parse(e2);
    return q2(c.runSync(d2, e2), a2);
  }, $c = async function(a2) {
    let c = b(a2), e2 = Qb(a2), d2 = c.parse(e2);
    return q2(await Promise.resolve(c.run(d2, e2)), a2);
  }, ad = function(a2) {
    var e2 = b(a2), d2 = (0, import_react.useState)(void 0), g2 = d2[1], r2 = d2[0], j2 = (0, import_react.useState)(void 0), i2 = j2[1], f2 = j2[0], c = [];
    Array.prototype.push.call(c, a2.children), Array.prototype.push.call(c, a2.rehypePlugins), Array.prototype.push.call(c, a2.remarkPlugins), Array.prototype.push.call(c, a2.remarkRehypeOptions), (0, import_react.useEffect)(function() {
      var b2 = false;
      let q3 = Qb(a2), c2 = e2.run;
      e2.run(e2.parse(q3), q3, function(a3, q4) {
        b2 || (g2(a3), i2(q4));
      });
      return function() {
        b2 = true;
      };
    }, c);
    if (r2) throw r2;
    return f2 ? q2(f2, a2) : a2.fallback;
  };
})();
function hb(a, b) {
  Object.defineProperty(a, "name", { configurable: true, value: b });
}
function Ba() {
  return { type: "text", value: "\n" };
}
JSON.parse("null");
var Wa = Object.prototype.hasOwnProperty;
var bd = Object.prototype.propertyIsEnumerable;
var ib = JSON.parse("null");
var La = Object.prototype.hasOwnProperty;
var cd = Object.prototype.toString;
var ua = Array.prototype.slice;
var dd = (0, function() {
  var a = ua.call(arguments), b = a.pop();
  "function" == typeof b || Fa("Expected function as last argument, not " + b);
  var q2, c = -1, e2 = this.fns;
  q2 = function() {
    c++;
    var f2 = void 0;
    c < e2.length && (f2 = e2[c]);
    var j2, r2 = [];
    arguments.length > 0 && (j2 = arguments[0], r2 = ua.call(arguments, 1));
    if (j2) {
      b(j2);
      return;
    }
    for (var g2 = a.length, d3 = -1; ++d3 < g2; ) j2 = void 0, d3 < r2.length && (j2 = r2[d3]), j2 == null && (r2[d3] = a[d3]);
    a = r2, "function" == typeof f2 ? ae(f2, q2).apply(void 0, r2) : (d3 = ua.call(r2), d3.unshift(ib), b.apply(void 0, d3));
  };
  var d2 = ua.call(a);
  d2.unshift(ib), q2.apply(void 0, d2);
});
var ed = (0, function(a) {
  return "function" == typeof a || Fa("Expected `middelware` to be a function, not " + a), this.fns.push(a), this;
});
var jb = "history path basename stem extname dirname".split(mf);
var la = {};
var g = (0, function(a, b, q2) {
  if (this === void 0) throw new TypeError("Class constructor VFileMessage cannot be invoked without 'new'");
  return ub(a, b, q2);
});
la = g.prototype, Object.setPrototypeOf(g, Error), Object.setPrototypeOf(la, Error.prototype);
var d = true;
Object.defineProperty(g, "name", { configurable: d, value: "VFileMessage" }), la.file = hf, la.name = hf, la.reason = hf, la.message = hf, la.stack = hf, la.column = void 0, la.line = void 0, la.ancestors = void 0, la.cause = void 0, la.fatal = void 0, la.place = void 0, la.ruleId = void 0, la.source = void 0, Object.defineProperty(g, "prototype", { writable: false });
var Xa;
var Ma = class VFile extends Object {
  constructor(a) {
    super();
    if (this === void 0) throw new TypeError("Class constructor VFile cannot be invoked without 'new'");
    !a ? a = {} : qc(a) ? a = { path: a } : ("string" == typeof a || oc(a)) && (a = { value: a });
    var b = be();
    "cwd" in a && (b = hf);
    this.cwd = b, this.data = {}, this.history = [], this.messages = [];
    for (var q2, c = 0; c < jb.length; c++) b = jb[c] || "", b in a && a[b] != null && a[b] !== void 0 && (q2 = a[b], "history" == b && (q2 = q2.slice()), this[b] = q2);
    for (b in a) jb.includes(b) || (this[b] = a[b]);
  }
};
Xa = Ma.prototype, Object.defineProperty(Ma, "name", { configurable: d, value: "VFile" });
var e = (0, function(a, b, q2) {
  a = this.message(a, b, q2), a.fatal = true;
  throw a;
});
var f = (0, function(a, b, q2) {
  a = this.message(a, b, q2), a.fatal = void 0;
  return a;
});
var h = (0, function(a, b, q2) {
  a = ub(a, b, q2);
  if (b = Ga(this)) {
    var c = b + ":" + a.name;
    a.name = c, a.file = b;
  }
  a.fatal = false;
  this.messages.push(a);
  return a;
});
var i = (0, function(a) {
  var b = this.value;
  if (b === void 0) return hf;
  if ("string" == typeof b) return b;
  var q2 = void 0;
  a = a || q2, q2 = new TextDecoder(a);
  return q2.decode(b);
});
Qa("basename", { configurable: d, get: function() {
  var a = Ga(this);
  if ("string" == typeof a) return rc(a + "", hf);
}, set: function(a) {
  tb(a, "basename"), sb(a, "basename");
  var b = this.dirname;
  b = b || hf, Pa(this, ab(b, a));
} }), Qa("dirname", { configurable: d, get: function() {
  var a = Ga(this);
  if ("string" == typeof a) return ce(a + "");
}, set: function(a) {
  var b = this.basename;
  if (!b) throw new Error("Setting `dirname` requires `path` to be set too");
  a = a || hf, Pa(this, ab(a, b));
} }), Qa("extname", { configurable: d, get: function() {
  var a = Ga(this);
  if ("string" == typeof a) return de(a + "");
}, set: function(a) {
  sb(a, "extname");
  var b = this.dirname;
  if (!b) throw new Error("Setting `extname` requires `path` to be set too");
  if (a) {
    if (46 != (+a.codePointAt(0) | 0)) throw new Error("`extname` must start with `.`");
    if (a.includes(nf, 1)) throw new Error("`extname` cannot contain multiple dots");
  }
  a = a ? a + "" : hf;
  Pa(this, ab(b, this.stem + "" + a));
} }), Qa("path", { configurable: d, get: function() {
  return Ga(this);
}, set: function(a) {
  Pa(this, a);
} }), Qa("stem", { configurable: d, get: function() {
  var a = Ga(this);
  if ("string" == typeof a) return a = a + "", rc(a, this.extname + "");
}, set: function(a) {
  tb(a, "stem"), sb(a, "stem");
  var q2 = a + "";
  a = this.dirname, a = a ? a + "" : hf;
  var b = this.extname;
  b = b ? b + "" : hf, Pa(this, ab(a, q2 + b));
} }), bb("fail", e), bb("info", f), bb("message", h), bb("toString", i), Object.defineProperty(Ma, "prototype", { writable: false });
var fd = (0, function() {
  xb("use", this.frozen);
  var b = this.attachers, q2 = this.namespace, a = void 0;
  arguments.length > 0 && (a = arguments[0]);
  if (a == null) return this;
  if ("function" == typeof a) return Ab(b, a, ua.call(arguments, 1)), this;
  if ("object" == typeof a) return Array.isArray(a) ? uc(b, q2, a) : vc(b, q2, a), this;
  throw new TypeError(lf + a + of);
});
var gd = (0, function() {
  return wc(this);
});
var hd = (0, function(a) {
  this.freeze(), a = cb(a);
  let b = yb(this);
  vb("parse", b);
  return b(String(a), a);
});
var id = (0, function(a, b, q2) {
  sc(a);
  var d2 = this.freeze;
  this.freeze(), !q2 && "function" == typeof b && (q2 = b, b = void 0);
  var e2 = this.transformers, c = function(c2, d3) {
    let r2 = cb(b);
    e2.run(a, r2, function(b2, e3, r3) {
      var j2 = !e3 ? a : e3;
      if (b2) {
        d3(b2);
        return;
      }
      if (c2) {
        c2(j2);
        return;
      }
      q2(void 0, j2, r3);
    });
  };
  if (q2) {
    c(void 0, q2);
    return;
  }
  return new Promise(c);
});
var jd = (0, function(a, b) {
  var q2, c = false;
  this.run(a, b, function(a2, b2, e2) {
    pc(a2), q2 = b2, c = true;
  }), tc("runSync", "run", c);
  return q2;
});
var kd = (0, function(a, b) {
  this.freeze();
  let q2 = cb(b);
  b = zb(this), wb("stringify", b), sc(a);
  return b(a, q2);
});
var ld = (0, function(a, b) {
  var q2 = this;
  q2.freeze(), vb("process", yb(q2)), wb("process", zb(q2));
  var c = function(c2, e2) {
    let d2 = cb(a), r2 = q2.parse(d2);
    q2.run(r2, d2, function(a2, d3, r3) {
      if (a2 || !d3 || !r3) {
        e2(a2);
        return;
      }
      var j2 = q2.stringify(d3, r3);
      $d(j2) ? r3.value = j2 : r3.result = j2;
      if (c2) {
        c2(r3);
        return;
      }
      b(void 0, r3);
    });
  };
  if (b) {
    c(void 0, b);
    return;
  }
  return new Promise(c);
});
var md = (0, function(a) {
  this.freeze(), vb("processSync", yb(this)), wb("processSync", zb(this));
  var b, q2 = false;
  this.process(a, function(a2, c) {
    q2 = true, pc(a2), b = c;
  }), tc("processSync", "process", q2);
  return b;
});
var nd = (0, function(a, b) {
  var c = this.namespace, e2 = arguments.length, q2 = void 0;
  e2 > 0 && (q2 = a);
  if ("string" == typeof q2) {
    if (2 == e2) return xb("data", this.frozen), c[q2] = b, this;
    var d2;
    return La.call(c, q2) && (d2 = c[q2]) ? d2 : void 0;
  }
  return q2 ? (xb("data", this.frozen), this.namespace = q2, this) : c;
});
var od = (0, function() {
  if (this.frozen) return this;
  var b = this.attachers, c = this.transformers;
  while (true) {
    var a = +this.freezeIndex + 1;
    this.freezeIndex = a;
    if (a >= b.length) break;
    var q2 = b[a], e2 = q2[0];
    a = ua.call(q2, 1);
    if (!(a.length > 0 && a[0] === false)) a.length > 0 && true === a[0] && Array.prototype.splice.call(a, 0, 1, void 0), a = e2.apply(this, a), "function" == typeof a && c.use(a);
  }
  this.frozen = true;
  this.freezeIndex = Number.POSITIVE_INFINITY;
  return this;
});
var Ha = (0, function() {
  if (this === void 0) throw new TypeError("Class constructor Processor cannot be invoked without 'new'");
  return ie();
});
Object.defineProperty(Ha, "name", { configurable: d, value: "Processor" });
var Rb = Ha.prototype;
he(), h = new Ha(), h.freeze();
var pd = h;
var k = Object;
var Ea = Number;
var Ya = Math;
var kb = Error;
var va = new RegExp("[A-Za-z]", hf);
var wa = new RegExp("[\\dA-Za-z]", hf);
var qd = new RegExp("[#-'*+\\--9=?A-Z^-~]", hf);
var lb = new RegExp("\\d", hf);
var rd = new RegExp("[\\dA-Fa-f]", hf);
var sd = new RegExp("[!-/:-@[-`{-~]", hf);
var td = new RegExp("\\p{P}|\\p{S}", "u");
var ud = new RegExp("\\s", hf);
var vd = { tokenize: function(a) {
  var b, q2, c, e2 = function(b2) {
    if (Y(b2)) {
      a.exit("chunkText"), a.exit("paragraph"), a.consume(b2);
      return;
    }
    if (Z(b2)) return a.consume(b2), a.exit("chunkText"), q2;
    a.consume(b2);
    return e2;
  };
  q2 = function(q3) {
    var c2 = {};
    c2.contentType = "text", c2.previous = b, c2 = a.enter("chunkText", c2), b && (b.next = c2), b = c2;
    return e2(q3);
  };
  let j2 = a.attempt;
  c = a.attempt(this.parser.constructs.contentInitial, function(b2) {
    if (Y(b2)) {
      a.consume(b2);
      return;
    }
    a.enter("lineEnding");
    a.consume(b2), a.exit("lineEnding");
    return ca(a, c, "linePrefix", 0);
  }, function(b2) {
    a.enter("paragraph");
    return q2(b2);
  });
  return c;
} };
e = function(a, b, q2) {
  var c = this.parser.constructs.disable.null;
  c = !ka(c, "codeIndented") ? 4 : 0;
  var e2 = a.attempt;
  return ca(a, a.attempt(this.parser.constructs.document, b, q2), "linePrefix", c);
};
var mb = {};
mb.tokenize = e;
var wd = { tokenize: function(a) {
  var q2 = this;
  let b = [[], 0, null, null, null, 0, null, null];
  b[2] = a;
  var r2 = function(c2) {
    if (Y(c2)) {
      Bc(q2, b, a.exit("chunkFlow"), true), Ra(q2, a, b[0], 0), a.consume(c2);
      return;
    }
    if (Z(c2)) return a.consume(c2), Bc(q2, b, a.exit("chunkFlow"), false), b[1] = 0, q2.interrupt = void 0, b[6];
    a.consume(c2);
    return r2;
  };
  let c = function(c2) {
    if (Y(c2)) {
      !b[3] || Eb(q2, b), Ra(q2, a, b[0], 0), a.consume(c2);
      return;
    }
    if (!b[3]) {
      var d3 = q2.parser, j3 = d3.flow;
      b[3] = d3.flow(q2.now());
    }
    var e3 = {};
    e3._tokenizer = b[3], e3.contentType = "flow", e3.previous = b[4], a.enter("chunkFlow", e3);
    return r2(c2);
  }, f2 = function(a2) {
    let c2 = b[1] + 1 | 0;
    b[1] = c2;
    let e3 = b[0], d3 = q2.currentConstruct;
    e3.push({ construct: d3, state: q2.containerState });
    return b[7](a2);
  }, e2 = function(b2) {
    q2.containerState = {};
    return a.attempt(mb, f2, c)(b2);
  }, g2 = function(a2) {
    let e3 = q2.parser.lazy, d3 = q2.now().line, r3 = b[1];
    xc(e3, d3, r3 != W(b[0])), b[5] = +q2.now().offset;
    return c(a2);
  }, i2 = function(c2) {
    !b[3] || Eb(q2, b), Ra(q2, a, b[0], b[1]);
    return e2(c2);
  }, d2 = function(d3) {
    if (b[1] == b[0].length) {
      if (!b[3]) return e2(d3);
      var r3 = b[3].currentConstruct;
      if (r3 && r3.concrete) return c(d3);
      q2.interrupt = r3 && !b[3]._gfmTableDynamicInterruptHack;
    }
    q2.containerState = {};
    return a.check(mb, i2, g2)(d3);
  }, k2 = function(c2) {
    var p2 = b[1] + 1 | 0;
    b[1] = p2;
    if (q2.containerState._closeFlow) {
      q2.containerState._closeFlow = void 0, !b[3] || Eb(q2, b);
      for (var j3, e3, h2, i3, f3, r3, k3 = W(q2.events), g3 = k3; --g3 >= 0; ) {
        e3 = q2.events[g3], "exit" == e3[0] ? (h2 = e3[1], i3 = "chunkFlow" == h2.type) : i3 = false;
        if (i3) {
          j3 = e3[1].end;
          break;
        }
      }
      Ra(q2, a, b[0], b[1]);
      for (r3 = k3; r3 < W(q2.events); r3++) f3 = q2.events[r3], e3 = f3[1], e3.end = da(j3);
      j3 = q2.events, g3++, f3 = q2.events, ra(j3, g3, 0, f3.slice(k3)), q2.events.length = r3;
      return d2(c2);
    }
    return b[6](c2);
  }, j2 = function(c2) {
    if (b[1] < b[0].length) {
      var e3 = b[0][b[1]];
      q2.containerState = e3.state;
      return a.attempt(e3.construct.continuation, k2, d2)(c2);
    }
    return d2(c2);
  };
  b[6] = j2, b[7] = e2;
  return j2;
} };
var Na = { tokenize: function(a, b, q2) {
  let c = function(a2) {
    return Y(a2) || Z(a2) ? b(a2) : q2(a2);
  };
  return function(b2) {
    return $(b2) ? ca(a, c, "linePrefix", 0)(b2) : c(b2);
  };
} };
Na.partial = d;
var Sb = class {
  constructor(a) {
    a ? this.left = Array.from(a) : this.left = [], this.right = [];
  }
  get(a) {
    var q2 = +a, c = W(this.left), b = c + W(this.right) | 0;
    (q2 < 0 || q2 >= +b) && Oa("Cannot access index `" + X(a) + "` in a splice buffer of size `" + b + of), b = this.left, c = W(b);
    if (q2 < +c) return b[+a];
    q2 = this.right, b = W(q2);
    return q2[((b - a | 0) + c | 0) - 1];
  }
  slice(a, b) {
    var c = +Ea.POSITIVE_INFINITY;
    na(b) || (c = +b);
    var e2 = +a, d2 = this.left;
    a = this.right, b = d2.length;
    if (c < b) return d2.slice(e2, c);
    if (e2 > b) {
      var q2 = a.length;
      c = q2 - c + b, q2 = q2 - e2 + b, q2 = a.slice(c, q2);
      return q2.reverse();
    }
    e2 = d2.slice(e2);
    q2 = a.length - c + b, q2 = a.slice(q2), q2.reverse();
    return e2.concat(q2);
  }
  splice(a, b, q2) {
    b = b ? +b : 0, Ca(this, +Ya.trunc.call(Ya, +a)), a = this.right, b = a.length - b;
    var c = Ea.POSITIVE_INFINITY;
    b = a.splice(b, c), !q2 || Sa(this.left, q2);
    return b.reverse();
  }
  shift() {
    Ca(this, 0);
    let a = this.right;
    return a.pop();
  }
  pop() {
    Ca(this, +Ea.POSITIVE_INFINITY);
    let a = this.left;
    return a.pop();
  }
  push(a) {
    Ca(this, +Ea.POSITIVE_INFINITY);
    let b = this.left;
    b.push(a);
  }
  pushMany(a) {
    Ca(this, +Ea.POSITIVE_INFINITY), Sa(this.left, a);
  }
  unshift(a) {
    Ca(this, 0);
    let b = this.right;
    b.push(a);
  }
  unshiftMany(a) {
    Ca(this, 0), a = Array.from(a), a.reverse(), Sa(this.right, a);
  }
  setCursor(a) {
    Ca(this, +a);
  }
};
e = Sb.prototype;
k.defineProperty(e, "length", { enumerable: d, configurable: d, get: function() {
  let a = W(this.left);
  return a + W(this.right) | 0;
} }), e = function(a, b) {
  Cc(a);
  return a;
};
var Tb = { tokenize: function(a, b, q2) {
  var c = this;
  let e2 = function(e3) {
    if (Y(e3) || Z(e3)) return q2(e3);
    var r2 = c.events, f2 = W(r2), d2 = r2[f2 - 1];
    if (!ka(c.parser.constructs.disable.null, "codeIndented") && d2 && "linePrefix" == d2[1].type) {
      r2 = d2[2];
      var j2 = X(r2.sliceSerialize.call(d2[2], d2[1], true)).length >= 4;
    } else j2 = false;
    if (j2) return b(e3);
    j2 = a.interrupt;
    return a.interrupt(c.parser.constructs.flow, q2, b)(e3);
  };
  return function(b2) {
    a.exit("chunkContent"), a.enter("lineEnding"), a.consume(b2), a.exit("lineEnding");
    return ca(a, e2, "linePrefix", 0);
  };
} };
Tb.partial = d;
var xd = { tokenize: function(a, b, q2) {
  var c, e2, r2, d2 = function(b2) {
    if (Y(b2)) return e2(b2);
    if (Z(b2)) return a.check(Tb, r2, e2)(b2);
    a.consume(b2);
    return d2;
  };
  e2 = function(q3) {
    a.exit("chunkContent"), a.exit("content");
    return b(q3);
  }, r2 = function(b2) {
    a.consume(b2), a.exit("chunkContent");
    let q3 = {};
    q3.contentType = "content", q3.previous = c, q3 = a.enter("chunkContent", q3), c.next = q3, c = q3;
    return d2;
  };
  return function(b2) {
    a.enter("content");
    let q3 = {};
    q3.contentType = "content", c = a.enter("chunkContent", q3);
    return d2(b2);
  };
}, resolve: e };
var yd = { tokenize: function(a) {
  var c = this;
  let e2 = c.parser.constructs;
  var q2;
  let b = function(b2) {
    if (Y(b2)) {
      a.consume(b2);
      return;
    }
    a.enter("lineEnding");
    a.consume(b2), a.exit("lineEnding"), c.currentConstruct = void 0;
    return q2;
  }, d2 = a.attempt, j2 = e2.flow;
  d2 = ca(a, a.attempt(j2, b, a.attempt(xd, b, void 0)), "linePrefix", 0), b = a.attempt(e2.flowInitial, b, d2), q2 = a.attempt(Na, function(b2) {
    if (Y(b2)) {
      a.consume(b2);
      return;
    }
    a.enter("lineEndingBlank");
    a.consume(b2), a.exit("lineEndingBlank"), c.currentConstruct = void 0;
    return q2;
  }, b);
  return q2;
} };
var l = {};
var A = void 0;
l.resolveAll = function(a, b) {
  var q2, r2, j2 = void 0, d2 = W(a), c = -1, e2 = j2;
  while (true) {
    q2 = c + 1 | 0;
    if (q2 > d2) break;
    e2 === void 0 ? (q2 < d2 && a[q2] && "data" == a[q2][1].type && (c = c + 2 | 0, e2 = q2, q2 = c), c = q2) : ((q2 >= d2 || !a[q2] || "data" != a[q2][1].type) && (e2 = e2 | 0, q2 != (e2 + 2 | 0) && (r2 = a[e2], d2 = r2[1], d2.end = a[q2 - 1][1].end, c = e2 + 2 | 0, a.splice(c, (q2 - e2 | 0) - 2 | 0), d2 = W(a), q2 = c), e2 = void 0), c = q2);
  }
  return "function" == typeof A ? A(a, b) : a;
};
var B = void 0;
e = {}, e.resolveAll = function(a, b) {
  var q2, r2, j2 = void 0, d2 = W(a), c = -1, e2 = j2;
  while (true) {
    q2 = c + 1 | 0;
    if (q2 > d2) break;
    e2 === void 0 ? (q2 < d2 && a[q2] && "data" == a[q2][1].type && (c = c + 2 | 0, e2 = q2, q2 = c), c = q2) : ((q2 >= d2 || !a[q2] || "data" != a[q2][1].type) && (e2 = e2 | 0, q2 != (e2 + 2 | 0) && (r2 = a[e2], d2 = r2[1], d2.end = a[q2 - 1][1].end, c = e2 + 2 | 0, a.splice(c, (q2 - e2 | 0) - 2 | 0), d2 = W(a), q2 = c), e2 = void 0), c = q2);
  }
  return "function" == typeof B ? B(a, b) : a;
}, e.tokenize = function(a) {
  var b = this;
  let c = b.parser.constructs.string;
  var q2;
  let e2 = function(a2) {
    if (Y(a2)) return true;
    var q3 = db(c, a2);
    if (!q3) return false;
    for (var e3, r3 = W(q3), d3 = -1; ++d3 < r3; ) {
      e3 = q3[d3], a2 = e3.previous;
      if ("function" != typeof a2 || a2.call(b, b.previous)) return true;
    }
    return false;
  };
  var d2 = function(b2) {
    if (e2(b2)) return a.exit("data"), q2(b2);
    a.consume(b2);
    return d2;
  };
  let r2 = function(b2) {
    if (Y(b2)) {
      a.consume(b2);
      return;
    }
    a.enter("data");
    a.consume(b2);
    return d2;
  }, j2 = function(a2) {
    return e2(a2) ? q2(a2) : r2(a2);
  };
  q2 = a.attempt(c, j2, r2);
  return j2;
};
var zd = e;
var s = function(a, b) {
  return oe(a, b);
};
e = {}, e.resolveAll = function(a, b) {
  var q2, r2, j2 = void 0, d2 = W(a), c = -1, e2 = j2;
  while (true) {
    q2 = c + 1 | 0;
    if (q2 > d2) break;
    e2 === void 0 ? (q2 < d2 && a[q2] && "data" == a[q2][1].type && (c = c + 2 | 0, e2 = q2, q2 = c), c = q2) : ((q2 >= d2 || !a[q2] || "data" != a[q2][1].type) && (e2 = e2 | 0, q2 != (e2 + 2 | 0) && (r2 = a[e2], d2 = r2[1], d2.end = a[q2 - 1][1].end, c = e2 + 2 | 0, a.splice(c, (q2 - e2 | 0) - 2 | 0), d2 = W(a), q2 = c), e2 = void 0), c = q2);
  }
  return "function" == typeof s ? s(a, b) : a;
}, e.tokenize = function(a) {
  var b = this;
  let c = b.parser.constructs.text;
  var q2;
  let e2 = function(a2) {
    if (Y(a2)) return true;
    var q3 = db(c, a2);
    if (!q3) return false;
    for (var e3, r3 = W(q3), d3 = -1; ++d3 < r3; ) {
      e3 = q3[d3], a2 = e3.previous;
      if ("function" != typeof a2 || a2.call(b, b.previous)) return true;
    }
    return false;
  };
  var d2 = function(b2) {
    if (e2(b2)) return a.exit("data"), q2(b2);
    a.consume(b2);
    return d2;
  };
  let r2 = function(b2) {
    if (Y(b2)) {
      a.consume(b2);
      return;
    }
    a.enter("data");
    a.consume(b2);
    return d2;
  }, j2 = function(a2) {
    return e2(a2) ? q2(a2) : r2(a2);
  };
  q2 = a.attempt(c, j2, r2);
  return j2;
};
var Ad = e;
i = { name: "attention", tokenize: function(a, b, q2) {
  let d2 = this.parser.constructs.attentionMarkers.null;
  q2 = this.previous;
  let c = Dc(q2);
  var e2 = 0, r2 = function(j2) {
    if (j2 == e2) return a.consume(j2), r2;
    var f2, g2, i2 = a.exit("attentionSequence"), k2 = Dc(j2);
    f2 = !k2 || 2 == k2 && c || ka(d2, j2), g2 = !c || 2 == c && k2 || ka(d2, q2), 42 == e2 ? (i2._open = f2, i2._close = g2) : (i2._open = f2 && (!!c || !g2), i2._close = g2 && (!!k2 || !f2));
    return b(j2);
  };
  return function(b2) {
    e2 = b2 | 0, a.enter("attentionSequence");
    return r2(b2);
  };
}, resolveAll: function(a, b) {
  var p2, r2, c, g2, f2, K, j2, i2, k2, h2, A2, q2 = W(a), e2 = -1;
  while (true) {
    r2 = e2 + 1 | 0;
    if (r2 >= q2) break;
    var n2 = a[r2], l2 = n2[1];
    c = l2;
    if ("enter" == a[r2][0] && "attentionSequence" == c.type && c._close) for (g2 = r2; --g2 >= 0; ) {
      var y2 = a[g2], d2 = y2[1];
      if ("exit" == a[g2][0] && "attentionSequence" == d2.type && d2._open) {
        e2 = b.sliceSerialize(d2);
        if (e2.charCodeAt(0) == b.sliceSerialize(c).charCodeAt(0)) {
          var u2;
          u2 = d2.start.offset | 0, f2 = (d2.end.offset | 0) - u2 | 0, p2 = c.start.offset | 0, e2 = (c.end.offset | 0) - p2 | 0, j2 = (d2._close || c._open) && 0 != e2 % 3 && 0 == (f2 + e2 | 0) % 3;
          if (!j2) {
            q2 = f2 > 1 && e2 > 1 ? 2 : 1, j2 = da(d2.end), i2 = da(c.start), e2 = 0 - q2;
            var s2 = j2.column + e2;
            j2.column = s2;
            var w2 = j2.offset + e2;
            j2.offset = w2;
            var N = j2._bufferIndex + e2;
            j2._bufferIndex = N;
            var L = i2.column + q2;
            i2.column = L;
            var B2 = i2.offset + q2;
            i2.offset = B2;
            var O = i2._bufferIndex + q2;
            i2._bufferIndex = O, q2 > 1 ? (q2 = "strongSequence", e2 = "strongText", f2 = "strong") : (q2 = "emphasisSequence", e2 = "emphasisText", f2 = "emphasis"), k2 = { type: q2, start: j2, end: da(d2.end) }, h2 = { type: q2, start: da(c.start), end: i2 }, q2 = da(d2.end), e2 = { type: e2, start: q2, end: da(c.start) }, q2 = da(k2.start), f2 = { type: f2, start: q2, end: da(h2.end) }, d2.end = da(k2.start), c.start = da(h2.end), q2 = [], 0 != d2.end.offset - d2.start.offset && (q2 = sa(q2, [["enter", d2, b], ["exit", d2, b]])), q2 = sa(q2, [["enter", f2, b], ["enter", k2, b], ["exit", k2, b], ["enter", e2, b]]), K = b.parser.constructs.insideSpan.null, A2 = g2 + 1 | 0, q2 = sa(sa(q2, Cb(K, a.slice(A2, r2), b)), [["exit", e2, b], ["enter", h2, b], ["exit", h2, b], ["exit", f2, b]]), 0 != c.end.offset - c.start.offset ? (q2 = sa(q2, [["enter", c, b], ["exit", c, b]]), c = 2) : c = 0, ra(a, g2 - 1 | 0, (r2 - g2 | 0) + 3 | 0, q2), e2 = ((g2 + W(q2) | 0) - c | 0) - 2 | 0, q2 = W(a), r2 = e2;
            break;
          }
        }
      }
    }
    e2 = r2;
  }
  for (b = W(a), r2 = -1; ++r2 < b; ) "attentionSequence" == a[r2][1].type && (c = a[r2][1], c.type = "data");
  return a;
} };
var t = qa("autolink", function(a, b, q2) {
  var d2, r2, c = 0, j2 = function(b2) {
    if ((45 === b2 || ba(wa, b2)) && c < 63) {
      c++;
      var e3 = d2;
      45 === b2 && (e3 = j2), a.consume(b2);
      return e3;
    }
    return q2(b2);
  };
  d2 = function(q3) {
    return 46 === q3 ? (a.consume(q3), c = 0, r2) : 62 === q3 ? (a.exit("autolinkProtocol").type = "autolinkEmail", a.enter("autolinkMarker"), a.consume(q3), a.exit("autolinkMarker"), a.exit("autolink"), b) : j2(q3);
  }, r2 = function(a2) {
    return ba(wa, a2) ? d2(a2) : q2(a2);
  };
  var e2 = function(b2) {
    return 64 === b2 ? (a.consume(b2), r2) : ba(qd, b2) ? (a.consume(b2), e2) : q2(b2);
  }, f2 = function(c2) {
    if (62 === c2) return a.exit("autolinkProtocol"), a.enter("autolinkMarker"), a.consume(c2), a.exit("autolinkMarker"), a.exit("autolink"), b;
    if (Y(c2) || 32 === c2 || 60 === c2 || Bb(c2)) return q2(c2);
    a.consume(c2);
    return f2;
  }, g2 = function(b2) {
    if (58 === b2) return a.consume(b2), c = 0, f2;
    if ((43 === b2 || 45 === b2 || 46 === b2 || ba(wa, b2)) && c < 32) return c = c + 1 | 0, a.consume(b2), g2;
    c = 0;
    return e2(b2);
  };
  let i2 = function(a2) {
    return 43 === a2 || 45 === a2 || 46 === a2 || ba(wa, a2) ? (c = 1, g2(a2)) : e2(a2);
  }, k2 = function(b2) {
    return ba(va, b2) ? (a.consume(b2), i2) : 64 === b2 ? q2(b2) : e2(b2);
  };
  return function(b2) {
    a.enter("autolink"), a.enter("autolinkMarker"), a.consume(b2), a.exit("autolinkMarker"), a.enter("autolinkProtocol");
    return k2;
  };
});
var Za = qa("blockQuote", (0, function(a, b, q2) {
  var c = this;
  let e2 = function(q3) {
    if ($(q3)) return a.enter("blockQuotePrefixWhitespace"), a.consume(q3), a.exit("blockQuotePrefixWhitespace"), a.exit("blockQuotePrefix"), b;
    a.exit("blockQuotePrefix");
    return b(q3);
  };
  return function(b2) {
    if (62 === b2) {
      var d2 = c.containerState;
      if (!d2.open) {
        var r2 = {};
        r2._container = true, a.enter("blockQuote", r2), d2.open = true;
      }
      a.enter("blockQuotePrefix");
      a.enter("blockQuoteMarker"), a.consume(b2), a.exit("blockQuoteMarker");
      return e2;
    }
    return q2(b2);
  };
}));
f = function(a) {
  a.exit("blockQuote");
}, e = {}, e.tokenize = function(a, b, q2) {
  var e2 = this;
  let c = function(c2) {
    return a.attempt(Za, b, q2)(c2);
  };
  return function(b2) {
    if ($(b2)) {
      var q3 = ka(e2.parser.constructs.disable.null, "codeIndented") ? 0 : 4;
      return ca(a, c, "linePrefix", q3)(b2);
    }
    return c(b2);
  };
}, Za.continuation = e, Za.exit = f;
var m = qa("characterEscape", function(a, b, q2) {
  let c = function(c2) {
    return ba(sd, c2) ? (a.enter("characterEscapeValue"), a.consume(c2), a.exit("characterEscapeValue"), a.exit("characterEscape"), b) : q2(c2);
  };
  return function(b2) {
    a.enter("characterEscape"), a.enter("escapeMarker"), a.consume(b2), a.exit("escapeMarker");
    return c;
  };
});
var Ub = { AElig: "\xC6", AMP: "&", Aacute: "\xC1", Abreve: "\u0102", Acirc: "\xC2", Acy: "\u0410", Afr: "\u{1D504}", Agrave: "\xC0", Alpha: "\u0391", Amacr: "\u0100", And: "\u2A53", Aogon: "\u0104", Aopf: "\u{1D538}", ApplyFunction: "\u2061", Aring: "\xC5", Ascr: "\u{1D49C}", Assign: "\u2254", Atilde: "\xC3", Auml: "\xC4", Backslash: "\u2216", Barv: "\u2AE7", Barwed: "\u2306", Bcy: "\u0411", Because: "\u2235", Bernoullis: "\u212C", Beta: "\u0392", Bfr: "\u{1D505}", Bopf: "\u{1D539}", Breve: "\u02D8", Bscr: "\u212C", Bumpeq: "\u224E", CHcy: "\u0427", COPY: "\xA9", Cacute: "\u0106", Cap: "\u22D2", CapitalDifferentialD: "\u2145", Cayleys: "\u212D", Ccaron: "\u010C", Ccedil: "\xC7", Ccirc: "\u0108", Cconint: "\u2230", Cdot: "\u010A", Cedilla: "\xB8", CenterDot: "\xB7", Cfr: "\u212D", Chi: "\u03A7", CircleDot: "\u2299", CircleMinus: "\u2296", CirclePlus: "\u2295", CircleTimes: "\u2297", ClockwiseContourIntegral: "\u2232", CloseCurlyDoubleQuote: "\u201D", CloseCurlyQuote: "\u2019", Colon: "\u2237", Colone: "\u2A74", Congruent: "\u2261", Conint: "\u222F", ContourIntegral: "\u222E", Copf: "\u2102", Coproduct: "\u2210", CounterClockwiseContourIntegral: "\u2233", Cross: "\u2A2F", Cscr: "\u{1D49E}", Cup: "\u22D3", CupCap: "\u224D", DD: "\u2145", DDotrahd: "\u2911", DJcy: "\u0402", DScy: "\u0405", DZcy: "\u040F", Dagger: "\u2021", Darr: "\u21A1", Dashv: "\u2AE4", Dcaron: "\u010E", Dcy: "\u0414", Del: "\u2207", Delta: "\u0394", Dfr: "\u{1D507}", DiacriticalAcute: "\xB4", DiacriticalDot: "\u02D9", DiacriticalDoubleAcute: "\u02DD", DiacriticalGrave: "`", DiacriticalTilde: "\u02DC", Diamond: "\u22C4", DifferentialD: "\u2146", Dopf: "\u{1D53B}", Dot: "\xA8", DotDot: "\u20DC", DotEqual: "\u2250", DoubleContourIntegral: "\u222F", DoubleDot: "\xA8", DoubleDownArrow: "\u21D3", DoubleLeftArrow: "\u21D0", DoubleLeftRightArrow: "\u21D4", DoubleLeftTee: "\u2AE4", DoubleLongLeftArrow: "\u27F8", DoubleLongLeftRightArrow: "\u27FA", DoubleLongRightArrow: "\u27F9", DoubleRightArrow: "\u21D2", DoubleRightTee: "\u22A8", DoubleUpArrow: "\u21D1", DoubleUpDownArrow: "\u21D5", DoubleVerticalBar: "\u2225", DownArrow: "\u2193", DownArrowBar: "\u2913", DownArrowUpArrow: "\u21F5", DownBreve: "\u0311", DownLeftRightVector: "\u2950", DownLeftTeeVector: "\u295E", DownLeftVector: "\u21BD", DownLeftVectorBar: "\u2956", DownRightTeeVector: "\u295F", DownRightVector: "\u21C1", DownRightVectorBar: "\u2957", DownTee: "\u22A4", DownTeeArrow: "\u21A7", Downarrow: "\u21D3", Dscr: "\u{1D49F}", Dstrok: "\u0110", ENG: "\u014A", ETH: "\xD0", Eacute: "\xC9", Ecaron: "\u011A", Ecirc: "\xCA", Ecy: "\u042D", Edot: "\u0116", Efr: "\u{1D508}", Egrave: "\xC8", Element: "\u2208", Emacr: "\u0112", EmptySmallSquare: "\u25FB", EmptyVerySmallSquare: "\u25AB", Eogon: "\u0118", Eopf: "\u{1D53C}", Epsilon: "\u0395", Equal: "\u2A75", EqualTilde: "\u2242", Equilibrium: "\u21CC", Escr: "\u2130", Esim: "\u2A73", Eta: "\u0397", Euml: "\xCB", Exists: "\u2203", ExponentialE: "\u2147", Fcy: "\u0424", Ffr: "\u{1D509}", FilledSmallSquare: "\u25FC", FilledVerySmallSquare: "\u25AA", Fopf: "\u{1D53D}", ForAll: "\u2200", Fouriertrf: "\u2131", Fscr: "\u2131", GJcy: "\u0403", GT: ">", Gamma: "\u0393", Gammad: "\u03DC", Gbreve: "\u011E", Gcedil: "\u0122", Gcirc: "\u011C", Gcy: "\u0413", Gdot: "\u0120", Gfr: "\u{1D50A}", Gg: "\u22D9", Gopf: "\u{1D53E}", GreaterEqual: "\u2265", GreaterEqualLess: "\u22DB", GreaterFullEqual: "\u2267", GreaterGreater: "\u2AA2", GreaterLess: "\u2277", GreaterSlantEqual: "\u2A7E", GreaterTilde: "\u2273", Gscr: "\u{1D4A2}", Gt: "\u226B", HARDcy: "\u042A", Hacek: "\u02C7", Hat: "^", Hcirc: "\u0124", Hfr: "\u210C", HilbertSpace: "\u210B", Hopf: "\u210D", HorizontalLine: "\u2500", Hscr: "\u210B", Hstrok: "\u0126", HumpDownHump: "\u224E", HumpEqual: "\u224F", IEcy: "\u0415", IJlig: "\u0132", IOcy: "\u0401", Iacute: "\xCD", Icirc: "\xCE", Icy: "\u0418", Idot: "\u0130", Ifr: "\u2111", Igrave: "\xCC", Im: "\u2111", Imacr: "\u012A", ImaginaryI: "\u2148", Implies: "\u21D2", Int: "\u222C", Integral: "\u222B", Intersection: "\u22C2", InvisibleComma: "\u2063", InvisibleTimes: "\u2062", Iogon: "\u012E", Iopf: "\u{1D540}", Iota: "\u0399", Iscr: "\u2110", Itilde: "\u0128", Iukcy: "\u0406", Iuml: "\xCF", Jcirc: "\u0134", Jcy: "\u0419", Jfr: "\u{1D50D}", Jopf: "\u{1D541}", Jscr: "\u{1D4A5}", Jsercy: "\u0408", Jukcy: "\u0404", KHcy: "\u0425", KJcy: "\u040C", Kappa: "\u039A", Kcedil: "\u0136", Kcy: "\u041A", Kfr: "\u{1D50E}", Kopf: "\u{1D542}", Kscr: "\u{1D4A6}", LJcy: "\u0409", LT: "<", Lacute: "\u0139", Lambda: "\u039B", Lang: "\u27EA", Laplacetrf: "\u2112", Larr: "\u219E", Lcaron: "\u013D", Lcedil: "\u013B", Lcy: "\u041B", LeftAngleBracket: "\u27E8", LeftArrow: "\u2190", LeftArrowBar: "\u21E4", LeftArrowRightArrow: "\u21C6", LeftCeiling: "\u2308", LeftDoubleBracket: "\u27E6", LeftDownTeeVector: "\u2961", LeftDownVector: "\u21C3", LeftDownVectorBar: "\u2959", LeftFloor: "\u230A", LeftRightArrow: "\u2194", LeftRightVector: "\u294E", LeftTee: "\u22A3", LeftTeeArrow: "\u21A4", LeftTeeVector: "\u295A", LeftTriangle: "\u22B2", LeftTriangleBar: "\u29CF", LeftTriangleEqual: "\u22B4", LeftUpDownVector: "\u2951", LeftUpTeeVector: "\u2960", LeftUpVector: "\u21BF", LeftUpVectorBar: "\u2958", LeftVector: "\u21BC", LeftVectorBar: "\u2952", Leftarrow: "\u21D0", Leftrightarrow: "\u21D4", LessEqualGreater: "\u22DA", LessFullEqual: "\u2266", LessGreater: "\u2276", LessLess: "\u2AA1", LessSlantEqual: "\u2A7D", LessTilde: "\u2272", Lfr: "\u{1D50F}", Ll: "\u22D8", Lleftarrow: "\u21DA", Lmidot: "\u013F", LongLeftArrow: "\u27F5", LongLeftRightArrow: "\u27F7", LongRightArrow: "\u27F6", Longleftarrow: "\u27F8", Longleftrightarrow: "\u27FA", Longrightarrow: "\u27F9", Lopf: "\u{1D543}", LowerLeftArrow: "\u2199", LowerRightArrow: "\u2198", Lscr: "\u2112", Lsh: "\u21B0", Lstrok: "\u0141", Lt: "\u226A", Map: "\u2905", Mcy: "\u041C", MediumSpace: "\u205F", Mellintrf: "\u2133", Mfr: "\u{1D510}", MinusPlus: "\u2213", Mopf: "\u{1D544}", Mscr: "\u2133", Mu: "\u039C", NJcy: "\u040A", Nacute: "\u0143", Ncaron: "\u0147", Ncedil: "\u0145", Ncy: "\u041D", NegativeMediumSpace: "\u200B", NegativeThickSpace: "\u200B", NegativeThinSpace: "\u200B", NegativeVeryThinSpace: "\u200B", NestedGreaterGreater: "\u226B", NestedLessLess: "\u226A", NewLine: "\n", Nfr: "\u{1D511}", NoBreak: "\u2060", NonBreakingSpace: "\xA0", Nopf: "\u2115", Not: "\u2AEC", NotCongruent: "\u2262", NotCupCap: "\u226D", NotDoubleVerticalBar: "\u2226", NotElement: "\u2209", NotEqual: "\u2260", NotEqualTilde: "\u2242\u0338", NotExists: "\u2204", NotGreater: "\u226F", NotGreaterEqual: "\u2271", NotGreaterFullEqual: "\u2267\u0338", NotGreaterGreater: "\u226B\u0338", NotGreaterLess: "\u2279", NotGreaterSlantEqual: "\u2A7E\u0338", NotGreaterTilde: "\u2275", NotHumpDownHump: "\u224E\u0338", NotHumpEqual: "\u224F\u0338", NotLeftTriangle: "\u22EA", NotLeftTriangleBar: "\u29CF\u0338", NotLeftTriangleEqual: "\u22EC", NotLess: "\u226E", NotLessEqual: "\u2270", NotLessGreater: "\u2278", NotLessLess: "\u226A\u0338", NotLessSlantEqual: "\u2A7D\u0338", NotLessTilde: "\u2274", NotNestedGreaterGreater: "\u2AA2\u0338", NotNestedLessLess: "\u2AA1\u0338", NotPrecedes: "\u2280", NotPrecedesEqual: "\u2AAF\u0338", NotPrecedesSlantEqual: "\u22E0", NotReverseElement: "\u220C", NotRightTriangle: "\u22EB", NotRightTriangleBar: "\u29D0\u0338", NotRightTriangleEqual: "\u22ED", NotSquareSubset: "\u228F\u0338", NotSquareSubsetEqual: "\u22E2", NotSquareSuperset: "\u2290\u0338", NotSquareSupersetEqual: "\u22E3", NotSubset: "\u2282\u20D2", NotSubsetEqual: "\u2288", NotSucceeds: "\u2281", NotSucceedsEqual: "\u2AB0\u0338", NotSucceedsSlantEqual: "\u22E1", NotSucceedsTilde: "\u227F\u0338", NotSuperset: "\u2283\u20D2", NotSupersetEqual: "\u2289", NotTilde: "\u2241", NotTildeEqual: "\u2244", NotTildeFullEqual: "\u2247", NotTildeTilde: "\u2249", NotVerticalBar: "\u2224", Nscr: "\u{1D4A9}", Ntilde: "\xD1", Nu: "\u039D", OElig: "\u0152", Oacute: "\xD3", Ocirc: "\xD4", Ocy: "\u041E", Odblac: "\u0150", Ofr: "\u{1D512}", Ograve: "\xD2", Omacr: "\u014C", Omega: "\u03A9", Omicron: "\u039F", Oopf: "\u{1D546}", OpenCurlyDoubleQuote: "\u201C", OpenCurlyQuote: "\u2018", Or: "\u2A54", Oscr: "\u{1D4AA}", Oslash: "\xD8", Otilde: "\xD5", Otimes: "\u2A37", Ouml: "\xD6", OverBar: "\u203E", OverBrace: "\u23DE", OverBracket: "\u23B4", OverParenthesis: "\u23DC", PartialD: "\u2202", Pcy: "\u041F", Pfr: "\u{1D513}", Phi: "\u03A6", Pi: "\u03A0", PlusMinus: "\xB1", Poincareplane: "\u210C", Popf: "\u2119", Pr: "\u2ABB", Precedes: "\u227A", PrecedesEqual: "\u2AAF", PrecedesSlantEqual: "\u227C", PrecedesTilde: "\u227E", Prime: "\u2033", Product: "\u220F", Proportion: "\u2237", Proportional: "\u221D", Pscr: "\u{1D4AB}", Psi: "\u03A8", QUOT: '"', Qfr: "\u{1D514}", Qopf: "\u211A", Qscr: "\u{1D4AC}", RBarr: "\u2910", REG: "\xAE", Racute: "\u0154", Rang: "\u27EB", Rarr: "\u21A0", Rarrtl: "\u2916", Rcaron: "\u0158", Rcedil: "\u0156", Rcy: "\u0420", Re: "\u211C", ReverseElement: "\u220B", ReverseEquilibrium: "\u21CB", ReverseUpEquilibrium: "\u296F", Rfr: "\u211C", Rho: "\u03A1", RightAngleBracket: "\u27E9", RightArrow: "\u2192", RightArrowBar: "\u21E5", RightArrowLeftArrow: "\u21C4", RightCeiling: "\u2309", RightDoubleBracket: "\u27E7", RightDownTeeVector: "\u295D", RightDownVector: "\u21C2", RightDownVectorBar: "\u2955", RightFloor: "\u230B", RightTee: "\u22A2", RightTeeArrow: "\u21A6", RightTeeVector: "\u295B", RightTriangle: "\u22B3", RightTriangleBar: "\u29D0", RightTriangleEqual: "\u22B5", RightUpDownVector: "\u294F", RightUpTeeVector: "\u295C", RightUpVector: "\u21BE", RightUpVectorBar: "\u2954", RightVector: "\u21C0", RightVectorBar: "\u2953", Rightarrow: "\u21D2", Ropf: "\u211D", RoundImplies: "\u2970", Rrightarrow: "\u21DB", Rscr: "\u211B", Rsh: "\u21B1", RuleDelayed: "\u29F4", SHCHcy: "\u0429", SHcy: "\u0428", SOFTcy: "\u042C", Sacute: "\u015A", Sc: "\u2ABC", Scaron: "\u0160", Scedil: "\u015E", Scirc: "\u015C", Scy: "\u0421", Sfr: "\u{1D516}", ShortDownArrow: "\u2193", ShortLeftArrow: "\u2190", ShortRightArrow: "\u2192", ShortUpArrow: "\u2191", Sigma: "\u03A3", SmallCircle: "\u2218", Sopf: "\u{1D54A}", Sqrt: "\u221A", Square: "\u25A1", SquareIntersection: "\u2293", SquareSubset: "\u228F", SquareSubsetEqual: "\u2291", SquareSuperset: "\u2290", SquareSupersetEqual: "\u2292", SquareUnion: "\u2294", Sscr: "\u{1D4AE}", Star: "\u22C6", Sub: "\u22D0", Subset: "\u22D0", SubsetEqual: "\u2286", Succeeds: "\u227B", SucceedsEqual: "\u2AB0", SucceedsSlantEqual: "\u227D", SucceedsTilde: "\u227F", SuchThat: "\u220B", Sum: "\u2211", Sup: "\u22D1", Superset: "\u2283", SupersetEqual: "\u2287", Supset: "\u22D1", THORN: "\xDE", TRADE: "\u2122", TSHcy: "\u040B", TScy: "\u0426", Tab: "	", Tau: "\u03A4", Tcaron: "\u0164", Tcedil: "\u0162", Tcy: "\u0422", Tfr: "\u{1D517}", Therefore: "\u2234", Theta: "\u0398", ThickSpace: "\u205F\u200A", ThinSpace: "\u2009", Tilde: "\u223C", TildeEqual: "\u2243", TildeFullEqual: "\u2245", TildeTilde: "\u2248", Topf: "\u{1D54B}", TripleDot: "\u20DB", Tscr: "\u{1D4AF}", Tstrok: "\u0166", Uacute: "\xDA", Uarr: "\u219F", Uarrocir: "\u2949", Ubrcy: "\u040E", Ubreve: "\u016C", Ucirc: "\xDB", Ucy: "\u0423", Udblac: "\u0170", Ufr: "\u{1D518}", Ugrave: "\xD9", Umacr: "\u016A", UnderBar: "_", UnderBrace: "\u23DF", UnderBracket: "\u23B5", UnderParenthesis: "\u23DD", Union: "\u22C3", UnionPlus: "\u228E", Uogon: "\u0172", Uopf: "\u{1D54C}", UpArrow: "\u2191", UpArrowBar: "\u2912", UpArrowDownArrow: "\u21C5", UpDownArrow: "\u2195", UpEquilibrium: "\u296E", UpTee: "\u22A5", UpTeeArrow: "\u21A5", Uparrow: "\u21D1", Updownarrow: "\u21D5", UpperLeftArrow: "\u2196", UpperRightArrow: "\u2197", Upsi: "\u03D2", Upsilon: "\u03A5", Uring: "\u016E", Uscr: "\u{1D4B0}", Utilde: "\u0168", Uuml: "\xDC", VDash: "\u22AB", Vbar: "\u2AEB", Vcy: "\u0412", Vdash: "\u22A9", Vdashl: "\u2AE6", Vee: "\u22C1", Verbar: "\u2016", Vert: "\u2016", VerticalBar: "\u2223", VerticalLine: "|", VerticalSeparator: "\u2758", VerticalTilde: "\u2240", VeryThinSpace: "\u200A", Vfr: "\u{1D519}", Vopf: "\u{1D54D}", Vscr: "\u{1D4B1}", Vvdash: "\u22AA", Wcirc: "\u0174", Wedge: "\u22C0", Wfr: "\u{1D51A}", Wopf: "\u{1D54E}", Wscr: "\u{1D4B2}", Xfr: "\u{1D51B}", Xi: "\u039E", Xopf: "\u{1D54F}", Xscr: "\u{1D4B3}", YAcy: "\u042F", YIcy: "\u0407", YUcy: "\u042E", Yacute: "\xDD", Ycirc: "\u0176", Ycy: "\u042B", Yfr: "\u{1D51C}", Yopf: "\u{1D550}", Yscr: "\u{1D4B4}", Yuml: "\u0178", ZHcy: "\u0416", Zacute: "\u0179", Zcaron: "\u017D", Zcy: "\u0417", Zdot: "\u017B", ZeroWidthSpace: "\u200B", Zeta: "\u0396", Zfr: "\u2128", Zopf: "\u2124", Zscr: "\u{1D4B5}", aacute: "\xE1", abreve: "\u0103", ac: "\u223E", acE: "\u223E\u0333", acd: "\u223F", acirc: "\xE2", acute: "\xB4", acy: "\u0430", aelig: "\xE6", af: "\u2061", afr: "\u{1D51E}", agrave: "\xE0", alefsym: "\u2135", aleph: "\u2135", alpha: "\u03B1", amacr: "\u0101", amalg: "\u2A3F", amp: "&", and: "\u2227", andand: "\u2A55", andd: "\u2A5C", andslope: "\u2A58", andv: "\u2A5A", ang: "\u2220", ange: "\u29A4", angle: "\u2220", angmsd: "\u2221", angmsdaa: "\u29A8", angmsdab: "\u29A9", angmsdac: "\u29AA", angmsdad: "\u29AB", angmsdae: "\u29AC", angmsdaf: "\u29AD", angmsdag: "\u29AE", angmsdah: "\u29AF", angrt: "\u221F", angrtvb: "\u22BE", angrtvbd: "\u299D", angsph: "\u2222", angst: "\xC5", angzarr: "\u237C", aogon: "\u0105", aopf: "\u{1D552}", ap: "\u2248", apE: "\u2A70", apacir: "\u2A6F", ape: "\u224A", apid: "\u224B", apos: "'", approx: "\u2248", approxeq: "\u224A", aring: "\xE5", ascr: "\u{1D4B6}", ast: "*", asymp: "\u2248", asympeq: "\u224D", atilde: "\xE3", auml: "\xE4", awconint: "\u2233", awint: "\u2A11", bNot: "\u2AED", backcong: "\u224C", backepsilon: "\u03F6", backprime: "\u2035", backsim: "\u223D", backsimeq: "\u22CD", barvee: "\u22BD", barwed: "\u2305", barwedge: "\u2305", bbrk: "\u23B5", bbrktbrk: "\u23B6", bcong: "\u224C", bcy: "\u0431", bdquo: "\u201E", becaus: "\u2235", because: "\u2235", bemptyv: "\u29B0", bepsi: "\u03F6", bernou: "\u212C", beta: "\u03B2", beth: "\u2136", between: "\u226C", bfr: "\u{1D51F}", bigcap: "\u22C2", bigcirc: "\u25EF", bigcup: "\u22C3", bigodot: "\u2A00", bigoplus: "\u2A01", bigotimes: "\u2A02", bigsqcup: "\u2A06", bigstar: "\u2605", bigtriangledown: "\u25BD", bigtriangleup: "\u25B3", biguplus: "\u2A04", bigvee: "\u22C1", bigwedge: "\u22C0", bkarow: "\u290D", blacklozenge: "\u29EB", blacksquare: "\u25AA", blacktriangle: "\u25B4", blacktriangledown: "\u25BE", blacktriangleleft: "\u25C2", blacktriangleright: "\u25B8", blank: "\u2423", blk12: "\u2592", blk14: "\u2591", blk34: "\u2593", block: "\u2588", bne: "=\u20E5", bnequiv: "\u2261\u20E5", bnot: "\u2310", bopf: "\u{1D553}", bot: "\u22A5", bottom: "\u22A5", bowtie: "\u22C8", boxDL: "\u2557", boxDR: "\u2554", boxDl: "\u2556", boxDr: "\u2553", boxH: "\u2550", boxHD: "\u2566", boxHU: "\u2569", boxHd: "\u2564", boxHu: "\u2567", boxUL: "\u255D", boxUR: "\u255A", boxUl: "\u255C", boxUr: "\u2559", boxV: "\u2551", boxVH: "\u256C", boxVL: "\u2563", boxVR: "\u2560", boxVh: "\u256B", boxVl: "\u2562", boxVr: "\u255F", boxbox: "\u29C9", boxdL: "\u2555", boxdR: "\u2552", boxdl: "\u2510", boxdr: "\u250C", boxh: "\u2500", boxhD: "\u2565", boxhU: "\u2568", boxhd: "\u252C", boxhu: "\u2534", boxminus: "\u229F", boxplus: "\u229E", boxtimes: "\u22A0", boxuL: "\u255B", boxuR: "\u2558", boxul: "\u2518", boxur: "\u2514", boxv: "\u2502", boxvH: "\u256A", boxvL: "\u2561", boxvR: "\u255E", boxvh: "\u253C", boxvl: "\u2524", boxvr: "\u251C", bprime: "\u2035", breve: "\u02D8", brvbar: "\xA6", bscr: "\u{1D4B7}", bsemi: "\u204F", bsim: "\u223D", bsime: "\u22CD", bsol: "\\", bsolb: "\u29C5", bsolhsub: "\u27C8", bull: "\u2022", bullet: "\u2022", bump: "\u224E", bumpE: "\u2AAE", bumpe: "\u224F", bumpeq: "\u224F", cacute: "\u0107", cap: "\u2229", capand: "\u2A44", capbrcup: "\u2A49", capcap: "\u2A4B", capcup: "\u2A47", capdot: "\u2A40", caps: "\u2229\uFE00", caret: "\u2041", caron: "\u02C7", ccaps: "\u2A4D", ccaron: "\u010D", ccedil: "\xE7", ccirc: "\u0109", ccups: "\u2A4C", ccupssm: "\u2A50", cdot: "\u010B", cedil: "\xB8", cemptyv: "\u29B2", cent: "\xA2", centerdot: "\xB7", cfr: "\u{1D520}", chcy: "\u0447", check: "\u2713", checkmark: "\u2713", chi: "\u03C7", cir: "\u25CB", cirE: "\u29C3", circ: "\u02C6", circeq: "\u2257", circlearrowleft: "\u21BA", circlearrowright: "\u21BB", circledR: "\xAE", circledS: "\u24C8", circledast: "\u229B", circledcirc: "\u229A", circleddash: "\u229D", cire: "\u2257", cirfnint: "\u2A10", cirmid: "\u2AEF", cirscir: "\u29C2", clubs: "\u2663", clubsuit: "\u2663", colon: ":", colone: "\u2254", coloneq: "\u2254", comma: ",", commat: "@", comp: "\u2201", compfn: "\u2218", complement: "\u2201", complexes: "\u2102", cong: "\u2245", congdot: "\u2A6D", conint: "\u222E", copf: "\u{1D554}", coprod: "\u2210", copy: "\xA9", copysr: "\u2117", crarr: "\u21B5", cross: "\u2717", cscr: "\u{1D4B8}", csub: "\u2ACF", csube: "\u2AD1", csup: "\u2AD0", csupe: "\u2AD2", ctdot: "\u22EF", cudarrl: "\u2938", cudarrr: "\u2935", cuepr: "\u22DE", cuesc: "\u22DF", cularr: "\u21B6", cularrp: "\u293D", cup: "\u222A", cupbrcap: "\u2A48", cupcap: "\u2A46", cupcup: "\u2A4A", cupdot: "\u228D", cupor: "\u2A45", cups: "\u222A\uFE00", curarr: "\u21B7", curarrm: "\u293C", curlyeqprec: "\u22DE", curlyeqsucc: "\u22DF", curlyvee: "\u22CE", curlywedge: "\u22CF", curren: "\xA4", curvearrowleft: "\u21B6", curvearrowright: "\u21B7", cuvee: "\u22CE", cuwed: "\u22CF", cwconint: "\u2232", cwint: "\u2231", cylcty: "\u232D", dArr: "\u21D3", dHar: "\u2965", dagger: "\u2020", daleth: "\u2138", darr: "\u2193", dash: "\u2010", dashv: "\u22A3", dbkarow: "\u290F", dblac: "\u02DD", dcaron: "\u010F", dcy: "\u0434", dd: "\u2146", ddagger: "\u2021", ddarr: "\u21CA", ddotseq: "\u2A77", deg: "\xB0", delta: "\u03B4", demptyv: "\u29B1", dfisht: "\u297F", dfr: "\u{1D521}", dharl: "\u21C3", dharr: "\u21C2", diam: "\u22C4", diamond: "\u22C4", diamondsuit: "\u2666", diams: "\u2666", die: "\xA8", digamma: "\u03DD", disin: "\u22F2", div: "\xF7", divide: "\xF7", divideontimes: "\u22C7", divonx: "\u22C7", djcy: "\u0452", dlcorn: "\u231E", dlcrop: "\u230D", dollar: "$", dopf: "\u{1D555}", dot: "\u02D9", doteq: "\u2250", doteqdot: "\u2251", dotminus: "\u2238", dotplus: "\u2214", dotsquare: "\u22A1", doublebarwedge: "\u2306", downarrow: "\u2193", downdownarrows: "\u21CA", downharpoonleft: "\u21C3", downharpoonright: "\u21C2", drbkarow: "\u2910", drcorn: "\u231F", drcrop: "\u230C", dscr: "\u{1D4B9}", dscy: "\u0455", dsol: "\u29F6", dstrok: "\u0111", dtdot: "\u22F1", dtri: "\u25BF", dtrif: "\u25BE", duarr: "\u21F5", duhar: "\u296F", dwangle: "\u29A6", dzcy: "\u045F", dzigrarr: "\u27FF", eDDot: "\u2A77", eDot: "\u2251", eacute: "\xE9", easter: "\u2A6E", ecaron: "\u011B", ecir: "\u2256", ecirc: "\xEA", ecolon: "\u2255", ecy: "\u044D", edot: "\u0117", ee: "\u2147", efDot: "\u2252", efr: "\u{1D522}", eg: "\u2A9A", egrave: "\xE8", egs: "\u2A96", egsdot: "\u2A98", el: "\u2A99", elinters: "\u23E7", ell: "\u2113", els: "\u2A95", elsdot: "\u2A97", emacr: "\u0113", empty: "\u2205", emptyset: "\u2205", emptyv: "\u2205", emsp13: "\u2004", emsp14: "\u2005", emsp: "\u2003", eng: "\u014B", ensp: "\u2002", eogon: "\u0119", eopf: "\u{1D556}", epar: "\u22D5", eparsl: "\u29E3", eplus: "\u2A71", epsi: "\u03B5", epsilon: "\u03B5", epsiv: "\u03F5", eqcirc: "\u2256", eqcolon: "\u2255", eqsim: "\u2242", eqslantgtr: "\u2A96", eqslantless: "\u2A95", equals: "=", equest: "\u225F", equiv: "\u2261", equivDD: "\u2A78", eqvparsl: "\u29E5", erDot: "\u2253", erarr: "\u2971", escr: "\u212F", esdot: "\u2250", esim: "\u2242", eta: "\u03B7", eth: "\xF0", euml: "\xEB", euro: "\u20AC", excl: "!", exist: "\u2203", expectation: "\u2130", exponentiale: "\u2147", fallingdotseq: "\u2252", fcy: "\u0444", female: "\u2640", ffilig: "\uFB03", fflig: "\uFB00", ffllig: "\uFB04", ffr: "\u{1D523}", filig: "\uFB01", fjlig: "fj", flat: "\u266D", fllig: "\uFB02", fltns: "\u25B1", fnof: "\u0192", fopf: "\u{1D557}", forall: "\u2200", fork: "\u22D4", forkv: "\u2AD9", fpartint: "\u2A0D", frac12: "\xBD", frac13: "\u2153", frac14: "\xBC", frac15: "\u2155", frac16: "\u2159", frac18: "\u215B", frac23: "\u2154", frac25: "\u2156", frac34: "\xBE", frac35: "\u2157", frac38: "\u215C", frac45: "\u2158", frac56: "\u215A", frac58: "\u215D", frac78: "\u215E", frasl: "\u2044", frown: "\u2322", fscr: "\u{1D4BB}", gE: "\u2267", gEl: "\u2A8C", gacute: "\u01F5", gamma: "\u03B3", gammad: "\u03DD", gap: "\u2A86", gbreve: "\u011F", gcirc: "\u011D", gcy: "\u0433", gdot: "\u0121", ge: "\u2265", gel: "\u22DB", geq: "\u2265", geqq: "\u2267", geqslant: "\u2A7E", ges: "\u2A7E", gescc: "\u2AA9", gesdot: "\u2A80", gesdoto: "\u2A82", gesdotol: "\u2A84", gesl: "\u22DB\uFE00", gesles: "\u2A94", gfr: "\u{1D524}", gg: "\u226B", ggg: "\u22D9", gimel: "\u2137", gjcy: "\u0453", gl: "\u2277", glE: "\u2A92", gla: "\u2AA5", glj: "\u2AA4", gnE: "\u2269", gnap: "\u2A8A", gnapprox: "\u2A8A", gne: "\u2A88", gneq: "\u2A88", gneqq: "\u2269", gnsim: "\u22E7", gopf: "\u{1D558}", grave: "`", gscr: "\u210A", gsim: "\u2273", gsime: "\u2A8E", gsiml: "\u2A90", gt: ">", gtcc: "\u2AA7", gtcir: "\u2A7A", gtdot: "\u22D7", gtlPar: "\u2995", gtquest: "\u2A7C", gtrapprox: "\u2A86", gtrarr: "\u2978", gtrdot: "\u22D7", gtreqless: "\u22DB", gtreqqless: "\u2A8C", gtrless: "\u2277", gtrsim: "\u2273", gvertneqq: "\u2269\uFE00", gvnE: "\u2269\uFE00", hArr: "\u21D4", hairsp: "\u200A", half: "\xBD", hamilt: "\u210B", hardcy: "\u044A", harr: "\u2194", harrcir: "\u2948", harrw: "\u21AD", hbar: "\u210F", hcirc: "\u0125", hearts: "\u2665", heartsuit: "\u2665", hellip: "\u2026", hercon: "\u22B9", hfr: "\u{1D525}", hksearow: "\u2925", hkswarow: "\u2926", hoarr: "\u21FF", homtht: "\u223B", hookleftarrow: "\u21A9", hookrightarrow: "\u21AA", hopf: "\u{1D559}", horbar: "\u2015", hscr: "\u{1D4BD}", hslash: "\u210F", hstrok: "\u0127", hybull: "\u2043", hyphen: "\u2010", iacute: "\xED", ic: "\u2063", icirc: "\xEE", icy: "\u0438", iecy: "\u0435", iexcl: "\xA1", iff: "\u21D4", ifr: "\u{1D526}", igrave: "\xEC", ii: "\u2148", iiiint: "\u2A0C", iiint: "\u222D", iinfin: "\u29DC", iiota: "\u2129", ijlig: "\u0133", imacr: "\u012B", image: "\u2111", imagline: "\u2110", imagpart: "\u2111", imath: "\u0131", imof: "\u22B7", imped: "\u01B5", in: "\u2208", incare: "\u2105", infin: "\u221E", infintie: "\u29DD", inodot: "\u0131", int: "\u222B", intcal: "\u22BA", integers: "\u2124", intercal: "\u22BA", intlarhk: "\u2A17", intprod: "\u2A3C", iocy: "\u0451", iogon: "\u012F", iopf: "\u{1D55A}", iota: "\u03B9", iprod: "\u2A3C", iquest: "\xBF", iscr: "\u{1D4BE}", isin: "\u2208", isinE: "\u22F9", isindot: "\u22F5", isins: "\u22F4", isinsv: "\u22F3", isinv: "\u2208", it: "\u2062", itilde: "\u0129", iukcy: "\u0456", iuml: "\xEF", jcirc: "\u0135", jcy: "\u0439", jfr: "\u{1D527}", jmath: "\u0237", jopf: "\u{1D55B}", jscr: "\u{1D4BF}", jsercy: "\u0458", jukcy: "\u0454", kappa: "\u03BA", kappav: "\u03F0", kcedil: "\u0137", kcy: "\u043A", kfr: "\u{1D528}", kgreen: "\u0138", khcy: "\u0445", kjcy: "\u045C", kopf: "\u{1D55C}", kscr: "\u{1D4C0}", lAarr: "\u21DA", lArr: "\u21D0", lAtail: "\u291B", lBarr: "\u290E", lE: "\u2266", lEg: "\u2A8B", lHar: "\u2962", lacute: "\u013A", laemptyv: "\u29B4", lagran: "\u2112", lambda: "\u03BB", lang: "\u27E8", langd: "\u2991", langle: "\u27E8", lap: "\u2A85", laquo: "\xAB", larr: "\u2190", larrb: "\u21E4", larrbfs: "\u291F", larrfs: "\u291D", larrhk: "\u21A9", larrlp: "\u21AB", larrpl: "\u2939", larrsim: "\u2973", larrtl: "\u21A2", lat: "\u2AAB", latail: "\u2919", late: "\u2AAD", lates: "\u2AAD\uFE00", lbarr: "\u290C", lbbrk: "\u2772", lbrace: "{", lbrack: "[", lbrke: "\u298B", lbrksld: "\u298F", lbrkslu: "\u298D", lcaron: "\u013E", lcedil: "\u013C", lceil: "\u2308", lcub: "{", lcy: "\u043B", ldca: "\u2936", ldquo: "\u201C", ldquor: "\u201E", ldrdhar: "\u2967", ldrushar: "\u294B", ldsh: "\u21B2", le: "\u2264", leftarrow: "\u2190", leftarrowtail: "\u21A2", leftharpoondown: "\u21BD", leftharpoonup: "\u21BC", leftleftarrows: "\u21C7", leftrightarrow: "\u2194", leftrightarrows: "\u21C6", leftrightharpoons: "\u21CB", leftrightsquigarrow: "\u21AD", leftthreetimes: "\u22CB", leg: "\u22DA", leq: "\u2264", leqq: "\u2266", leqslant: "\u2A7D", les: "\u2A7D", lescc: "\u2AA8", lesdot: "\u2A7F", lesdoto: "\u2A81", lesdotor: "\u2A83", lesg: "\u22DA\uFE00", lesges: "\u2A93", lessapprox: "\u2A85", lessdot: "\u22D6", lesseqgtr: "\u22DA", lesseqqgtr: "\u2A8B", lessgtr: "\u2276", lesssim: "\u2272", lfisht: "\u297C", lfloor: "\u230A", lfr: "\u{1D529}", lg: "\u2276", lgE: "\u2A91", lhard: "\u21BD", lharu: "\u21BC", lharul: "\u296A", lhblk: "\u2584", ljcy: "\u0459", ll: "\u226A", llarr: "\u21C7", llcorner: "\u231E", llhard: "\u296B", lltri: "\u25FA", lmidot: "\u0140", lmoust: "\u23B0", lmoustache: "\u23B0", lnE: "\u2268", lnap: "\u2A89", lnapprox: "\u2A89", lne: "\u2A87", lneq: "\u2A87", lneqq: "\u2268", lnsim: "\u22E6", loang: "\u27EC", loarr: "\u21FD", lobrk: "\u27E6", longleftarrow: "\u27F5", longleftrightarrow: "\u27F7", longmapsto: "\u27FC", longrightarrow: "\u27F6", looparrowleft: "\u21AB", looparrowright: "\u21AC", lopar: "\u2985", lopf: "\u{1D55D}", loplus: "\u2A2D", lotimes: "\u2A34", lowast: "\u2217", lowbar: "_", loz: "\u25CA", lozenge: "\u25CA", lozf: "\u29EB", lpar: "(", lparlt: "\u2993", lrarr: "\u21C6", lrcorner: "\u231F", lrhar: "\u21CB", lrhard: "\u296D", lrm: "\u200E", lrtri: "\u22BF", lsaquo: "\u2039", lscr: "\u{1D4C1}", lsh: "\u21B0", lsim: "\u2272", lsime: "\u2A8D", lsimg: "\u2A8F", lsqb: "[", lsquo: "\u2018", lsquor: "\u201A", lstrok: "\u0142", lt: "<", ltcc: "\u2AA6", ltcir: "\u2A79", ltdot: "\u22D6", lthree: "\u22CB", ltimes: "\u22C9", ltlarr: "\u2976", ltquest: "\u2A7B", ltrPar: "\u2996", ltri: "\u25C3", ltrie: "\u22B4", ltrif: "\u25C2", lurdshar: "\u294A", luruhar: "\u2966", lvertneqq: "\u2268\uFE00", lvnE: "\u2268\uFE00", mDDot: "\u223A", macr: "\xAF", male: "\u2642", malt: "\u2720", maltese: "\u2720", map: "\u21A6", mapsto: "\u21A6", mapstodown: "\u21A7", mapstoleft: "\u21A4", mapstoup: "\u21A5", marker: "\u25AE", mcomma: "\u2A29", mcy: "\u043C", mdash: "\u2014", measuredangle: "\u2221", mfr: "\u{1D52A}", mho: "\u2127", micro: "\xB5", mid: "\u2223", midast: "*", midcir: "\u2AF0", middot: "\xB7", minus: "\u2212", minusb: "\u229F", minusd: "\u2238", minusdu: "\u2A2A", mlcp: "\u2ADB", mldr: "\u2026", mnplus: "\u2213", models: "\u22A7", mopf: "\u{1D55E}", mp: "\u2213", mscr: "\u{1D4C2}", mstpos: "\u223E", mu: "\u03BC", multimap: "\u22B8", mumap: "\u22B8", nGg: "\u22D9\u0338", nGt: "\u226B\u20D2", nGtv: "\u226B\u0338", nLeftarrow: "\u21CD", nLeftrightarrow: "\u21CE", nLl: "\u22D8\u0338", nLt: "\u226A\u20D2", nLtv: "\u226A\u0338", nRightarrow: "\u21CF", nVDash: "\u22AF", nVdash: "\u22AE", nabla: "\u2207", nacute: "\u0144", nang: "\u2220\u20D2", nap: "\u2249", napE: "\u2A70\u0338", napid: "\u224B\u0338", napos: "\u0149", napprox: "\u2249", natur: "\u266E", natural: "\u266E", naturals: "\u2115", nbsp: "\xA0", nbump: "\u224E\u0338", nbumpe: "\u224F\u0338", ncap: "\u2A43", ncaron: "\u0148", ncedil: "\u0146", ncong: "\u2247", ncongdot: "\u2A6D\u0338", ncup: "\u2A42", ncy: "\u043D", ndash: "\u2013", ne: "\u2260", neArr: "\u21D7", nearhk: "\u2924", nearr: "\u2197", nearrow: "\u2197", nedot: "\u2250\u0338", nequiv: "\u2262", nesear: "\u2928", nesim: "\u2242\u0338", nexist: "\u2204", nexists: "\u2204", nfr: "\u{1D52B}", ngE: "\u2267\u0338", nge: "\u2271", ngeq: "\u2271", ngeqq: "\u2267\u0338", ngeqslant: "\u2A7E\u0338", nges: "\u2A7E\u0338", ngsim: "\u2275", ngt: "\u226F", ngtr: "\u226F", nhArr: "\u21CE", nharr: "\u21AE", nhpar: "\u2AF2", ni: "\u220B", nis: "\u22FC", nisd: "\u22FA", niv: "\u220B", njcy: "\u045A", nlArr: "\u21CD", nlE: "\u2266\u0338", nlarr: "\u219A", nldr: "\u2025", nle: "\u2270", nleftarrow: "\u219A", nleftrightarrow: "\u21AE", nleq: "\u2270", nleqq: "\u2266\u0338", nleqslant: "\u2A7D\u0338", nles: "\u2A7D\u0338", nless: "\u226E", nlsim: "\u2274", nlt: "\u226E", nltri: "\u22EA", nltrie: "\u22EC", nmid: "\u2224", nopf: "\u{1D55F}", not: "\xAC", notin: "\u2209", notinE: "\u22F9\u0338", notindot: "\u22F5\u0338", notinva: "\u2209", notinvb: "\u22F7", notinvc: "\u22F6", notni: "\u220C", notniva: "\u220C", notnivb: "\u22FE", notnivc: "\u22FD", npar: "\u2226", nparallel: "\u2226", nparsl: "\u2AFD\u20E5", npart: "\u2202\u0338", npolint: "\u2A14", npr: "\u2280", nprcue: "\u22E0", npre: "\u2AAF\u0338", nprec: "\u2280", npreceq: "\u2AAF\u0338", nrArr: "\u21CF", nrarr: "\u219B", nrarrc: "\u2933\u0338", nrarrw: "\u219D\u0338", nrightarrow: "\u219B", nrtri: "\u22EB", nrtrie: "\u22ED", nsc: "\u2281", nsccue: "\u22E1", nsce: "\u2AB0\u0338", nscr: "\u{1D4C3}", nshortmid: "\u2224", nshortparallel: "\u2226", nsim: "\u2241", nsime: "\u2244", nsimeq: "\u2244", nsmid: "\u2224", nspar: "\u2226", nsqsube: "\u22E2", nsqsupe: "\u22E3", nsub: "\u2284", nsubE: "\u2AC5\u0338", nsube: "\u2288", nsubset: "\u2282\u20D2", nsubseteq: "\u2288", nsubseteqq: "\u2AC5\u0338", nsucc: "\u2281", nsucceq: "\u2AB0\u0338", nsup: "\u2285", nsupE: "\u2AC6\u0338", nsupe: "\u2289", nsupset: "\u2283\u20D2", nsupseteq: "\u2289", nsupseteqq: "\u2AC6\u0338", ntgl: "\u2279", ntilde: "\xF1", ntlg: "\u2278", ntriangleleft: "\u22EA", ntrianglelefteq: "\u22EC", ntriangleright: "\u22EB", ntrianglerighteq: "\u22ED", nu: "\u03BD", num: "#", numero: "\u2116", numsp: "\u2007", nvDash: "\u22AD", nvHarr: "\u2904", nvap: "\u224D\u20D2", nvdash: "\u22AC", nvge: "\u2265\u20D2", nvgt: ">\u20D2", nvinfin: "\u29DE", nvlArr: "\u2902", nvle: "\u2264\u20D2", nvlt: "<\u20D2", nvltrie: "\u22B4\u20D2", nvrArr: "\u2903", nvrtrie: "\u22B5\u20D2", nvsim: "\u223C\u20D2", nwArr: "\u21D6", nwarhk: "\u2923", nwarr: "\u2196", nwarrow: "\u2196", nwnear: "\u2927", oS: "\u24C8", oacute: "\xF3", oast: "\u229B", ocir: "\u229A", ocirc: "\xF4", ocy: "\u043E", odash: "\u229D", odblac: "\u0151", odiv: "\u2A38", odot: "\u2299", odsold: "\u29BC", oelig: "\u0153", ofcir: "\u29BF", ofr: "\u{1D52C}", ogon: "\u02DB", ograve: "\xF2", ogt: "\u29C1", ohbar: "\u29B5", ohm: "\u03A9", oint: "\u222E", olarr: "\u21BA", olcir: "\u29BE", olcross: "\u29BB", oline: "\u203E", olt: "\u29C0", omacr: "\u014D", omega: "\u03C9", omicron: "\u03BF", omid: "\u29B6", ominus: "\u2296", oopf: "\u{1D560}", opar: "\u29B7", operp: "\u29B9", oplus: "\u2295", or: "\u2228", orarr: "\u21BB", ord: "\u2A5D", order: "\u2134", orderof: "\u2134", ordf: "\xAA", ordm: "\xBA", origof: "\u22B6", oror: "\u2A56", orslope: "\u2A57", orv: "\u2A5B", oscr: "\u2134", oslash: "\xF8", osol: "\u2298", otilde: "\xF5", otimes: "\u2297", otimesas: "\u2A36", ouml: "\xF6", ovbar: "\u233D", par: "\u2225", para: "\xB6", parallel: "\u2225", parsim: "\u2AF3", parsl: "\u2AFD", part: "\u2202", pcy: "\u043F", percnt: "%", period: ".", permil: "\u2030", perp: "\u22A5", pertenk: "\u2031", pfr: "\u{1D52D}", phi: "\u03C6", phiv: "\u03D5", phmmat: "\u2133", phone: "\u260E", pi: "\u03C0", pitchfork: "\u22D4", piv: "\u03D6", planck: "\u210F", planckh: "\u210E", plankv: "\u210F", plus: "+", plusacir: "\u2A23", plusb: "\u229E", pluscir: "\u2A22", plusdo: "\u2214", plusdu: "\u2A25", pluse: "\u2A72", plusmn: "\xB1", plussim: "\u2A26", plustwo: "\u2A27", pm: "\xB1", pointint: "\u2A15", popf: "\u{1D561}", pound: "\xA3", pr: "\u227A", prE: "\u2AB3", prap: "\u2AB7", prcue: "\u227C", pre: "\u2AAF", prec: "\u227A", precapprox: "\u2AB7", preccurlyeq: "\u227C", preceq: "\u2AAF", precnapprox: "\u2AB9", precneqq: "\u2AB5", precnsim: "\u22E8", precsim: "\u227E", prime: "\u2032", primes: "\u2119", prnE: "\u2AB5", prnap: "\u2AB9", prnsim: "\u22E8", prod: "\u220F", profalar: "\u232E", profline: "\u2312", profsurf: "\u2313", prop: "\u221D", propto: "\u221D", prsim: "\u227E", prurel: "\u22B0", pscr: "\u{1D4C5}", psi: "\u03C8", puncsp: "\u2008", qfr: "\u{1D52E}", qint: "\u2A0C", qopf: "\u{1D562}", qprime: "\u2057", qscr: "\u{1D4C6}", quaternions: "\u210D", quatint: "\u2A16", quest: "?", questeq: "\u225F", quot: '"', rAarr: "\u21DB", rArr: "\u21D2", rAtail: "\u291C", rBarr: "\u290F", rHar: "\u2964", race: "\u223D\u0331", racute: "\u0155", radic: "\u221A", raemptyv: "\u29B3", rang: "\u27E9", rangd: "\u2992", range: "\u29A5", rangle: "\u27E9", raquo: "\xBB", rarr: "\u2192", rarrap: "\u2975", rarrb: "\u21E5", rarrbfs: "\u2920", rarrc: "\u2933", rarrfs: "\u291E", rarrhk: "\u21AA", rarrlp: "\u21AC", rarrpl: "\u2945", rarrsim: "\u2974", rarrtl: "\u21A3", rarrw: "\u219D", ratail: "\u291A", ratio: "\u2236", rationals: "\u211A", rbarr: "\u290D", rbbrk: "\u2773", rbrace: "}", rbrack: "]", rbrke: "\u298C", rbrksld: "\u298E", rbrkslu: "\u2990", rcaron: "\u0159", rcedil: "\u0157", rceil: "\u2309", rcub: "}", rcy: "\u0440", rdca: "\u2937", rdldhar: "\u2969", rdquo: "\u201D", rdquor: "\u201D", rdsh: "\u21B3", real: "\u211C", realine: "\u211B", realpart: "\u211C", reals: "\u211D", rect: "\u25AD", reg: "\xAE", rfisht: "\u297D", rfloor: "\u230B", rfr: "\u{1D52F}", rhard: "\u21C1", rharu: "\u21C0", rharul: "\u296C", rho: "\u03C1", rhov: "\u03F1", rightarrow: "\u2192", rightarrowtail: "\u21A3", rightharpoondown: "\u21C1", rightharpoonup: "\u21C0", rightleftarrows: "\u21C4", rightleftharpoons: "\u21CC", rightrightarrows: "\u21C9", rightsquigarrow: "\u219D", rightthreetimes: "\u22CC", ring: "\u02DA", risingdotseq: "\u2253", rlarr: "\u21C4", rlhar: "\u21CC", rlm: "\u200F", rmoust: "\u23B1", rmoustache: "\u23B1", rnmid: "\u2AEE", roang: "\u27ED", roarr: "\u21FE", robrk: "\u27E7", ropar: "\u2986", ropf: "\u{1D563}", roplus: "\u2A2E", rotimes: "\u2A35", rpar: ")", rpargt: "\u2994", rppolint: "\u2A12", rrarr: "\u21C9", rsaquo: "\u203A", rscr: "\u{1D4C7}", rsh: "\u21B1", rsqb: "]", rsquo: "\u2019", rsquor: "\u2019", rthree: "\u22CC", rtimes: "\u22CA", rtri: "\u25B9", rtrie: "\u22B5", rtrif: "\u25B8", rtriltri: "\u29CE", ruluhar: "\u2968", rx: "\u211E", sacute: "\u015B", sbquo: "\u201A", sc: "\u227B", scE: "\u2AB4", scap: "\u2AB8", scaron: "\u0161", sccue: "\u227D", sce: "\u2AB0", scedil: "\u015F", scirc: "\u015D", scnE: "\u2AB6", scnap: "\u2ABA", scnsim: "\u22E9", scpolint: "\u2A13", scsim: "\u227F", scy: "\u0441", sdot: "\u22C5", sdotb: "\u22A1", sdote: "\u2A66", seArr: "\u21D8", searhk: "\u2925", searr: "\u2198", searrow: "\u2198", sect: "\xA7", semi: ";", seswar: "\u2929", setminus: "\u2216", setmn: "\u2216", sext: "\u2736", sfr: "\u{1D530}", sfrown: "\u2322", sharp: "\u266F", shchcy: "\u0449", shcy: "\u0448", shortmid: "\u2223", shortparallel: "\u2225", shy: "\xAD", sigma: "\u03C3", sigmaf: "\u03C2", sigmav: "\u03C2", sim: "\u223C", simdot: "\u2A6A", sime: "\u2243", simeq: "\u2243", simg: "\u2A9E", simgE: "\u2AA0", siml: "\u2A9D", simlE: "\u2A9F", simne: "\u2246", simplus: "\u2A24", simrarr: "\u2972", slarr: "\u2190", smallsetminus: "\u2216", smashp: "\u2A33", smeparsl: "\u29E4", smid: "\u2223", smile: "\u2323", smt: "\u2AAA", smte: "\u2AAC", smtes: "\u2AAC\uFE00", softcy: "\u044C", sol: "/", solb: "\u29C4", solbar: "\u233F", sopf: "\u{1D564}", spades: "\u2660", spadesuit: "\u2660", spar: "\u2225", sqcap: "\u2293", sqcaps: "\u2293\uFE00", sqcup: "\u2294", sqcups: "\u2294\uFE00", sqsub: "\u228F", sqsube: "\u2291", sqsubset: "\u228F", sqsubseteq: "\u2291", sqsup: "\u2290", sqsupe: "\u2292", sqsupset: "\u2290", sqsupseteq: "\u2292", squ: "\u25A1", square: "\u25A1", squarf: "\u25AA", squf: "\u25AA", srarr: "\u2192", sscr: "\u{1D4C8}", ssetmn: "\u2216", ssmile: "\u2323", sstarf: "\u22C6", star: "\u2606", starf: "\u2605", straightepsilon: "\u03F5", straightphi: "\u03D5", strns: "\xAF", sub: "\u2282", subE: "\u2AC5", subdot: "\u2ABD", sube: "\u2286", subedot: "\u2AC3", submult: "\u2AC1", subnE: "\u2ACB", subne: "\u228A", subplus: "\u2ABF", subrarr: "\u2979", subset: "\u2282", subseteq: "\u2286", subseteqq: "\u2AC5", subsetneq: "\u228A", subsetneqq: "\u2ACB", subsim: "\u2AC7", subsub: "\u2AD5", subsup: "\u2AD3", succ: "\u227B", succapprox: "\u2AB8", succcurlyeq: "\u227D", succeq: "\u2AB0", succnapprox: "\u2ABA", succneqq: "\u2AB6", succnsim: "\u22E9", succsim: "\u227F", sum: "\u2211", sung: "\u266A", sup1: "\xB9", sup2: "\xB2", sup3: "\xB3", sup: "\u2283", supE: "\u2AC6", supdot: "\u2ABE", supdsub: "\u2AD8", supe: "\u2287", supedot: "\u2AC4", suphsol: "\u27C9", suphsub: "\u2AD7", suplarr: "\u297B", supmult: "\u2AC2", supnE: "\u2ACC", supne: "\u228B", supplus: "\u2AC0", supset: "\u2283", supseteq: "\u2287", supseteqq: "\u2AC6", supsetneq: "\u228B", supsetneqq: "\u2ACC", supsim: "\u2AC8", supsub: "\u2AD4", supsup: "\u2AD6", swArr: "\u21D9", swarhk: "\u2926", swarr: "\u2199", swarrow: "\u2199", swnwar: "\u292A", szlig: "\xDF", target: "\u2316", tau: "\u03C4", tbrk: "\u23B4", tcaron: "\u0165", tcedil: "\u0163", tcy: "\u0442", tdot: "\u20DB", telrec: "\u2315", tfr: "\u{1D531}", there4: "\u2234", therefore: "\u2234", theta: "\u03B8", thetasym: "\u03D1", thetav: "\u03D1", thickapprox: "\u2248", thicksim: "\u223C", thinsp: "\u2009", thkap: "\u2248", thksim: "\u223C", thorn: "\xFE", tilde: "\u02DC", times: "\xD7", timesb: "\u22A0", timesbar: "\u2A31", timesd: "\u2A30", tint: "\u222D", toea: "\u2928", top: "\u22A4", topbot: "\u2336", topcir: "\u2AF1", topf: "\u{1D565}", topfork: "\u2ADA", tosa: "\u2929", tprime: "\u2034", trade: "\u2122", triangle: "\u25B5", triangledown: "\u25BF", triangleleft: "\u25C3", trianglelefteq: "\u22B4", triangleq: "\u225C", triangleright: "\u25B9", trianglerighteq: "\u22B5", tridot: "\u25EC", trie: "\u225C", triminus: "\u2A3A", triplus: "\u2A39", trisb: "\u29CD", tritime: "\u2A3B", trpezium: "\u23E2", tscr: "\u{1D4C9}", tscy: "\u0446", tshcy: "\u045B", tstrok: "\u0167", twixt: "\u226C", twoheadleftarrow: "\u219E", twoheadrightarrow: "\u21A0", uArr: "\u21D1", uHar: "\u2963", uacute: "\xFA", uarr: "\u2191", ubrcy: "\u045E", ubreve: "\u016D", ucirc: "\xFB", ucy: "\u0443", udarr: "\u21C5", udblac: "\u0171", udhar: "\u296E", ufisht: "\u297E", ufr: "\u{1D532}", ugrave: "\xF9", uharl: "\u21BF", uharr: "\u21BE", uhblk: "\u2580", ulcorn: "\u231C", ulcorner: "\u231C", ulcrop: "\u230F", ultri: "\u25F8", umacr: "\u016B", uml: "\xA8", uogon: "\u0173", uopf: "\u{1D566}", uparrow: "\u2191", updownarrow: "\u2195", upharpoonleft: "\u21BF", upharpoonright: "\u21BE", uplus: "\u228E", upsi: "\u03C5", upsih: "\u03D2", upsilon: "\u03C5", upuparrows: "\u21C8", urcorn: "\u231D", urcorner: "\u231D", urcrop: "\u230E", uring: "\u016F", urtri: "\u25F9", uscr: "\u{1D4CA}", utdot: "\u22F0", utilde: "\u0169", utri: "\u25B5", utrif: "\u25B4", uuarr: "\u21C8", uuml: "\xFC", uwangle: "\u29A7", vArr: "\u21D5", vBar: "\u2AE8", vBarv: "\u2AE9", vDash: "\u22A8", vangrt: "\u299C", varepsilon: "\u03F5", varkappa: "\u03F0", varnothing: "\u2205", varphi: "\u03D5", varpi: "\u03D6", varpropto: "\u221D", varr: "\u2195", varrho: "\u03F1", varsigma: "\u03C2", varsubsetneq: "\u228A\uFE00", varsubsetneqq: "\u2ACB\uFE00", varsupsetneq: "\u228B\uFE00", varsupsetneqq: "\u2ACC\uFE00", vartheta: "\u03D1", vartriangleleft: "\u22B2", vartriangleright: "\u22B3", vcy: "\u0432", vdash: "\u22A2", vee: "\u2228", veebar: "\u22BB", veeeq: "\u225A", vellip: "\u22EE", verbar: "|", vert: "|", vfr: "\u{1D533}", vltri: "\u22B2", vnsub: "\u2282\u20D2", vnsup: "\u2283\u20D2", vopf: "\u{1D567}", vprop: "\u221D", vrtri: "\u22B3", vscr: "\u{1D4CB}", vsubnE: "\u2ACB\uFE00", vsubne: "\u228A\uFE00", vsupnE: "\u2ACC\uFE00", vsupne: "\u228B\uFE00", vzigzag: "\u299A", wcirc: "\u0175", wedbar: "\u2A5F", wedge: "\u2227", wedgeq: "\u2259", weierp: "\u2118", wfr: "\u{1D534}", wopf: "\u{1D568}", wp: "\u2118", wr: "\u2240", wreath: "\u2240", wscr: "\u{1D4CC}", xcap: "\u22C2", xcirc: "\u25EF", xcup: "\u22C3", xdtri: "\u25BD", xfr: "\u{1D535}", xhArr: "\u27FA", xharr: "\u27F7", xi: "\u03BE", xlArr: "\u27F8", xlarr: "\u27F5", xmap: "\u27FC", xnis: "\u22FB", xodot: "\u2A00", xopf: "\u{1D569}", xoplus: "\u2A01", xotime: "\u2A02", xrArr: "\u27F9", xrarr: "\u27F6", xscr: "\u{1D4CD}", xsqcup: "\u2A06", xuplus: "\u2A04", xutri: "\u25B3", xvee: "\u22C1", xwedge: "\u22C0", yacute: "\xFD", yacy: "\u044F", ycirc: "\u0177", ycy: "\u044B", yen: "\xA5", yfr: "\u{1D536}", yicy: "\u0457", yopf: "\u{1D56A}", yscr: "\u{1D4CE}", yucy: "\u044E", yuml: "\xFF", zacute: "\u017A", zcaron: "\u017E", zcy: "\u0437", zdot: "\u017C", zeetrf: "\u2128", zeta: "\u03B6", zfr: "\u{1D537}", zhcy: "\u0436", zigrarr: "\u21DD", zopf: "\u{1D56B}", zscr: "\u{1D4CF}", zwj: "\u200D", zwnj: "\u200C" };
var n = qa("characterReference", (0, function(a, b, q2) {
  var d2 = this;
  let c = [0, 0, 0];
  var e2 = function(r3) {
    if (59 === r3 && c[0] > 0) {
      var j3 = a.exit("characterReferenceValue");
      if (0 == c[2] && !Fb(X(d2.sliceSerialize(j3)))) return q2(r3);
      a.enter("characterReferenceMarker"), a.consume(r3), a.exit("characterReferenceMarker"), a.exit("characterReference");
      return b;
    }
    if (pe(c[2], r3) && c[0] < c[1]) {
      var f2 = c[0] + 1 | 0;
      c[0] = f2, a.consume(r3);
      return e2;
    }
    return q2(r3);
  };
  let r2 = function(b2) {
    if (88 === b2 || 120 === b2) return a.enter("characterReferenceMarkerHexadecimal"), a.consume(b2), a.exit("characterReferenceMarkerHexadecimal"), a.enter("characterReferenceValue"), c[1] = 6, c[2] = 1, e2;
    a.enter("characterReferenceValue"), c[1] = 7, c[2] = 2;
    return e2(b2);
  }, j2 = function(b2) {
    if (35 === b2) return a.enter("characterReferenceMarkerNumeric"), a.consume(b2), a.exit("characterReferenceMarkerNumeric"), r2;
    a.enter("characterReferenceValue"), c[1] = 31, c[2] = 0;
    return e2(b2);
  };
  return function(b2) {
    a.enter("characterReference"), a.enter("characterReferenceMarker"), a.consume(b2), a.exit("characterReferenceMarker");
    return j2;
  };
}));
var nb = { tokenize: function(a, b, q2) {
  var c = this;
  let e2 = function(a2) {
    return c.parser.lazy[c.now().line] ? q2(a2) : b(a2);
  };
  return function(b2) {
    if (Y(b2)) return q2(b2);
    a.enter("lineEnding"), a.consume(b2), a.exit("lineEnding");
    return e2;
  };
} };
nb.partial = d;
var o = { name: "codeFenced", tokenize: function(a, b, q2) {
  var c, k2, d2, j2, f2 = this, g2 = 0, r2 = 0, e2 = 0;
  let h2 = { tokenize: function(a2, b2, q3) {
    var c2 = 0;
    let d3 = function(c3) {
      return Y(c3) || Z(c3) ? (a2.exit("codeFencedFence"), b2(c3)) : q3(c3);
    };
    var j3 = function(b3) {
      return b3 == e2 ? (c2 = c2 + 1 | 0, a2.consume(b3), j3) : c2 >= r2 ? (a2.exit("codeFencedFenceSequence"), $(b3) ? ca(a2, d3, "whitespace", 0)(b3) : d3(b3)) : q3(b3);
    };
    let g3 = function(b3) {
      return b3 == e2 ? (a2.enter("codeFencedFenceSequence"), j3(b3)) : q3(b3);
    }, i3 = function(b3) {
      a2.enter("codeFencedFence");
      if ($(b3)) {
        var q4 = ka(f2.parser.constructs.disable.null, "codeIndented") ? 0 : 4;
        return ca(a2, g3, "linePrefix", q4)(b3);
      }
      return g3(b3);
    };
    return function(b3) {
      a2.enter("lineEnding"), a2.consume(b3), a2.exit("lineEnding");
      return i3;
    };
  } };
  h2.partial = true;
  let i2 = function(q3) {
    a.exit("codeFenced");
    return b(q3);
  };
  var p2 = function(b2) {
    if (Y(b2) || Z(b2)) return a.exit("codeFlowValue"), d2(b2);
    a.consume(b2);
    return p2;
  };
  d2 = function(b2) {
    if (Y(b2) || Z(b2)) return a.check(nb, j2, i2)(b2);
    a.enter("codeFlowValue");
    return p2(b2);
  };
  let n2 = function(b2) {
    return g2 > 0 && $(b2) ? ca(a, d2, "linePrefix", g2 + 1)(b2) : d2(b2);
  }, l2 = function(b2) {
    a.enter("lineEnding"), a.consume(b2), a.exit("lineEnding");
    return n2;
  };
  j2 = function(b2) {
    return a.attempt(h2, i2, l2)(b2);
  };
  var K = function(b2) {
    if (Y(b2) || Z(b2)) return a.exit("chunkString"), a.exit("codeFencedFenceInfo"), c(b2);
    if ($(b2)) return a.exit("chunkString"), a.exit("codeFencedFenceInfo"), ca(a, k2, "whitespace", 0)(b2);
    if (96 === b2 && b2 == e2) return q2(b2);
    a.consume(b2);
    return K;
  }, A2 = function(b2) {
    if (Y(b2) || Z(b2)) return a.exit("chunkString"), a.exit("codeFencedFenceMeta"), c(b2);
    if (96 === b2 && b2 == e2) return q2(b2);
    a.consume(b2);
    return A2;
  };
  k2 = function(b2) {
    if (Y(b2) || Z(b2)) return c(b2);
    a.enter("codeFencedFenceMeta");
    var q3 = {};
    q3.contentType = "string", a.enter("chunkString", q3);
    return A2(b2);
  }, c = function(q3) {
    if (Y(q3) || Z(q3)) return a.exit("codeFencedFence"), f2.interrupt ? b(q3) : a.check(nb, j2, i2)(q3);
    a.enter("codeFencedFenceInfo");
    var c2 = {};
    c2.contentType = "string", a.enter("chunkString", c2);
    return K(q3);
  };
  var u2 = function(b2) {
    if (b2 == e2) return r2 = r2 + 1 | 0, a.consume(b2), u2;
    if (r2 < 3) return q2(b2);
    a.exit("codeFencedFenceSequence");
    return $(b2) ? ca(a, c, "whitespace", 0)(b2) : c(b2);
  };
  return function(b2) {
    var q3 = f2.events, c2 = q3[W(q3) - 1];
    if (c2) {
      q3 = c2[1];
      var d3 = "linePrefix" == q3.type;
    } else d3 = false;
    d3 ? (q3 = c2[2], d3 = X(q3.sliceSerialize.call(c2[2], c2[1], true)).length) : d3 = 0;
    g2 = d3, e2 = b2 | 0, a.enter("codeFenced"), a.enter("codeFencedFence"), a.enter("codeFencedFenceSequence");
    return u2(b2);
  };
}, concrete: d };
var Vb = { tokenize: function(a, b, q2) {
  var c, e2 = this;
  let d2 = function(a2) {
    var d3 = e2.events, r2 = d3[W(d3) - 1];
    if (r2) {
      d3 = r2[1];
      var j2 = "linePrefix" == d3.type;
    } else j2 = false;
    j2 ? (d3 = r2[2], j2 = X(d3.sliceSerialize.call(r2[2], r2[1], true)).length >= 4) : j2 = false;
    return j2 ? b(a2) : Z(a2) ? c(a2) : q2(a2);
  };
  c = function(b2) {
    return e2.parser.lazy[e2.now().line] ? q2(b2) : Z(b2) ? (a.enter("lineEnding"), a.consume(b2), a.exit("lineEnding"), c) : ca(a, d2, "linePrefix", 5)(b2);
  };
  return c;
} };
Vb.partial = d, e = qa("codeIndented", (0, function(a, b, q2) {
  var c, r2 = this, e2 = function(b2) {
    if (Y(b2) || Z(b2)) return a.exit("codeFlowValue"), c(b2);
    a.consume(b2);
    return e2;
  };
  let d2 = function(q3) {
    a.exit("codeIndented");
    return b(q3);
  };
  c = function(b2) {
    if (Y(b2)) return d2(b2);
    if (Z(b2)) return a.attempt(Vb, c, d2)(b2);
    a.enter("codeFlowValue");
    return e2(b2);
  };
  let j2 = function(a2) {
    var b2 = r2.events, e3 = b2[W(b2) - 1];
    if (e3) {
      b2 = e3[1];
      var d3 = "linePrefix" == b2.type;
    } else d3 = false;
    d3 ? (b2 = e3[2], d3 = X(b2.sliceSerialize.call(e3[2], e3[1], true)).length >= 4) : d3 = false;
    return d3 ? c(a2) : q2(a2);
  };
  return function(b2) {
    a.enter("codeIndented");
    return ca(a, j2, "linePrefix", 5)(b2);
  };
}));
var u = { name: "codeText", tokenize: function(a, b, q2) {
  var r2, c, j2 = 0, e2 = 0, d2 = function(b2) {
    if (Y(b2) || 32 === b2 || 96 === b2 || Z(b2)) return a.exit("codeTextData"), c(b2);
    a.consume(b2);
    return d2;
  }, f2 = function(q3) {
    if (96 === q3) return a.consume(q3), e2++, f2;
    if (e2 == j2) return a.exit("codeTextSequence"), a.exit("codeText"), b(q3);
    r2.type = "codeTextData";
    return d2(q3);
  };
  c = function(b2) {
    if (Y(b2)) return q2(b2);
    if (32 === b2) return a.enter("space"), a.consume(b2), a.exit("space"), c;
    if (96 === b2) return r2 = a.enter("codeTextSequence"), e2 = 0, f2(b2);
    if (Z(b2)) return a.enter("lineEnding"), a.consume(b2), a.exit("lineEnding"), c;
    a.enter("codeTextData");
    return d2(b2);
  };
  var g2 = function(b2) {
    if (96 === b2) return a.consume(b2), j2++, g2;
    a.exit("codeTextSequence");
    return c(b2);
  };
  return function(b2) {
    a.enter("codeText"), a.enter("codeTextSequence");
    return g2(b2);
  };
}, previous: function(a) {
  if (96 !== a) return true;
  a = this.events;
  var b = a[W(a) - 1][1];
  return "characterEscape" == b.type;
}, resolve: function(a, b) {
  var c = W(a) - 4 | 0, q2 = a[3][1];
  "lineEnding" == q2.type ? q2 = true : (b = a[3][1], q2 = "space" == b.type);
  q2 ? (q2 = a[c][1], "lineEnding" == q2.type ? q2 = true : (b = a[c][1], q2 = "space" == b.type)) : q2 = false;
  if (q2) for (q2 = 3; ; ) {
    if ((q2 + 1 | 0) >= c) {
      q2 = 3;
      break;
    }
    q2++;
    b = a[q2][1];
    if ("codeTextData" == b.type) {
      q2 = a[3], b = q2[1], b.type = "codeTextPadding", a[c][1].type = "codeTextPadding", c = b = c - 2 | 0, q2 = 5;
      break;
    }
  }
  else q2 = 3;
  b = c + 1 | 0;
  q2--, c = -1;
  for (; q2 < b; ) {
    q2++;
    if (c < 0) q2 != b && "lineEnding" != a[q2][1].type && (c = q2);
    else if (q2 == b || "lineEnding" == a[q2][1].type) {
      var e2 = a[c][1];
      e2.type = "codeTextData", q2 != (c + 2 | 0) && (e2 = a[c][1], e2.end = a[q2 - 1][1].end, e2 = c + 2 | 0, c = (q2 - c | 0) - 2 | 0, a.splice(e2, c), b = b - c | 0, q2 = e2), c = -1;
    }
  }
  return a;
} };
var Wb = (0, function(a, b, q2, c, e2, d2) {
  var p2 = this;
  let k2 = c + "", g2 = e2 + "", h2 = d2 + "";
  var r2, j2, f2 = 0, i2 = false;
  let K = function(b2) {
    return 91 === b2 || 92 === b2 || 93 === b2 ? (a.consume(b2), f2++, r2) : r2(b2);
  };
  r2 = function(b2) {
    if (Y(b2) || 91 === b2 || 93 === b2 || Z(b2)) return a.exit("chunkString"), j2(b2);
    var q3 = f2;
    f2++;
    if (q3 > 999) return a.exit("chunkString"), j2(b2);
    a.consume(b2), i2 = i2 || !$(b2);
    return 92 === b2 ? K : r2;
  }, j2 = function(c2) {
    if (f2 > 999 || Y(c2) || 91 === c2 || 93 === c2 && !i2 || 94 === c2 && 0 == f2 && ia(p2.parser.constructs, "_hiddenFootnoteSupport")) return q2(c2);
    if (93 === c2) return a.exit(h2), a.enter(g2), a.consume(c2), a.exit(g2), a.exit(k2), b;
    if (Z(c2)) return a.enter("lineEnding"), a.consume(c2), a.exit("lineEnding"), j2;
    var e3 = {};
    e3.contentType = "string", a.enter("chunkString", e3);
    return r2(c2);
  };
  return function(b2) {
    a.enter(k2), a.enter(g2), a.consume(b2), a.exit(g2), a.enter(h2);
    return j2;
  };
});
var Bd = new RegExp("[\\t\\n\\r ]+", "g");
var Cd = new RegExp("^ | $", "g");
var Xb = { tokenize: function(a, b, q2) {
  let c = function(a2) {
    return Y(a2) || Z(a2) ? b(a2) : q2(a2);
  }, e2 = function(b2) {
    return $(b2) ? ca(a, c, "whitespace", 0)(b2) : c(b2);
  }, d2 = function(b2) {
    return Fc(a, e2, q2, "definitionTitle", "definitionTitleMarker", "definitionTitleString")(b2);
  };
  return function(b2) {
    return oa(b2) ? Ta(a, d2)(b2) : q2(b2);
  };
} };
Xb.partial = d;
var v = qa("definition", (0, function(a, b, q2) {
  var c = this, e2 = hf;
  let d2 = function(d3) {
    return Y(d3) || Z(d3) ? (a.exit("definition"), c.parser.defined.push(e2), b(d3)) : q2(d3);
  }, r2 = function(b2) {
    return $(b2) ? ca(a, d2, "whitespace", 0)(b2) : d2(b2);
  }, f2 = function(b2) {
    return a.attempt(Xb, r2, r2)(b2);
  }, j2 = function(b2) {
    return Ec(a, f2, q2, "definitionDestination", "definitionDestinationLiteral", "definitionDestinationLiteralMarker", "definitionDestinationRaw", "definitionDestinationString", 0)(b2);
  }, g2 = function(b2) {
    return oa(b2) ? Ta(a, j2)(b2) : j2(b2);
  }, i2 = function(b2) {
    var d3 = c.events, r3 = c.sliceSerialize;
    r3 = X(c.sliceSerialize(d3[W(d3) - 1][1])), e2 = Ja(X(r3.slice(1, -1)));
    return 58 === b2 ? (a.enter("definitionMarker"), a.consume(b2), a.exit("definitionMarker"), g2) : q2(b2);
  }, k2 = function(b2) {
    let e3 = [];
    e3.push(a), e3.push(i2), e3.push(q2), e3.push("definitionLabel"), e3.push("definitionLabelMarker"), e3.push("definitionLabelString");
    return Wb.apply(c, e3)(b2);
  };
  return function(b2) {
    a.enter("definition");
    return k2(b2);
  };
}));
var w = qa("hardBreakEscape", function(a, b, q2) {
  let c = function(c2) {
    return Z(c2) ? (a.exit("hardBreakEscape"), b(c2)) : q2(c2);
  };
  return function(b2) {
    a.enter("hardBreakEscape"), a.consume(b2);
    return c;
  };
});
var x = { name: "headingAtx", tokenize: function(a, b, q2) {
  var c, e2 = 0, d2 = function(b2) {
    if (Y(b2) || 35 === b2 || oa(b2)) return a.exit("atxHeadingText"), c(b2);
    a.consume(b2);
    return d2;
  }, r2 = function(b2) {
    if (35 === b2) return a.consume(b2), r2;
    a.exit("atxHeadingSequence");
    return c(b2);
  };
  c = function(q3) {
    if (35 === q3) return a.enter("atxHeadingSequence"), r2(q3);
    if (Y(q3) || Z(q3)) return a.exit("atxHeading"), b(q3);
    if ($(q3)) return ca(a, c, "whitespace", 0)(q3);
    a.enter("atxHeadingText");
    return d2(q3);
  };
  var j2 = function(b2) {
    return 35 === b2 && e2 < 6 ? (e2 = e2 + 1 | 0, a.consume(b2), j2) : Y(b2) || oa(b2) ? (a.exit("atxHeadingSequence"), c(b2)) : q2(b2);
  };
  let f2 = function(b2) {
    a.enter("atxHeadingSequence");
    return j2(b2);
  };
  return function(b2) {
    a.enter("atxHeading");
    return f2(b2);
  };
}, resolve: function(a, b) {
  var q2 = W(a) - 2 | 0, c = a[3][1];
  c = "whitespace" == c.type ? 5 : 3, (q2 - 2 | 0) > c && "whitespace" == a[q2][1].type && (q2 = q2 - 2 | 0);
  var e2 = a[q2][1];
  "atxHeadingSequence" == e2.type && (c == (q2 - 1 | 0) || (q2 - 4 | 0) > c && "whitespace" == a[q2 - 2][1].type) && (q2 = c + 1 == q2 ? q2 - 2 | 0 : q2 - 4 | 0);
  if (q2 > c) {
    var d2 = {};
    d2.type = "atxHeadingText", d2.start = a[c][1].start, d2.end = a[q2][1].end, e2 = {}, e2.type = "chunkText", e2.start = a[c][1].start, e2.end = a[q2][1].end, e2.contentType = "text", ra(a, c, (q2 - c | 0) + 1 | 0, [["enter", d2, b], ["enter", e2, b], ["exit", e2, b], ["exit", d2, b]]);
  }
  return a;
} };
var Dd = "address article aside base basefont blockquote body caption center col colgroup dd details dialog dir div dl dt fieldset figcaption figure footer form frame frameset h1 h2 h3 h4 h5 h6 head header hr html iframe legend li link main menu menuitem nav noframes ol optgroup option p param search section summary table tbody td tfoot th thead title tr track ul".split(mf);
var Yb = "pre script style textarea".split(mf);
f = function(a, b) {
  for (var q2 = W(a); --q2 >= 0; ) {
    if ("enter" == a[q2][0]) {
      var e2 = a[q2][1];
      b = "htmlFlow" == e2.type;
    } else b = false;
    if (b) break;
  }
  if (q2 > 1 && "linePrefix" == a[q2 - 2][1].type) {
    var c = a[q2][1];
    b = q2 - 2 | 0, c.start = a[b][1].start, c = a[q2 + 1][1], c.start = a[b][1].start, a.splice(b, 2);
  }
  return a;
};
var Zb = { tokenize: function(a, b, q2) {
  var c = this;
  let e2 = function(a2) {
    return c.parser.lazy[c.now().line] ? q2(a2) : b(a2);
  };
  return function(b2) {
    return Z(b2) ? (a.enter("lineEnding"), a.consume(b2), a.exit("lineEnding"), e2) : q2(b2);
  };
} };
Zb.partial = d;
var _b = { tokenize: function(a, b, q2) {
  return function(c) {
    a.enter("lineEnding"), a.consume(c), a.exit("lineEnding");
    return a.attempt(Na, b, q2);
  };
} };
_b.partial = d;
var y = { name: "htmlFlow", tokenize: function(a, b, q2) {
  var i2, k2, y2, s2, w2, N, f2, g2, h2, r2 = this, e2 = 0, A2 = false, j2 = hf, p2 = 0, u2 = 0;
  let c = function(b2) {
    a.consume(b2);
  };
  i2 = function(q3) {
    a.exit("htmlFlow");
    return b(q3);
  };
  var K = function(b2) {
    if (Y(b2) || Z(b2)) return a.exit("htmlFlowData"), i2(b2);
    c(b2);
    return K;
  }, d2 = function(b2) {
    if (45 === b2 && 2 == e2) return c(b2), s2;
    if (60 === b2 && 1 == e2) return c(b2), w2;
    if (62 === b2 && 4 == e2) return c(b2), K;
    if (63 === b2 && 3 == e2) return c(b2), f2;
    if (93 === b2 && 5 == e2) return c(b2), N;
    if (Z(b2) && (6 == e2 || 7 == e2)) return a.exit("htmlFlowData"), a.check(_b, i2, k2)(b2);
    if (Y(b2) || Z(b2)) return a.exit("htmlFlowData"), k2(b2);
    c(b2);
    return d2;
  };
  let T2 = function(b2) {
    a.enter("lineEnding"), c(b2), a.exit("lineEnding");
    return y2;
  };
  k2 = function(b2) {
    return a.check(Zb, T2, i2)(b2);
  }, y2 = function(b2) {
    if (Y(b2) || Z(b2)) return k2(b2);
    a.enter("htmlFlowData");
    return d2(b2);
  }, s2 = function(a2) {
    return 45 === a2 ? (c(a2), f2) : d2(a2);
  };
  var L = function(a2) {
    if (62 === a2) return ka(Yb, j2.toLowerCase()) ? (c(a2), K) : d2(a2);
    if (ba(va, a2) && j2.length < 8) {
      c(a2);
      var b2 = j2;
      j2 = b2 + Ia(a2);
      return L;
    }
    return d2(a2);
  };
  w2 = function(a2) {
    return 47 === a2 ? (c(a2), j2 = hf, L) : d2(a2);
  }, N = function(a2) {
    return 93 === a2 ? (c(a2), f2) : d2(a2);
  }, f2 = function(a2) {
    return 62 === a2 ? (c(a2), K) : 45 === a2 && 2 == e2 ? (c(a2), f2) : d2(a2);
  };
  var B2 = function(a2) {
    return Y(a2) || Z(a2) ? d2(a2) : $(a2) ? (c(a2), B2) : q2(a2);
  };
  let n2 = function(a2) {
    return 62 === a2 ? (c(a2), B2) : q2(a2);
  }, m2 = function(a2) {
    return 47 === a2 || 62 === a2 || $(a2) ? g2(a2) : q2(a2);
  };
  var O = function(a2) {
    if (a2 == u2) return c(a2), u2 = 0, m2;
    if (Y(a2) || Z(a2)) return q2(a2);
    c(a2);
    return O;
  }, Q = function(a2) {
    if (Y(a2) || 34 === a2 || 39 === a2 || 47 === a2 || 60 === a2 || 61 === a2 || 62 === a2 || 96 === a2 || oa(a2)) return h2(a2);
    c(a2);
    return Q;
  }, t2 = function(a2) {
    return Y(a2) || 60 === a2 || 61 === a2 || 62 === a2 || 96 === a2 ? q2(a2) : 34 === a2 || 39 === a2 ? (c(a2), u2 = a2 | 0, O) : $(a2) ? (c(a2), t2) : Q(a2);
  };
  h2 = function(a2) {
    return 61 === a2 ? (c(a2), t2) : $(a2) ? (c(a2), h2) : g2(a2);
  };
  var M = function(a2) {
    return 45 === a2 || 46 === a2 || 58 === a2 || 95 === a2 || ba(wa, a2) ? (c(a2), M) : h2(a2);
  };
  g2 = function(a2) {
    return 47 === a2 ? (c(a2), n2) : 58 === a2 || 95 === a2 || ba(va, a2) ? (c(a2), M) : $(a2) ? (c(a2), g2) : n2(a2);
  };
  var o2 = function(a2) {
    return $(a2) ? (c(a2), o2) : n2(a2);
  };
  let W2 = function(a2) {
    return 62 === a2 ? (c(a2), r2.interrupt ? b : d2) : q2(a2);
  };
  var l2 = function(a2) {
    if (Y(a2) || 47 === a2 || 62 === a2 || oa(a2)) {
      var f3, i3 = 47 === a2, k3 = j2.toLowerCase();
      if (!i3 && !A2 && ka(Yb, k3)) return e2 = 1, r2.interrupt ? b(a2) : d2(a2);
      if (ka(Dd, k3)) return e2 = 6, i3 ? (c(a2), W2) : r2.interrupt ? b(a2) : d2(a2);
      e2 = 7;
      if (r2.interrupt) {
        f3 = r2.parser.lazy;
        var h3 = !f3[r2.now().line];
      } else h3 = false;
      return h3 ? q2(a2) : A2 ? o2(a2) : g2(a2);
    }
    if (45 === a2 || ba(wa, a2)) {
      c(a2);
      var p3 = j2;
      j2 = p3 + Ia(a2);
      return l2;
    }
    return q2(a2);
  };
  let P = function(a2) {
    return ba(va, a2) ? (c(a2), j2 = Ia(a2), l2) : q2(a2);
  };
  var C = function(a2) {
    var e3 = p2, j3 = p2;
    p2 = j3 + 1 | 0;
    return !Y(a2) && zc(a2) == "CDATA[".charCodeAt(e3) ? (c(a2), 6 == (e3 + 1 | 0) ? r2.interrupt ? b : d2 : C) : q2(a2);
  };
  let z2 = function(a2) {
    return 45 === a2 ? (c(a2), r2.interrupt ? b : f2) : q2(a2);
  }, F = function(a2) {
    return 45 === a2 ? (c(a2), e2 = 2, z2) : 91 === a2 ? (c(a2), e2 = 5, p2 = 0, C) : ba(va, a2) ? (c(a2), e2 = 4, r2.interrupt ? b : f2) : q2(a2);
  }, X2 = function(a2) {
    return 33 === a2 ? (c(a2), F) : 47 === a2 ? (c(a2), A2 = true, P) : 63 === a2 ? (c(a2), e2 = 3, r2.interrupt ? b : f2) : ba(va, a2) ? (c(a2), j2 = Ia(a2), l2) : q2(a2);
  };
  return function(b2) {
    a.enter("htmlFlow"), a.enter("htmlFlowData"), c(b2);
    return X2;
  };
}, concrete: d, resolveTo: f };
var z = qa("htmlText", (0, function(a, b, q2) {
  var e2, r2, s2, w2, h2, p2, o2 = this, K = 0, g2 = 0;
  let c = function(b2) {
    a.consume(b2);
  }, N = function(b2) {
    a.enter("htmlTextData");
    return e2(b2);
  }, C = function(b2) {
    if ($(b2)) {
      var q3 = ka(o2.parser.constructs.disable.null, "codeIndented") ? 0 : 4;
      return ca(a, N, "linePrefix", q3)(b2);
    }
    return N(b2);
  }, d2 = function(b2) {
    a.exit("htmlTextData"), a.enter("lineEnding"), c(b2), a.exit("lineEnding");
    return C;
  }, j2 = function(e3) {
    return 62 === e3 ? (c(e3), a.exit("htmlTextData"), a.exit("htmlText"), b) : q2(e3);
  }, T2 = function(a2) {
    return 47 === a2 || 62 === a2 || oa(a2) ? r2(a2) : q2(a2);
  };
  var L = function(a2) {
    if (Y(a2) || 34 === a2 || 39 === a2 || 60 === a2 || 61 === a2 || 96 === a2) return q2(a2);
    if (47 === a2 || 62 === a2 || oa(a2)) return r2(a2);
    c(a2);
    return L;
  }, A2 = function(a2) {
    if (a2 == K) return c(a2), K = 0, T2;
    if (Y(a2)) return q2(a2);
    if (Z(a2)) return e2 = A2, d2(a2);
    c(a2);
    return A2;
  }, u2 = function(a2) {
    if (Y(a2) || 60 === a2 || 61 === a2 || 62 === a2 || 96 === a2) return q2(a2);
    if (34 === a2 || 39 === a2) return c(a2), K = a2 | 0, A2;
    if (Z(a2)) return e2 = u2, d2(a2);
    if ($(a2)) return c(a2), u2;
    c(a2);
    return L;
  }, n2 = function(a2) {
    return 61 === a2 ? (c(a2), u2) : Z(a2) ? (e2 = n2, d2(a2)) : $(a2) ? (c(a2), n2) : r2(a2);
  }, B2 = function(a2) {
    return 45 === a2 || 46 === a2 || 58 === a2 || 95 === a2 || ba(wa, a2) ? (c(a2), B2) : n2(a2);
  };
  r2 = function(a2) {
    return 47 === a2 ? (c(a2), j2) : 58 === a2 || 95 === a2 || ba(va, a2) ? (c(a2), B2) : Z(a2) ? (e2 = r2, d2(a2)) : $(a2) ? (c(a2), r2) : j2(a2);
  };
  var O = function(a2) {
    return 45 === a2 || ba(wa, a2) ? (c(a2), O) : 47 === a2 || 62 === a2 || oa(a2) ? r2(a2) : q2(a2);
  }, l2 = function(a2) {
    return Z(a2) ? (e2 = l2, d2(a2)) : $(a2) ? (c(a2), l2) : j2(a2);
  }, Q = function(a2) {
    return 45 === a2 || ba(wa, a2) ? (c(a2), Q) : l2(a2);
  };
  let m2 = function(a2) {
    return ba(va, a2) ? (c(a2), Q) : q2(a2);
  };
  var i2 = function(a2) {
    if (Y(a2)) return q2(a2);
    if (63 === a2) return c(a2), s2;
    if (Z(a2)) return e2 = i2, d2(a2);
    c(a2);
    return i2;
  };
  s2 = function(a2) {
    return 62 === a2 ? j2(a2) : i2(a2);
  };
  var y2 = function(a2) {
    if (Y(a2) || 62 === a2) return j2(a2);
    if (Z(a2)) return e2 = y2, d2(a2);
    c(a2);
    return y2;
  }, f2 = function(a2) {
    if (Y(a2)) return q2(a2);
    if (93 === a2) return c(a2), w2;
    if (Z(a2)) return e2 = f2, d2(a2);
    c(a2);
    return f2;
  }, t2 = function(a2) {
    return 62 === a2 ? j2(a2) : 93 === a2 ? (c(a2), t2) : f2(a2);
  };
  w2 = function(a2) {
    return 93 === a2 ? (c(a2), t2) : f2(a2);
  };
  var M = function(a2) {
    var b2 = g2, e3 = g2;
    g2 = e3 + 1 | 0;
    return !Y(a2) && zc(a2) == "CDATA[".charCodeAt(b2) ? (c(a2), 6 == (b2 + 1 | 0) ? f2 : M) : q2(a2);
  }, k2 = function(a2) {
    if (Y(a2)) return q2(a2);
    if (45 === a2) return c(a2), h2;
    if (Z(a2)) return e2 = k2, d2(a2);
    c(a2);
    return k2;
  };
  h2 = function(a2) {
    return 45 === a2 ? (c(a2), p2) : k2(a2);
  }, p2 = function(a2) {
    return 62 === a2 ? j2(a2) : 45 === a2 ? h2(a2) : k2(a2);
  };
  let W2 = function(a2) {
    return 45 === a2 ? (c(a2), p2) : q2(a2);
  }, P = function(a2) {
    return 45 === a2 ? (c(a2), W2) : 91 === a2 ? (c(a2), g2 = 0, M) : ba(va, a2) ? (c(a2), y2) : q2(a2);
  }, z2 = function(a2) {
    return 33 === a2 ? (c(a2), P) : 47 === a2 ? (c(a2), m2) : 63 === a2 ? (c(a2), i2) : ba(va, a2) ? (c(a2), O) : q2(a2);
  };
  return function(b2) {
    a.enter("htmlText"), a.enter("htmlTextData"), c(b2);
    return z2;
  };
}));
f = function(a, b) {
  b = [];
  for (var e2, q2, d2 = W(a), c = -1; ++c < d2; ) e2 = a[c][1], b.push(a[c]), q2 = X(e2.type), ("labelImage" == q2 || "labelLink" == q2 || "labelEnd" == q2) && (q2 = "labelImage" == q2 ? 4 : 2, e2.type = "data", c = c + q2 | 0);
  W(a) != W(b) && ra(a, 0, W(a), b);
  return a;
};
var j = function(a, b) {
  for (var c, e2, r2, p2, k2, h2, j2, i2, g2, K, A2, q2 = W(a), d2 = void 0, f2 = void 0; ; ) {
    if (false) {
      j2 = 0, q2 = d2;
      break;
    }
    q2--;
    if (q2 < 0) {
      j2 = 0, q2 = d2;
      break;
    }
    c = a[q2][1];
    e2 = X(c.type);
    if (d2) {
      if ("link" == e2 || "labelLink" == e2 && c._inactive) {
        j2 = 0, q2 = d2;
        break;
      }
      "enter" == a[q2][0] && "labelLink" == e2 && (c._inactive = true);
    } else if (f2) {
      if ("enter" == a[q2][0] && ("labelImage" == e2 || "labelLink" == e2) && !c._balanced) {
        if ("labelLink" != e2) {
          j2 = 2;
          break;
        }
        d2 = q2;
      }
    } else "labelEnd" == e2 && (f2 = q2);
  }
  d2 = q2 | 0;
  f2 = f2 | 0, q2 = a[d2][1], q2 = "labelLink" == q2.type ? "link" : "image", e2 = {}, e2.type = q2, p2 = a[d2], e2.start = da(p2[1].start), e2.end = da(a[W(a) - 1][1].end), c = {}, c.type = "label", c.start = da(a[d2][1].start), c.end = da(a[f2][1].end), r2 = {}, r2.type = "labelText", k2 = d2 + j2 | 0, r2.start = da(a[k2 + 2][1].end), h2 = f2 - 2, r2.end = da(a[h2][1].start), j2 = [], j2.push(["enter", e2, b]), j2.push(["enter", c, b]), q2 = d2 + 1 | 0, i2 = k2 + 3 | 0, q2 = sa(j2, a.slice(q2, i2)), i2 = [], i2.push(["enter", r2, b]), q2 = sa(q2, i2), g2 = b.parser.constructs.insideSpan.null, K = k2 + 4 | 0, A2 = f2 - 3 | 0, g2 = sa(q2, Cb(g2, a.slice(K, A2), b)), q2 = [], q2.push(["exit", r2, b]), q2.push(a[h2]), q2.push(a[f2 - 1]), q2.push(["exit", c, b]), c = sa(g2, q2), r2 = f2 + 1 | 0, g2 = W(a), r2 = sa(c, a.slice(r2, g2)), c = [], c.push(["exit", e2, b]), e2 = sa(r2, c), ra(a, d2, W(a), e2);
  return a;
};
var T = function(a, b, q2) {
  var c = this;
  let e2 = function(a2) {
    var e3 = c.events, d3 = c.sliceSerialize;
    d3 = X(c.sliceSerialize(e3[W(e3) - 1][1]));
    var r2 = Ja(X(d3.slice(1, -1)));
    return ka(c.parser.defined, r2) ? b(a2) : q2(a2);
  }, d2 = function(a2) {
    return q2(a2);
  };
  return function(b2) {
    let q3 = [];
    q3.push(a), q3.push(e2), q3.push(d2), q3.push("reference"), q3.push("referenceMarker"), q3.push("referenceString");
    return Wb.apply(c, q3)(b2);
  };
};
var p = function(a, b, q2) {
  let c = function(c2) {
    return 93 === c2 ? (a.enter("referenceMarker"), a.consume(c2), a.exit("referenceMarker"), a.exit("reference"), b) : q2(c2);
  };
  return function(b2) {
    a.enter("reference"), a.enter("referenceMarker"), a.consume(b2), a.exit("referenceMarker");
    return c;
  };
};
var Ed = { tokenize: function(a, b, q2) {
  let c = function(c2) {
    return 41 === c2 ? (a.enter("resourceMarker"), a.consume(c2), a.exit("resourceMarker"), a.exit("resource"), b) : q2(c2);
  }, d2 = function(b2) {
    return oa(b2) ? Ta(a, c)(b2) : c(b2);
  }, r2 = function(b2) {
    return 34 === b2 || 39 === b2 || 40 === b2 ? Fc(a, d2, q2, "resourceTitle", "resourceTitleMarker", "resourceTitleString")(b2) : c(b2);
  }, j2 = function(a2) {
    return q2(a2);
  }, f2 = function(b2) {
    return oa(b2) ? Ta(a, r2)(b2) : c(b2);
  }, e2 = function(b2) {
    return 41 === b2 ? c(b2) : Ec(a, f2, j2, "resourceDestination", "resourceDestinationLiteral", "resourceDestinationLiteralMarker", "resourceDestinationRaw", "resourceDestinationString", 32)(b2);
  }, g2 = function(b2) {
    return oa(b2) ? Ta(a, e2)(b2) : e2(b2);
  };
  return function(b2) {
    a.enter("resource"), a.enter("resourceMarker"), a.consume(b2), a.exit("resourceMarker");
    return g2;
  };
} };
var Fd = { tokenize: T };
var Gd = { tokenize: p };
j = { name: "labelEnd", tokenize: function(a, b, q2) {
  for (var d2, r2 = this, e2 = W(r2.events); --e2 >= 0; ) {
    var c = r2.events[e2][1], j2 = X(c.type);
    if (("labelImage" == j2 || "labelLink" == j2) && !c._balanced) {
      d2 = c;
      break;
    }
  }
  var f2 = false;
  c = function(a2) {
    return b(a2);
  }, e2 = function(a2) {
    d2 && (d2._balanced = true);
    return q2(a2);
  }, j2 = function(b2) {
    return a.attempt(Gd, c, e2)(b2);
  };
  var g2 = function(b2) {
    if (40 === b2) {
      var q3 = f2 ? c : e2;
      return a.attempt(Ed, c, q3)(b2);
    }
    return 91 === b2 ? (q3 = f2 ? j2 : e2, a.attempt(Fd, c, q3)(b2)) : f2 ? c(b2) : e2(b2);
  };
  return function(b2) {
    if (!d2) return q2(b2);
    if (d2._inactive) return e2(b2);
    var c2 = {};
    c2.start = d2.end, c2.end = r2.now(), c2 = Ja(X(r2.sliceSerialize(c2))), f2 = ka(r2.parser.defined, c2), a.enter("labelEnd"), a.enter("labelMarker"), a.consume(b2), a.exit("labelMarker"), a.exit("labelEnd");
    return g2;
  };
}, resolveAll: f, resolveTo: j }, p = qa("labelStartImage", (0, function(a, b, q2) {
  var c = this;
  let e2 = function(a2) {
    return 94 === a2 && ia(c.parser.constructs, "_hiddenFootnoteSupport") ? q2(a2) : b(a2);
  }, d2 = function(b2) {
    return 91 === b2 ? (a.enter("labelMarker"), a.consume(b2), a.exit("labelMarker"), a.exit("labelImage"), e2) : q2(b2);
  };
  return function(b2) {
    a.enter("labelImage"), a.enter("labelImageMarker"), a.consume(b2), a.exit("labelImageMarker");
    return d2;
  };
})), p.resolveAll = j.resolveAll;
var q = qa("labelStartLink", (0, function(a, b, q2) {
  var c = this;
  let e2 = function(a2) {
    return 94 === a2 && ia(c.parser.constructs, "_hiddenFootnoteSupport") ? q2(a2) : b(a2);
  };
  return function(b2) {
    a.enter("labelLink"), a.enter("labelMarker"), a.consume(b2), a.exit("labelMarker"), a.exit("labelLink");
    return e2;
  };
}));
q.resolveAll = j.resolveAll, T = qa("lineEnding", function(a, b, q2) {
  return function(q3) {
    a.enter("lineEnding"), a.consume(q3), a.exit("lineEnding");
    return ca(a, b, "linePrefix", 0);
  };
});
var _a = qa("thematicBreak", function(a, b, q2) {
  var c, d2 = 0, e2 = 0, r2 = function(b2) {
    if (b2 == e2) return a.consume(b2), d2++, r2;
    a.exit("thematicBreakSequence");
    return $(b2) ? ca(a, c, "whitespace", 0)(b2) : c(b2);
  };
  c = function(c2) {
    return c2 == e2 ? (a.enter("thematicBreakSequence"), r2(c2)) : d2 >= 3 && (Y(c2) || Z(c2)) ? (a.exit("thematicBreak"), b(c2)) : q2(c2);
  };
  let j2 = function(a2) {
    e2 = a2 | 0;
    return c(a2);
  };
  return function(b2) {
    a.enter("thematicBreak");
    return j2(b2);
  };
});
var $b = { tokenize: function(a, b, q2) {
  var c = this, d2 = ka(c.parser.constructs.disable.null, "codeIndented") ? 0 : 5;
  return ca(a, function(a2) {
    var e2 = c.events, r2 = W(e2), d3 = e2[r2 - 1];
    return !$(a2) && d3 && "listItemPrefixWhitespace" == d3[1].type ? b(a2) : q2(a2);
  }, "listItemPrefixWhitespace", d2);
} };
$b.partial = d;
var ac = { tokenize: function(a, b, q2) {
  var c = this;
  return ca(a, function(a2) {
    var e2 = c.events, d2 = e2[W(e2) - 1];
    if (d2) {
      var r2 = d2[1];
      e2 = "listItemIndent" == r2.type;
    } else e2 = false;
    e2 ? (r2 = d2[2], e2 = X(r2.sliceSerialize.call(d2[2], d2[1], true)).length, e2 = e2 == c.containerState.size) : e2 = false;
    return e2 ? b(a2) : q2(a2);
  }, "listItemIndent", +c.containerState.size + 1);
} };
ac.partial = d;
var za = {};
za.name = "list";
f = function(a, b, q2) {
  var c = this;
  c.containerState._closeFlow = void 0;
  let e2 = function(e3) {
    c.containerState._closeFlow = true, c.interrupt = void 0;
    var d2 = ka(c.parser.constructs.disable.null, "codeIndented") ? 0 : 4;
    return ca(a, a.attempt(za, b, q2), "linePrefix", d2)(e3);
  };
  return a.check(Na, function(q3) {
    !c.containerState.furtherBlankLines && (c.containerState.furtherBlankLines = c.containerState.initialBlankLine);
    return ca(a, b, "listItemIndent", +c.containerState.size + 1)(q3);
  }, function(q3) {
    if (c.containerState.furtherBlankLines || !$(q3)) return c.containerState.furtherBlankLines = void 0, c.containerState.initialBlankLine = void 0, e2(q3);
    c.containerState.furtherBlankLines = void 0, c.containerState.initialBlankLine = void 0;
    return a.attempt(ac, b, e2)(q3);
  });
};
var r = function(a) {
  let b = a.exit;
  a.exit(this.containerState.type);
};
za.tokenize = function(a, b, q2) {
  var c = this, e2 = c.events, d2 = e2[W(e2) - 1], j2 = 0;
  if (d2) {
    var f2 = d2[1];
    e2 = "linePrefix" == f2.type;
  } else e2 = false;
  e2 && (e2 = d2[2], j2 = X(e2.sliceSerialize.call(d2[2], d2[1], true)).length);
  var r2 = 0;
  d2 = function(q3) {
    let e3 = a.exit("listItemPrefix"), d3 = c.containerState;
    d3.size = j2 + X(c.sliceSerialize(e3, true)).length;
    return b(q3);
  }, f2 = function(b2) {
    return $(b2) ? (a.enter("listItemPrefixWhitespace"), a.consume(b2), a.exit("listItemPrefixWhitespace"), d2) : q2(b2);
  };
  var i2 = function(a2) {
    c.containerState.initialBlankLine = true, j2++;
    return d2(a2);
  };
  e2 = function(b2) {
    a.enter("listItemMarker"), a.consume(b2), a.exit("listItemMarker"), c.containerState.marker || (c.containerState.marker = b2);
    var e3, r3 = c.interrupt ? q2 : i2;
    e3 = a.check;
    return a.check(Na, r3, a.attempt($b, d2, f2));
  };
  var g2 = function(b2) {
    if (ba(lb, b2) && (r2 + 1 | 0) < 10) return r2 = r2 + 1 | 0, a.consume(b2), g2;
    var j3 = !c.interrupt || r2 < 2, d3 = c.containerState.marker, f3 = d3 ? b2 == d3 : 41 === b2 || 46 === b2;
    return j3 && f3 ? (a.exit("listItemValue"), e2(b2)) : q2(b2);
  };
  return function(b2) {
    var d3 = c.containerState, r3 = d3.type ? X(d3.type) : 42 === b2 || 43 === b2 || 45 === b2 ? "listUnordered" : "listOrdered";
    if ("listUnordered" == r3 ? !d3.marker || b2 == d3.marker : ba(lb, b2)) {
      d3.type || (d3.type = r3, d3 = {}, d3._container = true, a.enter(r3, d3));
      if ("listUnordered" == r3) {
        var j3 = a.enter;
        a.enter("listItemPrefix");
        return 42 === b2 || 45 === b2 ? a.check(_a, q2, e2)(b2) : e2(b2);
      }
      if (!c.interrupt || 49 === b2) return a.enter("listItemPrefix"), a.enter("listItemValue"), g2(b2);
    }
    return q2(b2);
  };
}, d = {}, d.tokenize = f, za.continuation = d, za.exit = r, r = { name: "setextUnderline", tokenize: function(a, b, q2) {
  var c = this, e2 = 0;
  let d2 = function(c2) {
    return Y(c2) || Z(c2) ? (a.exit("setextHeadingLine"), b(c2)) : q2(c2);
  };
  var r2 = function(b2) {
    if (b2 == e2) return a.consume(b2), r2;
    a.exit("setextHeadingLineSequence");
    return $(b2) ? ca(a, d2, "lineSuffix", 0)(b2) : d2(b2);
  };
  let j2 = function(b2) {
    a.enter("setextHeadingLineSequence");
    return r2(b2);
  };
  return function(b2) {
    for (var d3 = W(c.events); ; ) {
      if (false) {
        d3 = false;
        break;
      }
      d3--;
      if (d3 < 0) {
        d3 = false;
        break;
      }
      var f2 = c.events[d3][1], r3 = f2.type + "";
      if ("lineEnding" != r3 && "linePrefix" != r3 && "content" != r3) {
        d3 = "paragraph" == r3;
        break;
      }
    }
    r3 = c.parser.lazy;
    return !r3[c.now().line] && (!!c.interrupt || d3) ? (a.enter("setextHeadingLine"), e2 = b2 | 0, j2(b2)) : q2(b2);
  };
}, resolveTo: function(a, b) {
  for (var c, e2, q2 = W(a), d2 = -1, r2 = -1; ; ) {
    if (false) {
      q2 = -1;
      break;
    }
    q2--;
    if (q2 < 0) {
      q2 = -1;
      break;
    }
    if ("enter" == a[q2][0]) {
      c = a[q2][1];
      if ("content" == c.type) break;
      c = a[q2][1], "paragraph" == c.type && (d2 = q2);
    } else c = a[q2][1], "content" == c.type && a.splice(q2, 1), r2 < 0 && "definition" == a[q2][1].type && (r2 = q2);
  }
  c = {};
  c.type = "setextHeading", e2 = a[q2], c.start = da(e2[1].start), c.end = da(a[W(a) - 1][1].end), a[d2][1].type = "setextHeadingText", r2 > 0 ? (a.splice(d2, 0, ["enter", c, b]), d2 = a[q2], e2 = d2[1], e2 = ["exit", e2, b], a.splice(r2 + 1 | 0, 0, e2), e2 = a[q2][1], e2.end = da(a[r2][1].end)) : a[q2][1] = c, a.push(["exit", c, b]);
  return a;
} }, f = {}, aa(f, 42, za), aa(f, 43, za), aa(f, 45, za);
for (d = 48; d <= 57; d++) aa(f, d, za);
aa(f, 62, Za), k = {}, aa(k, 91, v), g = {}, aa(g, -2, e), aa(g, -1, e), aa(g, 32, e), e = {}, aa(e, 35, x), aa(e, 42, _a), h = _a, d = [], d[0] = r, d[1] = h, aa(e, 45, d), aa(e, 60, y), aa(e, 61, r), aa(e, 95, _a), aa(e, 96, o), aa(e, 126, o), h = {}, aa(h, 38, n), aa(h, 92, m), d = {}, aa(d, -5, T), aa(d, -4, T), aa(d, -3, T), aa(d, 33, p), aa(d, 38, n), aa(d, 42, i), T = [], T[0] = t, T[1] = z, aa(d, 60, T), aa(d, 91, q), T = [], T[0] = w, T[1] = m, aa(d, 92, T), aa(d, 93, j), aa(d, 95, i), aa(d, 96, u), T = {}, j = [], j[0] = i, j[1] = l, T.null = j, j = {}, i = [], i[0] = 42, i[1] = 95, j.null = i, i = {}, i.null = [];
var xa = {};
xa.document = f, xa.contentInitial = k, xa.flowInitial = g, xa.flow = e, xa.string = h, xa.text = d, xa.insideSpan = T, xa.attentionMarkers = j, xa.disable = i;
var Hd = new RegExp("\\\\([!-/:-@[-`{-~])|&(#(?:\\d{1,7}|x[\\da-f]{1,6})|[\\da-z]{1,31});", "gi");
var ob = function(a, b, q2) {
  if (a && "object" == typeof a) {
    if (ia(a, "value")) return "html" == X(a.type) && !q2 ? hf : a.value;
    if (b && ia(a, "alt") && a.alt) return a.alt;
    if (ia(a, "children")) return Hc(a.children, b, q2);
  }
  return !na(a) && Array.isArray(a) ? Hc(a, b, q2) : hf;
};
var Id = ob;
var Jd = new RegExp("^(\\r?\\n|\\r)|(\\r?\\n|\\r)$", "g");
var Kd = new RegExp("(\\r?\\n|\\r)$", "g");
var bc = function(a, b) {
  if (a) {
    var q2 = "Cannot close `" + ta(a) + "` (", c = a.start;
    q2 = q2 + eb({ start: c, end: a.end }) + "): a different token (`" + ta(b) + "`, ", c = b.start;
    throw new kb(q2 + eb({ start: c, end: b.end }) + ") is open");
  }
  a = "Cannot close document, a token (`" + ta(b) + "`, ";
  q2 = b.start;
  throw new kb(a + eb({ start: q2, end: b.end }) + ") is still open");
};
var Ld = function(a) {
  return { type: "blockquote", children: [], position: void 0 };
};
var cc = function(a) {
  let b = null;
  b = { type: "code", lang: b, meta: b, value: hf }, b.position = void 0;
  return b;
};
var Md = function(a) {
  return { type: "inlineCode", value: hf, position: void 0 };
};
var Nd = function(a) {
  let b = null;
  b = { type: "definition", identifier: hf, label: b, title: b }, b.url = hf, b.position = void 0;
  return b;
};
var Od = function(a) {
  return { type: "emphasis", children: [], position: void 0 };
};
var dc = function(a) {
  return { type: "heading", depth: 0, children: [], position: void 0 };
};
var ec = function(a) {
  return { type: "break", position: void 0 };
};
var fc = function(a) {
  return { type: "html", value: hf, position: void 0 };
};
var Pd = function(a) {
  let b = null;
  b = { type: "image", title: b, url: hf, alt: b }, b.position = void 0;
  return b;
};
var gc = function(a) {
  let b = { type: "link", title: null, url: hf, children: [] };
  b.position = void 0;
  return b;
};
var hc = function(a) {
  let b = "listOrdered" == ta(a);
  b = { type: "list", ordered: b, start: null, spread: a._spread }, b.children = [], b.position = void 0;
  return b;
};
var Qd = function(a) {
  let b = { type: "listItem", spread: a._spread, checked: null, children: [] };
  b.position = void 0;
  return b;
};
var Rd = function(a) {
  return { type: "paragraph", children: [], position: void 0 };
};
var Sd = function(a) {
  return { type: "strong", children: [], position: void 0 };
};
var Td = function(a) {
  return { type: "thematicBreak", position: void 0 };
};
var Ud = (0, function(a) {
  var b = this;
  b.parser = function(q2) {
    var c = Aa({}, b.data("settings"));
    Aa(c, a), c.extensions = Kc(b.data("micromarkExtensions")), c.mdastExtensions = Kc(b.data("fromMarkdownExtensions"));
    var e2;
    c && "object" == typeof c && (e2 = c, c = void 0);
    var r2 = ye(e2), d2 = qe(e2);
    e2 = d2.document(), c = re()(q2, c, true), c = e2.write(c), q2 = void 0;
    while (!Cc(c)) {
    }
    d2 = r2(c);
    return d2;
  };
});
var Vd = function(a, b) {
  if (Se(a)) return function(q3, c) {
    let e2 = Vc(q3, Wc(c, b));
    e2 = a.run(e2, c), e2 = Promise.resolve(e2);
    return e2.then(function(a2) {
    });
  };
  if ((q2 = a, a === void 0) || a == null) var q2 = b;
  return function(a2, b2) {
    return Vc(a2, Wc(b2, q2));
  };
};
var pb = /* @__PURE__ */ new Map();
d = false;
var ic = d;
var ja = /* @__PURE__ */ new Map();
ja.set("classId", "classID"), ja.set("dataType", "datatype"), ja.set("itemId", "itemID"), ja.set("strokeDashArray", "strokeDasharray"), ja.set("strokeDashOffset", "strokeDashoffset"), ja.set("strokeLineCap", "strokeLinecap"), ja.set("strokeLineJoin", "strokeLinejoin"), ja.set("strokeMiterLimit", "strokeMiterlimit"), ja.set("typeOf", "typeof"), ja.set("xLinkActuate", "xlinkActuate"), ja.set("xLinkArcRole", "xlinkArcrole"), ja.set("xLinkHref", "xlinkHref"), ja.set("xLinkRole", "xlinkRole"), ja.set("xLinkShow", "xlinkShow"), ja.set("xLinkTitle", "xlinkTitle"), ja.set("xLinkType", "xlinkType"), ja.set("xmlnsXLink", "xmlnsXlink");
var Wd = Ma;
var Xd = new RegExp("^[$_\\p{ID_Start}][$_\\u200C\\u200D\\p{ID_Continue}]*$", "u");
var jc = [["action", ["form"], d], ["cite", ["blockquote", "del", "ins", "q"], d], ["data", ["object"], d], ["formAction", ["button", "input"], d], ["href", ["a", "area", "base", "link"], d], ["icon", ["menuitem"], d], ["itemId", [], true], ["manifest", ["html"], d], ["ping", ["a", "area"], d], ["poster", ["video"], d], ["src", ["audio", "embed", "iframe", "img", "input", "script", "source", "track", "video"], d]];
var Yd = [];
var kc = [];
var lc = { allowDangerousHtml: true };
var Zd = new RegExp("^(https?|ircs?|mailto|xmpp)$", "i");
d = "remove-buggy-html-in-markdown-parser", e = "replace-allownode-allowedtypes-and-disallowedtypes", f = "#add-urltransform";
var mc = [["astPlugins", d, hf], ["allowDangerousHtml", d, hf], ["allowNode", e, "allowElement"], ["allowedTypes", e, "allowedElements"], ["className", "remove-classname", hf], ["disallowedTypes", e, "disallowedElements"], ["escapeHtml", d, hf], ["includeElementIndex", "#remove-includeelementindex", hf], ["includeNodeIndex", "change-includenodeindex-to-includeelementindex", hf], ["linkTarget", "remove-linktarget", hf], ["plugins", "change-plugins-to-remarkplugins", "remarkPlugins"], ["rawSourcePos", "#remove-rawsourcepos", hf], ["renderers", "change-renderers-to-components", "components"], ["source", "change-source-to-children", "children"], ["sourcePos", "#remove-sourcepos", hf], ["transformImageUri", f, "urlTransform"], ["transformLinkUri", f, "urlTransform"]];
hb(_c, "Markdown"), hb($c, "MarkdownAsync"), hb(ad, "MarkdownHooks"), hb(Pb, "defaultUrlTransform");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MarkdownAsync,
  MarkdownHooks,
  defaultUrlTransform
});
