var loopTest = {
    Test1: {
        date: ['November 2011', 'a new date']
    },

    Test2: {
        date: 'January 2012'
    }
};

for (var key in loopTest) {
    [].concat(loopTest[key].date).forEach(function(date) {
        $('.content').append('- ' + date + '<br />');
    });
}


function repeat(a, n) { return !n ? [] : repeat(a, n-1).concat(a); }

function repeat(a, n, r) {
    return !n ? r : repeat(a, --n, (r||[]).concat(a));
}

console.log(repeat([1,2,3], 4));
