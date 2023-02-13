const Validator = require('validator')
const checkExist = require('./getDetail')
const db = require('../../db')

module.exports = async (req, res, name, email, mobile) => {
    const message = []
    // mengecek apakah data kontak dengan nama baru tersedia/tidak
    const isContact = await checkExist(name)
    if (isContact) {
        message.push({
            status: 409,
            message: 'Nama sudah tersedia',
        })
    }

    // cek apakah user memasukkan nomor hp atau tidak
    const isMobilePhoneValid = Validator.isMobilePhone(mobile, 'id-ID')
    if (mobile) {
        if (!isMobilePhoneValid) { // jika validasi nombor handphone false
            // menambah pesan jika terjadi salah format telpon
            message.push({
                status: 400,
                message: 'Format nomor telpon salah(contoh: 08212345678)'
            })
            // memberikan informasi kepada user bahwa nomor hp salah dan informasi nomor hp yang benar
        }
    }

    // cek apakah user memasukkan email atau tidak
    if (email) {
        const isEmailValid = Validator.isEmail(email);
        if (!isEmailValid) { // kondisi jika validasi false
            // menambah pesan jika format email salah
            message.push({
                status: 400,
                message: 'Format email salah (contoh: example@domain.com)'
            })
            // memberikan informasi kepada user bahwa email salah dan informasi email yang benar
        }
    }

    const contact = {
        name,
        email,
        mobile
    }

    // Jika sampai validasi terdapat error
    if (message.length) {
        req.flash('message', message)
        // mengembalikan value lama
        req.flash('olddata', contact)
        res.redirect('/contact/create')
        res.status(message[0].status)
        return message
    }

    if (!email) {
        await db.query(`INSERT INTO contacts (name, mobile) VALUES ('${name}','${mobile}')`)
        // menambah pesan jika data berhasil ditambahkan
        message.push({
            status: 'success',
            message: 'Data berhasil ditambahkan'
        })
        req.flash('message', message)
        return res.redirect('/contact')
    }

    await db.query(`INSERT INTO contacts VALUES ('${name}','${mobile}','${email}')`)
    // menambah pesan jika data berhasil ditambahkan
    message.push({
        status: 'success',
        message: 'Data berhasil ditambahkan'
    })
    req.flash('message', message)
    return res.redirect('/contact')
}