import { Request, Response } from "express";
import { ReportService } from "../services/reportService";
import { generateReportSchema } from "../validators/reportSchema";

export const generateReport = async (req: Request, res: Response) => {
  const payload = generateReportSchema.parse(req.body);

  const data = await ReportService.generate(
    payload.type,
    payload.filters,
    req.user!.id,
    req.ip || "unknown"
  );

  res.status(200).json({
    success: true,
    data,
  });
};
