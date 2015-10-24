http://pouchdb.com/2015/03/05/taming-the-async-beast-with-es7.html


async function foo() {
    if( Math.round(Math.random()) )
        return 'Success!';
    else
        throw 'Failure!';
}

// Is equivalent to...

function foo() {
    if( Math.round(Math.random()) )
        return Promise.resolve('Success!');
    else
        return Promise.reject('Failure!');
}



async function foo() {
    try {
    var values = await getValues();

        var newValues = values.map(async function(value) {
            var newValue = await asyncOperation(value);
            console.log(newValue);
            return newValue;
        });

        return await* newValues; // Promise.all
    } catch (err) {
        console.log('We had an ', err);
    }
}

// same parallel
async function foo() {
    try {
    var values = await getValues();
        var newValues = await Promise.all(values.map(asyncOperation));

        newValues.forEach(function(value) {
            console.log(value);
        });

        return newValues;
    } catch (err) {
        console.log('We had an ', err);
    }
}

// all sycronously, after one is done
async function foo() {
    try {
    var values = await getValues();

        return await values.reduce(async function(values, value) {
            values = await values;
            value = await asyncOperation(value);
            console.log(value);
            values.push(value);
            return values;
        }, []);
    } catch (err) {
        console.log('We had an ', err);
    }
}
