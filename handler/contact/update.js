const Validator = require('validator')
const checkExist = require('./getDetail')
const db = require('../../db')

module.exports = async (req, res, oldName, newName, email, mobile) => {
    const message = []

    // check oldnamenya tersedia atau ngga
    const isContact = await checkExist(oldName)

    if (!isContact) {
        message.push({
            status: 404,
            message: 'Data tidak tersedia'
        })
        return res.status(404) // jika tidak, maka mengembalikan res status 404
    }
    // jika nama baru dan nama lama beda, maka ganti
    if (newName.toLowerCase() != oldName.toLowerCase()) {
        const contactExist = await checkExist(newName)
        if (contactExist) {
            message.push({
                status: 409,
                message: 'Nama sudah tersedia'
            })
        }
    }


    const isMobilePhoneValid = Validator.isMobilePhone(mobile, 'id-ID')
    if (!isMobilePhoneValid) { // jika validasi nombor handphone false
        // memberikan informasi kepada user bahwa nomor hp salah dan informasi nomor hp yang benar
        console.log("Format nomor telpon salah (contoh: 08212345678)");
        message.push({
            status: 400,
            message: 'Format nomor telpon salah (contoh: 08212345678)'
        })
    }

    if (email) {
        const isEmailValid = Validator.isEmail(email);
        if (!isEmailValid) { // kondisi jika validasi false
            // memberikan informasi kepada user bahwa email salah dan informasi email yang benar
            message.push({
                status: 400,
                message: 'Format email salah (contoh: example@domain.com)'
            })
        }
    }

    if (message.length) {
        req.flash('message', message)
        res.redirect(`/contact/edit/${oldName}`)
        // akan memberikan res status yang pertama masuk pada msg
        return res.status(message[0].status)
    }

    message.push({
        status: 'success',
        message: `Data ${oldName} berhasil diubah`
    })
    req.flash('message', message)
    await db.query(`UPDATE contacts SET name = '${newName}', mobile ='${mobile}', email = '${email}' WHERE name = '${oldName}'`)
    return res.redirect('/contact')
}