module.exports = (tokens: string[]) => parse(tokens)

function parse(tokens: string[]) {
    var args = tokens.splice(1)
    console.log(args);
    var pargs = parseArgs(args)
    return {
        verb: tokens[0],
        args: args,
        argstr: args.join(' '),
        dobjstr: pargs.dobjstr,
        prepstr: pargs.prepstr,
        iobjstr: pargs.iobjstr
    }
} 

var prepositions = {
    'with': true,
    'using': true,
    'at': true,
    'using some tool': true
    // ...
};

function parseArgs(tokens: string[]) {
    var maybePrep0, maybePrep1, maybePrep2, count = tokens.length
    for (var i = 0; i < count; i++) {
        maybePrep0 = tokens[i] || ''

        if (i < count - 1) {
            maybePrep1 = [maybePrep0, tokens[i + 1]].join(' ')
        }
        else {
            maybePrep2 = ''
        }

        if (i < count - 2) {
            maybePrep2 = [maybePrep1, tokens[i + 2]].join(' ')
        }
        else {
            maybePrep2 = ''
        }

        if (maybePrep2 in prepositions) {
            return {
                dobjstr: tokens.slice(0, i).join(' '),
                prepstr: maybePrep2,
                iobjstr: tokens.slice(i + 3).join(' ')
            }
        }
        else if (maybePrep1 in prepositions) {
            return {
                dobjstr: tokens.slice(0, i).join(' '),
                prepstr: maybePrep1,
                iobjstr: tokens.slice(i + 2).join(' ')
            }
        }
        else if (maybePrep0 in prepositions) {
            return {
                dobjstr: tokens.slice(0, i).join(' '),
                prepstr: maybePrep0,
                iobjstr: tokens.slice(i + 1).join(' ')
            }
        }
    }

    return {
        dobjstr: tokens.join(' '),
        prepstr: '',
        iobjstr: ''
    }
}