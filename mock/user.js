import { MockMethod } from 'vite-plugin-mock'

export default [
    {
        rul: '/login',
        method: 'post',
        response: () => {
            return {
                code: 200,
                data: ['a','b']
            }
        }
    }
]