import express from 'express';
import { getClient, createClient, updateClient, deleteClient } from '../controllers/clientController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users managment
 * /app/clients/all:
 *  get:
 *    summary: Get all Clients
 *    tags: [Clients]
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/all', getClient);
/**
 * @swagger
 * /app/clients/create:
 *   post:
 *     summary: Create a new client
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Jona"
 *               apellido_paterno:
 *                 type: string
 *                 example: "Rios"
 *               apellido_materno:
 *                 type: string
 *                 example: "Martinez"
 *               correo:
 *                 type: string
 *                 example: "jona@gmail.com"
 *               telefono:
 *                 type: string
 *                 example: "6182936801"
 *               fecha_nacimiento:
 *                 type: string
 *                 example: "2005-03-2"
 *               direccion:
 *                 type: string
 *                 example: "Calle 12 #123"
 *     responses:
 *       200:
 *         description: CLient created successfully
 *       400:
 *         description: Bad request
 */
router.post('/create', createClient);
/**
 * @swagger
 * /app/clients/update/{id}:
 *   patch:
 *     summary: Update a client's information (only fields provided will be updated)
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the client to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Jona"
 *               apellido_paterno:
 *                 type: string
 *                 example: "Rios"
 *               apellido_materno:
 *                 type: string
 *                 example: "Martinez"
 *               telefono:
 *                 type: string
 *                 example: "6182936801"
 *               fecha_nacimiento:
 *                 type: string
 *                 example: "2005-03-2"
 *               direccion:
 *                 type: string
 *                 example: "Calle 12 #123"
 *     responses:
 *       200:
 *         description: Client updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Client not found
 */
router.patch('/update/:id', updateClient);
/**
 * @swagger
 * /app/clients/delete/{id}:
 *   patch:
 *     summary: Delete a client
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the client to delete
 *     responses:
 *       '200':
 *         description: Client deleted successfully
 */
router.patch('/delete/:id', deleteClient);

export default router;