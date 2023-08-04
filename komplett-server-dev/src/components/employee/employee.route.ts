import { Router } from "express";
import { EmployeeComponent } from '..';
const router: Router = Router();


/**
 * @example http://localhost:3000/api/employee?limit=1&page=1&sort=createdAt
 * 
 * @swagger
 * /api/employee:
 *  get:
 *    description: Get Employees api with pagination and sorting
 *    tags: ["employee"]
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
 *                - $ref: '#/components/schemas/EmployeeSchema'  
 * 
 */
router.get('/', EmployeeComponent.findEmployees);

/**
 * @example http://localhost:3000/api/employee/5f9ea933dc2a163ec9ee7bba
 * 
 * @swagger
 * /api/employee/{id}:
 *  get:
 *    description: get submaterials for the given materialId
 *    tags: ["employee"]
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
 *                $ref: '#/components/schemas/EmployeeSchema'
 *                
 */
router.get('/:id', EmployeeComponent.findEmployeeById);



/**
 * POST method route
 * @example http://localhost:3000/api/employee/
 * 
 * @swagger
 * /api/employee:
 *   post:
 *      description: create employee
 *      tags: ["employee"]
 *      security:
 *        - ApiKeyAuth: []
 *      requestBody:
 *        description: employee creation request body
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/EmployeeSchema'
 *            example:
 *              user: {name : someone , email : someemail@some.com}
 *              hseCardNumber: 5
 *              employeeNumber: 1
 *              location: {city: oslo, postCode: 548} 
 *      responses:
 *        201:
 *          description: return created employee
 *          content:
 *            application/json:
 *              schema:
 *                oneOf:
 *                  - $ref: '#/components/schemas/EmployeeSchema'
 *        default:
 *          description: unexpected error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 */
router.post('/', EmployeeComponent.insertEmployee);



/**
 * PUT method route
 * @example http://localhost:3000/api/employee/
 * 
 * @swagger
 * /api/employee:
 *   put:
 *      description: update employee
 *      tags: ["employee"]
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
 *              $ref: '#/components/schemas/EmployeeSchema'
 *            example:
 *              _id: 5f9bbb17405a9420e895920f
 *              user: {_id: 5f9bbb17405a9420e895920d ,name: Mohcine, email : someemail@some.com}
 *              hseCardNumber: 15
 *              location: {_id: 5f9bbb17405a9420e895920e, city: oslo, postCode: 548} 
 *      responses:
 *        201:
 *          description: return created employee
 *          content:
 *            application/json:
 *              schema:
 *                oneOf:
 *                  - $ref: '#/components/schemas/EmployeeSchema'
 *        default:
 *          description: unexpected error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 */
router.put('/', EmployeeComponent.updateEmployee);

/**
 * @example http://localhost:3000/api/employee/5f9bc88416d62e246cd2c504
 * 
 * @swagger
 * /api/employee/{id}:
 *  delete:
 *    description: delete employee by id
 *    tags: ["employee"]
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
router.delete('/:id', EmployeeComponent.deleteEmployee);
export default router;