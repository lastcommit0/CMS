import prisma from "../db";


type AuditAction = 'USER_CREATED' | 'USER_LOGIN' | 'USER_LOGOUT' | 'USER_REFRESH' | 'USER_LOGIN_FAILED' | 'USER_REFRESH_FAILED' | 'USER_LOGOUT_ALL';



export async function logAudit({
    userId,
    action,
    resource = 'Auth',
    metadata,
    ipAddress,
}: {
    userId?: string;
    action: string;
    resource: string;
    metadata?: any;
    ipAddress?: string;
}) {
    await prisma.auditLog.create({
        data: {
            userId: userId || 'unknown',
            action,
            resource,
            metadata,
            ipAddress: ipAddress || 'unknown',
        },
    });
}

