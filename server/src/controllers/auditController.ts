import { Request, Response } from "express";
import {
  auditListSchema,
  auditTimelineSchema,
  auditExportSchema,
} from "../validators/auditSchema";
import { AuditService } from "../services/auditService";
import CustomError from "../errors/customError";


export const getAuditLogs = async (req: Request, res: Response) => {
  const filters = auditListSchema.parse(req.query);
  const result = await AuditService.getAuditLogs(filters);

  res.status(200).json({ success: true, ...result });
};

export const getAuditLogById = async (req: Request, res: Response) => {
  const log = await AuditService.fetchAuditLogById(req.params.id);

  if (!log) {
    throw new CustomError({
      statusCode: 404,
      message: "Audit log not found",
      code: "AUDIT_LOG_NOT_FOUND",
    });
  }

  res.status(200).json({ success: true, data: log });
};

export const getTimeline = async (req: Request, res: Response) => {
  const filters = auditTimelineSchema.parse(req.query);
  const logs = await AuditService.fetchTimeline(filters);

  res.status(200).json({
    success: true,
    data: logs.map(log => ({
      id: log.id,
      timestamp: log.createdAt,
      action: log.action,
      resource: log.resource,
      user: log.user,
      metadata: log.metadata,
    })),
  });
};

export const getAuditStats = async (req: Request, res: Response) => {
  const dateFrom = req.query.dateFrom
    ? new Date(req.query.dateFrom as string)
    : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const dateTo = req.query.dateTo
    ? new Date(req.query.dateTo as string)
    : new Date();

  const stats = await AuditService.fetchAuditStats(dateFrom, dateTo);

  res.status(200).json({ success: true, data: stats });
};

export const exportAuditLogs = async (req: Request, res: Response) => {
  const { dateFrom, dateTo, format } = auditExportSchema.parse(req.query);

  const logs = await AuditService.getAuditLogs({
    page: 1,
    limit: 10000,
    dateFrom,
    dateTo,
  });

  if (format === "CSV") {
    const csv = [
      "ID,Timestamp,User,Action,Resource,IP",
      ...logs.logs.map(
        l =>
          `${l.id},${l.createdAt.toISOString()},${l.user?.name},${l.action},${l.resource},${l.ipAddress}`
      ),
    ].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=audit_logs.csv");
    return res.send(csv);
  }

  res.status(200).json({ success: true, data: logs.logs });
};

export const createAuditLog = async (req: Request, res: Response) => {
  const {
    action,
    resource = "Auth",
    metadata,
  } = req.body;

  await AuditService.logAudit({
    userId: req.user?.id,
    action,
    resource,
    metadata,
    ipAddress: req.ip,
  });

  res.status(201).json({
    success: true,
    message: "Audit log created",
  });
};