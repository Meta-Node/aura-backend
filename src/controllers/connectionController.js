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
        ' FILTER user._key == "' + brightId + '"' +
        ' for connection in connections' +
        ' FILTER connection._from == user._id' +
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

const getConnection = async (fromBrightId, toBrightId) => {
    let db = getDbConnection();
    // brightId = "users/" + brightId
    let x = []
    await db.query(
        'for user in users \n' +
        'FILTER user._key == "'+ fromBrightId +'" \n' +
        'for connection in connections\n' +
        'FILTER connection._from == user._id\n' +
        'for otherUser in users\n' +
        'FILTER otherUser._key == "' + toBrightId + '" \n' +
        'FILTER connection._to == otherUser._id\n' +
        'return merge(otherUser, {conn: connection})\n').then(
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
const getRatedConnections = async (brightId, offset, limit) => {
    let db = getDbConnection();
    // brightId = "users/" + brightId
    let x = []
    await db.query(
        'for user in users' +
        ' for connection in connections' +
        ' for otherUser in users' +
        ' FILTER user._key == "' + brightId + '"' +
        ' && connection._from == user._id' +
        ' && connection._to == otherUser._id' +
        ' && connection.rating != null' +
        ' LIMIT ' + offset + ', ' + limit +
        ' return merge(otherUser, {conn: connection})').then(
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
        ' for otherUser in users' +
        ' FILTER user._key == "' + brightId + '"' +
        ' && connection._from == user._id' +
        ' && connection._to == otherUser._id' +
        ' LIMIT ' + offset + ', ' + limit +
        ' return merge(otherUser, {conn: connection})').then(
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
const getAllConnections = async (brightId) => {
    let db = getDbConnection();
    // brightId = "users/" + brightId
    let x = []
    await db.query(
        'for user in users' +
        ' for connection in connections' +
        ' for otherUser in users' +
        ' FILTER user._key == "' + brightId + '"' +
        ' && connection._from == user._id' +
        ' && connection._to == otherUser._id' +
        ' return merge(otherUser, {conn: connection})').then(
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
        ' for otherUser in users' +
        ' FILTER user._key == "' + brightId + '"' +
        ' && connection._from == user._id' +
        ' && connection._to == otherUser._id' +
        ' && connection.rating == null' +
        ' LIMIT ' + offset + ', ' + limit +
        ' return merge(otherUser, {conn: connection})').then(
        cursor => cursor.all()
    ).then(
        key => {
            x = key
        }
    );
    return x;
}

/**
 *
 */
const getRating = async (fromBrightId, toBrightId) => {
    let db = getDbConnection();
    // brightId = "users/" + brightId
    let x = []
    await db.query(
        'for user in users' +
        ' for connection in connections' +
        ' for otherUser in users' +
        ' FILTER user._key == "' + fromBrightId + '"' +
        ' && otherUser._key == "' + toBrightId + '"' +
        ' && connection._from == user._id' +
        ' && connection._to == otherUser._id' +
        ' && connection.rating != null' +
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
 *
 */
const getOldRating = async (fromBrightId, toBrightId) => {
    let db = getDbConnection();
    // brightId = "users/" + brightId
    let x = []
    await db.query(
        'for user in users' +
        ' for connection in connections' +
        ' for otherUser in users' +
        ' FILTER user._key == "' + fromBrightId + '"' +
        ' && otherUser._key == "' + toBrightId + '"' +
        ' && connection._from == user._id' +
        ' && connection._to == otherUser._id' +
        ' && connection.rating != null' +
        ' return connection.oldRating').then(
        cursor => cursor.all()
    ).then(
        key => {
            x = key
        }
    );
    return x;
}

/**
 * Gets all ratings recieved by a single brightId
 * @param brightId
 * @return {Promise<*[]>}
 */
const getRatingsRecievedForConnection = async (brightId) => {
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
 * Gets all ratings given by a single brightId
 * @param brightId
 * @return {Promise<*[]>}
 */
const getRatingsGivenForConnection = async (brightId) => {
    let db = getDbConnection();
    // brightId = "users/" + brightId
    let x = []
    await db.query(
        'for user in users' +
        ' for connection in connections' +
        ' FILTER user._key == "' + brightId + '"' +
        ' AND connection._from == user._id && connection.rating != null' +
        ' return connection.rating').then(
        cursor => cursor.all()
    ).then(
        key => {
            x = key
        }
    );
    return x;
}

const getInboundConnections = async (brightId) => {
    let db = getDbConnection();
    // brightId = "users/" + brightId
    let x = []
    await db.query(
        'for user in users' +
        ' for connection in connections' +
        ' for otherUser in users' +
        ' FILTER user._key == "' + brightId + '"' +
        ' AND connection._to == user._id && connection.rating != null' +
        ' AND connection._from == otherUser._id' +
        ' return merge(otherUser, {conn: connection})').then(
        cursor => cursor.all()
    ).then(
        key => {
            x = key
        }
    );
    return x;
}

const getOutboundConnections = async (brightId) => {
    let db = getDbConnection();
    // brightId = "users/" + brightId
    let x = []
    await db.query(
        'for user in users' +
        ' for connection in connections' +
        ' for otherUser in users' +
        ' FILTER user._key == "' + brightId + '"' +
        ' AND connection._from == user._id && connection.rating != null' +
        ' AND connection._to == otherUser._id' +
        ' return merge(otherUser, {conn: connection})').then(
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
        ' AND connection._from == user._id && connection.rating != null' +
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
const getRatedById = async (brightId) => {
    let db = getDbConnection();
    // brightId = "users/" + brightId
    let x = []
    await db.query(
        'for user in users' +
        ' for connection in connections' +
        ' for otherUser in users' +
        ' FILTER user._key == "' + brightId + '"' +
        ' AND connection._from == user._id &&' +
        ' connection.rating != null &&' +
        ' connection._to == otherUser._id' +
        ' return otherUser._key').then(
        cursor => cursor.all()
    ).then(
        key => {
            x = key
        }
    );
    return x;
}

/**
 * Get all ratings given by a to a brightId
 * @param brightId
 * @return {Promise<*[]>}
 */
const getRatings = async (brightId) => {
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
 * adds a rating
 */
const addRating = async (fromId, toId, rating, oldRating) => {
    let db = getDbConnection();
    // brightId = "users/" + brightId
    rating = JSON.stringify(rating)
    oldRating = JSON.stringify(oldRating)
    let x = []
    await db.query(
        'for user in users' +
        ' for connection in connections' +
        ' for otherUser in users' +
        ' FILTER user._key == "' + fromId + '"' +
        ' && otherUser._key == "' + toId + '"' +
        ' && connection._from == user._id' +
        ' && connection._to == otherUser._id' +
        ' UPDATE connection WITH { rating:' + rating + ', oldRating:' + oldRating +'} IN connections').then(

        cursor => cursor.all()
    ).then(
        key => {
            x = key
        }
    );
    return x;
}

const addNickname = async (brightId, nickname) => {
    let db = getDbConnection();
    // brightId = "users/" + brightId
    let x = []
    await db.query(
        'for user in users' +
        ' FILTER user._key == "' + brightId + '"' +
        ' UPDATE connection WITH { nickname:' + nickname + ' } IN users').then(

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
    getAllConnections,
    getConnection
}
