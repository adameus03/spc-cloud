
const Sequelize = require('sequelize');
const sqlite3 = require('sqlite3');
/*const sequelize = new Sequelize(process.env.DB_SCHEMA || 'postgres',
                                process.env.DB_USER || 'postgres',
                                process.env.DB_PASSWORD || '',
                                {
                                    host: process.env.DB_HOST || 'localhost',
                                    port: process.env.DB_PORT || 5432,
                                    dialect: 'postgres',
                                    dialectOptions: {
                                        ssl: process.env.DB_SSL == "true"
                                    }
                                });*/
const name = "dnp";

const getStoragePath = ()=>{
    let storagePath = `${process.env.SQLITE_DBS_LOCATION}/${name}`
    console.log(`STORAGE PATH: ${storagePath}`);
    return storagePath;
};

const sequelize = new Sequelize({
    dialect: "sqlite",
    dialectModule: sqlite3,
    storage: getStoragePath()
    //storage: 'testStorageFile'
  });
//const sequelize = new Sequelize('sqlite::memory:');
/*const Person = sequelize.define('Person', {
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: true
    },
});*/
module.exports = {
    sequelize: sequelize,
    //Person: Person,
    //name: name //hide/delete?
};