import prisma from "../db";
import CustomError from "../errors/customError";
import { ErrorCode } from "../errors/errorCode";


export async function addStorySection(sectionId: string, payload: any){
    const exists = await prisma.storySection.findFirst({
        where: {
            sectionId,
            storyId: payload.storyId
        }
    });

    if(exists){
        throw new CustomError(ErrorCode.STORY_ALREADY_PUBLISHED);
    }

    return await prisma.storySection.create({
        data: {
            sectionId,
            storyId: payload.storyId,
            priority: payload.priority || 0,
            isFeatured: payload.isFeatured || false
        }
    })
}
