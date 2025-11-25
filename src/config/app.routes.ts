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
    getAllAdminProducts: `${productRoot}/get-all-admin-products`,
    showProduct: `${productRoot}/show-product/:id`,
    showProductCategory: `${productRoot}/show-category-product/:id`,
    showAdminProduct: `${productRoot}/show-admin-product/:id`,
    showCategoryProduct: `${productRoot}/show-category-product`,
    createProduct: `${productRoot}/add-product`,
    createProductCategory: `${productRoot}/add-product-category`,
    editProductCategory: `${productRoot}/edit-product-category/:id`,
    editProduct: `${productRoot}/edit-product/:id`,
    removeProduct: `${productRoot}/remove-product/:id`,
  },
  article: {
    getAllArticles: `${articleRoot}/get-all-articles`,
    showArticle: `${articleRoot}/show-article/:slug`,
    getAllAdminArticles: `${articleRoot}/get-all-articles-admin`,
    showAdminArticle: `${articleRoot}/show-article-admin/:slug`,
    createArticle: `${articleRoot}/add-article`,
    createArticleCategory: `${articleRoot}/add-article-category`,
    editArticle: `${articleRoot}/edit-article/:slug`,
    removeArticle: `${articleRoot}/remove-article/:slug`,
    showCategoriesArticle: `${articleRoot}/show-categories-article`,
    showArticleCategory: `${articleRoot}/show-category-article/:id`,
    editArticleCategory: `${articleRoot}/edit-article-category/:id`,
  },
  user: {
    updateProfile: `${userRoot}/update-profile`,
    updateUser: `${userRoot}/update-user/:id`,
    createSupportRequest: `${userRoot}/create-support-request`,
    getAllSupportRequests: `${userRoot}/support-requests`,
    getSingleSupportRequest: `${userRoot}/support-request/:id`,
    updateUserRequest: `${userRoot}/update-support-status/:id`,
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
    showProjectCategories: `${projectRoot}/show-all-project-categories`,
    showProjectCategory: `${projectRoot}/show-project-category/:id`,
    editProjectCategory: `${projectRoot}/edit-project-category/:id`,
    externalImages: {
      createImages: `${projectRoot}/create-external-images`,
      updateImages: `${projectRoot}/update-external-images/:id`,
      createCategory: `${projectRoot}/create-external-images-category`,
      showAllCategories: `${projectRoot}/show-all-external-project-image-categories`,
      showCategoryById: `${projectRoot}/show-external-project-category/:id`,
    },
  },
  search: {
    searchAll: `${searchRoot}/search-all`,
  },
};
