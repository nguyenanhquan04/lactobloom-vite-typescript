import request from './axios';

const changePassword = (email: string, otp: number, data: any) => {
    return request.post(`otp/changePassword/${email}/${otp}`, data);
}

const verifyEmail = (email: string) => {
    return request.post(`otp/verifyEmail/${email}`);
}

export {changePassword, verifyEmail}