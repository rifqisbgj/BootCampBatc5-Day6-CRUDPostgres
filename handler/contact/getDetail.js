const db = require('../../db')

module.exports = async (name) => {
    const detailContact = await db.query(`SELECT * FROM contacts WHERE lower(name) = '${name.toLowerCase()}'`);
    if (detailContact.rowCount) {
        return detailContact.rows;
    }

}