const {Database, aql} = require("arangojs");
aqlQuery = require('arangojs').aqlQuery;

const getDbConnection = () => {
    return new Database({
        url: process.env.DB_URL,
    });
}

/**
 * Gets all user connections with connection details
 *
 * Still need to test properly but seems correct
 *
 * @param brightId
 * @return {Promise<void>}
 */
const getConnections = async (brightId) => {
    let db = getDbConnection();
    // brightId = "users/" + brightId
    let x = []
    await db.query(
        'for user in users' +
        ' for connection in connections' +
        ' FILTER user._key == "' + brightId + '"' +
        ' && connection._from == user._id' +
        ' return merge(user, {conn: connection})').then(
        cursor => cursor.all()
    ).then(
        key => {
            x = key
        },
        //key => passworddb = key,
        err => console.error('Failed to execute query')
    );
    return x;
}

/**
 * Gets all user connections with connection details
 *
 * Still need to test properly but seems correct
 *
 * @param brightId
 * @return {Promise<void>}
 */
const getNonRatedConnections = async (brightId) => {
    let db = getDbConnection();
    // brightId = "users/" + brightId
    let x = []
    await db.query(
        'for user in users' +
        ' for connection in connections' +
        ' FILTER user._key == "' + brightId + '"' +
        ' && connection._from == user._id && connection.rating == null' +
        ' return merge(user, {conn: connection})').then(
        cursor => cursor.all()
    ).then(
        key => {
            x = key
        },
        err => new Error(err)
    );
    return x;
}

/**
 * Gets all paged connection
 *
 * @param brightId
 * @param offset
 * @param limit
 * @return {Promise<void>}
 */
const getConnectionsPaged = async (brightId, offset, limit) => {
    let db = getDbConnection();
    // brightId = "users/" + brightId
    let x = []
    await db.query(
        'for user in users' +
        ' for connection in connections' +
        ' FILTER user._key == "' + brightId + '"' +
        ' && connection._from == user._id' +
        ' LIMIT ' + offset + ', ' + limit +
        ' return merge(user, {conn: connection})').then(
        cursor => cursor.all()
    ).then(
        key => {
            x = key
        }
    );
    return x;
}

/**
 * Gets all paged connection
 *
 * @param brightId
 * @param offset
 * @param limit
 * @return {Promise<void>}
 */
const getNonRatedConnectionsPaged = async (brightId, offset, limit) => {
    let db = getDbConnection();
    // brightId = "users/" + brightId
    let x = []
    await db.query(
        'for user in users' +
        ' for connection in connections' +
        ' FILTER user._key == "' + brightId + '"' +
        ' && connection._from == user._id && connection.rating == null' +
        ' LIMIT ' + offset + ', ' + limit +
        ' return merge(user, {conn: connection})').then(
        cursor => cursor.all()
    ).then(
        key => {
            x = key
        }
    );
    return x;
}

/**
 * Gets all ratings given by a single brightId
 * @param brightId
 * @return {Promise<*[]>}
 */
const getRatingsForConnection = async (brightId) => {
    let db = getDbConnection();
    // brightId = "users/" + brightId
    let x = []
    await db.query(
        'for user in users' +
        ' for connection in connections' +
        ' FILTER user._key == "' + brightId + '"' +
        ' AND connection._to == user._id && connection.rating != null' +
        ' return connection.rating').then(
        cursor => cursor.all()
    ).then(
        key => {
            x = key
        }
    );
    return x;
}

/**
 * Get all ratings given by a give brightId
 * @param brightId
 * @return {Promise<*[]>}
 */
const getRatingsGivenById = async (brightId) => {
    let db = getDbConnection();
    // brightId = "users/" + brightId
    let x = []
    await db.query(
        'for user in users' +
        ' for connection in connections' +
        ' FILTER user._key == "' + brightId + '"' +
        ' AND connection.from == user._id && connection.rating != null' +
        ' return connection.rating').then(
        cursor => cursor.all()
    ).then(
        key => {
            x = key
        }
    );
    return x;
}


module.exports = {
    getConnections,
    getNonRatedConnections,
    getNonRatedConnectionsPaged,
    getConnectionsPaged,
    getRatingsForConnection,
    getRatingsGivenById
}
