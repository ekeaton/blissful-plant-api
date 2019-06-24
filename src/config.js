module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DATABASE_URL || 'postgresql://ek@localhost/blissful-plant',
    TEST_DB_URL: process.env.TEST_DB_URL || 'postgresql://ek@localhost/blissful-test'
  
}