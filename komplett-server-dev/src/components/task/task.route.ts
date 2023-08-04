import { Router } from 'express';
import { TaskComponent } from '..';

const router: Router = Router();


/**
 * @example http://localhost:3000/api/task?projectId=5f9f8aabd9bb99369c51923d&status=active&limit=1&page=1&sort=createdAt
 * 
 * @swagger
 * /api/task:
 *  get:
 *    description: Get tasks api with pagination and sorting
 *    tags: ["task"]
 *    parameters: 
 *      - in: query
 *        name: projectId
 *        required: true
 *        schema:
 *          type: string
 *      - in: query
 *        name: status
 *        schema:   
 *          type: string
 *        description: Example = active
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
 *                - $ref: '#/components/schemas/TaskSchema'  
 * 
 */
router.get('/', TaskComponent.findAllTask);



/**
 * @example http://localhost:3000/api/project/5f9bc88416d62e246cd2c504
 * 
 * @swagger
 * /api/task/{id}:
 *  get:
 *    description: get submaterials for the given materialId
 *    tags: ["task"]
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
 *                $ref: '#/components/schemas/TaskSchema'
 *                
 */
router.get('/:id', TaskComponent.getTaskById);

/**
 * POST method route
 * @example http://localhost:3000/api/task/
 * 
 * @swagger
 * /api/task:
 *   post:
 *      description: create task
 *      tags: ["task"]
 *      requestBody:
 *        description: task creation request body
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/TaskSchema'
 *            example:
 *              name: taskname
 *              description: desc
 *              estimation: 15
 *              projectId: 5f9f8aabd9bb99369c51923d
 *      responses:
 *        201:
 *          description: return created customer
 *          content:
 *            application/json:
 *              schema:
 *                oneOf:
 *                  - $ref: '#/components/schemas/TaskSchema'
 *        default:
 *          description: unexpected error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 */
router.post('/', TaskComponent.insertTask);


/**
 * PUT method route
 * @example http://localhost:3000/api/task/
 * 
 * @swagger
 * /api/task:
 *   put:
 *      description: update task
 *      tags: ["task"]
 *      requestBody:
 *        description: _id field is required
 *        required: true
 *        content:
 *          application/json:
 *            required:
 *              - id 
 *            schema:
 *              $ref: '#/components/schemas/TaskSchema'
 *            example:
 *              _id: 5f9fcc4c36aa9d1bd415392b
 *              name: updated taskname
 *              description: updated desc
 *              estimation: 150
 *             
 *      responses:
 *        201:
 *          description: return created task
 *          content:
 *            application/json:
 *              schema:
 *                oneOf:
 *                  - $ref: '#/components/schemas/TaskSchema'
 *        default:
 *          description: unexpected error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 */
router.put('/', TaskComponent.updateTask);


/**
 * @example http://localhost:3000/api/task/5f9fcc4c36aa9d1bd415392b
 * 
 * @swagger
 * /api/task/{id}:   
 *  delete:
 *    description: get submaterials for the given materialId
 *    tags: ["task"]
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
router.delete('/:id', TaskComponent.deleteTask);

export default router;