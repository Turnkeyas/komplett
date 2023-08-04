import { Router } from "express";
import { MaterialGroupsComponent } from "../";

const router: Router = Router();

router.get("/", MaterialGroupsComponent.findAll);
router.post("/", MaterialGroupsComponent.create);
router.put("/", MaterialGroupsComponent.update);
router.delete("/:id", MaterialGroupsComponent.deleteGroup);

// Subgroup
// router.get("/subgroup/", MaterialGroupsComponent.findAllSubgroup);
router.post("/subgroup/", MaterialGroupsComponent.addSubgroup);
router.put("/subgroup/", MaterialGroupsComponent.updateSubgroup);
router.delete("/subgroup/:id", MaterialGroupsComponent.deleteSubgroup);

export default router;
