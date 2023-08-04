import { Router } from 'express';
import { deleteCompanySetting, findCompanySettings, insertCompanySetting, updateCompanySetting } from './company-settings.controller';
const router: Router = Router();



/**
 * POST method route
 * @example http://localhost:3000/api/company-settings/
 * 
 * @swagger
 * /api/company-settings:
 *   post:
 *      description: create company-settings
 *      tags: ["company-settings"]
 *      security:
 *        - ApiKeyAuth: []
 *      requestBody:
 *        description: company-settings creation request body
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CompanySettingsSchema'
 *            example:
 *              netSalary: 5
 *              socialExpenses: 10
 *      responses:
 *        201:
 *          description: return created company-settings
 *          content:
 *            application/json:
 *              schema:
 *                oneOf:
 *                  - $ref: '#/components/schemas/CompanySettingsSchema'
 *        default:
 *          description: unexpected error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 */
router.post('/', insertCompanySetting);



/**
 * @example http://localhost:3000/api/company-settings
 * 
 * @swagger
 * /api/company-settings:
 *  get:
 *    description: Get Company Settings of logged in user
 *    tags: ["company-settings"]
 *    security:
 *      - ApiKeyAuth: []
 *    responses:
 *      200: 
 *        description: returns company-settings list 
 *        content: 
 *          application/json:
 *            schema:
 *              oneOf:
 *                - $ref: '#/components/schemas/CompanySettingsSchema'  
 * 
 */
router.get('/', findCompanySettings);


/**
 * @example http://localhost:3000/api/company-settings/5f9bc88416d62e246cd2c504
 * 
 * @swagger
 * /api/company-settings/{id}:
 *  delete:
 *    description: delete company-settings by id
 *    tags: ["company-settings"]
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
router.delete('/:id', deleteCompanySetting);



/**
 * PUT method route
 * @example http://localhost:3000/api/company-settings/
 * 
 * @swagger
 * /api/company-settings:
 *   put:
 *      description: update company-settings
 *      tags: ["company-settings"]
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
 *              $ref: '#/components/schemas/CompanySettingsSchema'
 *            example:
 *              netSalary: 5
 *              socialExpenses: 10
 *      responses:
 *        201:
 *          description: return created company-settings
 *          content:
 *            application/json:
 *              schema:
 *                oneOf:
 *                  - $ref: '#/components/schemas/CompanySettingsSchema'
 *        default:
 *          description: unexpected error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 */
router.put('/', updateCompanySetting);

export default router;