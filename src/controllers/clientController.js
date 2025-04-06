import Client from "../models/clientModel.js";
import { Op } from "sequelize";
import axios from "axios";

export const getClient = async (req, res) => {
  try {
    const clients = await Client.findAll({
      where: {
        estatus: true,
      },
    });
    res.status(200).json(clients);
  } catch (error) {
    console.error("Error al listar clientes:", error);
    res.status(500).json({ message: "Error al listar clientes" });
  }
};

export const createClient = async (req, res) => {
  const {
    nombre,
    apellido_paterno,
    apellido_materno,
    correo,
    telefono,
    fecha_nacimiento,
    direccion,
  } = req.body;

  // Validaciones
  if (
    !nombre ||
    !apellido_paterno ||
    !apellido_materno ||
    !correo ||
    !telefono ||
    !fecha_nacimiento ||
    !direccion
  ) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios." });
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(correo)) {
    return res.status(400).json({ message: "Correo electrónico no válido." });
  }

  if (!/^\d{10}$/.test(telefono)) {
    return res
      .status(400)
      .json({ message: "El teléfono debe tener exactamente 10 dígitos." });
  }

  const fechaNacimiento = new Date(fecha_nacimiento);
  const hoy = new Date();
  if (fechaNacimiento > hoy) {
    return res
      .status(400)
      .json({ message: "La fecha de nacimiento no puede ser en el futuro." });
  }

  try {
    // Verificar si ya existe un cliente con el mismo correo
    const existingClient = await Client.findOne({
      where: {
        [Op.or]: [{ correo }],
      },
    });

    if (existingClient) {
      return res
        .status(400)
        .json({
          message: "El cliente ya existe con el mismo correo o teléfono.",
        });
    }

    // Crear cliente en la base de datos
    const client = await Client.create({
      nombre,
      apellido_paterno,
      apellido_materno,
      correo,
      telefono,
      fecha_nacimiento,
      direccion,
      fecha_creacion: new Date(),
    });

    // Llamar a users/create para registrar el usuario
    try {
      // Verificar si el usuario ya existe
      const existingUser = await axios.get(
        `http://localhost:5001/app/users/${correo}`
      );
      if (existingUser.data) {
        console.log("El usuario ya existe en el servicio de usuarios.");
      } else {
        // Crear el usuario si no existe
        await axios.post("http://localhost:5001/app/users/create", {
          username: correo,
          password: "123456789",
          phone: telefono,
        });
      }
    } catch (userError) {
      if (userError.response && userError.response.status === 404) {
        // Si el usuario no existe, crearlo
        try {
          await axios.post("http://localhost:5001/app/users/create", {
            username: correo,
            password: "123456789",
            phone: telefono,
          });
        } catch (createError) {
          console.error("Error al crear usuario:", createError);
          return res.status(500).json({
            message: "Cliente creado, pero hubo un error al registrar el usuario.",
          });
        }
      } else {
        console.error("Error al verificar usuario:", userError);
        return res.status(500).json({
          message: "Cliente creado, pero hubo un error al verificar el usuario.",
        });
      }
    }

    res.status(201).json(client);
  } catch (error) {
    console.error("Error al crear cliente:", error);
    res.status(500).json({ message: "Error al crear cliente" });
  }
};

export const updateClient = async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    apellido_paterno,
    apellido_materno,
    telefono,
    fecha_nacimiento,
    direccion,
  } = req.body;

  // Verificar solo el teléfono si se incluye en la actualización
  if (telefono && !/^\d{10}$/.test(telefono)) {
    return res
      .status(400)
      .json({ message: "El teléfono debe tener exactamente 10 dígitos." });
  }

  // Verificar solo la fecha de nacimiento si se incluye en la actualización
  if (fecha_nacimiento) {
    const fechaNacimiento = new Date(fecha_nacimiento);
    const hoy = new Date();
    if (fechaNacimiento > hoy) {
      return res
        .status(400)
        .json({ message: "La fecha de nacimiento no puede ser en el futuro." });
    }
  }

  try {
    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({ message: "El cliente no existe." });
    }

    // Solo actualizamos los campos que se incluyen en la solicitud
    const updatedClientData = {
      nombre: nombre || client.nombre,
      apellido_paterno: apellido_paterno || client.apellido_paterno,
      apellido_materno: apellido_materno || client.apellido_materno,
      telefono: telefono || client.telefono,
      fecha_nacimiento: fecha_nacimiento || client.fecha_nacimiento,
      direccion: direccion || client.direccion,
    };

    // Actualizar el cliente
    await client.update(updatedClientData);

    res.status(200).json(client);
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    res.status(500).json({ message: "Error al actualizar cliente" });
  }
};

export const deleteClient = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await client.update({ estatus: false });

    return res
      .status(200)
      .json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};