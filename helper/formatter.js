function formatDate(date){
    return date.toLocaleString('id-ID', {dateStyle: "full"})
}

module.exports = {formatDate}