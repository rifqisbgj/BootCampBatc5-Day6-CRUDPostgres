const checkExist = require('./getDetail')
const db = require('../../db')

module.exports = async (req, res, name) => {
    const isContact = await checkExist(name)
    const message = []

    if (!isContact) {
        message.push({
            status: 404,
            message: `Data ${name} tidak tersedia`,
        })
        res.redirect('/contact')
        return res.status(404)
    }

    await db.query(`DELETE FROM contacts WHERE name = '${name}'`)
    message.push({
        status: 'success',
        message: `Data ${name} dihapus`,
    })

    req.flash('message', message)
    res.redirect('/contact')

}