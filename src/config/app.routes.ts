// Root
const authRoot = 'auth';
const productRoot = 'shop';
const articleRoot = 'article';
const userRoot = 'user';
const projectRoot = 'project';
const searchRoot = 'search';

// Api Versions
const v1 = 'api/v1';

export const routesV1 = {
  version: v1,
  auth: {
    signin: `${authRoot}/signin`,
    signup: `${authRoot}/signup`,
    logout: `${authRoot}/logout`,
    userInfo: `${authRoot}/user-info`,
    requestOtp: `${authRoot}/request-otp`,
    verifyOtp: `${authRoot}/verify-otp`,
    refreshToken: `${authRoot}/refresh-token`,
  },
  googleAuth: {
    googleAuth: `${authRoot}/google`,
    googleRedirectUrl: `${authRoot}/google/redirect`,
  },
  product: {
    getAllProducts: `${productRoot}/get-all-products`,
    showProduct: `${productRoot}/show-product/:id`,
    showCategoryProduct: `${productRoot}/show-category-product`,
    createProduct: `${productRoot}/add-product`,
    createProductCategory: `${productRoot}/add-product-category`,
    editProduct: `${productRoot}/edit-product/:id`,
    removeProduct: `${productRoot}/remove-product/:id`,
  },
  article: {
    getAllArticles: `${articleRoot}/get-all-articles`,
    showArticle: `${articleRoot}/show-article/:slug`,
    createArticle: `${articleRoot}/add-article`,
    createArticleCategory: `${articleRoot}/add-article-category`,
    editArticle: `${articleRoot}/edit-article/:slug`,
    removeArticle: `${articleRoot}/remove-article/:slug`,
  },
  user: {
    updateProfile: `${userRoot}/update-profile`,
    updateUser: `${userRoot}/update-user/:id`,
  },
  project: {
    getAllProjects: `${projectRoot}/get-all-projects`,
    getAllAdminProjects: `${projectRoot}/get-all-admin-projects`,
    showProject: `${projectRoot}/show-project/:id`,
    showAdminProject: `${projectRoot}/show-admin-project/:id`,
    createProject: `${projectRoot}/add-project`,
    createProjectCategory: `${projectRoot}/add-project-category`,
    editProject: `${projectRoot}/edit-project/:id`,
    removeProject: `${projectRoot}/remove-project/:id`,
    projectLabelImagesById: `${projectRoot}/projects-label/:projectId`,
    projectLabelImagesByLabel: `${projectRoot}/all-projects-label/:label`,
  },
  search: {
    searchAll: `${searchRoot}/search-all`,
  },
};
