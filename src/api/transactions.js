import request from '../utils/request'

export async function getSummaryList(data) {
    return request(`/api/tranx/summary`,{
        method: 'post',
        data,
    })
}

export async function getColumns(data) {
    return request(`/api/system/gettranxcolumns`,{
        method: 'post',
        data,
    })
}

export async function getTransactionsList(data) {
    return request(`/api/transactions_lookup`,{
        method: 'post',
        data,
    })
}