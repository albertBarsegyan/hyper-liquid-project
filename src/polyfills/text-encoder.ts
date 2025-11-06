/**
 * TextEncoder/TextDecoder polyfill for Microsoft Edge Legacy
 * Based on MDN spec-compliant polyfill
 * https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder
 */

// Only polyfill if TextEncoder is not available
if (typeof globalThis.TextEncoder === 'undefined') {
  // @ts-expect-error - Polyfill for legacy browsers
  globalThis.TextEncoder = class TextEncoder {
    encode(input: string): Uint8Array {
      const utf8: number[] = [];
      for (let i = 0; i < input.length; i++) {
        let charcode = input.charCodeAt(i);
        if (charcode < 0x80) {
          utf8.push(charcode);
        } else if (charcode < 0x800) {
          utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
        } else if (charcode < 0xd800 || charcode >= 0xe000) {
          utf8.push(
            0xe0 | (charcode >> 12),
            0x80 | ((charcode >> 6) & 0x3f),
            0x80 | (charcode & 0x3f)
          );
        } else {
          // Surrogate pair
          i++;
          charcode =
            0x10000 +
            (((charcode & 0x3ff) << 10) | (input.charCodeAt(i) & 0x3ff));
          utf8.push(
            0xf0 | (charcode >> 18),
            0x80 | ((charcode >> 12) & 0x3f),
            0x80 | ((charcode >> 6) & 0x3f),
            0x80 | (charcode & 0x3f)
          );
        }
      }
      return new Uint8Array(utf8);
    }
  };
}

// Only polyfill if TextDecoder is not available
if (typeof globalThis.TextDecoder === 'undefined') {
  // @ts-expect-error - Polyfill for legacy browsers
  globalThis.TextDecoder = class TextDecoder {
    decode(input: Uint8Array | ArrayBuffer): string {
      const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
      let result = '';
      let i = 0;
      while (i < bytes.length) {
        let c = bytes[i++];
        if (c > 127) {
          if (c > 191 && c < 224) {
            c = ((c & 31) << 6) | (bytes[i++] & 63);
          } else if (c > 223 && c < 240) {
            c =
              ((c & 15) << 12) |
              ((bytes[i++] & 63) << 6) |
              (bytes[i++] & 63);
          } else if (c > 239 && c < 248) {
            c =
              ((c & 7) << 18) |
              ((bytes[i++] & 63) << 12) |
              ((bytes[i++] & 63) << 6) |
              (bytes[i++] & 63);
            c -= 0x10000;
            result += String.fromCharCode(0xd800 + (c >> 10));
            c = 0xdc00 + (c & 0x3ff);
          }
        }
        result += String.fromCharCode(c);
      }
      return result;
    }
  };
}

