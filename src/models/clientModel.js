import { DataTypes } from "sequelize";
import sequelize from "../config/bd.js";

const Client = sequelize.define("Client", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  apellido_paterno: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  apellido_materno: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, 
    },
  },
  telefono: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      isNumeric: true, 
      len: [10, 10], 
    },
  },
  fecha_nacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  direccion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  estatus: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false, 
  tableName: "clients", 
});

export default Client;
