import { Button } from "@/components/ui/button"
import {
    Item,
    ItemActions,
    ItemContent,
    ItemTitle
} from "@/components/ui/item"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useAuth } from "@/lib/context/AuthProvider"
import axios from "axios"
import { CircleQuestionMark, Settings } from "lucide-react"
import { redirect } from "next/navigation"
import { Avatar, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { LinkStripeButton, UnLinkStripeButton } from "./StripeButton"

export default function UserSettings() {
    const { user } = useAuth();

    const handleUgrade = async () => {
        if (!user) return;
        const { data: url } = await axios.post('/api/stripe/create', {
            email: user.email,
            user_id: user.user_id,
        });
        redirect(url);
    }

    return user && (
        <Popover>
            <PopoverTrigger asChild>
                <Button size={"icon-lg"} variant={"outline"}>
                    <Settings />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-100">
                <div className="flex gap-3 flex-col">
                    <div className="flex gap-3 items-center">
                        <Avatar size="lg">
                            <AvatarImage src={user.picture}></AvatarImage>
                        </Avatar>
                        <div className="flex gap-2 flex-col">
                            <div className="flex gap-1">
                                <div>{user.name}</div>
                                {user.plan.name === 'free' ? (
                                    <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">{user.plan.name}</Badge>
                                ) : (
                                    <Badge className="bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300">{user.plan.name}</Badge>
                                )}
                            </div>
                            <div className="px-3 bg-neutral-100 ring ring-neutral-200 text-xs rounded-full">{user.email}</div>
                        </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="flex gap-1 items-center">
                                Stripe Account
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <CircleQuestionMark size={15} />
                                    </TooltipTrigger>
                                    <TooltipContent className="w-60">
                                        Link Stripe account allow viewing your balance and transaction history.
                                    </TooltipContent>
                                </Tooltip>
                            </span>
                            {user.stripe_user_id ?
                                (
                                    <div className="text-muted-foreground">Already linked!</div>

                                ) : (
                                    <div className="text-muted-foreground">Not linked yet!</div>
                                )
                            }
                        </div>
                        {user.stripe_user_id ?
                            (
                                <UnLinkStripeButton />
                            ) : (
                                <LinkStripeButton />
                            )
                        }
                    </div>
                    <Item variant="outline" className="bg-linear-to-br from-blue-500/10 to-purple-500/10 rounded-lg">
                        <ItemContent>
                            <ItemTitle>Upgrade to Pro</ItemTitle>
                            <div className="text-muted-foreground wrap-break-word">
                                Unlock the full 7-day calendar view, unlimited instant blocks, and advanced analytics.
                            </div>
                        </ItemContent>
                        <ItemActions>
                            {
                                user.plan.name === 'pro' ? (
                                    <Button variant="outline" size="sm" disabled>
                                        Actived
                                    </Button>
                                ) : (
                                    <Button variant="outline" size="sm" onClick={handleUgrade}>
                                        Upgrade
                                    </Button>
                                )
                            }
                        </ItemActions>
                    </Item>
                </div>
            </PopoverContent>
        </Popover >
    )
}
