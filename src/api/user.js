import request from '../utils/request'

export async function login(data) {
    return request(`/api/login`, {
        method: 'post',
        data,
    })
}

export async function getMultilayer(data) {
    return request(`/api/multilayer`, {
        method: 'post',
        data
    })
}
