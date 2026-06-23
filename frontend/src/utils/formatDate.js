export function FormatDate(date){
    let formatedDate = new Date(date).toLocaleDateString()
    return formatedDate
}