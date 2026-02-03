import { PrismaClient } from '../generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as argon2 from 'argon2';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Seeding database...');

    const permissions = [
        { key: 'user:manage', label: 'Manage Users' },
        { key: 'story:create', label: 'Create Stories' },
        { key: 'story:edit', label: 'Edit Stories' },
        { key: 'story:delete', label: 'Delete Stories' },
        { key: 'story:publish', label: 'Publish Stories' },
        { key: 'poll:manage', label: 'Manage Polls' },
        { key: 'epaper:manage', label: 'Manage E-Papers' },
        { key: 'priority:manage', label: 'Manage Priorities' },
        { key: 'contact:manage', label: 'Manage Contact Messages' },
    ];

    const permissionRecords = [];
    for (const p of permissions) {
        const record = await prisma.permission.upsert({
            where: { key: p.key },
            update: { label: p.label },
            create: p,
        });
        permissionRecords.push(record);
        console.log(`Permission ${p.key} ensured.`);
    }

    const roles = [
        { name: 'ADMIN', description: 'System Administrator with full access' },
        { name: 'SUB_ADMIN', description: 'Sub-Administrator with limited management access' },
        { name: 'EDITOR', description: 'Editor with content management access' },
    ];

    for (const r of roles) {
        const role = await prisma.roleModel.upsert({
            where: { name: r.name as any },
            update: { description: r.description },
            create: {
                name: r.name as any,
                description: r.description,
            },
        });
        console.log(`Role ${r.name} ensured.`);

        if (r.name === 'ADMIN') {
            for (const p of permissionRecords) {
                await prisma.rolePermission.upsert({
                    where: {
                        roleId_permissionId: {
                            roleId: role.id,
                            permissionId: p.id,
                        },
                    },
                    update: {},
                    create: {
                        roleId: role.id,
                        permissionId: p.id,
                    },
                });
            }
            console.log('All permissions linked to ADMIN role.');
        }
    }

    const adminRole = await prisma.roleModel.findUnique({
        where: { name: 'ADMIN' as any },
    });

    if (!adminRole) throw new Error('Admin role not found');

    const adminEmail = 'saketpandey2004@gmail.com';
    const adminPhone = '8882023011';
    const password = 'Password@123';
    const passwordHash = await argon2.hash(password);

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            phone: adminPhone,
        },
        create: {
            name: 'Saket Pandey',
            email: adminEmail,
            phone: adminPhone,
            passwordHash: passwordHash,
            status: 'ACTIVE',
            roles: {
                create: {
                    roleId: adminRole.id,
                },
            },
            profile: {
                create: {
                    designation: 'EDITOR_IN_CHIEF',
                    jobType: 'FULL_TIME',
                    location: 'Delhi, India',
                    bio: 'Super Admin for the CMS system.',
                },
            },
        },
    });

    console.log('Admin user seeded successfully!');
    console.log('Email:', adminEmail);
    console.log('Phone:', adminPhone);
    console.log('Password:', password);
}

main()
    .catch((e) => {
        console.error('Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
