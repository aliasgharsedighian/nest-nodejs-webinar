import * as Joi from 'joi';

export const validateEnv = (config: Record<string, any>) => {
  const schema = Joi.object({
    PROTOCOL: Joi.string().default('http://'),
    DOMAIN: Joi.string().default('localhost:2222'),
    PORT: Joi.number().default(2224),
    DB_NAME: Joi.string().required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().default(5432),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    POSTGRES_DATABASE_URL: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_REFRESH_SECRET: Joi.string().required(),
    DOMAIN_ADDRESS: Joi.string().required(),
    GOOGLE_CLIENT_ID: Joi.string().required(),
    GOOGLE_CLIENT_SECRET: Joi.string().required(),
  });

  const { error, value } = schema.validate(config, {
    allowUnknown: true,
    abortEarly: false,
  });

  if (error) {
    throw new Error(`❌ Environment validation error: ${error.message}`);
  }

  return value;
};
