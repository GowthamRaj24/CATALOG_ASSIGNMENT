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

    for(let nn = 0; nn < k; nn++){
        ppp.push(lagrangeInterpolation(nn, shares, p));
    }
    return ppp;
}

// Hardcoded test case 2
const d2 = {
    "keys": { "n": 9, "k": 6 },
    "1": { "base": "10", "value": "28735619723837" },
    "2": { "base": "16", "value": "1A228867F0CA" },
    "3": { "base": "12", "value": "32811A4AA0B7B" },
    "4": { "base": "11", "value": "917978721331A" },
    "5": { "base": "16", "value": "1A22886782E1" },
    "6": { "base": "10", "value": "28735619654702" },
    "7": { "base": "14", "value": "71AB5070CC4B" },
    "8": { "base": "9", "value": "122662581541670" },
    "9": { "base": "8", "value": "642121030037605" }
};

// Select the test case to run
const d = d2;
const n = d["keys"]["n"];
const k = d["keys"]["k"];
const p = 93251;  // A prime modulus for calculation

function convert(value, base) {
    return parseInt(value, base) % p;
}

const dc = [];

// Converting the input into (x, y) pairs
for (let i of Object.keys(d)) {
    if (i !== "keys") {
        var temp = parseInt(i);
        dc.push([temp, convert(d[i]["value"], d[i]["base"])]);
    }
}

console.log("dc:", dc);

// Reconstruct using the first k shares
var reconstructedSecret = reconstructSecret(dc.slice(0, k), k, p);
console.log("Reconstructed Secret (first k shares):", reconstructedSecret);
console.log("Secret:", reconstructedSecret[0]);

console.log("Outer------------");

var combinations = [];

// Generate combinations of shares
function rec(temp, arr, k) {
    if (k === 0) {
        combinations.push([...temp]);
        return;
    }
    if (arr.length < k) {
        return;
    }

    for (let i = 0; i < arr.length; i++) {
        temp.push(arr[i]);
        rec(temp, arr.slice(i + 1), k - 1);
        temp.pop();
    }
}

rec([], dc, k);

var sss = {};
console.log("Number of combinations:", combinations.length);

// Check all combinations and count occurrences of each secret
for (let i of combinations) {
    let secret = reconstructSecret(i, k, p);
    let secretKey = secret[0]; // We only need the secret key, which is the first element
    
    if (!sss[secretKey]) {
        sss[secretKey] = 0;
    }
    sss[secretKey] += 1;
}

console.log("Secret occurrences:", sss);
console.log("Unique secret count:", Object.keys(sss).length);

let correctSecret = null;
let maxCount = 0;

// Determine the correct secret by finding the one with the maximum occurrences
for (let secret in sss) {
    if (sss[secret] > maxCount) {
        maxCount = sss[secret];
        correctSecret = secret;
    }
}

console.log("The correct secret is likely:", correctSecret);
console.log("It appears", maxCount, "times among the combinations.");

// Find and log the combination that leads to the correct secret
for (var iii of combinations) {
    var bb = reconstructSecret(iii, k, p);
    if (bb[0] == correctSecret){
        console.log("Combination leading to correct secret:", iii);
        break; // Break after finding the first valid combination
    }
}
