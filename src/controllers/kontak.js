const kontak = require('../models/kontak')

exports.post = (req, res, next)=>{
    const image = req.file.path
    const header = req.body.header
    const paragraph = req.body.paragraph

    const post = new kontak({
        image: image,
        header: header,
        paragraph: paragraph,
        data: []
    })

    post.save()
        .then(result => {
            res.status(201).json({
                message: `data kontak berhasil di post`,
                data: result
            })
        })
        .catch(err => console.log(err))
}

exports.postData = (req, res, next)=>{
    const _id = req.params._id

    const nameDay = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
    const nameMonth = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

    const years = new Date().getFullYear()
    const dateNow = new Date().getDate()
    const month = new Date().getMonth()
    const day = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1

    const getHours = new Date().getHours()
    const hours = getHours.toString().length === 1 ? `0${getHours}` : getHours
    const getMinute = new Date().getMinutes()
    const minute = getMinute.toString().length === 1 ? `0${getMinute}` : getMinute

    const id = `${new Date().getTime()}`
    const nama = req.body.nama
    const email = req.body.email
    const pesan = req.body.pesan
    const date = `${nameDay[day]}, ${dateNow} ${nameMonth[month]} ${years} ${hours}:${minute}`

    const data = [{
        id: id,
        nama: nama,
        email: email,
        pesan: pesan,
        date: date
    }]

    kontak.updateOne(
        {_id: _id},
        {$push: {data: {$each: data, $position: 0}}}
    )
    .then(result=>{
        res.status(201).json({
            message: 'data user kontak berhasil di post',
            data: result
        })
    })
    .catch(err=>console.log(err))
}

exports.get = (req, res, next)=>{
    let totalItems;

    kontak.find()
    .countDocuments()
        .then(count => {
            totalItems = count
            return kontak.find()
        })
        .then(result => {
            res.status(200).json({
                message: 'data kontak berhasil di dapatkan',
                data: result,
                total_data: totalItems
            })
        })
        .catch(err => {
            next(err)
        })
}