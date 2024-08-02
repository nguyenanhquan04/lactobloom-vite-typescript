import request from './axios';

const changePassword = (email, otp, data) => {
    return request.post(`otp/changePassword/${email}/${otp}`, data);
}

const verifyEmail = (email) => {
    return request.post(`otp/verifyEmail/${email}`);
}

export {changePassword, verifyEmail}