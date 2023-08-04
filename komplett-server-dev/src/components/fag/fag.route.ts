import { Router } from "express";
import { FagComponent } from '..';
const router: Router = Router();


/**
 * @example http://localhost:3000/api/fag
 * 
 * @swagger
 * /api/fag:
 *  get:
 *    description: Get Fag List
 *    tags: ["fag"]
 *    security:
 *      - ApiKeyAuth: []
 *    responses:
 *      200: 
 *        description: returns fag list 
 *        content: 
 *          application/json:
 *            schema:
 *              oneOf:
 *                - $ref: '#/components/schemas/FagSchema'  
 * 
 */
router.get('/', FagComponent.findFags);


/**
 * @example http://localhost:3000/api/fag/:id/check:
 * 
 * @swagger
 * /api/fag/{id}/check:
 *  get:
 *    description: Check if fag is used
 *    tags: ["fag"]
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
 *        description: return boolean 
 *        content: 
 *          application/json:
 *            schema:
 *              oneOf:
 *                
 * 
 */
router.get('/:id/check', FagComponent.checkFagIsUsed);


/**
 * POST method route
 * @example http://localhost:3000/api/fag
 * 
 * @swagger
 * /api/fag:
 *   post:
 *      description: create fag
 *      tags: ["fag"]
 *      security:
 *        - ApiKeyAuth: []
 *      requestBody:
 *        description: fag creation request body
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/FagSchema'
 *            example:
 *              id: 5
 *              description: 10
 *              hourlyRate: 15
 *      responses:
 *        201:
 *          description: return created fag
 *          content:
 *            application/json:
 *              schema:
 *                oneOf:
 *                  - $ref: '#/components/schemas/FagSchema'
 *        default:
 *          description: unexpected error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 */
router.post('/', FagComponent.insertFag);



/**
 * PUT method route
 * @example http://localhost:3000/api/fag
 * 
 * @swagger
 * /api/fag:
 *   put:
 *      description: update fag
 *      tags: ["fag"]
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
 *              $ref: '#/components/schemas/FagSchema'
 *            example:
 *              _id: 5fc4bb19f6b3f24784998ed0
 *              id: 5
 *              description: 10
 *              hourlyRate: 15
 *      responses:
 *        201:
 *          description: return created fag
 *          content:
 *            application/json:
 *              schema:
 *                oneOf:
 *                  - $ref: '#/components/schemas/FagSchema'
 *        default:
 *          description: unexpected error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 */
router.put('/', FagComponent.updateFag);



/**
 * @example http://localhost:3000/api/fag/5f9bc88416d62e246cd2c504
 * 
 * @swagger
 * /api/fag/{id}:
 *  delete:
 *    description: delete fag by id
 *    tags: ["fag"]
 *    security:
 *       - ApiKeyAuth: []
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
router.delete('/:id', FagComponent.deleteFag);



/**
 * POST method route
 * @example http://localhost:3000/api/fag/replaceFag
 * 
 * @swagger
 * /api/fag/replaceFag:
 *   post:
 *      description: replace fag
 *      tags: ["fag"]
 *      security:
 *        - ApiKeyAuth: []
 *      requestBody:
 *        description: fag replace request body
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/FagSchema'
 *            example:
 *              oldFagId: 5fc4bb19f6b3f24784998ed0
 *              newFagId: 5fc76d2c4a56cc4100731410
 *      responses:
 *        204:
 *          description: return success
 *          content:
 *            application/json:
 *              schema:
 *                oneOf:
 *                  - $ref: '#/components/schemas/FagSchema'
 *        default:
 *          description: unexpected error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 */
router.post('/replaceFag', FagComponent.replaceFag);


export default router;