import request from './axios';

const login = (email, password) => {
    return request.post('auth/login', {
        email: email,
        password: password
    });
};

const register = (fullName, email, password) => {
    return request.post('auth/register',{
        fullName: fullName,
        email: email,
        password: password
    });
}

const logOut = (authToken) => {
    return request.get('auth/logout', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
}

const userInfo =(authToken) => {
    return request.get("user/info", {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
}

const updateUserInfo = (userData, config) => {
    return request.put(`user/updateInfo`, userData, config);
}

const resetPassword = (password, config) => {
    return request.put(`user/resetPassword`, password, config);
}

const getShopMembers = (token) => {
    return request.get('user/members', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
}

const getAllUsers = (token) => {
    return request.get('user/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
}

const getAllStaffs = (token) => {
  return request.get('user/staffs', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
}

const deleteUserByUserId = (token, userId) => {
    return request.delete(`user/delete/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
}

const updateUserByUserId = (token, data, userId) => {
  return request.put(`user/update/${userId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
}



export { login, register, logOut, userInfo, updateUserInfo, resetPassword, getShopMembers, getAllUsers, deleteUserByUserId, updateUserByUserId, getAllStaffs }; 