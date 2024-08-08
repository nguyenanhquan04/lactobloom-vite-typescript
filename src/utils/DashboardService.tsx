import request from './axios';

const getTop5SellingProducts = (token: string) => {
    return request.get('dashboard/top5SellingProducts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
}

const getTop5RecentOrders = (token: string) => {
    return request.get('dashboard/top5RecentOrders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
}

const getTotalRevenue = (token: string) => {
    return request.get('dashboard/totalRevenue', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
}

const getTodayRevenue = (token: string) => {
    return request.get('dashboard/todayRevenue', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
}

const getMonthRevenue = (token: string, month: number, year: number) => {
    return request.get(`dashboard/monthRevenue?month=${month}&year=${year}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
}

const getSalesByMonthOfYear= (token: string, year: number) => {
    return request.get(`dashboard/salesByMonthOfYear?year=${year}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
}

const getTodayOrders = (token: string) => {
    return request.get('dashboard/todayOrders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
}

const getSalesByDayOfMonth= (token: string, month: number, year: number) => {
    return request.get(`dashboard/salesByDayOfMonth?month=${month}&year=${year}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
}

export { getTop5SellingProducts, getTop5RecentOrders, getTotalRevenue, getTodayRevenue, getMonthRevenue, getSalesByMonthOfYear, getTodayOrders, getSalesByDayOfMonth }