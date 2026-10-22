import { Router, type IRouter } from "express";
import gateRouter from "./gate";
import healthRouter from "./health";

const router: IRouter = Router();

router.use(healthRouter);
router.use(gateRouter);

export default router;
