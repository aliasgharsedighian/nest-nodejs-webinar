// Root
const authRoot = 'auth';
const productRoot = 'shop';

// Api Versions
const v1 = 'api/v1';

export const routesV1 = {
  version: v1,
  auth: {
    signin: `${authRoot}/signin`,
    signup: `${authRoot}/signup`,
    userInfo: `${authRoot}/user-info`,
    requestOtp: `${authRoot}/request-otp`,
    verifyOtp: `${authRoot}/verify-otp`,
  },
  product: {
    getAllProducts: `${productRoot}/get-all-products`,
    showProduct: `${productRoot}/show-product/:id`,
    createProduct: `${productRoot}/add-product`,
    createProductCategory: `${productRoot}/add-product-category`,
    editProduct: `${productRoot}/edit-product/:id`,
    removeProduct: `${productRoot}/remove-product/:id`,
  },
};
