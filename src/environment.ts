export let configurations

switch (process.env.NODE_ENV) {
  case 'development': {
    configurations = {
      db: {
        type: 'mysql',
        host: process.env.DATABASE_HOST || 'localhost',
        port: 3306,
        username: 'users_service_development',
        password: '123',
        database: 'CATALOG_DEV',
      },
    }
    break
  }
  case 'test': {
    configurations = {
      db: {
        type: 'mysql',
        host: process.env.DATABASE_HOST || 'localhost',
        port: 6001,
        username: 'users_service_test',
        password: '123',
        database: 'CATALOG_TEST',
        synchronize: true,
      },
    }
    break
  }
}

Object.assign(process.env, configurations)
