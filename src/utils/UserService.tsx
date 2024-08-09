import request from './axios';

const login = (email: string, password: string) => {
    return request.post('auth/login', {
        email: email,
        password: password
    });
};

const register = (fullName: string, email: string, password: string) => {
    return request.post('auth/register',{
        fullName: fullName,
        email: email,
        password: password
    });
}

const logOut = (authToken: string) => {
    return request.get('auth/logout', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
}

const userInfo =(authToken?: string) => {
    return request.get("user/info", {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
}

const updateUserInfo = (userData: any, config: any) => {
    return request.put(`user/updateInfo`, userData, config);
}

const resetPassword = (password: string, config: any) => {
    return request.put(`user/resetPassword`, password, config);
}

const getShopMembers = (token: string) => {
    return request.get('user/members', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
}

const getAllUsers = (token: string) => {
    return request.get('user/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
}

const getAllStaffs = (token: string) => {
  return request.get('user/staffs', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
}

const deleteUserByUserId = (token: string, userId: number) => {
    return request.delete(`user/delete/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
}

const updateUserByUserId = (token: string, data: any, userId: number) => {
  return request.put(`user/update/${userId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
}



export { login, register, logOut, userInfo, updateUserInfo, resetPassword, getShopMembers, getAllUsers, deleteUserByUserId, updateUserByUserId, getAllStaffs }; 