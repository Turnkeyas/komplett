import { Router } from 'express';
import { insertCustomer, findCustomer, deleteCustomer, findCustomerById, updateCustomer } from './customer.controller';
const router: Router = Router();



/**
 * POST method route
 * @example http://localhost:3000/api/customer/
 * 
 * @swagger
 * /api/customer:
 *   post:
 *      description: create customer
 *      tags: ["customer"]
 *      security:
 *        - ApiKeyAuth: []
 *      requestBody:
 *        description: customer creation request body
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CustomerSchema'
 *            example:
 *              user: {name : someone , email : someemail@some.com}
 *              contactPerson: Mohcine
 *              location: {city: oslo, postCode: 548} 
 *      responses:
 *        201:
 *          description: return created customer
 *          content:
 *            application/json:
 *              schema:
 *                oneOf:
 *                  - $ref: '#/components/schemas/CustomerSchema'
 *        default:
 *          description: unexpected error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 */
router.post('/', insertCustomer);



/**
 * @example http://localhost:3000/api/customer?limit=1&page=1&sort=createdAt
 * 
 * @swagger
 * /api/customer:
 *  get:
 *    description: Get Customers api with pagination and sorting
 *    tags: ["customer"]
 *    security:
 *      - ApiKeyAuth: []
 *    parameters: 
 *      - in: query
 *        name: page
 *        schema: 
 *          type: integer
 *        description: 1
 *      - in: query
 *        name: limit
 *        schema: 
 *          type: integer
 *        description: 10
 *      - in: query
 *        name: sort
 *        schema: 
 *          type: string
 *        description: Example = createdAt
 *      - in: query
 *        name: customerName
 *        schema: 
 *          type: string
 *        description: Example = somename
 *      - in: query
 *        name: order
 *        schema: 
 *          type: acs
 *        description: Example = acs
 *    responses:
 *      200: 
 *        description: returns customers list 
 *        content: 
 *          application/json:
 *            schema:
 *              oneOf:
 *                - $ref: '#/components/schemas/CustomerSchema'  
 * 
 */
router.get('/', findCustomer);

/**
 * @example http://localhost:3000/api/customer/5f9bc88416d62e246cd2c504
 * 
 * @swagger
 * /api/customer/{id}:
 *  get:
 *    description: get submaterials for the given materialId
 *    tags: ["customer"]
 *    security:
 *      - ApiKeyAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *            schema:
 *              oneOf:
 *                $ref: '#/components/schemas/CustomerSchema'
 *                
 */
router.get('/:id', findCustomerById);
// router.get('/name/:name', findByName);

/**
 * @example http://localhost:3000/api/customer/5f9bc88416d62e246cd2c504
 * 
 * @swagger
 * /api/customer/{id}:
 *  delete:
 *    description: delete customer by id
 *    tags: ["customer"]
 *    security:
 *      - ApiKeyAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      204:
 *        content:
 *                
 */
router.delete('/:id', deleteCustomer);



/**
 * PUT method route
 * @example http://localhost:3000/api/customer/
 * 
 * @swagger
 * /api/customer:
 *   put:
 *      description: update customer
 *      tags: ["customer"]
 *      security:
 *        - ApiKeyAuth: []
 *      requestBody:
 *        description: _id field is required
 *        required: true
 *        content:
 *          application/json:
 *            required:
 *              - id 
 *            schema:
 *              $ref: '#/components/schemas/CustomerSchema'
 *            example:
 *              _id: 5f9bbb17405a9420e895920f
 *              user: {_id: 5f9bbb17405a9420e895920d ,name: Mohcine, email : someemail@some.com}
 *              contactPerson: Mohcine
 *              location: {_id: 5f9bbb17405a9420e895920e, city: oslo, postCode: 548} 
 *      responses:
 *        201:
 *          description: return created customer
 *          content:
 *            application/json:
 *              schema:
 *                oneOf:
 *                  - $ref: '#/components/schemas/CustomerSchema'
 *        default:
 *          description: unexpected error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 */
router.put('/', updateCustomer);

export default router;