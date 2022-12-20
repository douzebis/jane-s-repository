const super_st = '\u02E2\u1D57'
const super_nd = '\u207F\u1D48'
const super_rd = '\u02B3\u1D48'
const super_th = '\u1D57\u02B0'
const arrow_up = '\u2191'
const arrow_reluctant = '\u21AB'

function subscript(n) {
    res = '' + label(n)
    while (n > 0) {
    d = n % 10
    res = String.fromCharCode(8320 + d) + res
    n = Math.trunc(n / 10)
    }
    return res
}

function HSLToHex(h, s, l) {
    const hDecimal = l / 100
    const a = (s * Math.min(hDecimal, 1 - hDecimal)) / 100
    const f = (n) => {
    const k = (n + h / 30) % 12
    const color = hDecimal - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)

    // Convert to Hex and prefix with "0" if required
    return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0")
    }
    return `#${f(0)}${f(8)}${f(4)}`
}

function is_even(n) {
    return n%2 == 0
}

function is_odd(n) {
    return n%2 != 0
}

function is_black(n) {
    return n%3 == 0
}

function is_white(n) {
    return n%3 != 0
}

function label(n) {
    return 1 + (n >> 1)
}

function up(n) {
    return n + label(n)
}

function upn(n, r) {
    while (--r >= 0) n = up(n)
    return n
}

function down(n) {
    return n - label(n)
}

function lambda(n) {
    if (is_black(n)) throw 'Parameter is multiple of 3!'
    return ((2*n)/3) | 0
}

function lambdan(n, r) {
    while (--r >= 0) {
        if (is_black(n)) throw 'Parameter is multiple of 3!'
        n = lambda(n)
    }
    return n
}

function mu(n) {
    return 2*n + 1
}

function nu(n) {
    return 2*n + 2
}

function black(n) {
    return 3*n
}

function seed(n) {
    while (true) {
        if (is_black(n)) return n
        n = lambda(n)
    }
}

function lambex(n) {
    lex = 0
    while (true) {
        if (is_black(n)) return lex
        n = lambda(n)
        ++lex
    }
}

function seedandlamb(n) {
    lex = 0
    while (true) {
        if (is_black(n)) return {seed: n, lambex: lex}
        n = lambda(n)
        ++lex
    }
}

function ord(s, l) {
    while (--l >= 0) {
        s = up(s)
    }
    return s
}

function height(n) {
    if (n < 0) throw new Error("n must be a nonnegative integer")
    if (n == 0) return 0
    if (n == 1) return 1
    visited = [0, 1]  // the beads we have visited so far
    rings = [Array.of(0), Array.of(1)]  // the beads ordered by height (min length of path from 0)
    //console.log('v', visited)
    //console.log('r', rings)
    for (let height = 2; true; ++height) {
        new_ring = []
        for (let bead of rings[height - 1]) {
            let label = (bead >> 1) + 1
            for (let next_bead of [bead - label, bead + label]) {
                if (!visited.includes(next_bead)) {
                    if (next_bead == n) return height
                    visited.push(next_bead)
                    new_ring.push(next_bead)
                }
            }
        }
        //console.log(new_ring)
        rings.push(new_ring)
    }
}

function turboHeight(n) {
    n2 = n
    n2 = n
    h = 0
    while (true) {
        if (n == 0) return h
        if (is_white(n)) {
            n = lambda(n)
            if (is_white(n2)) {
                n2 = lambda(n2)
            } else {
                n2 = n
            }
        } else if (is_white(n2)) {
            n2 = lambda(n2)
            n = n2
        } else {
            n2 = nu(n)
            n = mu(n)
        }
        h += 1
    }
}

//function back(n) {
//    if (n <= 0) throw 'Parameter must be positive!'
//    if (is_white(n)) return lambda(n)
//    b1 = mu(n)
//    b2 = nu(n)
//    if (seed(b1) <= seed(b2)) {
//        return b1
//    } else {
//        return b2
//    }
//}

function reluc(n) {
    if (n < 0) throw 'Parameter must be nonnegative!'
    if (n == 0) return 0
    const visited = [0]
    bead = 1
    for (let i = 1; i < n; ++i) {
        visited[i] = bead
        let l = label(bead)
        if (! visited.includes(bead - l)) {
            bead -= l
        } else {
            bead += l
        }
    }
    return bead
}

function coreluc(bead) {
    if (bead < 0) throw 'Parameter must be nonnegative!'
    if (bead == 0) return 0
    const visited = [0, 1]
    b = 1
    n = 1
    while (b != bead) {
        let l = label(b)
        if (! visited.includes(b - l)) {
            b -= l
        } else {
            b += l
        }
        visited[++n] = b
    }
    return n
}

function relucs(width, height) {
    if (width < 0) throw 'width must be nonnegative!'
    if (height < 0) throw 'height must be nonnegative!'
    if (width == 0 || height == 0) return {rel: [], corel: []}
    const corel = [0, 1]
    const rel = [0, 1]
    let b = 1
    let n = 1
    for (let bead = 0; bead <= upn(black(height-1), width-1); ++bead) {
        let {seed: i, lambex: j} = seedandlamb(bead)
        if (rel.includes(bead)) continue
        while (b != bead) {
            let l = label(b)
            if (! rel.includes(b - l)) {
                b -= l
            } else {
                b += l
            }
            rel[++n] = b
            corel[b] = n
        }
    }
    return {rel: rel, corel: corel}
}

function reluctant(n) {
    if (n < 0) throw new Error("argument must be nonnegative")
    if (n == 0) return 0
    let visited = Array.of(0)
    bead = 1
    for (i = 1; i < n; ++i) {
        visited[bead] = i
        label = 1 + (bead >> 1)
        if (visited[bead - label] == undefined) {
            bead -= label  // moving down
        } else {
            bead += label  // moving up
        }
    }
    return bead
}

function dither(n) {
    if (n < 0) throw new Error("argument must be nonnegative")
    let prev = 0
    for (let i = 1; true; ++i) {
        if (n == 0) return prev
        let nxt = seed(reluctant(i))/3 | 0
        if (nxt != prev) {
            prev = nxt
            --n
        }
    }
}

//function Height(n) {
//    for (i = 0; true; ++i) {
//        if (n == dither(i)) return i
//}

function Mu(n, k = 1) {
    while (k > 0) {
        n = seed(mu(3*n))/3 | 0
        --k
    }
    return n
}

function Nu(n, k = 1) {
    while (k > 0) {
        n = seed(nu(3*n))/3 | 0
        --k
    }
    return n
}

function back(n) {
    if (n%3 != 0) return lambda(n)
    m = mu(n)
    n = lambda(m)
    while (n%3 == 1) n = lambda(n)
    if (n%3 == 2) return m
    return m + 1
}

function backToSeed(n) {
    if (n%3 != 0) return seed(n)
    m = mu(n)
    n = lambda(m)
    while (n%3 == 1) n = lambda(n)
    if (n%3 == 2) return seed(m)
    return seed(m + 1)
}

function Back(n) {
    return backToSeed(3*n)/3 | 0
}

function is_lower(n, m) {
    if (n == 0) return true
    while (m != 0) {
        if (m == n) return true
        m = Back(m)
    }
    return false
}

function HHeight(n) {
    h = 0
    while (n != 0) {
        n = Back(n)
        ++h
    }
    return h
}

function listHeight(h, l) {
    for (i = 0; i < l; ++i) {
        if (HHeight(i) == h) console.log(i)
    }
}
