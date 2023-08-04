import { Router } from 'express';
import { MaterialComponent } from "..";
import * as multer from 'multer';
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

/**@example http://localhost:3000/api/material?page=1&limit=5&type=Engineering&sort=_id
 * 
 * @swagger
 * /api/material:
 *  get: 
 *    description: Get Materials
 *    tags: ["material"]
 *    security:
 *       - ApiKeyAuth: []
 *    parameters:
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *        description : 1
 *      - in: query
 *        name: limit
 *        schema:
 *           type: integer
 *        description: 10
 *      - in: query
 *        name: type
 *        schema: 
 *          type: string
 *        description: Example = Engineering
 *      - in: query
 *        name: sort
 *        schema: 
 *          type: string
 *        description: Example = _id
 *    responses:
 *      200:
 *        description: return materials based on conditions
 *        content:
 *          application/json:
 *            schema:
 *              oneOf:
 *                - $ref: '#/components/schemas/MaterialSchema'
 * */
router.get('/', MaterialComponent.findAll);

/**
 * @example http://localhost:3000/api/material/
 * 
 * @swagger
 * /api/material:
 *  post:
 *   description: add material
 *   tags: ['material']
 *   security:
 *     - ApiKeyAuth: []
 *   requestBody:
 *     content:
 *       application/json:
 *         schema: 
 *           $ref: '#/components/schemas/MaterialSchema'
 *   responses:
 *     201:
 *       description: material created
 *       content:
 *         application/json:
 *           schema: 
 *             oneOf:
 *               - $ref: '#/components/schemas/MaterialSchema'
 * 
 */
router.post('/', MaterialComponent.insert);




/**
 * @example http://localhost:3000/api/material/withsubmaterials
 * 
 * @swagger
 * /api/material/withsubmaterials:
 *  post:
 *   description: add material
 *   tags: ['material']
 *   security:
 *     - ApiKeyAuth: []
 *   requestBody:
 *     required:
 *       - name
 *     description: buildingComponents and type is required
 *     content:
 *       application/json:
 *         schema: 
 *           $ref: '#/components/schemas/MaterialSchema'
 *         example:
 *           subMaterials: ["5fa8cbacb992bf182cfec886"]
 *           buildingComponents: "name here"
 *           type: "Engineering" 
 *   responses:
 *     201:
 *       description: material created
 *       content:
 *         application/json:
 *           schema: 
 *             oneOf:
 *               - $ref: '#/components/schemas/MaterialSchema'
 * 
 */
router.post('/withsubmaterials', MaterialComponent.insertWithSubMaterials);

router.put('/addsubmaterials', MaterialComponent.pushInSubMaterials);

/**
 * @example http://localhost:3000/api/material/
 * 
 * @swagger
 * /api/material:
 *  put:
 *    tags: [material]
 *    security:
 *       - ApiKeyAuth: []
 *    requestBody: 
 *      required: true
 *      description: _id field is required
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/MaterialSchema'
 *          example:
 *            _id: "5f85845341855c2b209ba312"
 *            type: "Engineering"
 *            subMaterials: []
 *              
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *            schema:
 *              oneOf:
 *                - $ref: '#/components/schemas/MaterialSchema'
 *                        
 */
router.put('/', MaterialComponent.update);

/**
 * @example http://localhost:3000/api/material/5f9bc88416d62e246cd2c504
 * 
 * @swagger
 * /api/material/{id}:
 *  delete:
 *    description: delete material by id
 *    tags: ["material"]
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
router.delete('/:id', MaterialComponent.remove);

/**
 * @example http://localhost:3000/api/material/subMaterial
 * 
 * @swagger
 * components:
 *  schemas:
 *    InsertSubMaterial:
 *      allOf:
 *        - $ref: '#/components/schemas/SubMaterialSchema'
 *        - type: object
 *          properties:
 *            materialId:
 *              type: string
 * 
 * /api/material/subMaterial:
 *  post:
 *    description: add submaterials
 *    tags: ["submaterial"]
 *    security:
 *      - ApiKeyAuth: []  
 *    requestBody:
 *      description: materialId field is required
 *      required: true
 *      content: 
 *        application/json:
 *          materialId:
 *            type: string
 *          schema: 
 *            $ref: '#/components/schemas/InsertSubMaterial'
 *            materialId: 
 *              type: string
 *    response:
 *      201:
 *        content: 
 *          application/json:
 *            schema:
 *              oneOf:
 *                - $ref: '#/components/schemas/InsertSubMaterial'
 *              
 *        
 */
router.post('/subMaterial', upload.single('document'), MaterialComponent.insertSubMaterial);

router.post('/subMaterial/document', upload.single('document'), MaterialComponent.uploadDocument);
router.delete('/subMaterial/:id/document/delete', MaterialComponent.deleteDocument);

/**
 * @example http://localhost:3000/api/material/subMaterial/5f85845341855c2b209ba312
 * 
 * @swagger
 * /api/material/subMaterial/{materialId}:
 *  get:
 *    description: get submaterials for the given materialId
 *    tags: ["submaterial"]
 *    security:
 *      - ApiKeyAuth: []
 *    parameters:
 *      - in: path
 *        name: materialId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *            schema:
 *              oneOf:
 *                $ref: '#/components/schemas/SubMaterialSchema'
 *                
 */
router.get('/subMaterial/:id', MaterialComponent.findSubMaterial);

/**
 * 
 * @example http://localhost:3000/api/material/subMaterial
 * 
 * @swagger
 * /api/material/subMaterial:
 *   put:
 *     description: update subMaterial
 *     security:
 *       - ApiKeyAuth: []
 *     tags: ["submaterial"]
 *     requestBody:
 *       description: _id field is required
 *       content:
 *         application/json:
 *           schema: 
 *             $ref: '#/components/schemas/SubMaterialSchema'
 *           example:
 *             _id: 5f83da51fb2d502d6ca74b2c
 *             NS3420: "std"
 *          
 */
router.put('/subMaterial', MaterialComponent.updateSubMaterial);



/**
 * @example http://localhost:3000/api/material/subMaterial/5f9bc88416d62e246cd2c504
 * 
 * @swagger
 * /api/material/subMaterial/{id}:
 *  delete:
 *    description: delete subMaterial by id
 *    tags: ["submaterial"]
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
router.delete('/subMaterial/:id', MaterialComponent.removeSubMaterial);

router.get('/clear-quantity', MaterialComponent.clearAllQuantity);

router.put('/reorder', MaterialComponent.reorder);

export default router;
