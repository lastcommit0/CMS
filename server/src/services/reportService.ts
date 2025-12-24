import prisma from '../db';
import CustomError from '../errors/customError';
import { ErrorCode } from '../errors/errorCode';


export class ReportService {
  static async generate(type: string, filters: any, userId: string, ip: string) {
    let results;

    switch (type) {
      case 'STORIES':
        results = await prisma.story.count();
        break;
      case 'USERS':
        results = await prisma.user.count();
        break;
      case 'POLLS':
        results = await prisma.poll.count();
        break;
      case 'ANALYTICS':
        results = await prisma.auditLog.count();
        break;
      case 'SYSTEM_HEALTH':
        results = await prisma.session.count();
        break;
      default:
        throw new CustomError(ErrorCode.REPORT_GENERATION_FAILED);
    }

    const report = await prisma.report.create({
      data: { type, filters, generatedBy: userId }
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'REPORT_GENERATED',
        resource: 'Report',
        metadata: { reportId: report.id },
        ipAddress: ip
      }
    });

    return { report, results };
  }
}
