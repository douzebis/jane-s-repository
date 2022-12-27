// -- Pretty printing ----------------------------------------------------------

// Colors
function hsl_to_col(h, s, l) {
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

// Arrows
const arrow_up = '\u2191'
const arrow_reluctant = '\u21AB'
const arrow_up_n_down = '\u2195'
//const arrow_up = '\u2191'
const arrow_down = '\u2193'
const arrow_to_floor = '\u2913'
//const arrow_left_n_right = '\u21C4'

// Other symbols
const uni_st = '\u02E2\u1D57'
const uni_nd = '\u207F\u1D48'
const uni_rd = '\u02B3\u1D48'
const uni_th = '\u1D57\u02B0'
const uni_super_0 = '\u2070'
const code_super_0 = uni_super_0.charCodeAt(0)
const uni_sub_0 = '\u2080'
const code_sub_0 = uni_sub_0.charCodeAt(0)

// Subscript numbers
function subscript(n) {
    // We aim at performing exact integer calculus
    if (!Number.isSafeInteger(n)) throw 'param is not an integer'
    if (n < 0) throw 'param must be nonnegative'
    if (n == 0) return uni_sub_0
    let res = ''
    while (n > 0) {
        let u = n%10
        res = String.fromCharCode(code_sub_0 + u) + res
        n = (n - u)/10
        //if (!Number.isSafeInteger(n)) throw 'internal error'
    }
    return res
}

// Superscript numbers
function subscript(n) {
    // We aim at performing exact integer calculus
    if (!Number.isSafeInteger(n)) throw 'param is not an integer'
    if (n < 0) throw 'param must be nonnegative'
    if (n == 0) return uni_sub_0
    let res = ''
    while (u > 0) {
        let u = n%10
        res = String.fromCharCode(code_super_0 + u) + res
        n = (n - u)/10
        //if (!Number.isSafeInteger(n)) throw 'internal error'
    }
    return res
}

// Formats for nodes
function f_label_position(n) {
    res = '' + n
    switch (n) {
    case 1:
        return res  // + uni_st
    case 2:
        return res  // + uni_nd
    case 3:
        return res  // + uni_rd
    default:
        return res  // + uni_th
    }
}
function f_label_label(n) {
    if (n == 0) {
        return arrow_up + label(n)
    } else {
        return arrow_up_n_down + label(n)
    }
}
function f_label_height(n) {
    return arrow_to_floor + height(n)
}
function f_label_reluctant_inv(n) {
    return arrow_reluctant + reluctant_inv(n)
}
function f_label(bead, type) {
    switch (type) {
        case 'position':
            return f_label_position(bead)
        case 'label':
            return f_label_label(bead)
        case 'height':
            return f_label_height(bead)
        case 'reluctant_inv':
            return f_label_reluctant_inv(bead)
        default:
            return ''
    }
}

// -- Bead calculus ------------------------------------------------------------

// Limits
const MAX_SAFE = Number.MAX_SAFE_INTEGER
const MAX_SAFE_FOR_UP = (MAX_SAFE - MAX_SAFE%3)/3*2 - 1
const MAX_SAFE_FOR_MUNU = (MAX_SAFE - MAX_SAFE%2)/2 - 1
const MAX_SAFE_FOR_BIGMU = (MAX_SAFE - MAX_SAFE%3)/3

function is_even(n) {
    // We aim at performing exact integer calculus
    if (!Number.isSafeInteger(n)) throw 'param is not an integer'
    if (n < 0) throw 'param must be nonnegative'
    return n%2 == 0
}

function is_odd(n) {
    // We aim at performing exact integer calculus
    if (!Number.isSafeInteger(n)) throw 'param is not an integer'
    if (n < 0) throw 'param must be nonnegative'
    return n%2 != 0
}

function is_black(n) {
    // We aim at performing exact integer calculus
    if (!Number.isSafeInteger(n)) throw 'param is not an integer'
    if (n < 0) throw 'param must be nonnegative'
    return n%3 == 0
}

function is_white(n) {
    // We aim at performing exact integer calculus
    if (!Number.isSafeInteger(n)) throw 'param is not an integer'
    if (n < 0) throw 'param must be nonnegative'
    return n%3 != 0
}

function label(n) {
    // We aim at performing exact integer calculus
    if (!Number.isSafeInteger(n)) throw 'param is not an integer'
    if (n < 0) throw 'param must be nonnegative'
    return 1 + (n - n%2)/2
}

function up(n, r = 1) {
    // We aim at performing exact integer calculus
    if (!Number.isSafeInteger(n)) throw 'param is not an integer'
    if (n < 0 || r < 0) throw 'params must be nonnegative'
    while (--r >= 0) {
        if (n > MAX_SAFE_FOR_UP) throw 'operation is not safe'
        n += 1 + (n - n%2)/2
    }
    return n
}

function down(n, r = 1) {
    // We aim at performing exact integer calculus
    if (!Number.isSafeInteger(n)) throw 'param is not an integer'
    if (n < 0 || r < 0) throw 'params must be nonnegative'
    while (--r >= 0) {
        if (n == 0) throw 'cannot down from 0'
        n -= 1 + (n - n%2)/2
    }
    return n
}

function lambda(n, r = 1) {
    // We aim at performing exact integer calculus
    if (!Number.isSafeInteger(n)) throw 'param is not an integer'
    if (n < 0 || r < 0) throw 'params must be nonnegative'
    while (--r >= 0) {
        switch (n%3) {
        case 0:
            throw 'cannot lambda a multiple of 3!'
        case 1:
            n = 2*((n - 1)/3)
            break
        case 2:
            n = 2*((n - 2)/3) + 1
            break
        }
    }
    return n
}

function mu(n, r = 1) {
    // We aim at performing exact integer calculus
    if (!Number.isSafeInteger(n)) throw 'param is not an integer'
    if (n < 0 || r < 0) throw 'params must be nonnegative'
    while (--r >= 0) {
        if (n > MAX_SAFE_FOR_MUNU) throw 'operation is not safe'
        n = 2*n + 1
    }
    return n
}

function nu(n, r = 1) {
    // We aim at performing exact integer calculus
    if (!Number.isSafeInteger(n)) throw 'param is not an integer'
    if (n < 0 || r < 0) throw 'params must be nonnegative'
    while (--r >= 0) {
        if (n > MAX_SAFE_FOR_MUNU) throw 'operation is not safe'
        n = 2*n + 2
    }
    return n
}

function seed(n) {
    // We aim at performing exact integer calculus
    if (!Number.isSafeInteger(n)) throw 'param is not an integer'
    if (n < 0) throw 'param must be nonnegative'
    while (true) {
        switch (n%3) {
        case 0:
            return n
        case 1:
            n = 2*((n - 1)/3)
            break
        case 2:
            n = 2*((n - 2)/3) + 1
            break
        }
    }
}

function seed_n_lambex(n) {
    // We aim at performing exact integer calculus
    if (!Number.isSafeInteger(n)) throw 'param is not an integer'
    if (n < 0) throw 'param must be nonnegative'
    let lambex = 0
    while (true) {
        switch (n%3) {
        case 0:
            return [n, lambex]
        case 1:
            n = 2*((n - 1)/3)
            break
        case 2:
            n = 2*((n - 2)/3) + 1
            break
        }
        ++lambex
    }
}

function bead(seed, lambex) {
    // We aim at performing exact integer calculus
    if (!Number.isSafeInteger(seed)) throw 'param is not an integer'
    if (seed < 0) throw 'param must be nonnegative'
    if (s%3 != 0) throw 'param must be a seed'
    while (--lambex >= 0) {
        s = up(s)
    }
    return s
}

function slow_height(n) {
    // We aim at performing exact integer calculus
    if (!Number.isSafeInteger(seed)) throw 'param is not an integer'
    if (n < 0) throw 'param must be nonnegative'
    if (n == 0) return 0
    if (n == 1) return 1
    visited = [0, 1]  // the beads we have visited so far
    rings = [[0], [1]]  // the beads ordered by height (min length of path from 0)
    for (let height = 2; true; ++height) {
        new_ring = []
        for (let bead of rings[height - 1]) {
            if (bead > MAX_SAFE_FOR_UP) throw 'operation is not safe'
            let label = 1 + (bead - bead%2)/2
            for (let next_bead of [bead - label, bead + label]) {
                if (!visited.includes(next_bead)) {
                    if (next_bead == n) return height
                    visited.push(next_bead)
                    new_ring.push(next_bead)
                }
            }
        }
        rings.push(new_ring)
    }
}

function height(n) {
    // We aim at performing exact integer calculus
    if (!Number.isSafeInteger(n)) throw 'param is not an integer'
    if (n < 0) throw 'param must be nonnegative'
    if (n > MAX_SAFE_FOR_MUNU) throw 'operation is not safe'
    let h = 0
    let n2 = n
    while (true) {
        if (n == 0) return h
        switch (n%3) {
        case 0:
            switch (n2%3) {
            case 0:
                n = 2*n +1
                n2 = n + 1
                break
            case 1:
                n2 = 2*((n2 - 1)/3)
                n = n2
                break
            case 2:
                n2 = 2*((n2 - 2)/3) + 1
                break
            }
            break
        case 1:
            n = 2*((n - 1)/3)
            switch (n2%3) {
            case 0:
                n2 = n
                break
            case 1:
                n2 = 2*((n2 - 1)/3)
                break
            case 2:
                n2 = 2*((n2 - 2)/3) + 1
                break
            }
            break
        case 2:
            n = 2*((n - 2)/3) + 1
            switch (n2%3) {
            case 0:
                n2 = n
                break
            case 1:
                n2 = 2*((n2 - 1)/3)
                break
            case 2:
                n2 = 2*((n2 - 2)/3) + 1
                break
            }
            break
        }
        h += 1
    }
}

function heights(n) {
    // We aim at performing exact integer calculus
    if (!Number.isSafeInteger(n)) throw 'param is not an integer'
    if (n < 0) throw 'param must be nonnegative'
    let res = new ArrayBuffer(n)
    let view = new Uint8Array(res)
    if (n > 0) view[0] = 0
    if (n > 1) view[1] = 1
    if (n > 2) view[2] = 2
    if (n > 3) view[3] = 5
    if (n > 4) view[4] = 3
    if (n > 5) view[5] = 6
    if (n > 6) view[6] = 9
    if (n > 7) view[7] = 4
    if (n > 8) view[8] = 7
    let eight = 0
    let i = 8
    let six = 5
    while (true) {
        eight += 8
        if (++i >= n) return view  //  0
        view[i] = view[eight] + 3
        if (++i >= n) return view  //  1
        view[i] = view[++six] + 1
        if (++i >= n) return view  //  2
        view[i] = view[++six] + 1
        if (++i >= n) return view  //  3
        if (view[eight + 2] <= view[eight + 3]) {
            view[i] = view[eight + 2] + 3
        } else {
            view[i] = view[eight + 3] + 3
        }
        if (++i >= n) return view  //  4
        view[i] = view[++six] + 1
        if (++i >= n) return view  //  5
        view[i] = view[++six] + 1
        if (++i >= n) return view  //  6
        view[i] = view[eight + 5] + 3
        if (++i >= n) return view  //  7
        view[i] = view[++six] + 1
        if (++i >= n) return view  //  8
        view[i] = view[++six] + 1
    }
}

function heights2(n) {
    // We aim at performing exact integer calculus
    if (!Number.isSafeInteger(n)) throw 'param is not an integer'
    if (n < 0) throw 'param must be nonnegative'
    let view = []
    let i = 0
    if (n > 0) view.push({x: 1, y: 0})
    if (n > 1) view.push({x: Math.log(++i), y: 1})
    if (n > 2) view.push({x: Math.log(++i), y: 2})
    if (n > 3) view.push({x: Math.log(++i), y: 5})
    if (n > 4) view.push({x: Math.log(++i), y: 3})
    if (n > 5) view.push({x: Math.log(++i), y: 6})
    if (n > 6) view.push({x: Math.log(++i), y: 9})
    if (n > 7) view.push({x: Math.log(++i), y: 4})
    if (n > 8) view.push({x: Math.log(++i), y: 7})
    let eight = 0
    let six = 5
    while (true) {
        eight += 8
        if (++i >= n) return view  //  0
        view.push({x: Math.log(i), y: view[eight].y + 3})
        if (++i >= n) return view  //  1
        view.push({x: Math.log(i), y: view[++six].y + 1})
        if (++i >= n) return view  //  2
        view.push({x: Math.log(i), y: view[++six].y + 1})
        if (++i >= n) return view  //  3
        if (view[eight + 2].y <= view[eight + 3].y) {
            view.push({x: Math.log(i), y: view[eight + 2].y + 3})
        } else {
            view.push({x: Math.log(i), y: view[eight + 3].y + 3})
        }
        if (++i >= n) return view  //  4
        view.push({x: Math.log(i), y: view[++six].y + 1})
        if (++i >= n) return view  //  5
        view.push({x: Math.log(i), y: view[++six].y + 1})
        if (++i >= n) return view  //  6
        view.push({x: Math.log(i), y: view[eight + 5].y + 3})
        if (++i >= n) return view  //  7
        view.push({x: Math.log(i), y: view[++six].y + 1})
        if (++i >= n) return view  //  8
        view.push({x: Math.log(i), y: view[++six].y + 1})
    }
}

//function toto(a) {
//    let view = new Uint8Array(a)
//    for (let i in view) console.log(i, view[i])
//}

function back(n) {
    // We aim at performing exact integer calculus
    if (!Number.isSafeInteger(n)) throw 'param is not an integer'
    if (n < 0) throw 'param must be nonnegative'
    if (n > MAX_SAFE_FOR_MUNU) throw 'operation is not safe'
    switch (n%3) {
    case 1:
        return 2*((n - 1)/3)
    case 2:
        return 2*((n - 2)/3) + 1
    case 0:
        n = 2*n + 1
        let m = n
        while (true) {
            switch (n%3) {
            case 0:
                return m + 1
            case 2:
                return m
            case 1:
                n = 2*((n - 1)/3)
                break
            }
        }
        break
    }
}

function back_to_prev_seed(n) {
    // We aim at performing exact integer calculus
    if (!Number.isSafeInteger(n)) throw 'param is not an integer'
    if (n <= 0) throw 'param must be positive'
    if (n > MAX_SAFE_FOR_MUNU) throw 'operation is not safe'
    switch (n%3) {
    case 1:
        n = 2*((n - 1)/3)
        while (true) {
            switch (n%3) {
            case 0:
                return [n, 0]
            case 1:
                n = 2*((n - 1)/3)
                break
            case 2:
                n = 2*((n - 2)/3) + 1
                break
            }
        }
    case 2:
        n = 2*((n - 2)/3) + 1
        while (true) {
            switch (n%3) {
            case 0:
                return [n, 0]
            case 1:
                n = 2*((n - 1)/3)
                break
            case 2:
                n = 2*((n - 2)/3) + 1
                break
            }
        }
    case 0:
        n = 2*n + 1
        let m = n
        while (true) {
            switch (n%3) {
            case 0:
                // lmn = 2
                n = 2*((n)/3)
                while (true) {
                    switch (n%3) {
                    case 0:
                        return [n, 2]
                    case 1:
                        n = 2*((n - 1)/3)
                        break
                    case 2:
                        n = 2*((n - 2)/3) + 1
                        break
                    }
                }
            case 2:
                // lmn = 1
                n = 2*((n - 2)/3) + 1
                while (true) {
                    switch (n%3) {
                    case 0:
                        return [n, 1]
                    case 1:
                        n = 2*((n - 1)/3)
                        break
                    case 2:
                        n = 2*((n - 2)/3) + 1
                        break
                    }
                }
            case 1:
                n = 2*((n - 1)/3)
                break
            }
        }
        break
    }
}

function canonic(n) {
    // We aim at performing exact integer calculus
    if (!Number.isSafeInteger(n)) throw 'param is not an integer'
    if (n < 0) throw 'param must be nonnegative'
    res = []
    while (n != 0) {
        let [s, lmn] = back_to_prev_seed(n)
        res.push([s, lmn])
        n = s
    }
    return res
}

//function backToSeed(n) {
//    if (n%3 != 0) return seed(n)
//    m = mu(n)
//    n = lambda(m)
//    while (n%3 == 1) n = lambda(n)
//    if (n%3 == 2) return seed(m)
//    return seed(m + 1)
//}

function reluctant_fun(n) {
    // We aim at performing exact integer calculus
    if (!Number.isSafeInteger(n)) throw 'param is not an integer'
    if (n < 0) throw 'param must be nonnegative!'
    if (n == 0) return 0
    let visited = [0]
    let bead = 1
    for (i = 1; i < n; ++i) {
        visited[bead] = i
        let label = 1 + (bead - bead%2)/2
        if (visited[bead - label] == undefined) {
            bead -= label  // moving down
        } else {
            bead += label  // moving up
        }
    }
    return bead
}

function reluctant_inv(bead) {
    // We aim at performing exact integer calculus
    if (!Number.isSafeInteger(bead)) throw 'param is not an integer'
    if (bead < 0) throw 'param must be nonnegative'
    if (bead == 0) return 0
    let visited = [0, 1]
    let b = 1
    let n = 1
    while (b != bead) {
        let l = 1 + (b - b%2)/2
        if (visited[b - l] == undefined) {
            b -= l
        } else {
            b += l
        }
        visited[b] = ++n
    }
    return n
}

function reluctants(beads) {
    // We aim at performing exact integer calculus
    if (!Number.isSafeInteger(beads)) throw 'param is not an integer'
    if (beads < 0) throw 'param must be nonnegative'
    if (beads == 0) return [[], []]
    if (beads == 1) return [[0], [0]]
    let fun = [0, 1]
    let inv = [0, 1]
    let b = 1
    let i = 1
    for (let bead = 0; bead < beads; ++bead) {
        if (inv[bead] != undefined) continue
        while (b != bead) {
            let l = 1 + (b - b%2)/2
            if (inv[b - l] == undefined) {
                b -= l
            } else {
                b += l
            }
            fun[++i] = b
            inv[b] = i
        }
    }
    return [fun, inv]
}

function Mu(n, r = 1) {
    // We aim at performing exact integer calculus
    if (!Number.isSafeInteger(n)) throw 'param is not an integer'
    if (n < 0 || r < 0) throw 'params must be nonnegative'
    while (--r > 0) {
        if (n > MAX_SAFE_FOR_BIGMU) throw 'operation is not safe'
        n = seed(mu(3*n))/3
    }   
    return n
}

function Nu(n, k = 1) {
    // We aim at performing exact integer calculus
    if (!Number.isSafeInteger(n)) throw 'param is not an integer'
    if (n < 0 || r < 0) throw 'params must be nonnegative'
    while (--r > 0) {
        if (n > MAX_SAFE_FOR_BIGMU) throw 'operation is not safe'
        n = seed(nu(3*n))/3
    }
    return n
}

function Back(n) {
    // We aim at performing exact integer calculus
    if (!Number.isSafeInteger(n)) throw 'param is not an integer'
    if (n <= 0) throw 'param must be positive'
    if (n > MAX_SAFE_FOR_BIGMU) throw 'operation is not safe'
    let [s, _] = back_to_prev_seed(3*n)
    return s/3
}

function Is_lower(n, m) {
    if (n == 0) return true
    while (m != 0) {
        if (m == n) return true
        m = Back(m)
    }
    return false
}

function Height(n) {
    h = 0
    while (n != 0) {
        n = Back(n)
        ++h
    }
    return h
}

function Slow_Foraging_fun(n) {
    // We aim at performing exact integer calculus
    if (!Number.isSafeInteger(n)) throw 'param is not an integer'
    if (n < 0) throw 'param must be nonnegative!'
    let prev = 0
    for (let i = 1; true; ++i) {
        if (n == 0) return prev
        let nxt = seed(relucting(i))/3 | 0
        if (nxt != prev) {
            prev = nxt
            --n
        }
    }
}

function Foraging_fun(n) {
    // We aim at performing exact integer calculus
    if (!Number.isSafeInteger(n)) throw 'param is not an integer'
    if (n < 0) throw 'param must be nonnegative!'
    if (n == 0) return 0
    let visited = [0]
    let bead = 1
    let i = 0
    let count = 0
    while (++i) {
        visited[bead] = i
        let label = 1 + (bead - bead%2)/2
        if (visited[bead - label] == undefined) {
            bead -= label  // moving down
            if (++count == n) return seed(bead)/3
        } else {
            bead += label  // moving up
        }
    }
}

function Foragings(n) {
    // We aim at performing exact integer calculus
    if (!Number.isSafeInteger(n)) throw 'param is not an integer'
    if (n < 0) throw 'param must be nonnegative!'
    let res = []
    if (n == 0) return res
    let visited = [0]
    let bead = 1
    let i = 0
    let count = 0
    while (++i) {
        visited[bead] = i
        let label = 1 + (bead - bead%2)/2
        if (visited[bead - label] == undefined) {
            bead -= label  // moving down
            res.push(seed(bead)/3)
            if (++count == n) return res
        } else {
            bead += label  // moving up
        }
    }
}

function FF(n) {
    function seed2(n) {
        if (n < 0) throw 'param must be nonnegative'
        while (true) {
            switch (n%3) {
            case 0:
                return n
            case 1:
                n = 2*((n - 1)/3)
                break
            case 2:
                n = 2*((n - 2)/3) + 1
                break
            }
        }
    }
    if (n < 0) throw 'param must be nonnegative!'
    if (n == 0) return 0
    let visited = [0]
    let bead = 1
    let i = 0
    let count = 0
    while (++i) {
        visited[bead] = i
        let label = 1 + (bead - bead%2)/2
        if (visited[bead - label] == undefined) {
            bead -= label  // moving down
            if (++count == n) return seed2(bead)/3
        } else {
            bead += label  // moving up
        }
    }
}