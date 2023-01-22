import { PrismaClient, Prisma, User, Server } from '@prisma/client'
import { hash } from './crypto';
import { Upload } from './file-storage'

export const prisma = new PrismaClient();

export namespace Users {
    export const create = (email: string, username: string, password: string, tag?: number): Prisma.Prisma__UserClient<User, never> => {
        console.log({ email, username, password });
        tag = tag || 1;
        prisma.user.findMany({
            where: {
                username
            }
        }).then((users) => {
            for (const user of users) {
                if (user.tag == tag) tag++;
                else break;
            }
        });

        password = hash(password);

        return prisma.user.create({
            data: {
                email,
                username,
                password,
                tag,
                bio: '',
                icon: '',
                createdAt: new Date()
            }
        })
    };

    export const getById = (id: number) => {
        return prisma.user.findUnique({
            where: { id }
        });
    }

    export const getByNameAndTag = (username: string, tag: number) => {
        return prisma.user.findMany({
            where: {
                AND: {
                    username,
                    tag
                }
            }
        });
    }

    export const setIcon = async (id: number, file: File) => {
        let icon = await Upload.profileIcon(id, file);
        prisma.user.update({
            where: {
                id
            },
            data: {
                icon
            }
        })
    }

}

export namespace Servers {
    export const create = (name: string): Prisma.Prisma__ServerClient<Server, never> => {
        console.log({ name });
        return prisma.server.create({
            data: {
                name,
                createdAt: new Date(),
                icon: ''
            }
        })
    };

    export const getById = (id: number) => {
        return prisma.server.findUnique({
            where: { id }
        });
    }

    export const getByName = (name: string) => {
        return prisma.server.findMany({
            where: {
                name
            }
        });
    }

    export const setIcon = async (id: number, file: File) => {
        let icon = await Upload.serverIcon(id, file);
        prisma.server.update({
            where: {
                id
            },
            data: {
                icon
            }
        })
    }
}