
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
const Person = sequelize.define('Person', {
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
		unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
});

const LoginInstance = sequelize.define("LoginInstance", {
	login_id: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
		primaryKey: true,
	},
	user_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
		references: {
			model: Person,
			key: "user_id",
		},
		onUpdate: "CASCADE",
		onDelete: "CASCADE",
	}
});

const ShareInfo = sequelize.define("ShareInfo", {
    share_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    sharer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Person,
            key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    /*sharee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Person,
            key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },*/
    dirRelPath: {
        type: Sequelize.STRING,
        allowNull: false
    },
    passKey: {
        type: Sequelize.STRING,
        allowNull: false
    },
    isReadOnly: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
});

const ActiveShare = sequelize.define("ActiveShare", {
    active_share_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    share_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: ShareInfo,
            key: "share_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    sharee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Person,
            key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    }
});

module.exports = {
    sequelize: sequelize,
    Person: Person,
	LoginInstance: LoginInstance,
    ShareInfo: ShareInfo,
    ActiveShare: ActiveShare
    //name: name //hide/delete?
};