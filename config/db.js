// create a config to configure both pooling behavior 
// and client options 
// note: all config is optional and the environment variables 
// will be read if the config is not present 

module.exports = {
    user: 'courses', //env var: PGUSER 
    database: 'courses', //env var: PGDATABASE 
    password: '', //env var: PGPASSWORD 
    host: 'localhost', // Server hosting the postgres database 
    port: 5432, //env var: PGPORT 
    max: 10, // max number of clients in the pool 
    idleTimeoutMillis: 30000
}