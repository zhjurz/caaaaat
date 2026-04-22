class CCC {
    enc = ["c", "C", "с", "ϲ"]
    dec = {
        "c": "0",
        "C": "1",
        "с": "2",
        "ϲ": "3"
    }
    ver = { "cccc": true }
    currVer = "cccc"

    removeAndCheckVersion(ccc) {
        return this.ver[ccc.substring(0, 4)] ? ccc.substring(4) : null
    }

    addVersion(ccc) {
        return this.currVer + ccc
    }

    encodeUrl(url) {
        let unversioned = this.toUTF8Array(url)
            .map(n => n.toString(4).padStart(4, "0"))
            .join("").split("")
            .map(x => this.enc[parseInt(x)])
            .join("")
        return this.addVersion(unversioned)
    }

    decodeUrl(ccc) {
        ccc = this.removeAndCheckVersion(ccc)
        if (ccc === null) return
        let b4str = ccc.split("").map(x => this.dec[x]).join("")
        let utf8arr = []
        for (let i = 0; i < b4str.length; i += 4)
            utf8arr.push(parseInt(b4str.substring(i, i + 4), 4))
        return this.Utf8ArrayToStr(utf8arr)
    }

    toUTF8Array(str) {
        var utf8 = [];
        for (var i = 0; i < str.length; i++) {
            var charcode = str.charCodeAt(i);
            if (charcode < 0x80) utf8.push(charcode);
            else if (charcode < 0x800) {
                utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
            }
            else if (charcode < 0xd800 || charcode >= 0xe000) {
                utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
            }
            else {
                i++;
                charcode = ((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff)
                utf8.push(0xf0 | (charcode >> 18), 0x80 | ((charcode >> 12) & 0x3f), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
            }
        }
        return utf8;
    }

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
                    out += String.fromCharCode(c);
                    break;
                case 12: case 13:
                    char2 = array[i++];
                    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                    break;
                case 14:
                    char2 = array[i++];
                    char3 = array[i++];
                    out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
                    break;
            }
        }
        return out;
    }
}
