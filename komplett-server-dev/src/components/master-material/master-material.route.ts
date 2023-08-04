import { Router } from 'express';
import * as multer from 'multer';
import { MasterMaterialComponent } from "..";

const router: Router = Router();

var storage = multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
        cb(null, './uploads')
    },
    filename: function (req: any, file: any, cb: any) {
        cb(null, Date.now() + file.originalname);
    },
})

var upload = multer({ storage: storage })

/**
 * @example http://localhost:3000/api/master-materials?category=Engineering
 * 
 * @swagger
 * /api/master-materials:
 *  get:
 *    description: Get master material api with pagination and sorting
 *    tags: ["MasterMaterial"]
 *    security:
 *       - ApiKeyAuth: []
 *    parameters: 
 *      - in: query
 *        name: category
 *        schema: 
 *          type: string
 *        description: Carpentry
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
 *              type: array
 *              oneOf:
 *                - $ref: '#/components/schemas/SubMaterialSchema'
 *                 
 * 
 */
router.get('/', MasterMaterialComponent.findByCategory);


/**
 * @example http://localhost:3000/api/master-materials
 * 
 * @swagger
 * /api/master-materials:
 *  post:
 *    description: add master sub materials
 *    tags: ["MasterMaterial"]
 *    security:
 *       - ApiKeyAuth: []     
 *    requestBody:
 *      description: application and category field is required
 *      required: true
 *      content: 
 *        application/json:
 *          schema: 
 *            $ref: '#/components/schemas/SubMaterialSchema'
 *          example:
 *            application: application name here
 *            category: Engineering
 *           
 *    responses:
 *      201:
 *        content: 
 *          application/json:
 *            schema:
 *              oneOf:
 *                - $ref: '#/components/schemas/InsertSubMaterial'
 *              
 *        
 */
router.post('/', MasterMaterialComponent.insertInMasterMaterial);

router.post('/document', upload.single('document'), MasterMaterialComponent.uploadDocument);
router.delete('/:id/document/delete', MasterMaterialComponent.deleteDocument);

/**
 * @example http://localhost:3000/api/master-materials/5f9bc88416d62e246cd2c504
 * 
 * @swagger
 * /api/master-materials/{id}:
 *  delete:
 *    description: delete master-materials by id
 *    tags: ["MasterMaterial"]
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
router.delete('/:id', MasterMaterialComponent.deleteMasterMaterial);




/**
 * PUT method route
 * @example http://localhost:3000/api/master-materials/
 * 
 * @swagger
 * /api/master-materials:
 *   put:
 *      description: update master-materials
 *      tags: ["MasterMaterial"]
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
 *              $ref: '#/components/schemas/SubMaterialSchema'
 *            example:
 *              _id: 5f9bbb17405a9420e895920f
 *              application: application name here
 *              category: Engineering
 *      responses:
 *        201:
 *          description: return updated master-material
 *          content:
 *            application/json:
 *              schema:
 *                oneOf:
 *                  - $ref: '#/components/schemas/SubMaterialSchema'
 *        default:
 *          description: unexpected error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 */
router.put('/', MasterMaterialComponent.updateMasterMaterial);
export default router;
