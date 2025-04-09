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
    console.error("🔥 ERROR DETECTADO EN getClient:");
    console.error("🧠 Mensaje:", error.message);
    console.error("🪵 Detalle completo:", error);
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

  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  if (!nombre || !apellido_paterno || !apellido_materno || !correo || !telefono || !fecha_nacimiento || !direccion) {
    return res.status(400).json({ message: "Todos los campos son obligatorios." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(correo)) {
    return res.status(400).json({ message: "Correo electrónico no válido." });
  }

  if (!/^\d{10}$/.test(telefono)) {
    return res.status(400).json({ message: "El teléfono debe tener exactamente 10 dígitos." });
  }

  const fechaNacimiento = new Date(fecha_nacimiento);
  const hoy = new Date();
  if (fechaNacimiento > hoy) {
    return res.status(400).json({ message: "La fecha de nacimiento no puede ser en el futuro." });
  }

  try {
    const existingClient = await Client.findOne({ where: { correo } });

    if (existingClient) {
      return res.status(400).json({ message: "El cliente ya existe con el mismo correo o teléfono." });
    }

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

    try {
      const response = await axios.get(
        `https://users-production-8ab1.up.railway.app/app/users/${correo}`,
        { headers: { Authorization: token } }
      );

      if (!response.data) {
        await axios.post(
          `https://users-production-8ab1.up.railway.app/app/users/create`,
          {
            username: correo,
            password: "123456789",
            phone: telefono,
          },
          { headers: { Authorization: token } }
        );
      }
    } catch (userError) {
      if (userError.response && userError.response.status === 404) {
        try {
          await axios.post(
            `https://users-production-8ab1.up.railway.app/app/users/create`,
            {
              username: correo,
              password: "123456789",
              phone: telefono,
            },
            { headers: { Authorization: token } }
          );
        } catch (createErr) {
          console.error("Error al crear usuario:", createErr);
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
    console.error("🔥 ERROR DETECTADO EN createClient:");
    console.error("🧠 Mensaje:", error.message);
    console.error("🪵 Detalle completo:", error);
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

  if (telefono && !/^\d{10}$/.test(telefono)) {
    return res.status(400).json({ message: "El teléfono debe tener exactamente 10 dígitos." });
  }

  if (fecha_nacimiento) {
    const fechaNacimiento = new Date(fecha_nacimiento);
    const hoy = new Date();
    if (fechaNacimiento > hoy) {
      return res.status(400).json({ message: "La fecha de nacimiento no puede ser en el futuro." });
    }
  }

  try {
    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(404).json({ message: "El cliente no existe." });
    }

    const updatedClientData = {
      nombre: nombre || client.nombre,
      apellido_paterno: apellido_paterno || client.apellido_paterno,
      apellido_materno: apellido_materno || client.apellido_materno,
      telefono: telefono || client.telefono,
      fecha_nacimiento: fecha_nacimiento || client.fecha_nacimiento,
      direccion: direccion || client.direccion,
    };

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

    return res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};
