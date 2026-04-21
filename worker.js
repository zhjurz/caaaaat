
/**
 * V1 of CCC - cloudflare worker to redirect traffic to correct url
 */
class CCC {
    // 5个以"c"为核心的编码字符
    // c: U+0063 Latin Small Letter C
    // C: U+0043 Latin Capital Letter C
    // с: U+0441 Cyrillic Small Letter Es
    // ϲ: U+03F2 Greek Lunate Sigma Symbol
    // ᴄ: U+1D04 Latin Letter Small Capital C
    enc = ["c", "C", "с", "ϲ", "ᴄ"]
    //           0063 0043 0441 03F2 1D04
    dec = {
        "c": "0",
        "C": "1",
        "с": "2",
        "ϲ": "3",
        "ᴄ": "4"
    }

    ver = {
        "cccc": true
    }

    currVer = "cccc"

    removeAndCheckVersion(ccc) {
        if (this.ver[ccc.substring(0, 4)]) {
            return ccc.substring(4)
        } else {
            return null
        }
    }

    addVersion(ccc) {
        return this.currVer + ccc
    }

    encodeUrl(url) {
        // get utf8 array
        let unversioned = this.toUTF8Array(url)
            // convert to string with base 5
            // padstart very important! otherwise missing leading 0s
            .map(n => n.toString(5).padStart(4, "0"))
            // convert to array of characters
            .join("").split("")
            // map to the c's
            .map(x => this.enc[parseInt(x)])
            // join into single string
            .join("")

        return this.addVersion(unversioned)
    }

    decodeUrl(ccc) {

        ccc = this.removeAndCheckVersion(ccc)
        if (ccc === null) return

        // get the base 5 string representation of the url
        let b5str = ccc.split("").map(x => this.dec[x]).join("")

        let utf8arr = []

        // parse 4 characters at a time (255 in b10 = 3333 in b5... wait, 4^4=256, 5^4=625)
        // in base 5, 4 digits can represent up to 624, which covers all byte values 0-255
        for (let i = 0; i < b5str.length; i += 4)
            utf8arr.push(parseInt(b5str.substring(i, i + 4), 5))

        return this.Utf8ArrayToStr(utf8arr)
    }


    // from https://gist.github.com/joni/3760795
    toUTF8Array(str) {
        var utf8 = [];
        for (var i = 0; i < str.length; i++) {
            var charcode = str.charCodeAt(i);
            if (charcode < 0x80) utf8.push(charcode);
            else if (charcode < 0x800) {
                utf8.push(0xc0 | (charcode >> 6),
                    0x80 | (charcode & 0x3f));
            }
            else if (charcode < 0xd800 || charcode >= 0xe000) {
                utf8.push(0xe0 | (charcode >> 12),
                    0x80 | ((charcode >> 6) & 0x3f),
                    0x80 | (charcode & 0x3f));
            }
            // surrogate pair
            else {
                i++;
                charcode = ((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff)
                utf8.push(0xf0 | (charcode >> 18),
                    0x80 | ((charcode >> 12) & 0x3f),
                    0x80 | ((charcode >> 6) & 0x3f),
                    0x80 | (charcode & 0x3f));
            }
        }
        return utf8;
    }

    // from https://gist.github.com/wumingdan/759564f6cb887a55bceb
    Utf8ArrayToStr(array) {
        var out, i, len, c;
        var char2, char3;

        out = "";
        len = array.length;
        i = 0;
        while (i < len) {
            c = array[i++];
            switch (c >> 4) {
                case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                    // 0xxxxxxx
                    out += String.fromCharCode(c);
                    break;
                case 12: case 13:
                    // 110x xxxx   10xx xxxx
                    char2 = array[i++];
                    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                    break;
                case 14:
                    // 1110 xxxx  10xx xxxx  10xx xxxx
                    char2 = array[i++];
                    char3 = array[i++];
                    out += String.fromCharCode(((c & 0x0F) << 12) |
                        ((char2 & 0x3F) << 6) |
                        ((char3 & 0x3F) << 0));
                    break;
            }
        }

        return out;
    }

}

async function handleRequest(request) {
  let reqUrl = new URL(request.url)
  let redirectLocation = new CCC().decodeUrl(decodeURI(reqUrl.pathname.replace("/", "")))
  
  let response;
  try {
    response = Response.redirect(redirectLocation, 302)
  } catch(e) {
    response = new Response(null, {status: 400})
  }

  return response
}

addEventListener("fetch", async event => {
  event.respondWith(handleRequest(event.request))
})
