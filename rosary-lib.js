const super_st = '\u02E2\u1D57'
const super_nd = '\u207F\u1D48'
const super_rd = '\u02B3\u1D48'
const super_th = '\u1D57\u02B0'

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
    n2 = n
    n2 = n
    h = 0
    while (true) {
        if (n == 0) return h
        if (is_white(n)) {
            n = lambda(n)
            if (is_white(n2)) {
                n2 = n
            } else {
                n2 = lambda(n2)
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

function back(n) {
    if (n <= 0) throw 'Parameter must be positive!'
    if (is_white(n)) return lambda(n)
    b1 = mu(n)
    b2 = nu(n)
    if (back(b1) <= back(b2)) {
        return b1
    } else {
        return b2
    }
}

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