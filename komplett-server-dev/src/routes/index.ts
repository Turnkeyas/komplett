import * as express from "express";
import * as http from "http";
import * as jwtConfig from "../config/middleware/jwtAuth";
import * as swaggerUi from "swagger-ui-express";
import AuthRouter from "../components/auth/auth.route";
import UserRouter from "../components/user/user.route";
import UserDetailsRouter from "../components/user copy/user.route";
import MaterialRouter from "../components/materials/material.route";
import ProjectRouter from "../components/project/project.route";
import CustomerRouter from "../components/customer/customer.route";
import EmployeeRouter from "../components/employee/employee.route";
import TaskRouter from "../components/task/task.route";
import MasterMaterialRoute from "../components/master-material/master-material.route";
import FagRoute from "../components/fag/fag.route";
import OfferTemplateRoute from "../components/offer-template/offer-template.route";
import CompanySettingsRoute from "../components/company-settings/company-settings.route";
import ReportRoute from "../components/report/report.route";
import MaterialGroupsRoute from "../components/material-groups/material-groups.route";

import * as fs from "fs";
import * as archiver from "archiver";

let swaggerDoc: Object;

try {
  swaggerDoc = require("../../swagger.json");
} catch (error) {
  console.log("***************************************************");
  console.log("  Seems like you doesn`t have swagger.json file");
  console.log("  Please, run: ");
  console.log("  $ swagger-jsdoc -d swaggerDef.js -o swagger.json");
  console.log("***************************************************");
}

/**
 * @export
 * @param {express.Application} app
 */
export function init(app: express.Application): void {
  const router: express.Router = express.Router();

  /**
   * @description
   *  Forwards any requests to the /v1/users URI to our UserRouter
   *  Also, check if user authenticated
   * @constructs
   */
  app.use("/v1/users", jwtConfig.isAuthenticated, UserDetailsRouter);
  app.use("/api/users", UserRouter);

  /**
   * @description Forwards any requests to the /auth URI to our AuthRouter
   * @constructs
   */
  app.use("/auth", AuthRouter);
  app.use("/api/material", MaterialRouter);
  app.use("/api/project", ProjectRouter);
  app.use("/api/customer", CustomerRouter);
  app.use("/api/employee", EmployeeRouter);
  app.use("/api/task", TaskRouter);
  app.use("/api/master-materials", MasterMaterialRoute);
  app.use("/api/fag", FagRoute);
  app.use("/api/offer-template", OfferTemplateRoute);
  app.use(
    "/api/company-settings",
    jwtConfig.isAuthenticated,
    CompanySettingsRoute
  );
  app.use("/api/report", ReportRoute);
  app.use("/api/material-groups", MaterialGroupsRoute);

  app.get("/error-logs", async (req, res) => {
    try {
      const archive = archiver("zip");
      var output = fs.createWriteStream("logs.zip");
      archive.pipe(output);
      archive.directory("logs", false);
      archive.finalize();
      res.set({
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment",
      });
      output.on("finish", () => {
        res.download("logs.zip");
      });
    } catch (error) {
      res.send(error);
    }
  });
  /**
   * @description
   *  If swagger.json file exists in root folder, shows swagger api description
   *  else send commands, how to get swagger.json file
   * @constructs
   */
  if (swaggerDoc) {
    app.use("/docs", swaggerUi.serve);
    app.get("/docs", swaggerUi.setup(swaggerDoc));
  } else {
    app.get("/docs", (req, res) => {
      res.send(
          "<p>Seems like you doesn't have <code>swagger.json</code> file.</p>" +
          "<p>For generate doc file use: <code>swagger-jsdoc -d swaggerDef.js -o swagger.json</code> in terminal</p>" +
          "<p>Then, restart your application</p>"
      );
    });
  }

  /**
   * @description No results returned mean the object is not found
   * @constructs
   */
  app.use((req, res, next) => {
    res.status(404).send(http.STATUS_CODES[404]);
  });

  /**
   * @constructs all routes
   */
  app.use(router);
}
