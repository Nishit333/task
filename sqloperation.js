const mssql = require('mssql')

const config = require('config')
const database = config.get('database');

mssql.connect(database, function(err) {
    if(err) {
        console.log("Not Connected")
    }
    else {
        console.log("Connected")
    }
});

async function executeQuery(q) {
    let response = mssql.query(q);
    return response
}

async function executeStoredProcedure(q) {
    let request = new mssql.Request();
    let response = await request.execute(q);
 
    return response
}

async function executeStoredProcedureWithParameters(q, paramHash) {    
    let request = new mssql.Request();
    request = await createPayload(paramHash, request)
    let response = await request.execute(q);
 
    return response
}
async function createPayload(paramHash, request) {
    paramHash.keys().forEach(param => {
        request.input(param, mssql.VarChar, paramHash.get(param));
    });

    return request;
}

module.exports = {
    executeQuery,
    executeStoredProcedure,
    executeStoredProcedureWithParameters
}