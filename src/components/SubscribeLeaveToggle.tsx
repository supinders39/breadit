"use client"
import { FC, startTransition } from 'react'
import { Button } from './ui/Button';
import { useMutation } from '@tanstack/react-query';
import { SubscribeToSubredditPayload } from '@/lib/validators/subreddit';
import axios, { AxiosError } from 'axios';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface SubscribeLeaveToggleProps {
    subredditId: string,
    subredditName: string,
    isSubscribed: boolean,
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({ subredditId, subredditName, isSubscribed }) => {
    const router = useRouter();
    const { loginToast } = useCustomToast();

    const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
        mutationFn: async () => {
            const payload: SubscribeToSubredditPayload = {
                subredditId
            }
            const { data } = await axios.post('/api/subreddit/subscribe', payload)
            return data as string;
        },
        onError: (error: any) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    return loginToast();
                }

            }
            console.log(error)
            return toast({
                title: "There was an problem",
                description: "Something went wrong, please try again",
                variant: "destructive"
            })
        },
        onSuccess: (data) => {
            startTransition(() => {
                router.refresh();
            })

            return toast({
                title: "Subscribed",
                description: `You are now subscribed to r/${subredditName}`
            })
        }
    })

    const { mutate: unsubscribe, isLoading: isUnSubLoading } = useMutation({
        mutationFn: async () => {
            const payload: SubscribeToSubredditPayload = {
                subredditId
            }
            const { data } = await axios.post('/api/subreddit/unsubscribe', payload)
            return data as string;
        },
        onError: (error: any) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    return loginToast();
                }

            }

            return toast({
                title: "There was an problem",
                description: "Something went wrong, please try again",
                variant: "destructive"
            })
        },
        onSuccess: (data) => {
            startTransition(() => {
                router.refresh();
            })

            return toast({
                title: "Unsubscribed",
                description: `You are now unsubscribed to r/${subredditName}`
            })
        }
    })
    return isSubscribed ? (
        <Button isLoading={isUnSubLoading} onClick={() => unsubscribe()} className=' w-full mt-1 mb-4' >Leave community</Button>
    ) : (
        <Button isLoading={isSubLoading} onClick={() => subscribe()} className=' w-full mt-1 mb-4' >Join to post</Button>
    )
}

export default SubscribeLeaveToggle