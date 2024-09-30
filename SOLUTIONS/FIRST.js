function reconstructSecret(shares, k, p) {
    var ppp = [];
    function modInverse(a, m) {
        a = ((a % m) + m) % m;
        for (let x = 1; x < m; x++) {
            if ((a * x) % m === 1) {
                return x;
            }
        }
        return 1;
    }

    function lagrangeInterpolation(x, shares, p) {
        let total = 0;
        for (let i = 0; i < shares.length; i++) {
            let [xi, yi] = shares[i];
            let prod = 1;
            for (let j = 0; j < shares.length; j++) {
                if (i !== j) {
                    let [xj, _] = shares[j];
                    prod *= (x - xj) * modInverse(xi - xj, p);
                    prod %= p;
                }
            }
            total += yi * prod;
            total %= p;
        }
        return total;
    }
    for(let nn=0; nn < k;nn++){
        ppp.push(lagrangeInterpolation(nn, shares, p));
    }
    return ppp;
}



const d1 = {
    "keys": { "n": 4, "k": 3 },
    "1": { "base": "10", "value": "4" },
    "2": { "base": "2", "value": "111" },
    "3": { "base": "10", "value": "12" },
    "6": { "base": "4", "value": "213" }
};

const d2 = {
    "1": { "base": "10", "value": "28735619723837" },
    "2": { "base": "16", "value": "1A228867F0CA" },
    "3": { "base": "12", "value": "32811A4AA0B7B" },
    "4": { "base": "11", "value": "917978721331A" },
    "5": { "base": "16", "value": "1A22886782E1" },
    "6": { "base": "10", "value": "28735619654702" },
    "7": { "base": "14", "value": "714B5070CC4B" },
    "8": { "base": "9", "value": "122662581541670" },
    "9": { "base": "8", "value": "642121030037605" },
    "keys": { "n": 9, "k": 6 }
};


const d = d1;
const n = d["keys"]["n"];
const k = d["keys"]["k"];
const p = 93251;

function convert(value, base) {
    return parseInt(value, base) % p;
}

const dc = [];

for (let i of Object.keys(d)) {
    if (i != "keys") {
        var temp = parseInt(i);
        dc.push([temp, convert(d[i]["value"], d[i]["base"])]);
    }
}

console.log("dc:", dc);

var reconstructedSecret = reconstructSecret(dc.slice(0,k), k, p);
console.log("Reconstructed Secret:", reconstructedSecret);
console.log("Secret :" , reconstructedSecret[0]);

console.log("Outer------------");
