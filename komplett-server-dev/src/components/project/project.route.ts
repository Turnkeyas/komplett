import { Router } from 'express';
import { ProjectComponent } from '..';

const router: Router = Router();


/**
 * @example http://localhost:3000/api/project?limit=1&page=1&sort=createdAt
 * 
 * @swagger
 * /api/project:
 *  get:
 *    description: Get Projects api with pagination and sorting
 *    tags: ["project"]
 *    parameters: 
 *      - in: query
 *        name: status
 *        schema:   
 *          type: string
 *        description: Example = active
 *      - in: query
 *        name: projectName
 *        schema: 
 *          type: string
 *        description: Example = project 1 
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
 *        description: returns projects list 
 *        content: 
 *          application/json:
 *            schema:
 *              oneOf:
 *                - $ref: '#/components/schemas/ProjectSchema'  
 * 
 */
router.get('/', ProjectComponent.findAllProjects);

/**
 * @example http://localhost:3000/api/project/5f9bc88416d62e246cd2c504
 * 
 * @swagger
 * /api/project/{id}:
 *  get:
 *    description: get submaterials for the given materialId
 *    tags: ["project"]
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
 *                $ref: '#/components/schemas/ProjectSchema'
 *                
 */
router.get('/:id', ProjectComponent.getProjectById);


/**
 * POST method route
 * @example http://localhost:3000/api/project/
 * 
 * @swagger
 * /api/project:
 *   post:
 *      description: create project
 *      tags: ["project"]
 *      requestBody:
 *        description: project creation request body
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ProjectSchema'
 *            example:
 *              name: userName
 *              description: desc
 *              customerId: 5f9cdeaf63bcde326cc86b1e
 *              location: {city: oslo, postCode: 548} 
 *      responses:
 *        201:
 *          description: return created project
 *          content:
 *            application/json:
 *              schema:
 *                oneOf:
 *                  - $ref: '#/components/schemas/ProjectSchema'
 *        default:
 *          description: unexpected error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 */
router.post('/', ProjectComponent.insertProject);



/**
 * @example http://localhost:3000/api/project/customer/5f9f8a22d9bb99369c51923b
 * 
 * @swagger
 * /api/project/customer/{id}:
 *  get:
 *    description: get project by customer id
 *    tags: ["project"]
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
 *                $ref: '#/components/schemas/ProjectSchema'
 *                
 */
router.get('/customer/:id', ProjectComponent.findProjectByCustomerId);

/**
 * @example http://localhost:3000/api/project/5f9bc88416d62e246cd2c504
 * 
 * @swagger
 * /api/project/{id}:   
 *  delete:
 *    description: get submaterials for the given materialId
 *    tags: ["project"]
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
router.delete('/:id', ProjectComponent.deleteProject);


/**
 * PUT method route
 * @example http://localhost:3000/api/project/
 * 
 * @swagger
 * /api/project:
 *   put:
 *      description: update project
 *      tags: ["project"]
 *      requestBody:
 *        description: _id field is required
 *        required: true
 *        content:
 *          application/json:
 *            required:
 *              - id 
 *            schema:
 *              $ref: '#/components/schemas/ProjectSchema'
 *            example:
 *              _id: 5f9bbb17405a9420e895920f
 *              contactPersonName: Mohcine
 *              location: {_id: 5f9d5344157c674bf0798c93, city: somelo, postCode: 548} 
 *      responses:
 *        201:
 *          description: return created project
 *          content:
 *            application/json:
 *              schema:
 *                oneOf:
 *                  - $ref: '#/components/schemas/ProjectSchema'
 *        default:
 *          description: unexpected error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 */
router.put('/', ProjectComponent.updateProject);
export default router;