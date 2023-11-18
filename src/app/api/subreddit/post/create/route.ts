import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/post";
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request, res: Response) {
    try {
        const session = await getAuthSession();
        if (!session?.user) {
            return new Response("Unauthorized", { status: 401 })
        }

        const body = await req.json();

        const { subredditId, title, content } = PostValidator.parse(body);

        const subscriptionExists = await db.subscription.findFirst({
            where: {
                subredditId,
                userId: session?.user?.id
            }
        })

        if (!subscriptionExists) {
            return new Response("Subscribe to post", { status: 400 })
        }

        await db.post.create({
            data: {
                subredditId,
                title, content,
                // @ts-ignore
                authorId: session?.user?.id
            }
        })

        return new Response("OK")


    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response("Invalid POST request data passed", { status: 422 })
        }
        console.error(error)
        return new Response('Could not post to subreddit at this time, please try again later', { status: 500 })
    }
}