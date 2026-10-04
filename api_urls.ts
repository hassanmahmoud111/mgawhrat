export const apiUrls = {
  auth: {
    login: 'api/v1/admin/auth/login',
    register: 'api/v1/client/auth/signup',
    adminLogin: 'api/v1/admin/auth/login',
    merchantLogin: 'api/v1/merchant/auth/login',
    clientLogin: 'api/v1/client/auth/login',
    clientVerifyOtp: 'api/v1/client/auth/verify-otp',
    clientResendOtp: 'api/v1/client/auth/resend-otp',
    merchantVerifyOtp: 'api/v1/merchant/auth/verify-otp',
    merchantResendOtp: 'api/v1/merchant/auth/resend-otp',
    sendOtp: 'api/v1/client/auth/resend-otp',
    verifyOtp: 'api/v1/client/auth/verify-otp',
    sendEmailReset: 'password/forgot',
    sendOtpReset: 'password/verify-otp',
    changePassword: 'password/reset',
    logout: 'api/v1/admin/auth/logout',
  },
  home: {
    getHomeData: 'api/v1/home',
    getFooterData: "contacts",
    getHomeHeader: "api/v1/home"
  },
  faqs: {
    getFaqs: "faqs"
  },
  terms: {
    getTerms: "terms"
  },
  contactUs: {
    sendContact: "contact-us",
    getContacts: "contacts"
  },
  auction: {
    addAuction: "auctions/request"
  },
  profile: {
    getProfile: "api/v1/admin/profile",
    adminProfile: "api/v1/admin/profile",
    merchantProfile: "api/v1/merchant/profile",
    clientProfile: "api/v1/client/profile",
    deleteAccount: "api/v1/client/profile",
    deleteClientProfile: "api/v1/client/profile",
    updateProfile: "profile",
    changePassword: "password/update",
    getDashboard: "profile",
    getProfileBids: "profile/bids",
    getProfileProjects: "profile/projects",
    getProfileWallet: "profile/wallet",
    getWithDraw: "profile/withdrawals",
    chargeWallet: "wallet/charge",
    withdrawWallet: "wallet/withdraw",
    getCities: "cities",
    getAuthority: "advertising-regulations"
  },
  project: {
    getProjectsCount: "projects/count",
    getProjects: "projects",
    getHomeProjects: "home/projects",
    showProject: "projects",
    getSingleProperty: "properties",
    canBid: "auctions",
    auctionDeposit: "auctions",
    getBids: "auctions",
    sendBid: "auctions",
    downloadFile: "properties"
  },
  notifications: {
    makeAllRead: "notifications/mark-as-read",
    getAllNotifications: "notifications",
    markAsReadSingle: "notifications"
  },
  shared: {
    getCountries: 'api/v1/shared/countries',
    getCities: 'api/v1/shared/cities'
  },
  products: {
    getProducts: 'api/v1/products',
    getProductDetails: (id: string | number) => `api/v1/products/${id}`
  },
  categories: {
    getCategories: 'api/v1/shared/categories'
  },
  cart: {
    getCart: 'api/v1/client/cart',
    addToCart: 'api/v1/client/cart',
    incrementItem: (id: string | number) => `api/v1/client/cart/${id}/increment`,
    decrementItem: (id: string | number) => `api/v1/client/cart/${id}/decrement`,
    removeItem: (id: string | number) => `api/v1/client/cart/${id}`,
    applyCoupon: 'api/v1/client/cart/coupon'
  }
}