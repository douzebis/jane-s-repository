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

function down(n) {
    return n - label(n)
}

function lambda(n) {
    if (is_black(n)) throw 'Parameter is multiple of 3!'
    return ((2*n)/3) | 0
}

function mu(n) {
    return 2*n + 1
}

function nu(n) {
    return 2*n + 2
}

function seed(n) {
    while (true) {
        if (is_black(n)) return n
        n = lambda(n)
    }
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

function back(n){
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