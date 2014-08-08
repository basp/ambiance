module.exports = (s: string) => tokenize(s)

function tokenize(source: string) {
    var tokens = [], result
    source = source.trim()
    while (source.length > 0) {
        source = skipWs(source)
        result = word(source)
        tokens.push(result.tok)
        source = result.rest
    }
    return tokens
}

function word(s: string) {
    var tok = '', i = 0
    while (i < s.length) {
        if (s[i] === '"') {
            return quoted(s.substr(i + 1), tok)
        }
        if (s[i] == ' ') {
            return { tok: tok, rest: s.substr(i + 1) }
        }
        tok += s[i];
        i += 1
    }
    return { tok: tok, rest: '' }
}

function quoted(s: string, prefix?: string) {
    var tok = prefix || '', i = 0
    while (i < s.length) {
        if (s.substr(i, 2) === '" ') {
            return { tok: tok, rest: s.substr(i + 2) }
        }
        if (s[i] !== '"') {
            tok += s[i];
        }
        i += 1;
    }
    return { tok: tok, rest: '' }
}

function skipWs(s: string) {
    var i = 0
    while (i < s.length) {
        if (s[i] !== ' ') {
            return s.substr(i)
        }
        i += 1
    }
    return ''
}