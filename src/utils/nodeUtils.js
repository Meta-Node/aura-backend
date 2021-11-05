const {Database, aql} = require("arangojs");
aqlQuery = require('arangojs').aqlQuery;

const getDbConnection = () => {
    return new Database({
        url: "http://localhost:3334",
    });
}

/**
 * Gets all connection objects paired with
 * @param brightId
 * @return {Promise<void>}
 */
const getConnections = async (brightId) => {
    let db = getDbConnection();
    // brightId = "users/" + brightId
    db.query(
        'FOR user in users' +
        ' FOR connection IN connections' +
        ' For to_user in users' +
        ' FILTER user._key == "' + brightId + '"' +
        ' AND user._id == connection._from' +
        ' AND to_user._id == connection._to return merge(to-user, {conn: connection})').then(
        cursor => cursor.all()
    ).then(
        key => {
            console.log('key:', key)
        },
        //key => passworddb = key,
        err => console.error('Failed to execute query')
    );
}

module.exports = {getDbConnection, getConnections}