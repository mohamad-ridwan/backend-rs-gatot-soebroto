const layananPengaduanMasyarakat = require('../models/layananpengaduan')

exports.post = (req, res, next)=>{
    const image = req.file.path
    const header = req.body.header
    const paragraph = req.body.paragraph

    const post = new layananPengaduanMasyarakat({
        image: image,
        header: header,
        paragraph: paragraph,
        dataLaporan: []
    })

    post.save()
        .then(result => {
            res.status(201).json({
                message: `data layanan pengaduan masyarakat berhasil di post`,
                data: result
            })
        })
        .catch(err => console.log(err))
}

exports.postDataLaporan = (req, res, next)=>{
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

    const nama = req.body.nama
    const email = req.body.email
    const alamat = req.body.alamat
    const tempatKejadian = req.body.tempatKejadian
    const waktuKejadian = req.body.waktuKejadian
    const detailPengaduan = req.body.detailPengaduan
    const image = req.file.path
    const date = `${nameDay[day]}, ${dateNow} ${nameMonth[month]} ${years} ${hours}:${minute}`

    const data = [{
        nama: nama,
        email: email,
        alamat: alamat,
        tempatKejadian: tempatKejadian,
        waktuKejadian: waktuKejadian,
        detailPengaduan: detailPengaduan,
        image: image,
        date: date
    }]

    layananPengaduanMasyarakat.updateOne(
        {_id: _id},
        {$push: {dataLaporan: {$each: data, $position: 0}}}
    )
    .then(result=>{
        res.status(201).json({
            message: 'data laporan layanan pengaduan masyarakat berhasil di post',
            data: result
        })
    })
    .catch(err=>console.log(err))
}

exports.get = (req, res, next)=>{
    let totalItems;

    layananPengaduanMasyarakat.find()
    .countDocuments()
        .then(count => {
            totalItems = count
            return layananPengaduanMasyarakat.find()
        })
        .then(result => {
            res.status(200).json({
                message: 'data layanan pengaduan masyarakat berhasil di dapatkan',
                data: result,
                total_data: totalItems
            })
        })
        .catch(err => {
            next(err)
        })
}