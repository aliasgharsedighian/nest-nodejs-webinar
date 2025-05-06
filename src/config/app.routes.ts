// Root
const authRoot = 'auth';
const productRoot = 'shop';
const articleRoot = 'article';

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
    refreshToken: `${authRoot}/refresh-token`,
  },
  product: {
    getAllProducts: `${productRoot}/get-all-products`,
    showProduct: `${productRoot}/show-product/:id`,
    createProduct: `${productRoot}/add-product`,
    createProductCategory: `${productRoot}/add-product-category`,
    editProduct: `${productRoot}/edit-product/:id`,
    removeProduct: `${productRoot}/remove-product/:id`,
  },
  article: {
    getAllArticles: `${articleRoot}/get-all-articles`,
    showArticle: `${articleRoot}/show-article/:id`,
    createArticle: `${articleRoot}/add-article`,
    createArticleCategory: `${articleRoot}/add-article-category`,
    editArticle: `${articleRoot}/edit-article/:id`,
    removeArticle: `${articleRoot}/remove-article/:id`,
  },
};
