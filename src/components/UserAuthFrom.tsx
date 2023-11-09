"use client"

import { FC, useState } from 'react'
import { Button } from './ui/Button'
import { cn } from '@/lib/utils'
import {signIn} from 'next-auth/react'
import { Icons } from './Icons'
import { toast } from '@/hooks/use-toast'


interface UserAuthFromProps extends React.HTMLAttributes<HTMLDivElement> {

}

const UserAuthFrom: FC<UserAuthFromProps> = ({ className, ...props }) => {

    const [isLoading, setIsLoading] = useState<boolean>(false)
 
    const loginWithGoogle = async () => {
        setIsLoading(true);
        try {
            await signIn('google')
        } catch (err) {
            //toast notification
            toast({
                title: "There was a problem",
                description: "There was an error logging in with Google",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className={cn('flex justify-center', className)} {...props}>
            <Button size='sm' onClick={loginWithGoogle} isLoading={isLoading} className='w-full'>
                {isLoading ? null : <Icons.google className='w-4 h-4 mr-2' />}
                Google
            </Button>
        </div>
    )

}

export default UserAuthFrom