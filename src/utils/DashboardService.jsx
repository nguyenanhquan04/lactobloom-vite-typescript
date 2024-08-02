import request from './axios';

const getTop5SellingProducts = (token) => {
    return request.get('dashboard/top5SellingProducts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
}

const getTop5RecentOrders = (token) => {
    return request.get('dashboard/top5RecentOrders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
}

const getTotalRevenue = (token) => {
    return request.get('dashboard/totalRevenue', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
}

const getTodayRevenue = (token) => {
    return request.get('dashboard/todayRevenue', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
}

const getMonthRevenue = (token, month, year) => {
    return request.get(`dashboard/monthRevenue?month=${month}&year=${year}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
}

const getSalesByMonthOfYear= (token, year) => {
    return request.get(`dashboard/salesByMonthOfYear?year=${year}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
}

const getTodayOrders = (token) => {
    return request.get('dashboard/todayOrders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
}

const getSalesByDayOfMonth= (token, month, year) => {
    return request.get(`dashboard/salesByDayOfMonth?month=${month}&year=${year}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
}

export { getTop5SellingProducts, getTop5RecentOrders, getTotalRevenue, getTodayRevenue, getMonthRevenue, getSalesByMonthOfYear, getTodayOrders, getSalesByDayOfMonth }